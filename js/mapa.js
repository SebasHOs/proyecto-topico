// Initialize and add the map
function initMap() {
    const defaultLocation = { lat: 19.4326, lng: -99.1332 }; // Mexico City coordinates
    const mapElement = document.getElementById("map");

    const map = new google.maps.Map(mapElement, {
        zoom: 12,
        center: defaultLocation,
        mapId: "D616dc0d71d24a8a8115ab2a5", // Required for AdvancedMarkerElement
        disableDoubleClickZoom: true // Desabilitar zoom con doble click
    });

    const createMarker = (position, title) => {
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
            const content = document.createElement('div');
            content.style.background = '#fff';
            content.style.border = '1px solid #333';
            content.style.borderRadius = '8px';
            content.style.padding = '6px 10px';
            content.style.fontSize = '14px';
            content.textContent = title;

            return new google.maps.marker.AdvancedMarkerElement({
                position,
                map,
                title,
                content
            });
        }

        return new google.maps.Marker({
            position,
            map,
            title
        });
    };

    let currentMarker = createMarker(defaultLocation, "Ubicación inicial");

    // Handle single clicks to create/move markers
    map.addListener("click", (event) => {
        if (currentMarker) {
            if (currentMarker.setMap) {
                currentMarker.setMap(null);
            } else if (currentMarker.map) {
                currentMarker.map = null;
            }
        }

        currentMarker = createMarker(event.latLng, "Nueva ubicación");
        console.log("Clicked location:", event.latLng.lat(), event.latLng.lng());
    });

    // Handle double-click to open report modal using DOM event
    mapElement.addEventListener('dblclick', (event) => {
        event.preventDefault();
        
        // Get the click position relative to the map
        const rect = mapElement.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Convert pixel coordinates to lat/lng
        const scale = Math.pow(2, map.getZoom());
        const projection = map.getProjection();
        const worldCoordinateCenter = projection.fromLatLngToPoint(map.getCenter());
        const pixelOffset = {
            x: (x - rect.width / 2),
            y: (y - rect.height / 2)
        };

        const worldCoordinate = new google.maps.Point(
            worldCoordinateCenter.x + pixelOffset.x / scale,
            worldCoordinateCenter.y + pixelOffset.y / scale
        );

        const location = projection.fromPointToLatLng(worldCoordinate);

        handleDoubleClick(location);
    });
}

function handleDoubleClick(location) {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location }, (results, status) => {
        let address = `${location.lat().toFixed(6)}, ${location.lng().toFixed(6)}`;

        if (status === 'OK' && results && results[0]) {
            address = results[0].formatted_address;
        }

        // Store location data for later use
        window.reportLocation = {
            lat: location.lat(),
            lng: location.lng(),
            address
        };

        // Show the incidence type modal
        showIncidenceModal();
    });
}

function showIncidenceModal() {
    const modal = document.getElementById('incidenceModal');
    modal.classList.add('active');

    // Add event listeners to incidence buttons
    const buttons = modal.querySelectorAll('.incidence-btn');
    buttons.forEach(button => {
        button.onclick = () => {
            window.selectedIncidenceType = button.dataset.type;
            modal.classList.remove('active');
            showDescriptionModal();
        };
    });

    const cancelBtn = document.getElementById('cancelIncidenceBtn');
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            modal.classList.remove('active');
        };
    }
}

function showDescriptionModal() {
    const modal = document.getElementById('descriptionModal');
    const input = document.getElementById('descriptionInput');
    const submitBtn = document.getElementById('submitBtn');
    const charCount = document.getElementById('charCount');

    // Clear the input
    input.value = '';
    charCount.textContent = '0';
    submitBtn.disabled = true;

    // Add event listener for character count and validation
    input.onkeyup = () => {
        const length = input.value.length;
        charCount.textContent = length;

        if (length >= 30) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    };

    // Add submit button listener
    submitBtn.onclick = () => {
        submitReport(input.value);
        modal.classList.remove('active');
        input.value = '';
        charCount.textContent = '0';
    };

    // Show the modal
    modal.classList.add('active');
}

function submitReport(description) {
    // Obtener el usuario actual
    const user = window.firebaseAuth.auth.currentUser;
    
    if (!user) {
        console.error("Usuario no autenticado");
        return;
    }

    const report = {
        type: window.selectedIncidenceType,
        description: description,
        location: {
            lat: window.reportLocation?.lat,
            lng: window.reportLocation?.lng,
            address: window.reportLocation?.address || ''
        },
        timestamp: new Date().toISOString(),
        userId: user.uid,
        userEmail: user.email,
        status: "Pendiente"
    };

    // Guardar en Firebase Firestore
    const { collection, addDoc } = window.firebaseAuth;
    const { db } = window.firebaseAuth;

    addDoc(collection(db, "reportes"), report)
        .then((docRef) => {
            console.log("Reporte guardado con ID:", docRef.id);
            showSuccessMessage();
        })
        .catch((error) => {
            console.error("Error al guardar el reporte:", error);
            alert("Hubo un error al enviar el reporte. Intenta de nuevo.");
        });
}

function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.classList.add('show');

    // Hide the message after 5 seconds
    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);
}

window.initMap = initMap;