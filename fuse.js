function createSearchUI() {
    let wrapper = document.getElementById("search-wrapper");
    if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "search-wrapper";
        wrapper.style.position = "absolute";
        wrapper.style.top = "10px";
        wrapper.style.left = "10px";
        wrapper.style.background = "rgba(255,255,255,0.95)";
        wrapper.style.padding = "10px";
        wrapper.style.borderRadius = "10px";
        wrapper.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
        wrapper.style.zIndex = "1000";
        wrapper.style.maxWidth = "300px";
        document.body.appendChild(wrapper);
    }

    const searchDiv = document.createElement("div");
    searchDiv.style.marginBottom = "12px";

    const inputRow = document.createElement("div");
    inputRow.style.display = "flex";
    inputRow.style.alignItems = "center";
    inputRow.style.gap = "6px";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "search-bar";
    searchInput.placeholder = "Search for anything...";
    searchInput.style.flex = "1";
    searchInput.style.padding = "5px";
    searchInput.style.border = "1px solid #ccc";
    searchInput.style.borderRadius = "4px";
    

    const toggleButton = document.createElement("button");
    toggleButton.innerText = "Highlight All";
    toggleButton.style.padding = "5px 8px";
    toggleButton.style.fontSize = "0.85em";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.borderRadius = "4px";
    toggleButton.style.border = "1px solid #999";
    toggleButton.style.background = "#e438f0";
    toggleButton.style.height = "32px"; // Match input height
    toggleButton.style.marginTop = "1px"; // Optional nudge if needed
    toggleButton.style.display = "flex";
    toggleButton.style.alignItems = "center";


    let highlightsActive = false;

    toggleButton.addEventListener("click", () => {
        if (!window.fuse) return;
        const searchQuery = searchInput.value.toLowerCase();
        const results = fuse.search(searchQuery);

        if (highlightsActive) {
            // Deselect
            vectorSource.getFeatures().forEach(feature => {
                feature.setStyle(defaultStyle);
            });
            toggleButton.innerText = "Highlight All";
            highlightsActive = false;
        } else {
            // Highlight
            results.forEach(result => {
                const feature = result.item.feature;
                feature.setStyle(new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: 8,
                        fill: new ol.style.Fill({ color: "yellow" }),
                        stroke: new ol.style.Stroke({ color: "black", width: 2 })
                    })
                }));
            });
            toggleButton.innerText = "Deselect All";
            highlightsActive = true;
        }
    });

    const resultsDiv = document.createElement("div");
    resultsDiv.id = "search-results";
    resultsDiv.style.maxHeight = "200px";
    resultsDiv.style.overflowY = "auto";
    resultsDiv.style.marginTop = "5px";

    inputRow.appendChild(searchInput);
    inputRow.appendChild(toggleButton);

    searchDiv.appendChild(inputRow);
    searchDiv.appendChild(resultsDiv);
    wrapper.appendChild(searchDiv);

    searchInput.addEventListener("input", function () {
        searchFeatures(this.value.toLowerCase());
        highlightsActive = false;
        toggleButton.innerText = "Highlight All";
    });
}


function searchFeatures(query) {
    const resultsDiv = document.getElementById("search-results");
    resultsDiv.innerHTML = "";

    if (!query || !window.fuse) return;

    const results = fuse.search(query);

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found</p>";
        return;
    }

    results.forEach(result => {
        const feature = result.item.feature;
        const label = result.item.Name || "Unnamed Location";

        const resultItem = document.createElement("div");
        resultItem.innerText = label;
        resultItem.style.cursor = "pointer";
        resultItem.style.padding = "5px";
        resultItem.style.borderBottom = "1px solid #ddd";
        resultItem.style.background = "#f9f9f9";

        resultItem.addEventListener("click", () => {
            highlightFeature(feature);
        });

        resultsDiv.appendChild(resultItem);
    });
}

function highlightFeature(feature) {
    const geometry = feature.getGeometry();
    const coords = geometry.getCoordinates();

    feature.setStyle(null); // clear any old style
    feature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({ color: 'yellow' }),
            stroke: new ol.style.Stroke({ color: 'black', width: 2 })
        })
    }));

    map.getView().animate({
        center: coords,
        zoom: Math.min(map.getView().getZoom() + 2, 16),
        duration: 1000
    });
}

function highlightAllSearchResults() {
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    if (!searchQuery || !window.fuse) return;

    const results = fuse.search(searchQuery);

    results.forEach(result => {
        const feature = result.item.feature;

        feature.setStyle(null);
        feature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({ color: "yellow" }),
                stroke: new ol.style.Stroke({ color: "black", width: 2 })
            })
        }));
    });

    console.log(`Highlighted ${results.length} matching features.`);
}

function deselectAllSearchResults() {
    vectorSource.getFeatures().forEach(feature => {
        feature.setStyle(defaultStyle);
    });
    console.log("Deselected all highlighted features.");
}

document.addEventListener("DOMContentLoaded", createSearchUI);
