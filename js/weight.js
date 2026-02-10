// weight.js - Weight/mass unit conversions
const weightMap = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  t: 1000,
  lb: 0.453592,
  oz: 0.0283495,
  st: 6.35029 // stone (14 pounds)
};

const weightFrom = document.getElementById('weight-from');
const weightTo = document.getElementById('weight-to');
const weightInputEl = document.getElementById('weight-input');
const weightResultEl = document.getElementById('weight-result');

function convertWeight(val, from, to) {
  if (isNaN(val) || val < 0) return 'Invalid';
  
  // Convert to kg first, then to target unit
  const inKg = val * (weightMap[from] || 1);
  return inKg / (weightMap[to] || 1);
}

function convertWeightUI() {
  if (!weightInputEl || !weightResultEl || !weightFrom || !weightTo) return;
  
  const val = Number(weightInputEl.value);
  const from = weightFrom.value;
  const to = weightTo.value;
  
  if (weightInputEl.value === '' || isNaN(val) || val < 0) {
    weightResultEl.textContent = '';
    weightResultEl.classList.remove('show');
    return;
  }
  
  const result = convertWeight(val, from, to);
  
  if (result === 'Invalid') {
    weightResultEl.textContent = '❌ Invalid input';
    weightResultEl.classList.remove('show');
    return;
  }
  
  // Format result
  const formatted = result < 0.001 ? result.toExponential(4) :
                   result < 1 ? result.toFixed(6) :
                   result < 1000 ? result.toFixed(4) :
                   result.toLocaleString('en-US', { maximumFractionDigits: 2 });
  
  weightResultEl.textContent = `${val} ${from} = ${formatted} ${to}`;
  weightResultEl.classList.add('show');
}

// Event listeners
if (weightInputEl) {
  weightInputEl.addEventListener('input', convertWeightUI);
}
if (weightFrom) {
  weightFrom.addEventListener('change', convertWeightUI);
}
if (weightTo) {
  weightTo.addEventListener('change', convertWeightUI);
}

window.convertWeight = convertWeight;
window.convertWeightUI = convertWeightUI;