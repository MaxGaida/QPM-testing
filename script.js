// Create the OpenLayers map
var map = new ol.Map({
    target: 'map', 
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM() 
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-75.1652, 39.9526]), // Philadelphia
        zoom: 12
    })
});

// Load GeoJSON Data
var vectorSource = new ol.source.Vector({
    format: new ol.format.GeoJSON()
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

map.addLayer(vectorLayer);

// Get slider elements
var startSlider = document.getElementById('startDecade');
var endSlider = document.getElementById('endDecade');
var startText = document.getElementById('startDecadeText');
var endText = document.getElementById('endDecadeText');

// Function to update text labels
function updateSliderLabels() {
    startText.innerText = startSlider.value + "s";
    endText.innerText = endSlider.value + "s";
}

// Load GeoJSON and store original data
var originalFeatures = [];

fetch('testopenlayers.geojson')
    .then(response => response.json())
    .then(data => {
        originalFeatures = new ol.format.GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857' // Ensure correct projection
        });

        vectorSource.addFeatures(originalFeatures);
    })
    .catch(error => console.error("Error loading GeoJSON:", error));

// Function to filter features based on selected decades
function filterData() {
    var startDecade = parseInt(startSlider.value);
    var endDecade = parseInt(endSlider.value);

    var filteredFeatures = originalFeatures.filter(feature => {
        var startDate = feature.get("start date") ? parseInt(feature.get("start date")) : null;
        var endDate = feature.get("end date") ? parseInt(feature.get("end date")) : null;

        // Check if the feature's date range falls within the selected decades
        return (startDate && startDate <= endDecade) && (!endDate || endDate >= startDecade);
    });

    vectorSource.clear();
    vectorSource.addFeatures(filteredFeatures);
}

// Attach event listeners to sliders
startSlider.addEventListener('input', () => {
    updateSliderLabels();
    filterData();
});

endSlider.addEventListener('input', () => {
    updateSliderLabels();
    filterData();
});

// Initialize text values on page load
updateSliderLabels();
