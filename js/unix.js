const unixInput = document.getElementById('unix-input');
const utcInput = document.getElementById('utc-input');
const unixResultEl = document.getElementById('unix-result');
const utcResultEl = document.getElementById('utc-result');
const startBtn = document.getElementById('unix-start-counter');
const stopBtn = document.getElementById('unix-stop-counter');
const msToggle = document.getElementById('unix-ms-toggle');
const copyBtn = document.getElementById('unix-copy-btn');

let unixInterval = null;
let baseTs = null; // in seconds

function showUnix(tsSeconds) {
  const date = new Date(tsSeconds * 1000);
  unixResultEl.textContent = `UTC: ${date.toUTCString()} | Local: ${date.toLocaleString()}`;
  unixResultEl.classList.add('show');
}

function convertUnix(){
  const ts = Number(unixInput.value);
  if(isNaN(ts)) {
    unixResultEl.textContent='Invalid UNIX';
    unixResultEl.classList.remove('show');
    return;
  }
  baseTs = Math.floor(ts);
  showUnix(baseTs);
}

function convertUTCtoUnix(){
  const utcVal = utcInput.value; // format: yyyy-mm-ddThh:mm
  if(!utcVal) return;
  const ts = Math.floor(Date.parse(utcVal)/1000);
  utcResultEl.textContent=`UNIX: ${ts}`;
  utcResultEl.classList.add('show');
}

function startUnixCounter(){
  const tsRaw = Number(unixInput.value);
  if (isNaN(tsRaw)) return;
  baseTs = Math.floor(tsRaw);
  if (unixInterval) clearInterval(unixInterval);
  unixInterval = setInterval(() => {
    const now = Math.floor(Date.now() / 1000);
    const elapsed = now - baseTs;
    unixResultEl.textContent = `Started at: ${new Date(baseTs*1000).toLocaleString()} | Elapsed: ${elapsed} s`;
    unixResultEl.classList.add('show');
  }, 1000);
}

function stopUnixCounter(){
  if (unixInterval) {
    clearInterval(unixInterval);
    unixInterval = null;
  }
}

msToggle.addEventListener('change', () => {
  const tsRaw = Number(unixInput.value);
  if (isNaN(tsRaw)) return;
  if (msToggle.checked) {
    // show milliseconds exact
    const msVal = tsRaw * 1000;
    unixResultEl.textContent = `Exact (ms): ${msVal}`;
    unixResultEl.classList.add('show');
  } else {
    showUnix(Math.floor(tsRaw));
  }
});

copyBtn.addEventListener('click', async () => {
  const tsRaw = Number(unixInput.value);
  if (isNaN(tsRaw)) return;
  const out = msToggle.checked ? String(tsRaw*1000) : String(Math.floor(tsRaw));
  try {
    await navigator.clipboard.writeText(out);
    copyBtn.textContent = 'Copied!';
    setTimeout(()=>copyBtn.textContent='Copy', 800);
  } catch(e) {
    console.error('Copy failed', e);
  }
});

startBtn.addEventListener('click', startUnixCounter);
stopBtn.addEventListener('click', stopUnixCounter);

// Listeners to update displays
unixInput.addEventListener('input', convertUnix);
utcInput.addEventListener('input', convertUTCtoUnix);

window.convertUnix = convertUnix;
window.convertUTCtoUnix = convertUTCtoUnix;
