window.onload = function() {
    // Style function for vector layer
    var styleFunction = function (feature) {
        var c1 = feature.get('c1'); // Category (e.g., event, business, etc.)
        var sexGender = feature.get('sex/gender'); // Sexual orientation/gender classification
        var race = feature.get('race'); // Race classification

        // Default color in case none of the conditions are met
        var color = 'gray';

        // Color based on 'c1' (Category)
        if (c1 === 'event') {
            color = 'red';  // Events in red
        } else if (c1 === 'business') {
            color = 'green';  // Businesses in green
        } else if (c1 === 'organization') {
            color = 'blue';  // Organizations in blue
        }

        // Override color based on 'sex/gender'
        if (sexGender === 'gay') {
            color = 'blue';  // Gay spaces in blue
        } else if (sexGender === 'lesbian') {
            color = 'purple';  // Lesbian spaces in purple
        } else if (sexGender === 'queer') {
            color = 'pink';  // Queer spaces in pink
        }

        // Override color based on 'race'
        if (race === 'white') {
            color = 'lightgray';  // White spaces in light gray
        } else if (race === 'Black') {
            color = 'black';  // Black spaces in black
        } else if (race === 'Latino') {
            color = 'orange';  // Latino spaces in orange
        }

        // Return a style with the color based on the classification
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,  // Size of the circle
                fill: new ol.style.Fill({ color: color }),  // Set color based on classification
                stroke: new ol.style.Stroke({ color: 'black', width: 1 })  // Black border for contrast
            })
        });
    };

    // Define the vector source with GeoJSON data
    var vectorSource = new ol.source.Vector({
        url: 'https://raw.githubusercontent.com/MaxGaida/QPM-testing/refs/heads/main/testopenlayers.geojson',  // Your GeoJSON file URL
        format: new ol.format.GeoJSON()
    });

    // Define the vector layer with the style function
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction  // Apply the style function
    });

    // Define the base layer (Stamen Toner - minimalist)
    var baseLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://{a-c}.tile.stamen.com/toner/{z}/{x}/{y}.png'  // URL to Stamen Toner tiles
        })
    });

    // Initialize the map
    var map = new ol.Map({
        target: 'map',  // ID of the div where the map will be displayed
        layers: [
            baseLayer,  // Add the base layer
            vectorLayer  // Add the vector layer with styled data points
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-75.1652, 39.9526]),  // Center on Philadelphia
            zoom: 12  // Initial zoom level
        })
    });
};
