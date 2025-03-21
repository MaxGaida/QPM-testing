function createSearchUI() {
    let searchDiv = document.createElement("div");
    searchDiv.id = "search-container";
    searchDiv.style.position = "absolute";
    searchDiv.style.top = "130px";
    searchDiv.style.left = "10px";
    searchDiv.style.background = "rgba(255, 255, 255, 0.9)";
    searchDiv.style.padding = "10px";
    searchDiv.style.borderRadius = "5px";
    searchDiv.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
    searchDiv.style.zIndex = "1000";
    searchDiv.style.maxWidth = "300px";

    let searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "search-bar";
    searchInput.placeholder = "Search for anything...";
    searchInput.style.width = "90%";
    searchInput.style.padding = "5px";

    let resultsList = document.createElement("div");
    resultsList.id = "search-results";
    resultsList.style.maxHeight = "200px";
    resultsList.style.overflowY = "auto";
    resultsList.style.marginTop = "5px";

    let highlightAllBtn = document.createElement("button");
    highlightAllBtn.innerText = "Highlight All";
    highlightAllBtn.style.margin = "5px";
    highlightAllBtn.style.cursor = "pointer";
    highlightAllBtn.addEventListener("click", function () {
        highlightAllSearchResults();
    });

    let deselectAllBtn = document.createElement("button");
    deselectAllBtn.innerText = "Deselect All";
    deselectAllBtn.style.margin = "5px";
    deselectAllBtn.style.cursor = "pointer";
    deselectAllBtn.addEventListener("click", function () {
        deselectAllSearchResults();
    });

    searchDiv.appendChild(searchInput);
    searchDiv.appendChild(resultsList);
    searchDiv.appendChild(highlightAllBtn);
    searchDiv.appendChild(deselectAllBtn);
    document.body.appendChild(searchDiv);

    searchInput.addEventListener("input", function () {
        searchFeatures(this.value.toLowerCase());
    });
}


function searchFeatures(query) {
    let resultsDiv = document.getElementById("search-results");
    resultsDiv.innerHTML = ""; // Clear previous results

    if (!query) return; // If search is empty, do nothing

    let matchingFeatures = [];

    vectorSource.getFeatures().forEach(feature => {
        let props = feature.getProperties();
        let featureText = Object.values(props).join(" ").toLowerCase(); // Combine all attributes

        if (featureText.includes(query)) {
            matchingFeatures.push({ feature, label: props.name || "Unnamed Location" });
        }
    });

    if (matchingFeatures.length === 0) {
        resultsDiv.innerHTML = "<p>No results found</p>";
        return;
    }

    matchingFeatures.forEach(match => {
        let resultItem = document.createElement("div");
        resultItem.innerText = match.label;
        resultItem.style.cursor = "pointer";
        resultItem.style.padding = "5px";
        resultItem.style.borderBottom = "1px solid #ddd";
        resultItem.style.background = "#f9f9f9";

        resultItem.addEventListener("click", function () {
            highlightFeature(match.feature);
        });

        resultsDiv.appendChild(resultItem);
    });
}

function highlightFeature(feature) {
    let geometry = feature.getGeometry();

    if (!geometry) {
        console.warn("Feature has no geometry, skipping zoom.");
        return;
    }

    let coordinates = geometry.getCoordinates();

    if (!coordinates || coordinates.length === 0) {
        console.warn("Invalid coordinates for feature, skipping zoom.");
        return;
    }

    feature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({ color: "yellow" }),
            stroke: new ol.style.Stroke({ color: "black", width: 2 })
        })
    }));

    // Ensure coordinates are correctly projected before zooming
    map.getView().animate({
        center: coordinates,
        zoom: Math.min(map.getView().getZoom() + 2, 16), // Prevent excessive zoom-in
        duration: 1000
    });
}


function highlightFeature(feature) {
    let geometry = feature.getGeometry();

    if (!geometry) {
        console.warn("Feature has no geometry, skipping zoom.");
        return;
    }

    let coordinates = geometry.getCoordinates();

    console.log("Feature coordinates (raw):", coordinates);

    if (!coordinates || coordinates.length === 0) {
        console.warn("Invalid coordinates for feature, skipping zoom.");
        return;
    }

    // Flatten array in case of nested structure
    let projectedCoordinates = Array.isArray(coordinates[0]) ? coordinates[0] : coordinates;

    console.log("Final coordinates for zoom:", projectedCoordinates);

    feature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({ color: "yellow" }),
            stroke: new ol.style.Stroke({ color: "black", width: 2 })
        })
    }));

    // Safeguard: Ensure the zoom level isn't too extreme
    let zoomLevel = Math.min(map.getView().getZoom() + 2, 16); // Prevent excessive zoom-in
    console.log("Zooming to:", projectedCoordinates, "Zoom Level:", zoomLevel);

    map.getView().animate({
        center: projectedCoordinates,
        zoom: zoomLevel,
        duration: 1000
    });
}

function highlightAllSearchResults() {
    let searchQuery = document.getElementById("search-bar").value.toLowerCase();
    if (!searchQuery) return;

    let foundAny = false;

    vectorSource.getFeatures().forEach(feature => {
        let props = feature.getProperties();
        let featureText = Object.values(props).join(" ").toLowerCase();

        if (featureText.includes(searchQuery)) {
            feature.setStyle(new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({ color: "yellow" }),
                    stroke: new ol.style.Stroke({ color: "black", width: 2 })
                })
            }));
            foundAny = true;
        }
    });

    if (!foundAny) {
        console.warn("No matching features found for highlighting.");
    } else {
        console.log("Highlighted all matching features.");
    }
}



document.addEventListener("DOMContentLoaded", function () {
    createSearchUI();
});

function deselectAllSearchResults() {
    vectorSource.getFeatures().forEach(feature => {
        feature.setStyle(styleFunction(feature)); // Reset to original style
    });

    console.log("Deselected all highlighted features.");
}
