// unix.js - Enhanced UNIX timestamp converter with auto-starting live counter
const unixInputEl = document.getElementById('unix-input');
const utcInputEl = document.getElementById('utc-input');
const unixResultEl = document.getElementById('unix-result');
const utcResultEl = document.getElementById('utc-result');
const startBtn = document.getElementById('unix-start-counter');
const stopBtn = document.getElementById('unix-stop-counter');
const msToggle = document.getElementById('unix-ms-toggle');
const copyBtn = document.getElementById('unix-copy-btn');
const nowBtn = document.getElementById('unix-now-btn');

let unixInterval = null;
let baseTs = null;
let isCounterRunning = false;

function showUnix(tsSeconds) {
  if (!unixResultEl) return;
  
  const date = new Date(tsSeconds * 1000);
  
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
  if (!unixInputEl || !unixResultEl) return;
  
  let ts = Number(unixInputEl.value);
  
  if (unixInputEl.value === '') {
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
  
  if (ts > 4102444800) {
    ts = Math.floor(ts / 1000);
    msToggle.checked = true;
  }
  
  baseTs = Math.floor(ts);
  showUnix(baseTs);
}

function convertUTCtoUnix() {
  const utcVal = utcInputEl.value;
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
  
  unixInputEl.value = tsSeconds;
  convertUnix();
}

function startLiveCounter() {
  if (unixInterval) clearInterval(unixInterval);
  
  isCounterRunning = true;
  if (startBtn) {
    startBtn.textContent = '⏸️ Pause';
    startBtn.style.background = '#ff9800';
  }
  if (stopBtn) stopBtn.style.display = 'inline-block';
  
  function updateCounter() {
    const now = Date.now();
    const currentTs = msToggle && msToggle.checked ? now : Math.floor(now / 1000);
    
    if (unixInputEl) unixInputEl.value = currentTs;
    
    if (unixResultEl) {
      const date = new Date(now);
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
      
      unixResultEl.style.color = 'var(--text-color)';
      unixResultEl.innerHTML = `
        <strong>🔴 LIVE COUNTER</strong><br>
        <strong>Current:</strong> ${msToggle && msToggle.checked ? now : Math.floor(now / 1000)}<br>
        <strong>UTC:</strong> ${utcString}<br>
        <strong>Local:</strong> ${localString}
      `;
      unixResultEl.classList.add('show');
    }
  }
  
  updateCounter();
  unixInterval = setInterval(updateCounter, 100);
}

function stopUnixCounter() {
  if (unixInterval) {
    clearInterval(unixInterval);
    unixInterval = null;
  }
  
  isCounterRunning = false;
  if (startBtn) {
    startBtn.textContent = '▶️ Start Counter';
    startBtn.style.background = 'var(--accent)';
  }
  
  if (unixInputEl && unixInputEl.value) {
    convertUnix();
  }
}

function setCurrentTimestamp() {
  const now = Date.now();
  const nowSeconds = Math.floor(now / 1000);
  
  if (msToggle && msToggle.checked) {
    if (unixInputEl) unixInputEl.value = now;
  } else {
    if (unixInputEl) unixInputEl.value = nowSeconds;
  }
  
  convertUnix();
}

if (msToggle) {
  msToggle.addEventListener('change', () => {
    const tsRaw = Number(unixInputEl.value);
    if (isNaN(tsRaw) || !unixInputEl.value) return;
    
    if (msToggle.checked) {
      unixInputEl.value = tsRaw * 1000;
    } else {
      unixInputEl.value = Math.floor(tsRaw / 1000);
    }
    
    if (!isCounterRunning) {
      convertUnix();
    }
  });
}

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const tsRaw = Number(unixInputEl.value);
    if (isNaN(tsRaw)) {
      copyBtn.textContent = '❌ Invalid';
      setTimeout(() => copyBtn.textContent = '📋 Copy', 1000);
      return;
    }
    
    const out = String(Math.floor(tsRaw));
    
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
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (isCounterRunning) {
      stopUnixCounter();
    } else {
      startLiveCounter();
    }
  });
}

if (stopBtn) {
  stopBtn.addEventListener('click', stopUnixCounter);
}

if (nowBtn) {
  nowBtn.addEventListener('click', setCurrentTimestamp);
}

if (unixInputEl) {
  unixInputEl.addEventListener('input', () => {
    if (isCounterRunning) {
      stopUnixCounter();
    }
    convertUnix();
  });
}

if (utcInputEl) {
  utcInputEl.addEventListener('input', convertUTCtoUnix);
}

window.addEventListener('DOMContentLoaded', () => {
  startLiveCounter();
});

window.convertUnix = convertUnix;
window.convertUTCtoUnix = convertUTCtoUnix;