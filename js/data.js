const dataMap = {
  B:1, KB:1024, MB:1048576, GB:1073741824, TB:1099511627776, PB:1125899906842624
};

function convertData(val, from, to){
  if(isNaN(val)) return 'Invalid';
  const inBytes = val*dataMap[from];
  return inBytes/dataMap[to];
}

window.convertData = convertData;
