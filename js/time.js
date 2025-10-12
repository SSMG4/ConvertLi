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
Object.keys(timeMap).forEach(u=>{
  timeFrom.innerHTML += `<option value="${u}">${u}</option>`;
  timeTo.innerHTML += `<option value="${u}">${u}</option>`;
});

function convertTime(){
  const val = Number(document.getElementById('time-input').value);
  const from = timeFrom.value;
  const to = timeTo.value;
  if(isNaN(val)) return document.getElementById('time-result').textContent='Invalid input';
  const seconds = val * timeMap[from];
  const result = seconds / timeMap[to];
  document.getElementById('time-result').textContent=`${val} ${from} = ${result} ${to}`;
  document.getElementById('time-result').classList.add('show');
  document.getElementById('time-formula').textContent=`Formula: value_in_${from} * ${timeMap[from]} / ${timeMap[to]}`;
}
