// Define colors for each category
const categoryColors = {
    'repeating': '#1f77b4',   // Blue
    'organization': '#ff7f0e', // Orange
    'event': '#2ca02c',        // Green
    'business': '#d62728',     // Red
    'media': '#9467bd',        // Purple
    'life': '#8c564b',         // Brown
    'single': '#e377c2',       // Pink
    'practice': '#7f7f7f',     // Gray
    'social': '#bcbd22',       // Yellow
    'art': '#17becf',          // Cyan
    'arrest': '#fdae61',       // Light Orange
    'service': '#4c566a'       // Dark Gray
};

// Function to style features based on "c1"
function styleFunction(feature) {
    const category = feature.get('c1'); // Get "c1" property
    const color = categoryColors[category] || '#000000'; // Default to black if undefined

    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: color }),
            stroke: new ol.style.Stroke({ color: '#ffffff', width: 1 })
        })
    });
}

// Load GeoJSON and apply the styling
fetch('https://raw.githubusercontent.com/MaxGaida/QPM-testing/main/testopenlayers.geojson')
    .then(response => response.json())
    .then(data => {
        const vectorSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: 'EPSG:3857' // Ensure correct projection
            })
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: styleFunction
        });

        // Add the layer to the map
        map.addLayer(vectorLayer);
    })
    .catch(error => console.error("Error loading GeoJSON:", error));
