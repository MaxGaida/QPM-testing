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

// Get filter elements
var startDecadeSelect = document.getElementById('startDecade');
var endDecadeSelect = document.getElementById('endDecade');
var categorySelect = document.getElementById('category');
var genderSelect = document.getElementById('gender');
var raceSelect = document.getElementById('race');

// Function to filter features based on selected values
function filterData() {
    var startDecade = parseInt(startDecadeSelect.value);
    var endDecade = parseInt(endDecadeSelect.value);
    var selectedCategory = categorySelect.value;
    var selectedGender = genderSelect.value;
    var selectedRace = raceSelect.value;

    vectorSource.clear(); // Clear existing data

    fetch('testopenlayers.geojson')  // Reload GeoJSON
        .then(response => response.json())
        .then(data => {
            var filteredFeatures = data.features.filter(feature => {
                var startDate = feature.properties["start date"] ? parseInt(feature.properties["start date"]) : null;
                var endDate = feature.properties["end date"] ? parseInt(feature.properties["end date"]) : null;

                // Filter based on selected decade range
                var isWithinDateRange = (startDate && startDate <= endDecade) && (endDate && endDate >= startDecade);

                // Filter based on selected category
                var isCategoryMatch = feature.properties["c1"] === selectedCategory || selectedCategory === "all";

                // Filter based on selected gender
                var isGenderMatch = feature.properties["sex/gender"] === selectedGender || selectedGender === "all";

                // Filter based on selected race
                var isRaceMatch = feature.properties["race"] === selectedRace || selectedRace === "all";

                // Return true if all conditions match
                return isWithinDateRange && isCategoryMatch && isGenderMatch && isRaceMatch;
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

// Attach event listeners to filters
startDecadeSelect.addEventListener('change', filterData);
endDecadeSelect.addEventListener('change', filterData);
categorySelect.addEventListener('change', filterData);
genderSelect.addEventListener('change', filterData);
raceSelect.addEventListener('change', filterData);

// Initial load
filterData();
