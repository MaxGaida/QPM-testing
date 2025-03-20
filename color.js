// Define a color mapping for c1 categories
const categoryColors = {
    "Business": "blue",
    "Event": "green",
    "Organization": "purple",
    "Other": "gray"
};

// Function to get color based on c1 category
function getColorForCategory(c1) {
    return categoryColors[c1] || "black"; // Default to black if category not found
}

// Function to dynamically style features based on their category
function styleFunction(feature) {
    const props = feature.getProperties();
    const color = getColorForCategory(props.c1); // Get color from c1 property

    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color: color }),
            stroke: new ol.style.Stroke({ color: "black", width: 1 })
        })
    });
}

// Ensure the vector layer has the correct style function
if (vectorLayer) {
    vectorLayer.setStyle(styleFunction);
} else {
    setTimeout(() => {
        if (vectorLayer) {
            vectorLayer.setStyle(styleFunction);
        }
    }, 1000);
}
