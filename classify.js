let classificationLayer = null; // Separate overlay layer for classification
let genderColors = {}; // Dynamically generated color map for sex/gender
let raceColors = {}; // Dynamically generated color map for race

// Function to extract unique values from GeoJSON and generate colors
function extractClassificationCategories() {
    let uniqueGenders = new Set();
    let uniqueRaces = new Set();

    if (!vectorSource || vectorSource.getFeatures().length === 0) {
        console.warn("GeoJSON data not loaded yet. Retrying...");
        setTimeout(extractClassificationCategories, 500);
        return;
    }

    vectorSource.getFeatures().forEach(feature => {
        let props = feature.getProperties();
        if (props["sex/gender"]) uniqueGenders.add(props["sex/gender"]);
        if (props["race"]) uniqueRaces.add(props["race"]);
    });

    // Generate colors dynamically
    genderColors = generateColorMap([...uniqueGenders]);
    raceColors = generateColorMap([...uniqueRaces]);

    console.log("Extracted Categories - Genders:", genderColors, "Races:", raceColors);

    // Once data is extracted, create UI
    createClassificationFilterUI();
}

// Function to generate a unique color map for given categories
function generateColorMap(categories) {
    let colors = {};
    categories.forEach((category, index) => {
        let hue = (index * 137) % 360; // Use a color spread across the spectrum
        colors[category] = `hsl(${hue}, 100%, 50%)`;
    });
    return colors;
}

function toggleClassificationLayer(attribute) {
    // If layer exists, remove it (toggle off)
    if (classificationLayer) {
        map.removeLayer(classificationLayer);
        classificationLayer = null;
        updateLegend(null); // Hide legend when toggling off
        return;
    }

    let source = new ol.source.Vector();
    let colorMap = (attribute === "sex/gender") ? genderColors : raceColors;

    vectorSource.getFeatures().forEach(feature => {
        let props = feature.getProperties();
        let currentStyle = feature.getStyle();

        // Only classify currently visible features
        if (!currentStyle || !currentStyle.getImage()) {
            return;
        }

        let classificationValue = (attribute === "sex/gender") ? props["sex/gender"] : props["race"];
        let color = colorMap[classificationValue];

        if (!color) {
            return; // Skip if no color is found
        }

        // Clone the feature and apply classification styling
        let newFeature = feature.clone();
        newFeature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({ color: color }),
                stroke: new ol.style.Stroke({ color: "black", width: 2 })
            })
        }));
        source.addFeature(newFeature);
    });

    // Create a new layer
    classificationLayer = new ol.layer.Vector({
        source: source,
        visible: true
    });

    map.addLayer(classificationLayer);

    // Update the legend with the current classification
    updateLegend(attribute);
}

function updateLegend(attribute) {
    let legendDiv = document.getElementById("classification-legend");

    if (!legendDiv) {
        legendDiv = document.createElement("div");
        legendDiv.id = "classification-legend";
        legendDiv.style.marginTop = "10px";
        legendDiv.style.padding = "5px";
        legendDiv.style.background = "rgba(255, 255, 255, 0.9)";
        legendDiv.style.borderRadius = "5px";
        legendDiv.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
        legendDiv.style.display = "none"; // Initially hidden
        document.getElementById("classification-filters").appendChild(legendDiv);
    }

    if (!attribute) {
        legendDiv.style.display = "none"; // Hide legend when classification is turned off
        return;
    }

    let colorMap = (attribute === "sex/gender") ? genderColors : raceColors;
    legendDiv.innerHTML = `<strong>Legend (${attribute}):</strong><br>`;

    Object.entries(colorMap).forEach(([key, color]) => {
        let legendItem = document.createElement("div");
        legendItem.style.display = "flex";
        legendItem.style.alignItems = "center";
        legendItem.style.marginBottom = "3px";

        let colorBox = document.createElement("div");
        colorBox.style.width = "15px";
        colorBox.style.height = "15px";
        colorBox.style.background = color;
        colorBox.style.marginRight = "5px";
        colorBox.style.border = "1px solid black";

        let label = document.createElement("span");
        label.innerText = key;

        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendDiv.appendChild(legendItem);
    });

    legendDiv.style.display = "block"; // Show legend when classification is active
}



function createClassificationFilterUI() {
    let classificationDiv = document.getElementById("classification-filters");

    if (!classificationDiv) {
        classificationDiv = document.createElement("div");
        classificationDiv.id = "classification-filters";
        classificationDiv.innerHTML = "<h3>Classification Overlay</h3>";

        classificationDiv.style.position = "absolute";
        classificationDiv.style.top = "10px"; 
        classificationDiv.style.right = "220px"; 
        classificationDiv.style.background = "rgba(255, 255, 255, 0.9)";
        classificationDiv.style.padding = "10px";
        classificationDiv.style.borderRadius = "5px";
        classificationDiv.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
        classificationDiv.style.zIndex = "1000";
        classificationDiv.style.maxWidth = "200px";

        document.body.appendChild(classificationDiv);
    }

    classificationDiv.innerHTML = "<h3>Classification Overlay</h3>";

    let classifyByGenderBtn = document.createElement("button");
    classifyByGenderBtn.innerText = "Toggle Sex/Gender Layer";
    classifyByGenderBtn.style.margin = "5px";
    classifyByGenderBtn.style.cursor = "pointer";
    classifyByGenderBtn.addEventListener("click", function () {
        console.log("Toggling Sex/Gender Layer");
        toggleClassificationLayer("sex/gender");
    });

    let classifyByRaceBtn = document.createElement("button");
    classifyByRaceBtn.innerText = "Toggle Race Layer";
    classifyByRaceBtn.style.margin = "5px";
    classifyByRaceBtn.style.cursor = "pointer";
    classifyByRaceBtn.addEventListener("click", function () {
        console.log("Toggling Race Layer");
        toggleClassificationLayer("race");
    });

    classificationDiv.appendChild(classifyByGenderBtn);
    classificationDiv.appendChild(classifyByRaceBtn);

    // Add a placeholder for the legend (initially hidden)
    let legendDiv = document.createElement("div");
    legendDiv.id = "classification-legend";
    legendDiv.style.display = "none";
    classificationDiv.appendChild(legendDiv);
}


// Ensure classification UI and extraction runs after the map loads
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(extractClassificationCategories, 1000);
});

