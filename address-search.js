document.addEventListener("DOMContentLoaded", function () {
    if (!window.map) {
        console.error("Map not ready. Load this after map-setup.js");
        return;
    }

    const wrapper = document.getElementById("search-wrapper");
    if (!wrapper) {
        console.error("Missing #search-wrapper. Load fuse.js first.");
        return;
    }

    const container = document.createElement("div");
    container.style.marginTop = "12px"; // spacing below fuse search

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Or, search by address...";
    input.style.width = "90%";
    input.style.padding = "5px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "4px";

    const resultsDiv = document.createElement("div");
    resultsDiv.style.maxHeight = "150px";
    resultsDiv.style.overflowY = "auto";
    resultsDiv.style.marginTop = "5px";

    container.appendChild(input);
    container.appendChild(resultsDiv);
    wrapper.appendChild(container); // ✅ Adds to same box as Fuse search

    // Marker layer
    const pinSource = new ol.source.Vector();
    const pinLayer = new ol.layer.Vector({ source: pinSource });
    map.addLayer(pinLayer);

    // Fetch address suggestions
    function fetchSuggestions(query) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                resultsDiv.innerHTML = "";

                if (!data || data.length === 0) {
                    resultsDiv.innerHTML = "<p>No matches</p>";
                    return;
                }

                data.forEach(item => {
                    const suggestion = document.createElement("div");
                    suggestion.innerText = item.display_name;
                    suggestion.style.cursor = "pointer";
                    suggestion.style.padding = "5px";
                    suggestion.style.borderBottom = "1px solid #ccc";

                    suggestion.addEventListener("click", () => {
                        const lon = parseFloat(item.lon);
                        const lat = parseFloat(item.lat);
                        const coord = ol.proj.fromLonLat([lon, lat]);

                        input.value = item.display_name;
                        resultsDiv.innerHTML = "";
                        pinSource.clear();

                        const pin = new ol.Feature({
                            geometry: new ol.geom.Point(coord)
                        });

                        pin.setStyle(new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [0.5, 1],
                                scale: 0.05,
                                src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png'
                            })
                        }));

                        pinSource.addFeature(pin);

                        map.getView().animate({
                            center: coord,
                            zoom: 16,
                            duration: 1000
                        });
                    });

                    resultsDiv.appendChild(suggestion);
                });
            })
            .catch(err => {
                console.error("Autocomplete failed:", err);
                resultsDiv.innerHTML = "<p>Error fetching suggestions</p>";
            });
    }

    let debounceTimer;
    input.addEventListener("input", () => {
        const query = input.value.trim();
        if (!query) {
            resultsDiv.innerHTML = "";
            return;
        }

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);
    });
});
