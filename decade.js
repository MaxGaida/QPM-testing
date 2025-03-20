// Function to create decade filter UI in the top-right corner
function createDecadeFilterUI() {
    const decadesDiv = document.createElement("div");
    decadesDiv.id = "decade-filters";
    decadesDiv.innerHTML = "<h3>Filter by Decade</h3>";

    // Style for positioning in top right
    decadesDiv.style.position = "absolute";
    decadesDiv.style.top = "10px";
    decadesDiv.style.right = "10px";
    decadesDiv.style.background = "rgba(255, 255, 255, 0.9)";
    decadesDiv.style.padding = "10px";
    decadesDiv.style.borderRadius = "5px";
    decadesDiv.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.3)";
    decadesDiv.style.zIndex = "1000";
    decadesDiv.style.maxWidth = "200px";

    // Define decades
    const decades = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

    // Create checkboxes for each decade
    decades.forEach(decade => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("decade-filter");
        checkbox.value = decade;
        checkbox.checked = true;

        let label = document.createElement("label");
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${decade}s`));

        decadesDiv.appendChild(label);
        decadesDiv.appendChild(document.createElement("br"));
    });

    document.body.appendChild(decadesDiv);

    addDecadeFilterListeners();
}

// Function to check if a feature falls within selected decades
function isFeatureInSelectedDecade(feature, selectedDecades) {
    let props = feature.getProperties();
    let startYear = parseInt(props.start, 10) || 0;
    let endYear = parseInt(props.end, 10) || 9999;

    return selectedDecades.some(decade => startYear <= decade + 9 && endYear >= decade);
}

// Function to add event listeners to decade checkboxes
function addDecadeFilterListeners() {
    document.querySelectorAll(".decade-filter").forEach(cb => {
        cb.addEventListener("change", filterFeatures);
    });
}

// Modify filterFeatures to include decade filtering
function filterFeatures() {
    let selectedC1 = new Set([...document.querySelectorAll(".c1-filter:checked")].map(cb => cb.value.toLowerCase()));
    let selectedC2 = new Set([...document.querySelectorAll(".c2-filter:checked")].map(cb => cb.value.toLowerCase()));
    let selectedDecades = [...document.querySelectorAll(".decade-filter:checked")].map(cb => parseInt(cb.value, 10));

    console.log("Selected Decades:", selectedDecades); // Debugging

    vectorSource.getFeatures().forEach(feature => {
        let props = feature.getProperties();
        let featureC1 = (props.c1 || "").toLowerCase();
        let featureC2 = (props.c2 || "").toLowerCase();

        let matchesC1C2 = selectedC1.has(featureC1) && selectedC2.has(featureC2);
        let matchesDecade = isFeatureInSelectedDecade(feature, selectedDecades);

        let visible = matchesC1C2 && matchesDecade;
        feature.setStyle(visible ? styleFunction(feature) : new ol.style.Style({ visibility: 'hidden' }));
    });
}

// Run the function to create UI when the page loads
createDecadeFilterUI();
