// distance.js - Distance unit conversions
const distanceMap = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.34,
  au: 149597870700,
  ly: 9.4607e15,
  pc: 3.0857e16
};

const distanceFromSelect = document.getElementById('distance-from');
const distanceToSelect = document.getElementById('distance-to');

Object.keys(distanceMap).forEach(u => {
  distanceFromSelect.innerHTML += `<option value="${u}">${u}</option>`;
  distanceToSelect.innerHTML += `<option value="${u}">${u}</option>`;
});

function convertDistance() {
  const val = Number(document.getElementById('distance-input').value);
  const fromUnit = distanceFromSelect.value;
  const toUnit = distanceToSelect.value;
  const resEl = document.getElementById('distance-result');
  
  if (isNaN(val)) {
    resEl.textContent = 'Invalid input';
    resEl.classList.remove('show');
    return;
  }
  
  const meters = val * distanceMap[fromUnit];
  const result = meters / distanceMap[toUnit];
  resEl.textContent = `${val} ${fromUnit} = ${result} ${toUnit}`;
  resEl.classList.add('show');
}

window.convertDistance = convertDistance;