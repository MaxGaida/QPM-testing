// Initialize the map
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-75.1652, 39.9526]), // Centered on Philadelphia
        zoom: 12
    })
});

// Load GeoJSON data
var vectorSource = new ol.source.Vector({
    url: 'testopenlayers.geojson',
    format: new ol.format.GeoJSON()
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

map.addLayer(vectorLayer);

// Get filter elements
var decadeFilter = document.getElementById('decadeFilter');
var categoryFilter = document.getElementById('categoryFilter');

// Function to filter data based on selected values
function filterData() {
    var selectedDecade = decadeFilter.value;
    var selectedCategory = categoryFilter.value;

    vectorSource.clear(); // Clear existing data

    fetch('testopenlayers.geojson')
        .then(response => response.json())
        .then(data => {
            var filteredFeatures = data.features.filter(feature => {
                var startDate = feature.properties["Start Date"] ? parseInt(feature.properties["Start Date"]) : null;
                var endDate = feature.properties["End Date"] ? parseInt(feature.properties["End Date"]) : null;
                var category = feature.properties["Category"] || "";

                // Filter by decade
                var matchesDecade = selectedDecade === "all" || (
                    startDate && endDate &&
                    startDate <= parseInt(selectedDecade) + 9 &&
                    endDate >= parseInt(selectedDecade)
                );

                // Filter by category
                var matchesCategory = selectedCategory === "all" || category.toLowerCase() === selectedCategory.toLowerCase();

                return matchesDecade && matchesCategory;
            });

            // Convert filtered features back to GeoJSON format
            var geojsonObject = {
                type: "FeatureCollection",
                features: filteredFeatures
            };

            // Create a new source with filtered data
            var newSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(geojsonObject, {
                    featureProjection: 'EPSG:3857' // Ensure correct projection
                })
            });

            // Update the layer with new data
            vectorLayer.setSource(newSource);
        })
        .catch(error => console.error("Error loading GeoJSON:", error));
}

// Attach event listeners to filters
decadeFilter.addEventListener('change', filterData);
categoryFilter.addEventListener('change', filterData);
