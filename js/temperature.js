const tempMap = {
  'C': (v,target)=>{
    if(target==='F') return v*9/5+32;
    if(target==='K') return v+273.15;
    if(target==='R') return (v+273.15)*9/5;
    return v;
  },
  'F': (v,target)=>{
    if(target==='C') return (v-32)*5/9;
    if(target==='K') return (v-32)*5/9+273.15;
    if(target==='R') return (v-32)*5/9+273.15*9/5;
    return v;
  },
  'K': (v,target)=>{
    if(target==='C') return v-273.15;
    if(target==='F') return (v-273.15)*9/5+32;
    if(target==='R') return v*9/5;
    return v;
  },
  'R': (v,target)=>{
    if(target==='C') return (v-491.67)*5/9;
    if(target==='F') return v-459.67;
    if(target==='K') return v*5/9;
    return v;
  }
};

function convertTemperature(value, from, to){
  if(isNaN(value)) return 'Invalid';
  return tempMap[from](value,to);
}
