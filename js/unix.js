// unix.js - Enhanced UNIX timestamp converter with polished UI
const unixInput = document.getElementById('unix-input');
const utcInput = document.getElementById('utc-input');
const unixResultEl = document.getElementById('unix-result');
const utcResultEl = document.getElementById('utc-result');
const startBtn = document.getElementById('unix-start-counter');
const stopBtn = document.getElementById('unix-stop-counter');
const msToggle = document.getElementById('unix-ms-toggle');
const copyBtn = document.getElementById('unix-copy-btn');
const nowBtn = document.getElementById('unix-now-btn');

let unixInterval = null;
let baseTs = null; // in seconds
let isCounterRunning = false;

// Format timestamp display with better readability
function showUnix(tsSeconds) {
  if (!unixResultEl) return;
  
  const date = new Date(tsSeconds * 1000);
  
  // Check if valid date
  if (isNaN(date.getTime())) {
    unixResultEl.textContent = '❌ Invalid timestamp';
    unixResultEl.classList.add('show');
    unixResultEl.style.color = '#f44336';
    return;
  }
  
  unixResultEl.style.color = 'var(--text-color)';
  
  const utcString = date.toUTCString();
  const localString = date.toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  });
  
  // Calculate relative time
  const now = Math.floor(Date.now() / 1000);
  const diff = Math.abs(now - tsSeconds);
  let relativeTime = '';
  
  if (diff < 60) {
    relativeTime = `${diff} second${diff !== 1 ? 's' : ''} ${tsSeconds < now ? 'ago' : 'from now'}`;
  } else if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    relativeTime = `${mins} minute${mins !== 1 ? 's' : ''} ${tsSeconds < now ? 'ago' : 'from now'}`;
  } else if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    relativeTime = `${hours} hour${hours !== 1 ? 's' : ''} ${tsSeconds < now ? 'ago' : 'from now'}`;
  } else if (diff < 2592000) {
    const days = Math.floor(diff / 86400);
    relativeTime = `${days} day${days !== 1 ? 's' : ''} ${tsSeconds < now ? 'ago' : 'from now'}`;
  } else if (diff < 31536000) {
    const months = Math.floor(diff / 2592000);
    relativeTime = `${months} month${months !== 1 ? 's' : ''} ${tsSeconds < now ? 'ago' : 'from now'}`;
  } else {
    const years = Math.floor(diff / 31536000);
    relativeTime = `${years} year${years !== 1 ? 's' : ''} ${tsSeconds < now ? 'ago' : 'from now'}`;
  }
  
  unixResultEl.innerHTML = `
    <strong>UTC:</strong> ${utcString}<br>
    <strong>Local:</strong> ${localString}<br>
    <strong>Relative:</strong> ${relativeTime}
  `;
  unixResultEl.classList.add('show');
}

function convertUnix() {
  if (!unixInput || !unixResultEl) return;
  
  let ts = Number(unixInput.value);
  
  // Handle empty input
  if (unixInput.value === '') {
    unixResultEl.textContent = '';
    unixResultEl.classList.remove('show');
    stopUnixCounter();
    return;
  }
  
  if (isNaN(ts)) {
    unixResultEl.textContent = '❌ Invalid input';
    unixResultEl.classList.add('show');
    unixResultEl.style.color = '#f44336';
    stopUnixCounter();
    return;
  }
  
  // Auto-detect milliseconds (if value > year 2100 in seconds)
  if (ts > 4102444800) {
    ts = Math.floor(ts / 1000);
    msToggle.checked = true;
  }
  
  baseTs = Math.floor(ts);
  showUnix(baseTs);
}

function convertUTCtoUnix() {
  const utcVal = utcInput.value;
  if (!utcVal || !utcResultEl) return;
  
  const date = new Date(utcVal);
  
  if (isNaN(date.getTime())) {
    utcResultEl.textContent = '❌ Invalid date';
    utcResultEl.classList.add('show');
    utcResultEl.style.color = '#f44336';
    return;
  }
  
  utcResultEl.style.color = 'var(--text-color)';
  
  const tsSeconds = Math.floor(date.getTime() / 1000);
  const tsMillis = date.getTime();
  
  utcResultEl.innerHTML = `
    <strong>UNIX (seconds):</strong> ${tsSeconds}<br>
    <strong>UNIX (milliseconds):</strong> ${tsMillis}
  `;
  utcResultEl.classList.add('show');
  
  // Sync with main input
  unixInput.value = tsSeconds;
  convertUnix();
}

function startUnixCounter() {
  if (!unixInput || !unixResultEl) return;
  
  const tsRaw = Number(unixInput.value);
  if (isNaN(tsRaw)) {
    unixResultEl.textContent = '❌ Enter valid timestamp first';
    unixResultEl.classList.add('show');
    unixResultEl.style.color = '#f44336';
    return;
  }
  
  baseTs = Math.floor(tsRaw);
  const startTime = Date.now();
  const startTsMillis = baseTs * 1000;
  
  if (unixInterval) clearInterval(unixInterval);
  
  isCounterRunning = true;
  startBtn.textContent = '⏸️ Pause';
  startBtn.style.background = '#ff9800';
  stopBtn.style.display = 'inline-block';
  
  unixInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const currentTsMillis = startTsMillis + elapsed;
    const currentTs = Math.floor(currentTsMillis / 1000);
    
    unixInput.value = msToggle.checked ? currentTsMillis : currentTs;
    
    const elapsedSec = Math.floor(elapsed / 1000);
    const hours = Math.floor(elapsedSec / 3600);
    const mins = Math.floor((elapsedSec % 3600) / 60);
    const secs = elapsedSec % 60;
    
    unixResultEl.style.color = 'var(--text-color)';
    unixResultEl.innerHTML = `
      <strong>Live Counter Running</strong><br>
      Current: ${msToggle.checked ? currentTsMillis : currentTs}<br>
      Elapsed: ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}<br>
      <em style="opacity: 0.7; font-size: 0.9em;">Started at: ${new Date(startTsMillis).toLocaleString()}</em>
    `;
    unixResultEl.classList.add('show');
  }, 100);
}

function stopUnixCounter() {
  if (unixInterval) {
    clearInterval(unixInterval);
    unixInterval = null;
  }
  
  isCounterRunning = false;
  startBtn.textContent = '▶️ Start Counter';
  startBtn.style.background = 'var(--accent)';
  
  // Show final value
  if (unixInput && unixInput.value) {
    convertUnix();
  }
}

function setCurrentTimestamp() {
  const now = Date.now();
  const nowSeconds = Math.floor(now / 1000);
  
  if (msToggle.checked) {
    unixInput.value = now;
  } else {
    unixInput.value = nowSeconds;
  }
  
  convertUnix();
}

// Event listeners
msToggle.addEventListener('change', () => {
  const tsRaw = Number(unixInput.value);
  if (isNaN(tsRaw) || !unixInput.value) return;
  
  if (msToggle.checked) {
    // Convert seconds to milliseconds
    unixInput.value = tsRaw * 1000;
  } else {
    // Convert milliseconds to seconds
    unixInput.value = Math.floor(tsRaw / 1000);
  }
  
  convertUnix();
});

copyBtn.addEventListener('click', async () => {
  const tsRaw = Number(unixInput.value);
  if (isNaN(tsRaw)) {
    copyBtn.textContent = '❌ Invalid';
    setTimeout(() => copyBtn.textContent = '📋 Copy', 1000);
    return;
  }
  
  const out = msToggle.checked ? String(Math.floor(tsRaw)) : String(Math.floor(tsRaw));
  
  try {
    await navigator.clipboard.writeText(out);
    copyBtn.textContent = '✓ Copied!';
    copyBtn.style.background = '#4CAF50';
    setTimeout(() => {
      copyBtn.textContent = '📋 Copy';
      copyBtn.style.background = '';
    }, 1500);
  } catch (e) {
    console.error('Copy failed', e);
    copyBtn.textContent = '❌ Failed';
    setTimeout(() => copyBtn.textContent = '📋 Copy', 1000);
  }
});

startBtn.addEventListener('click', () => {
  if (isCounterRunning) {
    stopUnixCounter();
  } else {
    startUnixCounter();
  }
});

stopBtn.addEventListener('click', stopUnixCounter);

if (nowBtn) {
  nowBtn.addEventListener('click', setCurrentTimestamp);
}

// Input listeners
if (unixInput) {
  unixInput.addEventListener('input', () => {
    if (isCounterRunning) {
      stopUnixCounter();
    }
    convertUnix();
  });
}

if (utcInput) {
  utcInput.addEventListener('input', convertUTCtoUnix);
}

// Initialize with current timestamp on page load
window.addEventListener('DOMContentLoaded', () => {
  if (unixInput && !unixInput.value) {
    setCurrentTimestamp();
  }
});

// Expose functions
window.convertUnix = convertUnix;
window.convertUTCtoUnix = convertUTCtoUnix;