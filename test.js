// Define color mapping for each sex/gender category
const genderColors = {
    "gay": "blue",
    "lesbian": "red",
    "queer": "purple",
    "trans": "green",
    "bi": "orange",
    "mixed": "brown",
    "unknown": "gray"
};

const genderCounts = {};

// Function to get color by sex/gender
function getGenderColor(value) {
    if (!value) return genderColors["unknown"];
    const key = value.toLowerCase().trim();
    if (!genderColors[key]) {
        genderColors[key] = getRandomColor();
    }
    genderCounts[key] = (genderCounts[key] || 0) + 1;
    return genderColors[key];
}

// Generate a random color for new categories
function getRandomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

// Create style function
function styleByGender(feature) {
    const gender = feature.get("sex/gender");
    const color = getGenderColor(gender);
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({ color }),
            stroke: new ol.style.Stroke({ color: '#000', width: 1 })
        })
    });
}

// Apply style to your vector layer
vectorLayer.setStyle(styleByGender);

// Create and add legend
function createLegend() {
    const legendDiv = document.createElement("div");
    legendDiv.id = "legend";
    legendDiv.style.position = "absolute";
    legendDiv.style.top = "10px";
    legendDiv.style.right = "10px";
    legendDiv.style.background = "white";
    legendDiv.style.padding = "10px";
    legendDiv.style.border = "1px solid #ccc";
    legendDiv.style.fontFamily = "sans-serif";
    legendDiv.style.fontSize = "14px";

    const title = document.createElement("strong");
    title.innerText = "Sex/Gender Legend";
    legendDiv.appendChild(title);

    for (const [key, color] of Object.entries(genderColors)) {
        if (!genderCounts[key]) continue;

        const row = document.createElement("div");
        row.innerHTML = `
            <span style="display:inline-block;width:12px;height:12px;background:${color};margin-right:8px;border:1px solid #000;"></span>
            ${key} (${genderCounts[key]})
        `;
        legendDiv.appendChild(row);
    }

    document.body.appendChild(legendDiv);
}

// Wait a bit for features to load, then build the legend
setTimeout(createLegend, 1000);
