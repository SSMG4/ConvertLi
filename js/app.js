const toggleBtn = document.querySelector('.dark-toggle');
toggleBtn.onclick = () => {
  const theme = document.body.getAttribute('data-theme')==='light'?'dark':'light';
  document.body.setAttribute('data-theme',theme);
  toggleBtn.textContent = theme==='light'?'🌙':'☀️';
};

// Instant conversion listeners
document.getElementById('currency-input').addEventListener('input',()=>convertCurrency());
document.getElementById('currency-from').addEventListener('input',()=>convertCurrency());
document.getElementById('currency-to').addEventListener('input',()=>convertCurrency());

document.getElementById('time-input').addEventListener('input',()=>convertTime());
document.getElementById('time-from').addEventListener('input',()=>convertTime());
document.getElementById('time-to').addEventListener('input',()=>convertTime());

document.getElementById('unix-input').addEventListener('input',()=>convertUnix());
document.getElementById('utc-input').addEventListener('input',()=>convertUTCtoUnix());
