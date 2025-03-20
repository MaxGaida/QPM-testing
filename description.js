let hoverTimeout;
let infoBox;

// Create and style the info box
function createInfoBox() {
    infoBox = document.createElement("div");
    infoBox.style.position = "absolute";
    infoBox.style.backgroundColor = "white";
    infoBox.style.border = "1px solid black";
    infoBox.style.padding = "8px";
    infoBox.style.borderRadius = "5px";
    infoBox.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
    infoBox.style.display = "none";
    infoBox.style.pointerEvents = "none";
    document.body.appendChild(infoBox);
}

// Function to display feature details
function showInfoBox(feature, event) {
    if (!feature) {
        infoBox.style.display = "none";
        return;
    }

    const properties = feature.getProperties();
    infoBox.innerHTML = `
        <strong>${properties.name || "No Name"}</strong><br>
        <em>${properties.address || "No Address"}</em><br>
        ${properties.description || "No Description"}<br>
        <small>Start: ${properties.start || "Unknown"} - End: ${properties.end || "Unknown"}</small>
    `;

    // Positioning the box near the cursor
    infoBox.style.left = `${event.pixel[0] + 10}px`;
    infoBox.style.top = `${event.pixel[1] + 10}px`;
    infoBox.style.display = "block";
}

// Initialize the hover effect
function initHoverEffect() {
    createInfoBox();

    map.on("pointermove", function (event) {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
        }

        const feature = map.forEachFeatureAtPixel(event.pixel, (feat) => feat);

        if (feature) {
            hoverTimeout = setTimeout(() => showInfoBox(feature, event), 1000); // 1-second delay
        } else {
            infoBox.style.display = "none";
        }
    });
}

// Run the hover effect after the map is initialized
initHoverEffect();
