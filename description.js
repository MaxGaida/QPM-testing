// --- Popup Setup ---
let popupDiv = document.getElementById('popup');
if (!popupDiv) {
  popupDiv = document.createElement('div');
  popupDiv.setAttribute('id', 'popup');
  popupDiv.style.position = 'absolute';
  popupDiv.style.backgroundColor = 'white';
  popupDiv.style.border = '1px solid black';
  popupDiv.style.padding = '10px';
  popupDiv.style.display = 'none';
  popupDiv.style.zIndex = '1000';
  popupDiv.style.maxWidth = '300px';
  popupDiv.style.wordWrap = 'break-word';
  popupDiv.style.borderRadius = '6px';
  popupDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
  document.body.appendChild(popupDiv);
}

// --- Utility Functions ---
function calculateDecades(startYear, endYear) {
  if (!startYear || !endYear) return 'Unknown';
  const startDecade = Math.floor(startYear / 10) * 10;
  const endDecade = Math.floor(endYear / 10) * 10;
  return startDecade === endDecade ? `${startDecade}s` : `${startDecade}s – ${endDecade}s`;
}

function getDataOrBlank(data) {
  return data ? data : '';
}

function getYear(raw) {
  return raw && /^\d{4}/.test(raw) ? parseInt(raw.slice(0, 4)) : null;
}

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

// --- Feature Click Handler ---
map.on('singleclick', function (event) {
  const tolerance = isMobile ? 8 : 0; // expands the clickable area

  let feature = null;

  // Try neighboring pixels if on mobile
  for (let dx = -tolerance; dx <= tolerance && !feature; dx++) {
    for (let dy = -tolerance; dy <= tolerance && !feature; dy++) {
      feature = map.forEachFeatureAtPixel([event.pixel[0] + dx, event.pixel[1] + dy], f => f);
    }
  }

  if (feature) {
    const props = feature.getProperties();
    const startYear = getYear(props["Start"]);
    const endYear = getYear(props["End"]) || new Date().getFullYear();
    const decades = calculateDecades(startYear, endYear);

    const name = getDataOrBlank(props['Name']);
    const address = getDataOrBlank(props['Address']);
    const sexGender = getDataOrBlank(props['sex/gender']);
    const race = getDataOrBlank(props['race']);
    const description = getDataOrBlank(props['Description']);
    const source = getDataOrBlank(props['Source']);

    popupDiv.innerHTML = `
      <div style="position: relative;">
    <button onclick="document.getElementById('popup').style.display='none'" 
      style="
        position: absolute;
        top: -10px;
        left: -10px;
        background-color: #c63dc6;
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 14px;
        line-height: 1;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">&times;</button>  
    
    <div style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 6px;">
        ${name}
      </div>

      <table style="margin-bottom: 10px;">
        <tr><td style="font-weight: bold; padding-right: 10px;">Address:</td><td>${address}</td></tr>
        <tr><td style="font-weight: bold; padding-right: 10px;">Active:</td><td>${decades}</td></tr>
        ${sexGender && sexGender.toLowerCase() !== 'unclear' ? `<tr><td style="font-weight: bold; padding-right: 10px;">Sexuality:</td><td>${sexGender}</td></tr>` : ''}
        ${race && race.toLowerCase() !== 'unclear' ? `<tr><td style="font-weight: bold; padding-right: 10px;">Race:</td><td>${race}</td></tr>` : ''}
      </table>

      <hr style="margin: 10px 0;" />
      <div style="text-align: justify;">${description}</div>
      <div style="margin-top: 10px;"><strong>Source:</strong> ${source}</div>
    `;

    const pixel = map.getPixelFromCoordinate(event.coordinate);
    popupDiv.style.left = `${pixel[0] + 10}px`;
    popupDiv.style.top = `${pixel[1] + 10}px`;
    popupDiv.style.display = 'block';
  } else {
    popupDiv.style.display = 'none';
  }
});
