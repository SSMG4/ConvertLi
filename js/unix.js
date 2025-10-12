const unixInput = document.getElementById('unix-input');
const utcInput = document.getElementById('utc-input');

function convertUnix(){
  const ts = Number(unixInput.value);
  if(isNaN(ts)) return document.getElementById('unix-result').textContent='Invalid UNIX';
  const date = new Date(ts*1000);
  document.getElementById('unix-result').textContent=`UTC: ${date.toUTCString()} | Local: ${date.toLocaleString()}`;
  document.getElementById('unix-result').classList.add('show');
}

function convertUTCtoUnix(){
  const utcVal = utcInput.value; // format: yyyy-mm-ddThh:mm
  if(!utcVal) return;
  const ts = Math.floor(Date.parse(utcVal)/1000);
  document.getElementById('utc-result').textContent=`UNIX: ${ts}`;
  document.getElementById('utc-result').classList.add('show');
}

// Listeners
unixInput.addEventListener('input',convertUnix);
utcInput.addEventListener('input',convertUTCtoUnix);
