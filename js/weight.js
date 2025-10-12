const weightMap = {
  mg:0.000001, g:0.001, kg:1, t:1000, lb:0.453592, oz:0.0283495
};

function convertWeight(val, from, to){
  if(isNaN(val)) return 'Invalid';
  const inKg = val*weightMap[from];
  return inKg/weightMap[to];
}
