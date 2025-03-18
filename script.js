// Function to extract the decade from a year
function getDecade(year) {
    return Math.floor(year / 10) * 10;
}

// Create OpenLayers map
var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-75.1652, 39.9526]), // Philadelphia
        zoom: 12
    })
});

// Load GeoJSON data
var vectorSource = new ol.source.Vector({
    url: 'testopenlayers.geojson', 
    format: new ol.format.GeoJSON(),
    loader: function () {
        fetch('testopenlayers.geojson')
            .then(response => response.json())
            .then(data => {
                var features = new ol.format.GeoJSON().readFeatures(data);
                vectorSource.clear();
                vectorSource.addFeatures(features);
                updateFilter(); // Apply filtering when data loads
            });
    }
});

var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: function (feature) {
        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: 'blue' }),
                stroke: new ol.style.Stroke({ color: 'white', width: 2 })
            })
        });
    }
});

map.addLayer(vectorLayer);

// Filter function
function updateFilter() {
    var startDecade = parseInt(document.getElementById('startDecade').value);
    var endDecade = parseInt(document.getElementById('endDecade').value);

    document.getElementById('startDecadeText').innerText = startDecade + 's';
    document.getElementById('endDecadeText').innerText = endDecade + 's';

    vectorSource.forEachFeature(function (feature) {
        var startYear = feature.get('start date') || 1900;
        var endYear = feature.get('end date') || 2020;
        var featureStartDecade = getDecade(startYear);
        var featureEndDecade = getDecade(endYear);

        var visible = featureStartDecade <= endDecade && featureEndDecade >= startDecade;
        feature.setStyle(visible ? null : new ol.style.Style({}));
    });
}

// Add event listeners for both sliders
document.getElementById('startDecade').addEventListener('input', updateFilter);
document.getElementById('endDecade').addEventListener('input', updateFilter);


// Event listener for slider change
document.getElementById('decadeRange').addEventListener('input', updateFilter);
