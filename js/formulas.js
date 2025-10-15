// formulas.js - populate the single formulas page (grouped & friendly)
const formulasContent = document.getElementById('formulas-content');

const formulas = [
  { group: 'Distance', items: [
    'We convert everything through meters. Example: to get result in target unit, first convert to meters, then to the target unit.',
    'E.g. 1 km → meters: 1 × 1000 = 1000 m. Then to miles: 1000 ÷ 1609.34 ≈ 0.621 miles.'
  ]},
  { group: 'Temperature', items: [
    'C → F: F = C × 9/5 + 32',
    'C → K: K = C + 273.15',
    'F → C: C = (F − 32) × 5/9',
    'K → C: C = K − 273.15',
    'Rankine → Kelvin: K = R × 5/9'
  ]},
  { group: 'Weight', items: [
    'We convert everything through kilograms. Example: To convert 500 g to lb: 500 g = 0.5 kg → 0.5 ÷ 0.453592 ≈ 1.102 lb.'
  ]},
  { group: 'Speed', items: [
    'm/s is the internal reference. Convert value to m/s, then to the requested unit.',
    'E.g. 36 km/h = 36 × (1/3.6) = 10 m/s.'
  ]},
  { group: 'Time', items: [
    'Seconds are used as the internal base. Convert to seconds then to desired unit.',
    'E.g. 2 hours = 2 × 3600 = 7200 seconds; to minutes: 7200 ÷ 60 = 120 minutes.'
  ]},
  { group: 'Data', items: [
    'Bytes are used as the base. Use powers of 1024 (1 KB = 1024 B).',
    'E.g. 1024 KB = 1024 × 1024 bytes = 1 MB.'
  ]},
  { group: 'Currency', items: [
    'Formula used: result = (amount / base_rate) × target_rate.',
    'Rates come from exchangerate.host and are updated live when available. If live rates are unavailable, we fall back to safe defaults and show a status message.'
  ]}
];

function renderFormulas() {
  if (!formulasContent) return;
  formulasContent.innerHTML = '';
  formulas.forEach(fg => {
    const card = document.createElement('div');
    card.style.marginBottom = '1rem';
    card.innerHTML = `<h3>${fg.group}</h3>`;
    const ul = document.createElement('ul');
    fg.items.forEach(it => {
      const li = document.createElement('li');
      li.textContent = it;
      ul.appendChild(li);
    });
    card.appendChild(ul);
    formulasContent.appendChild(card);
  });
}

renderFormulas();
