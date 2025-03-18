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
    url: 'testopenlayers.geojson',  // Update with correct path
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

// Function to filter features based on selected decades
function filterData() {
    var startDecade = parseInt(startSlider.value);
    var endDecade = parseInt(endSlider.value);

    vectorSource.clear(); // Clear existing data

    fetch('testopenlayers.geojson')  // Reload GeoJSON
        .then(response => response.json())
        .then(data => {
            var filteredFeatures = data.features.filter(feature => {
                var startDate = feature.properties["start date"] ? parseInt(feature.properties["start date"]) : null;
                var endDate = feature.properties["end date"] ? parseInt(feature.properties["end date"]) : null;

                // Check if the feature's date range falls within the selected decades
                return (startDate && startDate <= endDecade) && (endDate && endDate >= startDecade);
            });

            // Convert filtered features back to GeoJSON format
            var geojsonObject = {
                type: "FeatureCollection",
                features: filteredFeatures
            };

            var newSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(geojsonObject, {
                    featureProjection: 'EPSG:3857' // Ensure correct projection
                })
            });

            vectorLayer.setSource(newSource);
        })
        .catch(error => console.error("Error loading GeoJSON:", error));
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
