// time.js - Time unit conversions
const timeMap = {
  ms: 0.001,
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800,
  mo: 2629800,
  y: 31557600
};

const timeFromSelect = document.getElementById('time-from');
const timeToSelect = document.getElementById('time-to');

if (timeFromSelect && timeToSelect) {
  Object.keys(timeMap).forEach(u => {
    timeFromSelect.innerHTML += `<option value="${u}">${u}</option>`;
    timeToSelect.innerHTML += `<option value="${u}">${u}</option>`;
  });
}

const timeInputEl = document.getElementById('time-input');
const timeResultEl = document.getElementById('time-result');

function convertTime() {
  if (!timeInputEl || !timeResultEl || !timeFromSelect || !timeToSelect) return;

  const val = Number(timeInputEl.value);
  const fromUnit = timeFromSelect.value;
  const toUnit = timeToSelect.value;
  
  if (isNaN(val)) {
    timeResultEl.textContent = 'Invalid input';
    timeResultEl.classList.remove('show');
    return;
  }
  
  const seconds = val * (timeMap[fromUnit] || 1);
  const result = seconds / (timeMap[toUnit] || 1);
  timeResultEl.textContent = `${val} ${fromUnit} = ${result} ${toUnit}`;
  timeResultEl.classList.add('show');
}

window.convertTime = convertTime;