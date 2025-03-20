let categories = {}; // Store unique c1 and c2 categories

// Function to extract unique categories from GeoJSON
function extractCategories(features) {
    features.forEach(feature => {
        let props = feature.getProperties();
        let c1 = props.c1 || "Other";
        let c2 = props.c2 || "Other";

        if (!categories[c1]) {
            categories[c1] = new Set();
        }
        categories[c1].add(c2);
    });
}

// Function to filter features based on checkboxes
function filterFeatures() {
    let selectedC1 = new Set([...document.querySelectorAll(".c1-filter:checked")].map(cb => cb.value.toLowerCase()));
    let selectedC2 = new Set([...document.querySelectorAll(".c2-filter:checked")].map(cb => cb.value.toLowerCase()));

    vectorSource.getFeatures().forEach(feature => {
        let props = feature.getProperties();
        let featureC1 = (props.c1 || "").toLowerCase();
        let featureC2 = (props.c2 || "").toLowerCase();

        let visible = selectedC1.has(featureC1) && selectedC2.has(featureC2);
        feature.setStyle(visible ? styleFunction(feature) : new ol.style.Style({ visibility: 'hidden' }));
    });
}


// Function to create filter UI with collapsible c2 checkboxes
function createFilterUI() {
    const filterDiv = document.getElementById("filters");
    filterDiv.innerHTML = "<h3>Filter by Category</h3>";

    Object.keys(categories).forEach(c1 => {
        let c1Container = document.createElement("div");

        // Create a container for the C1 category
        let c1Header = document.createElement("div");
        c1Header.style.display = "flex";
        c1Header.style.alignItems = "center";

        // Create a toggle button
        let toggleBtn = document.createElement("button");
        toggleBtn.innerText = "▼"; // Down arrow initially
        toggleBtn.style.marginRight = "5px";
        toggleBtn.style.cursor = "pointer";
        toggleBtn.style.border = "none";
        toggleBtn.style.background = "none";
        toggleBtn.style.fontSize = "16px";
        toggleBtn.style.padding = "0";
        toggleBtn.style.width = "20px";

        // Create the main c1 checkbox
        let c1Checkbox = document.createElement("input");
        c1Checkbox.type = "checkbox";
        c1Checkbox.classList.add("c1-filter");
        c1Checkbox.value = c1;
        c1Checkbox.checked = true;

        let c1Label = document.createElement("label");
        c1Label.appendChild(c1Checkbox);
        c1Label.appendChild(document.createTextNode(` ${c1}`));

        // Create a container for c2 checkboxes
        let c2List = document.createElement("div");
        c2List.style.marginLeft = "15px";
        c2List.style.display = "none"; // Hide by default


        // Toggle functionality
        toggleBtn.addEventListener("click", function() {
            if (c2List.style.display === "none") {
                c2List.style.display = "block";
                toggleBtn.innerText = "▼"; // Down arrow
            } else {
                c2List.style.display = "none";
                toggleBtn.innerText = "▶"; // Right arrow
            }
        });

        // Add all c2 checkboxes under this c1
        categories[c1].forEach(c2 => {
            let c2Checkbox = document.createElement("input");
            c2Checkbox.type = "checkbox";
            c2Checkbox.classList.add("c2-filter");
            c2Checkbox.dataset.c1 = c1;
            c2Checkbox.value = c2;
            c2Checkbox.checked = true;

            let c2Label = document.createElement("label");
            c2Label.appendChild(c2Checkbox);
            c2Label.appendChild(document.createTextNode(` ${c2}`));

            c2List.appendChild(c2Label);
            c2List.appendChild(document.createElement("br"));
        });

        // Append elements to the category header
        c1Header.appendChild(toggleBtn);
        c1Header.appendChild(c1Label);

        // Append elements to the filter UI
        c1Container.appendChild(c1Header);
        c1Container.appendChild(c2List);
        filterDiv.appendChild(c1Container);
    });

    addFilterListeners(); // Ensure checkboxes still work for filtering
}

// Function to add event listeners to checkboxes
function addFilterListeners() {
    document.querySelectorAll(".c1-filter, .c2-filter").forEach(cb => {
        cb.addEventListener("change", () => {
            console.log("Filter changed:", cb.value); // Debugging

            if (typeof filterFeatures === "function") {
                filterFeatures();
            } else {
                console.error("filterFeatures function is not available.");
            }
        });
    });
}


// Wait for GeoJSON to load, then extract categories and create UI
setTimeout(() => {
    extractCategories(vectorSource.getFeatures());
    createFilterUI();
}, 1000);
