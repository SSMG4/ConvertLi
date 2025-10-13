// app.js - global wiring & theme persistence

const toggleBtn = document.querySelector('.dark-toggle');

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('convertli-theme');
if (savedTheme) {
  document.body.setAttribute('data-theme', savedTheme);
  toggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';
}

toggleBtn.onclick = () => {
  const theme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', theme);
  toggleBtn.textContent = theme === 'light' ? '🌙' : '☀️';
  localStorage.setItem('convertli-theme', theme);
};

// Currency listeners (currency.js provides convertCurrency)
document.getElementById('currency-input').addEventListener('input', () => convertCurrency());
document.getElementById('currency-from').addEventListener('input', () => {
  convertCurrency();
  fetchCurrencyHistory(); // update chart
});
document.getElementById('currency-to').addEventListener('input', () => {
  convertCurrency();
  fetchCurrencyHistory();
});

// Time listeners
document.getElementById('time-input').addEventListener('input', () => convertTime());
document.getElementById('time-from').addEventListener('input', () => convertTime());
document.getElementById('time-to').addEventListener('input', () => convertTime());

// UNIX listeners (unix.js handles buttons)
document.getElementById('unix-input').addEventListener('input', () => {
  convertUnix();
});
document.getElementById('utc-input').addEventListener('input', () => convertUTCtoUnix());

// Distance listeners
document.getElementById('distance-input').addEventListener('input', () => convertDistance());
document.getElementById('distance-from').addEventListener('input', () => convertDistance());
document.getElementById('distance-to').addEventListener('input', () => convertDistance());

// Temperature listeners
document.getElementById('temp-input').addEventListener('input', () => convertTemperatureUI());
document.getElementById('temp-from').addEventListener('input', () => convertTemperatureUI());
document.getElementById('temp-to').addEventListener('input', () => convertTemperatureUI());

// Speed listeners
document.getElementById('speed-input').addEventListener('input', () => {
  const v = Number(document.getElementById('speed-input').value);
  const from = document.getElementById('speed-from').value;
  const to = document.getElementById('speed-to').value;
  const out = convertSpeed(v, from, to);
  const el = document.getElementById('speed-result');
  if (out === 'Invalid') {
    el.textContent = 'Invalid input';
    el.classList.remove('show');
  } else {
    el.textContent = `${v} ${from} = ${out} ${to}`;
    el.classList.add('show');
  }
});
document.getElementById('speed-from').addEventListener('input', () => document.getElementById('speed-input').dispatchEvent(new Event('input')));
document.getElementById('speed-to').addEventListener('input', () => document.getElementById('speed-input').dispatchEvent(new Event('input')));

// Weight listeners
document.getElementById('weight-input').addEventListener('input', () => {
  const v = Number(document.getElementById('weight-input').value);
  const from = document.getElementById('weight-from').value;
  const to = document.getElementById('weight-to').value;
  const out = convertWeight(v, from, to);
  const el = document.getElementById('weight-result');
  if (out === 'Invalid') {
    el.textContent = 'Invalid input';
    el.classList.remove('show');
  } else {
    el.textContent = `${v} ${from} = ${out} ${to}`;
    el.classList.add('show');
  }
});
document.getElementById('weight-from').addEventListener('input', () => document.getElementById('weight-input').dispatchEvent(new Event('input')));
document.getElementById('weight-to').addEventListener('input', () => document.getElementById('weight-input').dispatchEvent(new Event('input')));

// Data listeners
document.getElementById('data-input').addEventListener('input', () => {
  const v = Number(document.getElementById('data-input').value);
  const from = document.getElementById('data-from').value;
  const to = document.getElementById('data-to').value;
  const out = convertData(v, from, to);
  const el = document.getElementById('data-result');
  if (out === 'Invalid') {
    el.textContent = 'Invalid input';
    el.classList.remove('show');
  } else {
    el.textContent = `${v} ${from} = ${out} ${to}`;
    el.classList.add('show');
  }
});
document.getElementById('data-from').addEventListener('input', () => document.getElementById('data-input').dispatchEvent(new Event('input')));
document.getElementById('data-to').addEventListener('input', () => document.getElementById('data-input').dispatchEvent(new Event('input')));

// Populate selects that other modules already fill (distance/time) - those files already do options generation.
// For any modules that need an initial conversion run, kick them off:
window.addEventListener('DOMContentLoaded', () => {
  // Attempt initial conversions if inputs already have values
  document.getElementById('time-input').dispatchEvent(new Event('input'));
  document.getElementById('distance-input').dispatchEvent(new Event('input'));
  document.getElementById('speed-input').dispatchEvent(new Event('input'));
  document.getElementById('weight-input').dispatchEvent(new Event('input'));
  document.getElementById('data-input').dispatchEvent(new Event('input'));
  document.getElementById('currency-input').dispatchEvent(new Event('input'));
});
