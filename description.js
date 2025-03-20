// Function to calculate decades from the start and end years
function calculateDecades(startYear, endYear) {
    let decades = [];
    for (let year = startYear; year <= endYear; year += 10) {
        let decadeStart = Math.floor(year / 10) * 10;
        let decadeEnd = decadeStart + 9;
        decades.push(`${decadeStart}s`);
    }
    return decades.join(", ");
}

// Create a popup div
const popupDiv = document.createElement('div');
popupDiv.setAttribute('id', 'popup');
popupDiv.style.position = 'absolute';
popupDiv.style.backgroundColor = 'white';
popupDiv.style.border = '1px solid black';
popupDiv.style.padding = '10px';
popupDiv.style.display = 'none';
popupDiv.style.zIndex = '1000';
popupDiv.style.maxWidth = '300px'; // Set a fixed width (you can adjust this)
popupDiv.style.wordWrap = 'break-word'; // Ensures content wraps
document.body.appendChild(popupDiv);

// Function to get data or return an empty string if data is null or undefined
function getDataOrBlank(data) {
    return data ? data : ''; // Return data if it exists, else return an empty string
}

// Handle hovering over features
let hoverTimeout;
window.map.on('pointermove', function (event) {
    const feature = map.forEachFeatureAtPixel(event.pixel, function (feat) {
        return feat;
    });

    if (feature) {
        const properties = feature.getProperties();

        const startYear = properties['start date'] ? parseInt(properties['start date'].split('-')[0]) : null;
        const endYear = properties['end date'] ? parseInt(properties['end date'].split('-')[0]) : null;

        // Calculate decades if start and end years are available
        const decades = startYear && endYear ? calculateDecades(startYear, endYear) : 'Unknown';

        // Create the popup content
        const popupContent = `
            <strong>Name:</strong> ${getDataOrBlank(properties['name'])}<br>
            <strong>Address:</strong> ${getDataOrBlank(properties['address'])}<br>
            <strong>Description:</strong> ${getDataOrBlank(properties['description'])}<br>
            <strong>Active Decades:</strong> ${decades}<br>
            <strong>Source:</strong> ${getDataOrBlank(properties['source'])}
        `;

        popupDiv.innerHTML = popupContent;
        popupDiv.style.left = `${event.pixel[0] + 10}px`;
        popupDiv.style.top = `${event.pixel[1] + 10}px`;

        // Show the popup after 1 second
        clearTimeout(hoverTimeout);
        hoverTimeout = setTimeout(function () {
            popupDiv.style.display = 'block';
        }, 1000); // 1000 ms = 1 second
    } else {
        // Hide popup if no feature is hovered over
        popupDiv.style.display = 'none';
        clearTimeout(hoverTimeout);
    }
});