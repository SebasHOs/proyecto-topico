// Initialize and add the map
function initMap() {
    // Default location (you can change this to any coordinates)
    const defaultLocation = { lat: 19.4326, lng: -99.1332 }; // Mexico City coordinates

    // Create the map
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultLocation,
    });

    // Add a marker at the default location
    const marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: "Ubicación inicial"
    });

    // Optional: Add click listener to place markers
    map.addListener("click", (event) => {
        // Remove previous marker
        if (marker) {
            marker.setMap(null);
        }

        // Add new marker at clicked location
        const newMarker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            title: "Nueva ubicación"
        });

        // You can add more functionality here, like saving coordinates
        console.log("Clicked location:", event.latLng.lat(), event.latLng.lng());
    });
}

// Make sure the map initializes when the page loads
window.onload = function() {
    // Check if Google Maps API is loaded
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    } else {
        // If not loaded yet, wait for it
        window.initMap = initMap;
    }
};