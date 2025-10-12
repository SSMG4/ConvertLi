// Use ExchangeRate.host API
const currencyFrom = document.getElementById('currency-from');
const currencyTo = document.getElementById('currency-to');
let currencyRates = {};

async function fetchCurrencies(){
  const res = await fetch('https://api.exchangerate.host/symbols');
  const data = await res.json();
  const symbols = Object.keys(data.symbols);
  symbols.forEach(s=>{
    currencyFrom.innerHTML += `<option value="${s}">${s}</option>`;
    currencyTo.innerHTML += `<option value="${s}">${s}</option>`;
  });
  await fetchRates();
}

async function fetchRates(){
  const res = await fetch('https://api.exchangerate.host/latest');
  const data = await res.json();
  currencyRates = data.rates;
}

function convertCurrency(){
  const val = Number(document.getElementById('currency-input').value);
  const from = currencyFrom.value;
  const to = currencyTo.value;
  if(isNaN(val)) return document.getElementById('currency-result').textContent='Invalid input';
  const result = (val / currencyRates[from]) * currencyRates[to];
  document.getElementById('currency-result').textContent=`${val} ${from} = ${result.toFixed(2)} ${to}`;
  document.getElementById('currency-result').classList.add('show');
  document.getElementById('currency-formula').textContent=`Formula: (${val} / rate_of_${from}) * rate_of_${to}`;
}

// Initialize
fetchCurrencies();
