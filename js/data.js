// data.js - Data size unit conversions
const dataMap = {
  bit: 0.125, // 8 bits = 1 byte
  B: 1,
  KB: 1024,
  MB: 1048576,
  GB: 1073741824,
  TB: 1099511627776,
  PB: 1125899906842624
};

const dataFrom = document.getElementById('data-from');
const dataTo = document.getElementById('data-to');
const dataInputEl = document.getElementById('data-input');
const dataResultEl = document.getElementById('data-result');

function convertData(val, from, to) {
  if (isNaN(val) || val < 0) return 'Invalid';
  
  // Convert to bytes first, then to target unit
  const inBytes = val * (dataMap[from] || 1);
  return inBytes / (dataMap[to] || 1);
}

function convertDataUI() {
  if (!dataInputEl || !dataResultEl || !dataFrom || !dataTo) return;
  
  const val = Number(dataInputEl.value);
  const from = dataFrom.value;
  const to = dataTo.value;
  
  if (dataInputEl.value === '' || isNaN(val) || val < 0) {
    dataResultEl.textContent = '';
    dataResultEl.classList.remove('show');
    return;
  }
  
  const result = convertData(val, from, to);
  
  if (result === 'Invalid') {
    dataResultEl.textContent = '❌ Invalid input';
    dataResultEl.classList.remove('show');
    return;
  }
  
  // Format result with appropriate precision
  const formatted = result < 0.001 ? result.toExponential(4) :
                   result < 1 ? result.toFixed(6) :
                   result < 1000 ? result.toFixed(4) :
                   result.toLocaleString('en-US', { maximumFractionDigits: 2 });
  
  dataResultEl.textContent = `${val} ${from} = ${formatted} ${to}`;
  dataResultEl.classList.add('show');
}

// Event listeners
if (dataInputEl) {
  dataInputEl.addEventListener('input', convertDataUI);
}
if (dataFrom) {
  dataFrom.addEventListener('change', convertDataUI);
}
if (dataTo) {
  dataTo.addEventListener('change', convertDataUI);
}

window.convertData = convertData;
window.convertDataUI = convertDataUI;