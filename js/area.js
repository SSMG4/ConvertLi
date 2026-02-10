// area.js - Area unit conversions
const areaMap = {
  mm2: 0.000001,
  cm2: 0.0001,
  m2: 1,
  km2: 1000000,
  ha: 10000, // hectare
  in2: 0.00064516,
  ft2: 0.092903,
  yd2: 0.836127,
  ac: 4046.86, // acre
  mi2: 2589988 // square mile
};

const areaFrom = document.getElementById('area-from');
const areaTo = document.getElementById('area-to');
const areaInputEl = document.getElementById('area-input');
const areaResultEl = document.getElementById('area-result');

function convertArea() {
  if (!areaInputEl || !areaResultEl || !areaFrom || !areaTo) return;
  
  const val = Number(areaInputEl.value);
  const from = areaFrom.value;
  const to = areaTo.value;
  
  if (areaInputEl.value === '' || isNaN(val) || val < 0) {
    areaResultEl.textContent = '';
    areaResultEl.classList.remove('show');
    return;
  }
  
  // Convert to m² first, then to target unit
  const inM2 = val * (areaMap[from] || 1);
  const result = inM2 / (areaMap[to] || 1);
  
  // Format result
  const formatted = result < 0.001 ? result.toExponential(4) :
                   result < 1 ? result.toFixed(6) :
                   result < 1000 ? result.toFixed(4) :
                   result.toLocaleString('en-US', { maximumFractionDigits: 2 });
  
  areaResultEl.textContent = `${val} ${from} = ${formatted} ${to}`;
  areaResultEl.classList.add('show');
}

// Event listeners
if (areaInputEl) areaInputEl.addEventListener('input', convertArea);
if (areaFrom) areaFrom.addEventListener('change', convertArea);
if (areaTo) areaTo.addEventListener('change', convertArea);

window.convertArea = convertArea;
