// calculator.js - scientific keypad based calculator
const calcDisplay = document.getElementById('calc-display');
const calcButtons = document.getElementById('calc-buttons');
const calcClear = document.getElementById('calc-clear');
const calcBack = document.getElementById('calc-back');
const calcEquals = document.getElementById('calc-equals');

let expr = '';

function updateDisplay() {
  calcDisplay.value = expr || '0';
}

function safeEval(s) {
  // very small guard: allow digits, operators, parentheses, ., and function names we add
  // replace gcd/lcm/pow/sqrt tokens with our JS-friendly versions
  try {
    // replace pow(a,b) with Math.pow(a,b), sqrt(x) with Math.sqrt(x)
    const transformed = s
      .replace(/pow\s*\(/g, 'Math.pow(')
      .replace(/sqrt\s*\(/g, 'Math.sqrt(');
    // gcd and lcm - implement wrapper calls to our helper functions
    // We'll attach gcd/lcm to window for use in eval
    // Allow percentage sign by converting n% to (n/100)
    const percented = transformed.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    // Evaluate in a Function scope
    return Function('"use strict"; return (' + percented + ')')();
  } catch (e) {
    throw e;
  }
}

// helper functions for gcd/lcm exposed to eval
function gcd(a,b){ a = Math.trunc(Math.abs(a)); b = Math.trunc(Math.abs(b)); return b?gcd(b,a%b):a; }
function lcm(a,b){ return Math.trunc(Math.abs(a*b))/gcd(a,b); }
window.gcd = gcd;
window.lcm = lcm;

calcButtons.addEventListener('click', (ev) => {
  const t = ev.target;
  if (!t) return;
  if (t.dataset.value) {
    expr += t.dataset.value;
    updateDisplay();
  } else if (t.datasetAction || t.dataset.action) {
    const action = t.datasetAction || t.dataset.action;
    if (action === 'sqrt') expr += 'sqrt(';
    else if (action === 'pow') expr += 'pow(';
    else if (action === 'gcd') expr += 'gcd(';
    else if (action === 'lcm') expr += 'lcm(';
    updateDisplay();
  }
});

calcClear.addEventListener('click', () => { expr = ''; updateDisplay(); });
calcBack.addEventListener('click', () => { expr = expr.slice(0,-1); updateDisplay(); });

calcEquals.addEventListener('click', () => {
  try {
    const val = safeEval(expr);
    expr = String(val);
    updateDisplay();
  } catch (e) {
    expr = '';
    calcDisplay.value = 'Err';
    setTimeout(()=>updateDisplay(), 800);
  }
});

// expose for potential keyboard support
window.calc = { setExpr: (s)=>{expr=s;updateDisplay();}, eval: ()=>{calcEquals.click();} };
updateDisplay();
