// Ensure vectorLayer is declared globally and initialized
var vectorLayer = new ol.layer.Vector({
    source: new ol.source.Vector()
});

// Create the base layer (e.g., OpenStreetMap)
var baseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var map = new ol.Map({
    target: 'map',
    layers: [
        baseLayer,  // Base layer (e.g., OpenStreetMap or any other tile source)
        vectorLayer // Your vector layer containing features
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-75.1652, 39.9526]),  // Center of the map (Philadelphia)
        zoom: 12
    })
});

// Load the GeoJSON data and add it to the vectorLayer
fetch('https://raw.githubusercontent.com/MaxGaida/QPM-testing/refs/heads/main/testopenlayers.geojson')
    .then(response => {
        if (!response.ok) throw new Error("Failed to load GeoJSON");
        return response.json();
    })
    .then(data => {
        console.log("Loaded GeoJSON Data:", data);
        loadInitialData(data);  // Adds the initial data to the vector layer
    })
    .catch(error => console.error("Error fetching GeoJSON:", error));

function loadInitialData(data) {
    var features = new ol.format.GeoJSON().readFeatures(data, {
        featureProjection: 'EPSG:3857'
    });

    console.log("Parsed Features:", features); // Check if features are correctly read

    vectorLayer.getSource().clear();  // Clear the vector layer before adding new data
    vectorLayer.getSource().addFeatures(features);  // Add the loaded features to the vector layer
}
