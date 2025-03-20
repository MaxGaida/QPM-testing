// Create the base map
const map = new ol.Map({
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

// Define category colors
const categoryColors = {
    "business": "blue",
    "event": "green",
    "organization": "purple",
    "other": "gray"
};

// Function to get color based on c1 category
function getColorForCategory(c1) {
    return categoryColors[c1] || "gray"; // Default to black if category not found
}


// Function to apply colors dynamically
function styleFunction(feature) {
    const props = feature.getProperties();

    const color = getColorForCategory(props.c1);
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: color }),
            stroke: new ol.style.Stroke({ color: "black", width: 1 })
        })
    });
}

// Create vector layer with style function
const vectorSource = new ol.source.Vector();
const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: styleFunction // Apply function at the layer level
});

map.addLayer(vectorLayer);

fetch('https://raw.githubusercontent.com/MaxGaida/QPM-testing/main/testopenlayers.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        //console.log("Raw GeoJSON Data:", data); // Debugging: Check if data is retrieved

        const features = new ol.format.GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857'
        });

        //console.log("Parsed Features:", features.length); // Debugging

        vectorSource.addFeatures(features);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

