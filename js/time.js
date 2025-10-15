// Time units to seconds
const timeMap = {
  ms: 0.001,
  s: 1,
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800,
  mo: 2629800, // average month in seconds
  y: 31557600 // average year in seconds
};

// Populate select options
const timeFrom = document.getElementById('time-from');
const timeTo = document.getElementById('time-to');
if (timeFrom && timeTo) {
  Object.keys(timeMap).forEach(u=>{
    timeFrom.innerHTML += `<option value="${u}">${u}</option>`;
    timeTo.innerHTML += `<option value="${u}">${u}</option>`;
  });
}

const timeInputEl = document.getElementById('time-input');
const timeResultEl = document.getElementById('time-result');

function convertTime(){
  // Guard for missing DOM elements
  if (!timeInputEl || !timeResultEl || !timeFrom || !timeTo) return;

  const val = Number(timeInputEl.value);
  const from = timeFrom.value;
  const to = timeTo.value;
  if(isNaN(val)) {
    timeResultEl.textContent='Invalid input';
    timeResultEl.classList.remove('show');
    return;
  }
  const seconds = val * (timeMap[from] || 1);
  const result = seconds / (timeMap[to] || 1);
  timeResultEl.textContent=`${val} ${from} = ${result} ${to}`;
  timeResultEl.classList.add('show');
}

window.convertTime = convertTime;
