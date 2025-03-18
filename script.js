window.onload = function() {
    // Define the minimalist base map layer
    var minimalistLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png' // Minimalistic base map
        })
    });

    // Define the vector source (GeoJSON data)
    var vectorSource = new ol.source.Vector({
        url: 'testopenlayers.geojson', // Path to your GeoJSON file
        format: new ol.format.GeoJSON()
    });

    // Create a vector layer with the vector source
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    // Initialize the map
    var map = new ol.Map({
        target: 'map',
        layers: [
            minimalistLayer,  // Add the minimalist map layer
            vectorLayer       // Add the vector layer
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-75.1652, 39.9526]), // Centered on Philadelphia
            zoom: 12
        })
    });

    // Get filter elements
    var decadeFilter = document.getElementById('decadeFilter');
    var categoryFilter = document.getElementById('categoryFilter');

    // Function to filter data based on selected values
    function filterData() {
        var selectedDecade = decadeFilter.value;
        var selectedCategory = categoryFilter.value;

        vectorSource.clear(); // Clear existing data

        fetch('testopenlayers.geojson')  // Reload GeoJSON
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
};
