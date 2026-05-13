// Initialize and add the map
function initMap() {
    const defaultLocation = { lat: 19.4326, lng: -99.1332 }; // Mexico City coordinates

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
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
}

window.initMap = initMap;