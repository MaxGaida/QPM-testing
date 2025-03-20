document.addEventListener("DOMContentLoaded", function () {
    if (!window.vectorLayer) {
        console.error("vectorLayer is not defined. Ensure it's initialized before this script runs.");
        return;
    }

    var vectorLayer = window.vectorLayer; // Use the globally defined vector layer

    var allFeatures = []; // Store all features globally

    function loadInitialData(data) {
        allFeatures = new ol.format.GeoJSON().readFeatures(data, {
            featureProjection: 'EPSG:3857'
        });

        vectorLayer.getSource().clear();
        vectorLayer.getSource().addFeatures(allFeatures);
    }

    function filterData() {
        var selectedCategories = new Set();
        document.querySelectorAll('.c1:checked').forEach(cb => selectedCategories.add(cb.id));

        var selectedSubCategories = new Set();
        document.querySelectorAll('#subcategories input[type="checkbox"]:checked').forEach(cb => {
            let subcategory = cb.id.split('-')[1];
            selectedSubCategories.add(subcategory);
        });

        var filteredFeatures = allFeatures.filter(feature => {
            var c1 = feature.get('c1');
            var c2 = feature.get('c2');
            return selectedCategories.has(c1) && selectedSubCategories.has(c2);
        });

        vectorLayer.getSource().clear();
        vectorLayer.getSource().addFeatures(filteredFeatures);
    }

    function createCategoryFilters(data) {
        var categoryContainer = document.getElementById('filters');
        var uniqueCategories = new Set();

        data.features.forEach(feature => uniqueCategories.add(feature.properties['c1']));

        uniqueCategories.forEach(category => {
            var label = document.createElement('label');
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('c1');
            checkbox.id = category;
            checkbox.checked = true;
            checkbox.addEventListener('change', () => {
                updateSubcategoryFilters();
                filterData();
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(category));
            categoryContainer.appendChild(label);
            categoryContainer.appendChild(document.createElement('br'));
        });
    }

    function updateSubcategoryFilters() {
        var selectedC1 = new Set();
        document.querySelectorAll('.c1:checked').forEach(cb => selectedC1.add(cb.id));

        var subcategoryContainer = document.getElementById('subcategories');
        subcategoryContainer.innerHTML = '';

        var uniqueSubcategories = {};

        allFeatures.forEach(feature => {
            var c1 = feature.get('c1');
            var c2 = feature.get('c2');

            if (selectedC1.has(c1)) {
                if (!uniqueSubcategories[c1]) uniqueSubcategories[c1] = new Set();
                uniqueSubcategories[c1].add(c2);
            }
        });

        Object.keys(uniqueSubcategories).forEach(c1 => {
            uniqueSubcategories[c1].forEach(subcategory => {
                var label = document.createElement('label');
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `${c1}-${subcategory}`;
                checkbox.checked = true;
                checkbox.addEventListener('change', filterData);

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(subcategory));
                subcategoryContainer.appendChild(label);
                subcategoryContainer.appendChild(document.createElement('br'));
            });
        });
    }

    fetch('https://raw.githubusercontent.com/MaxGaida/QPM-testing/refs/heads/main/testopenlayers.geojson')
        .then(response => response.json())
        .then(data => {
            createCategoryFilters(data);
            loadInitialData(data);
            updateSubcategoryFilters();
            filterData();
        });



});
