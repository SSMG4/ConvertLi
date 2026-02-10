// currency.js - Enhanced currency converter with improved charts and multiple timeframes
const currencyFromSelect = document.getElementById('currency-from');
const currencyToSelect = document.getElementById('currency-to');
const currencyResultEl = document.getElementById('currency-result');
const currencyStatusEl = document.getElementById('currency-status');
const currencyChartEl = document.getElementById('currency-chart');
const currencyChartMessageEl = document.getElementById('currency-chart-message');

let currencyRates = {};
let currencySymbols = [];
let currencyReady = false;
let currencyChart = null;
let currentTimeframe = '1Y';

async function safeFetch(url, timeout = 10000) {
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
  if (currencyStatusEl) currencyStatusEl.textContent = 'Loading currencies...';
  
  const data = await safeFetch('https://api.exchangerate.host/symbols');
  if (!data || !data.symbols) {
    currencySymbols = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'SEK', 'NZD', 'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'INR', 'RUB', 'BRL', 'ZAR'].sort();
  } else {
    currencySymbols = Object.keys(data.symbols).sort();
  }

  if (currencyFromSelect && currencyToSelect) {
    currencyFromSelect.innerHTML = '';
    currencyToSelect.innerHTML = '';
    
    currencySymbols.forEach(s => {
      const label = data && data.symbols && data.symbols[s] ? `${s} - ${data.symbols[s].description}` : s;
      
      const optA = document.createElement('option');
      optA.value = s;
      optA.textContent = label;
      currencyFromSelect.appendChild(optA);
      
      const optB = document.createElement('option');
      optB.value = s;
      optB.textContent = label;
      currencyToSelect.appendChild(optB);
    });

    if (currencySymbols.includes('USD')) currencyFromSelect.value = 'USD';
    else currencyFromSelect.selectedIndex = 0;
    if (currencySymbols.includes('EUR')) currencyToSelect.value = 'EUR';
    else currencyToSelect.selectedIndex = currencySymbols.length > 1 ? 1 : 0;
  }

  await fetchRates();
}

async function fetchRates() {
  const data = await safeFetch('https://api.exchangerate.host/latest');
  if (!data || !data.rates) {
    const fallbackRates = {USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, AUD: 1.52, CAD: 1.36, CHF: 0.88, CNY: 7.24, SEK: 10.36, NZD: 1.63, MXN: 17.12, SGD: 1.34, HKD: 7.83, NOK: 10.53, KRW: 1329, TRY: 32.5, INR: 83.2, RUB: 92.5, BRL: 4.98, ZAR: 18.76};
    currencySymbols.forEach(s => { currencyRates[s] = fallbackRates[s] || 1; });
    currencyReady = false;
    if (currencyStatusEl) {
      currencyStatusEl.textContent = '⚠️ Live rates unavailable - using approximate rates';
      currencyStatusEl.style.color = '#ff9800';
    }
    return;
  }
  
  currencyRates = data.rates;
  currencyReady = true;
  if (currencyStatusEl) {
    currencyStatusEl.textContent = '✓ Live rates updated';
    currencyStatusEl.style.color = '#4CAF50';
    setTimeout(() => { currencyStatusEl.textContent = ''; }, 3000);
  }
}

function convertCurrency() {
  if (!currencyResultEl || !currencyFromSelect || !currencyToSelect) return;
  
  const input = document.getElementById('currency-input').value;
  const val = Number(input);
  const fromCurr = currencyFromSelect.value;
  const toCurr = currencyToSelect.value;
  
  if (input === '' || isNaN(val) || val < 0) {
    currencyResultEl.textContent = '';
    currencyResultEl.classList.remove('show');
    return;
  }
  
  if (!currencyRates || !currencyRates[fromCurr] || !currencyRates[toCurr]) {
    if (!currencyReady) {
      currencyResultEl.textContent = '⏳ Loading rates...';
      currencyResultEl.classList.add('show');
      return;
    }
  }
  
  const fromRate = currencyRates[fromCurr] || 1;
  const toRate = currencyRates[toCurr] || 1;
  const result = (val / fromRate) * toRate;
  const formatted = result.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 4});
  
  currencyResultEl.textContent = `${val} ${fromCurr} = ${formatted} ${toCurr}`;
  currencyResultEl.classList.add('show');
}

async function fetchCurrencyHistory(timeframe = currentTimeframe) {
  if (!currencyFromSelect || !currencyToSelect || !currencyChartEl || !currencyChartMessageEl) return;
  
  const fromCurr = currencyFromSelect.value;
  const toCurr = currencyToSelect.value;
  if (!fromCurr || !toCurr) return;
  
  currentTimeframe = timeframe;
  const today = new Date();
  let startDate, labelFormat;
  
  switch(timeframe) {
    case '1W': startDate = new Date(today); startDate.setDate(today.getDate() - 7); labelFormat = 'day'; break;
    case '1M': startDate = new Date(today); startDate.setMonth(today.getMonth() - 1); labelFormat = 'day'; break;
    case '3M': startDate = new Date(today); startDate.setMonth(today.getMonth() - 3); labelFormat = 'week'; break;
    case '1Y': startDate = new Date(today); startDate.setFullYear(today.getFullYear() - 1); labelFormat = 'month'; break;
    case '5Y': startDate = new Date(today); startDate.setFullYear(today.getFullYear() - 5); labelFormat = 'year'; break;
    default: startDate = new Date(today); startDate.setFullYear(today.getFullYear() - 1); labelFormat = 'month';
  }
  
  const start = startDate.toISOString().slice(0, 10);
  const end = today.toISOString().slice(0, 10);
  const url = `https://api.exchangerate.host/timeseries?start_date=${start}&end_date=${end}&base=${fromCurr}&symbols=${toCurr}`;
  const data = await safeFetch(url, 15000);
  
  if (!data || !data.rates) {
    renderCurrencyChart(null, fromCurr, toCurr);
    return;
  }
  
  const labels = [];
  const values = [];
  const dates = Object.keys(data.rates).sort();
  
  if (labelFormat === 'day') {
    dates.forEach(dateStr => {
      const date = new Date(dateStr);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      values.push(data.rates[dateStr][toCurr] || null);
    });
  } else if (labelFormat === 'week') {
    for (let i = 0; i < dates.length; i += 7) {
      const date = new Date(dates[i]);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      values.push(data.rates[dates[i]][toCurr] || null);
    }
  } else if (labelFormat === 'month') {
    const monthlyData = {};
    dates.forEach(dateStr => {
      const monthKey = dateStr.slice(0, 7);
      if (!monthlyData[monthKey]) monthlyData[monthKey] = data.rates[dateStr][toCurr];
    });
    Object.keys(monthlyData).sort().forEach(monthKey => {
      const date = new Date(monthKey + '-01');
      labels.push(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));
      values.push(monthlyData[monthKey]);
    });
  } else if (labelFormat === 'year') {
    const yearlyData = {};
    dates.forEach(dateStr => {
      const year = dateStr.slice(0, 4);
      if (!yearlyData[year]) yearlyData[year] = data.rates[dateStr][toCurr];
    });
    Object.keys(yearlyData).sort().forEach(year => {
      labels.push(year);
      values.push(yearlyData[year]);
    });
  }
  
  renderCurrencyChart({ labels, values }, fromCurr, toCurr);
}

function renderCurrencyChart(payload, fromCurr, toCurr) {
  if (!currencyChartEl || !currencyChartMessageEl) return;
  
  if (!payload || !payload.labels || payload.labels.length === 0 || payload.values.every(v => v === null)) {
    currencyChartEl.style.display = 'none';
    currencyChartMessageEl.style.display = 'block';
    currencyChartMessageEl.textContent = '📊 Historical data unavailable';
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
  
  const validValues = payload.values.filter(v => v !== null);
  const minVal = Math.min(...validValues);
  const maxVal = Math.max(...validValues);
  const range = maxVal - minVal;
  const padding = range * 0.1;
  
  currencyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: payload.labels,
      datasets: [{
        label: `${toCurr} per ${fromCurr}`,
        data: payload.values,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {mode: 'index', intersect: false},
      plugins: {
        legend: {display: true, position: 'top', labels: {color: getComputedStyle(document.body).getPropertyValue('--text-color'), font: {size: 12}}},
        tooltip: {mode: 'index', intersect: false, backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 12, callbacks: {label: function(context) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed.y !== null) label += context.parsed.y.toFixed(4);
          return label;
        }}}
      },
      scales: {
        y: {beginAtZero: false, min: minVal - padding, max: maxVal + padding, ticks: {color: getComputedStyle(document.body).getPropertyValue('--text-color'), callback: function(value) {return value.toFixed(4);}}, grid: {color: 'rgba(128, 128, 128, 0.1)'}},
        x: {ticks: {color: getComputedStyle(document.body).getPropertyValue('--text-color'), maxRotation: 45, minRotation: 0}, grid: {color: 'rgba(128, 128, 128, 0.1)'}}
      }
    }
  });
}

function addTimeframeButtons() {
  const section = document.getElementById('currency');
  if (!section) return;
  const chartContainer = section.querySelector('div[style*="max-width:700px"]');
  if (!chartContainer || chartContainer.querySelector('.timeframe-buttons')) return;
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'timeframe-buttons';
  buttonContainer.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap; justify-content: center;';
  
  ['1W', '1M', '3M', '1Y', '5Y'].forEach(tf => {
    const btn = document.createElement('button');
    btn.textContent = tf;
    btn.className = 'timeframe-btn';
    btn.style.cssText = 'padding: 0.4rem 0.8rem; font-size: 0.85rem; border-radius: 6px; cursor: pointer; transition: all 0.2s;';
    btn.dataset.timeframe = tf;
    
    if (tf === currentTimeframe) {
      btn.style.background = 'var(--accent)';
      btn.style.color = '#fff';
      btn.style.border = 'none';
    } else {
      btn.style.background = 'transparent';
      btn.style.border = '1px solid var(--accent)';
      btn.style.color = 'var(--accent)';
    }
    
    btn.addEventListener('click', () => {
      buttonContainer.querySelectorAll('button').forEach(b => {
        if (b === btn) {
          b.style.background = 'var(--accent)';
          b.style.color = '#fff';
          b.style.border = 'none';
        } else {
          b.style.background = 'transparent';
          b.style.border = '1px solid var(--accent)';
          b.style.color = 'var(--accent)';
        }
      });
      fetchCurrencyHistory(tf);
    });
    
    buttonContainer.appendChild(btn);
  });
  
  chartContainer.insertBefore(buttonContainer, chartContainer.firstChild);
}

window.fetchCurrencyHistory = fetchCurrencyHistory;
window.convertCurrency = convertCurrency;

fetchCurrencies().then(() => {
  convertCurrency();
  addTimeframeButtons();
  fetchCurrencyHistory('1Y');
}).catch(err => {
  console.error('Currency module init error', err);
  if (currencyStatusEl) {
    currencyStatusEl.textContent = '❌ Failed to load currency data';
    currencyStatusEl.style.color = '#f44336';
  }
});