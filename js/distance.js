const distanceMap = {
  mm:0.001, cm:0.01, m:1, km:1000, in:0.0254, ft:0.3048,
  yd:0.9144, mi:1609.34, au:149597870700, ly:9.4607e15, pc:3.0857e16
};

const distanceFrom = document.getElementById('distance-from');
const distanceTo = document.getElementById('distance-to');
Object.keys(distanceMap).forEach(u=>{
  distanceFrom.innerHTML += `<option value="${u}">${u}</option>`;
  distanceTo.innerHTML += `<option value="${u}">${u}</option>`;
});

function convertDistance(){
  const val = Number(document.getElementById('distance-input').value);
  const from = distanceFrom.value;
  const to = distanceTo.value;
  const resEl = document.getElementById('distance-result');
  if(isNaN(val)) {
    resEl.textContent='Invalid input';
    resEl.classList.remove('show');
    return;
  }
  const meters = val * distanceMap[from];
  const result = meters / distanceMap[to];
  resEl.textContent=`${val} ${from} = ${result} ${to}`;
  resEl.classList.add('show');
}

window.convertDistance = convertDistance;
