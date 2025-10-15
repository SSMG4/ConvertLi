// currency.js - robust currency fetch + conversion + historical chart (Chart.js)
// Uses exchangerate.host API with graceful fallback and defaults.

const currencyFrom = document.getElementById('currency-from');
const currencyTo = document.getElementById('currency-to');
const currencyResultEl = document.getElementById('currency-result');
const currencyStatusEl = document.getElementById('currency-status');
const currencyChartEl = document.getElementById('currency-chart');
const currencyChartMessageEl = document.getElementById('currency-chart-message');

let currencyRates = {};
let currencySymbols = [];
let currencyReady = false;
let currencyChart = null;

// Safe fetch with timeout
async function safeFetch(url, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) throw new Error(`Network response was not ok ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(id);
    console.error('Fetch error', err);
    return null;
  }
}

async function fetchCurrencies() {
  // populate symbol list
  const data = await safeFetch('https://api.exchangerate.host/symbols');
  if (!data || !data.symbols) {
    // fallback minimal list
    currencySymbols = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
  } else {
    currencySymbols = Object.keys(data.symbols).sort();
  }

  // populate selects
  if (currencyFrom && currencyTo) {
    currencyFrom.innerHTML = '';
    currencyTo.innerHTML = '';
    currencySymbols.forEach(s => {
      const optA = document.createElement('option');
      optA.value = s;
      optA.textContent = s;
      currencyFrom.appendChild(optA);
      const optB = document.createElement('option');
      optB.value = s;
      optB.textContent = s;
      currencyTo.appendChild(optB);
    });

    // sensible defaults
    if (currencySymbols.includes('USD')) currencyFrom.value = 'USD';
    else currencyFrom.selectedIndex = 0;
    if (currencySymbols.includes('EUR')) currencyTo.value = 'EUR';
    else currencyTo.selectedIndex = currencySymbols.length > 1 ? 1 : 0;
  }

  await fetchRates();
}

async function fetchRates() {
  const data = await safeFetch('https://api.exchangerate.host/latest');
  if (!data || !data.rates) {
    // fallback attempt: use 1:1 for allowed currencies to avoid undefined
    currencySymbols.forEach(s => {
      currencyRates[s] = 1;
    });
    currencyReady = false;
    if (currencyStatusEl) {
      currencyStatusEl.textContent = 'Live rates unavailable — using fallback rates';
    }
    console.warn('Could not fetch live rates; using fallback rates.');
    return;
  }
  currencyRates = data.rates;
  currencyReady = true;
  if (currencyStatusEl) currencyStatusEl.textContent = '';
}

// Convert and update UI
function convertCurrency() {
  if (!currencyResultEl || !currencyFrom || !currencyTo) return;
  const input = document.getElementById('currency-input').value;
  const val = Number(input);
  const from = currencyFrom.value;
  const to = currencyTo.value;
  if (input === '' || isNaN(val)) {
    currencyResultEl.textContent = 'Invalid input';
    currencyResultEl.classList.remove('show');
    return;
  }
  if (!currencyRates || !currencyRates[from] || !currencyRates[to]) {
    // Not ready: wait or fall back to 1:1
    if (!currencyReady) {
      currencyResultEl.textContent = 'Rates loading...';
      currencyResultEl.classList.add('show');
      return;
    }
  }
  const fromRate = currencyRates[from] || 1;
  const toRate = currencyRates[to] || 1;
  const result = (val / fromRate) * toRate;
  currencyResultEl.textContent = `${val} ${from} = ${result.toFixed(4)} ${to}`;
  currencyResultEl.classList.add('show');
}

// Historical data & chart (last 5 years by year points)
async function fetchCurrencyHistory() {
  if (!currencyFrom || !currencyTo || !currencyChartEl || !currencyChartMessageEl) return;
  const from = currencyFrom.value;
  const to = currencyTo.value;
  if (!from || !to) return;

  // Build timeseries: one value per year (end of year) for last 5 years
  const today = new Date();
  const years = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear() - i, 11, 31); // Dec 31
    years.push(d);
  }
  const start = years[0].toISOString().slice(0, 10);
  const end = years[years.length - 1].toISOString().slice(0, 10);
  const url = `https://api.exchangerate.host/timeseries?start_date=${start}&end_date=${end}&base=${from}&symbols=${to}`;
  const data = await safeFetch(url, 10000);
  if (!data || !data.rates) {
    renderCurrencyChart(null, from, to);
    return;
  }

  // Build arrays for chart labels & values using yearly keys (pick Dec 31 value or latest available)
  const labels = [];
  const values = [];
  for (const d of years) {
    const k = d.toISOString().slice(0, 10);
    labels.push(d.getFullYear().toString());
    let val = null;
    if (data.rates[k] && data.rates[k][to] !== undefined) {
      val = data.rates[k][to];
    } else {
      for (let back = 1; back <= 10; back++) {
        const dt = new Date(d);
        dt.setDate(dt.getDate() - back);
        const key = dt.toISOString().slice(0, 10);
        if (data.rates[key] && data.rates[key][to] !== undefined) {
          val = data.rates[key][to];
          break;
        }
      }
    }
    values.push(val === null ? null : Number(val));
  }

  renderCurrencyChart({ labels, values }, from, to);
}

function renderCurrencyChart(payload, from, to) {
  // If payload is null or has no labels -> show message and hide chart
  if (!currencyChartEl || !currencyChartMessageEl) return;
  if (!payload || !payload.labels || payload.labels.length === 0 || payload.values.every(v => v === null)) {
    currencyChartEl.style.display = 'none';
    currencyChartMessageEl.style.display = 'block';
    currencyChartMessageEl.textContent = 'Historical data unavailable';
    if (currencyChart) { currencyChart.destroy(); currencyChart = null; }
    return;
  }

  currencyChartMessageEl.style.display = 'none';
  currencyChartEl.style.display = 'block';

  const ctx = currencyChartEl.getContext('2d');
  if (currencyChart) {
    currencyChart.destroy();
    currencyChart = null;
  }
  currencyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: payload.labels,
      datasets: [{
        label: `${to} per ${from} (yearly)`,
        data: payload.values,
        borderColor: 'var(--accent)',
        backgroundColor: 'rgba(33,150,243,0.12)',
        tension: 0.2,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: false }
      },
      plugins: {
        tooltip: { mode: 'index', intersect: false }
      }
    }
  });
}

// Expose fetchCurrencyHistory to app.js
window.fetchCurrencyHistory = fetchCurrencyHistory;

// Initialize
fetchCurrencies().then(() => {
  convertCurrency();
  fetchCurrencyHistory();
}).catch(err => {
  console.error('Currency module init error', err);
});
