// formulas.js - populate the single formulas page (grouped & sorted)
const formulasContent = document.getElementById('formulas-content');

const formulas = [
  { group: 'Distance', items: [
    'meters = value * unit_to_meters[from]',
    'result = meters / unit_to_meters[to]'
  ]},
  { group: 'Temperature', items: [
    'C -> F: F = C × 9/5 + 32',
    'C -> K: K = C + 273.15',
    'F -> C: C = (F - 32) × 5/9',
    'K -> C: C = K - 273.15',
    'Rankine -> Kelvin: K = R × 5/9'
  ]},
  { group: 'Weight', items: [
    'kg = value * unit_to_kg[from]',
    'result = kg / unit_to_kg[to]'
  ]},
  { group: 'Speed', items: [
    'm/s is used as base. value_in_m/s = value * factor[from] ; result = value_in_m/s / factor[to]'
  ]},
  { group: 'Time', items: [
    'seconds used as base. value_in_s = value * factor[from] ; result = value_in_s / factor[to]'
  ]},
  { group: 'Data', items: [
    'bytes used as base. value_in_B = value * factor[from] ; result = value_in_B / factor[to]'
  ]},
  { group: 'Currency', items: [
    'result = (amount / rate_of_base) * rate_of_target',
    'Rates are retrieved from exchangerate.host'
  ]}
];

function renderFormulas() {
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
