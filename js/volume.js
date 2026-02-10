// volume.js - Volume unit conversions
const volumeMap = {
  ml: 1,
  l: 1000,
  m3: 1000000,
  gal: 3785.41, // US gallon
  qt: 946.353,
  pt: 473.176,
  cup: 236.588,
  floz: 29.5735,
  tbsp: 14.7868,
  tsp: 4.92892
};

const volumeFrom = document.getElementById('volume-from');
const volumeTo = document.getElementById('volume-to');
const volumeInputEl = document.getElementById('volume-input');
const volumeResultEl = document.getElementById('volume-result');

function convertVolume() {
  if (!volumeInputEl || !volumeResultEl || !volumeFrom || !volumeTo) return;
  
  const val = Number(volumeInputEl.value);
  const from = volumeFrom.value;
  const to = volumeTo.value;
  
  if (volumeInputEl.value === '' || isNaN(val) || val < 0) {
    volumeResultEl.textContent = '';
    volumeResultEl.classList.remove('show');
    return;
  }
  
  // Convert to ml first, then to target unit
  const inMl = val * (volumeMap[from] || 1);
  const result = inMl / (volumeMap[to] || 1);
  
  // Format result
  const formatted = result < 0.001 ? result.toExponential(4) :
                   result < 1 ? result.toFixed(6) :
                   result < 1000 ? result.toFixed(4) :
                   result.toLocaleString('en-US', { maximumFractionDigits: 2 });
  
  volumeResultEl.textContent = `${val} ${from} = ${formatted} ${to}`;
  volumeResultEl.classList.add('show');
}

// Event listeners
if (volumeInputEl) volumeInputEl.addEventListener('input', convertVolume);
if (volumeFrom) volumeFrom.addEventListener('change', convertVolume);
if (volumeTo) volumeTo.addEventListener('change', convertVolume);

window.convertVolume = convertVolume;
