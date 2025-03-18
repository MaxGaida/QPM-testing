window.onload = function() {
    // Define the map
    var map = new ol.Map({
        target: 'map',
        layers: [
            // First base layer: Stamen Toner (black and white minimalist)
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'https://{a-c}.tile.stamen.com/toner/{z}/{x}/{y}.png'
                })
            }),
            // Second layer: Vector layer (your GeoJSON data)
            new ol.layer.Vector({
                source: new ol.source.Vector({
                    url: 'testopenlayers.geojson',  // URL to your GeoJSON file
                    format: new ol.format.GeoJSON()
                }),
                style: function(feature) {
                    // Check if 'c1' property is 'event'
                    var c1 = feature.get('c1');
                    var style;

                    if (c1 === 'event') {
                        // Style for 'event' category (triangle)
                        style = new ol.style.Style({
                            image: new ol.style.RegularShape({
                                fill: new ol.style.Fill({ color: 'black' }),  // Filled with black
                                stroke: new ol.style.Stroke({
                                    color: 'white',
                                    width: 2
                                }),
                                points: 3, // Triangle
                                radius: 10, // Size of the triangle
                                angle: Math.PI / 4 // Rotate it to be upright
                            })
                        });
                    } else {
                        // Style for other categories (circle)
                        style = new ol.style.Style({
                            image: new ol.style.Circle({
                                fill: new ol.style.Fill({ color: 'black' }),  // Filled with black
                                stroke: new ol.style.Stroke({
                                    color: 'white',
                                    width: 2
                                }),
                                radius: 10  // Size of the circle
                            })
                        });
                    }

                    return style;
                }
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-75.1652, 39.9526]),  // Centered on Philadelphia
            zoom: 12
        })
    });
};
