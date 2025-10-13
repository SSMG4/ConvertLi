const speedMap = {
  'm/s':1,
  'km/h':1/3.6,
  'mph':0.44704,
  'ft/s':0.3048,
  'knots':0.514444
};

function convertSpeed(val, from, to){
  if(isNaN(val)) return 'Invalid';
  const inMs = val*speedMap[from];
  return inMs / speedMap[to];
}

window.convertSpeed = convertSpeed;
