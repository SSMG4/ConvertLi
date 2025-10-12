const calcInput = document.getElementById('calc-input');
const calcResult = document.getElementById('calc-result');

function calculate(){
  let expr = calcInput.value;
  try {
    // Advanced functions: sqrt, pow, gcd, lcm
    expr = expr.replace(/sqrt\(([^)]+)\)/g,'Math.sqrt($1)');
    expr = expr.replace(/pow\(([^,]+),([^)]+)\)/g,'Math.pow($1,$2)');
    // simple eval fallback
    const result = eval(expr);
    calcResult.textContent = `Result: ${result}`;
    calcResult.classList.add('show');
  } catch(e){
    calcResult.textContent = 'Invalid Expression';
  }
}

calcInput.addEventListener('input', calculate);

// Optional helper functions
function gcd(a,b){return b?gcd(b,a%b):a;}
function lcm(a,b){return (a*b)/gcd(a,b);}
