// calculator.js - Full-featured scientific calculator with keyboard support
const calcDisplay = document.getElementById('calc-display');
const calcButtons = document.getElementById('calc-buttons');
const calcClear = document.getElementById('calc-clear');
const calcBack = document.getElementById('calc-back');
const calcEquals = document.getElementById('calc-equals');

let expr = '';
let lastResult = null;
let angleMode = 'deg'; // 'deg' or 'rad'

function updateDisplay() {
  calcDisplay.value = expr || '0';
}

// Helper: degrees to radians
function toRad(deg) { return deg * Math.PI / 180; }
function toDeg(rad) { return rad * 180 / Math.PI; }

// GCD and LCM helpers
function gcd(a, b) { 
  a = Math.trunc(Math.abs(a)); 
  b = Math.trunc(Math.abs(b)); 
  return b ? gcd(b, a % b) : a; 
}
function lcm(a, b) { 
  return Math.trunc(Math.abs(a * b)) / gcd(a, b); 
}

// Expose to window for eval
window.gcd = gcd;
window.lcm = lcm;

function safeEval(s) {
  try {
    // Replace mathematical functions with JavaScript equivalents
    let transformed = s
      // Basic functions
      .replace(/sqrt\s*\(/g, 'Math.sqrt(')
      .replace(/pow\s*\(/g, 'Math.pow(')
      .replace(/abs\s*\(/g, 'Math.abs(')
      .replace(/log\s*\(/g, 'Math.log10(')  // log is base 10
      .replace(/ln\s*\(/g, 'Math.log(')     // ln is natural log
      .replace(/exp\s*\(/g, 'Math.exp(')
      
      // Trigonometric functions (handle angle mode)
      .replace(/sin\s*\(/g, angleMode === 'deg' ? '(Math.sin(toRad(' : '(Math.sin(')
      .replace(/cos\s*\(/g, angleMode === 'deg' ? '(Math.cos(toRad(' : '(Math.cos(')
      .replace(/tan\s*\(/g, angleMode === 'deg' ? '(Math.tan(toRad(' : '(Math.tan(')
      .replace(/asin\s*\(/g, angleMode === 'deg' ? '(toDeg(Math.asin(' : '(Math.asin(')
      .replace(/acos\s*\(/g, angleMode === 'deg' ? '(toDeg(Math.acos(' : '(Math.acos(')
      .replace(/atan\s*\(/g, angleMode === 'deg' ? '(toDeg(Math.atan(' : '(Math.atan(')
      
      // Constants
      .replace(/\bpi\b/g, 'Math.PI')
      .replace(/\be\b/g, 'Math.E');
    
    // Handle closing parens for trig functions in deg mode
    if (angleMode === 'deg') {
      transformed = transformed.replace(/\(Math\.(sin|cos|tan)\(toRad\(([^)]+)\)\)/g, 'Math.$1(toRad($2))');
      transformed = transformed.replace(/\(toDeg\(Math\.(asin|acos|atan)\(([^)]+)\)\)/g, 'toDeg(Math.$1($2))');
    }
    
    // Handle percentage (convert n% to n/100)
    transformed = transformed.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    
    // Handle factorial
    transformed = transformed.replace(/(\d+)!/g, (match, n) => {
      const num = parseInt(n);
      if (num < 0 || num > 170) return 'NaN';
      let result = 1;
      for (let i = 2; i <= num; i++) result *= i;
      return result;
    });
    
    // Evaluate
    const result = Function('"use strict"; return (' + transformed + ')')();
    
    // Handle special cases
    if (!isFinite(result)) throw new Error('Math error');
    
    return result;
  } catch (e) {
    throw e;
  }
}

// Button click handler
calcButtons.addEventListener('click', (ev) => {
  const t = ev.target;
  if (!t || !t.tagName || t.tagName !== 'BUTTON') return;
  
  if (t.dataset.value) {
    expr += t.dataset.value;
    updateDisplay();
  } else if (t.dataset.action) {
    const action = t.dataset.action;
    
    // Functions that need opening parenthesis
    if (['sqrt', 'pow', 'gcd', 'lcm', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'abs', 'exp'].includes(action)) {
      expr += action + '(';
      updateDisplay();
    } 
    // Special actions
    else if (action === 'pi') {
      expr += 'pi';
      updateDisplay();
    } else if (action === 'e') {
      expr += 'e';
      updateDisplay();
    } else if (action === 'ans') {
      if (lastResult !== null) {
        expr += lastResult;
        updateDisplay();
      }
    } else if (action === 'deg-rad') {
      angleMode = angleMode === 'deg' ? 'rad' : 'deg';
      t.textContent = angleMode.toUpperCase();
      t.style.background = angleMode === 'rad' ? '#4CAF50' : 'var(--accent)';
    } else if (action === 'factorial') {
      expr += '!';
      updateDisplay();
    } else if (action === 'square') {
      expr += '^2';
      updateDisplay();
    } else if (action === 'cube') {
      expr += '^3';
      updateDisplay();
    }
  }
});

// Handle power operator (convert ^ to **)
function processPowerOperator(str) {
  return str.replace(/\^/g, '**');
}

calcClear.addEventListener('click', () => { 
  expr = ''; 
  updateDisplay(); 
});

calcBack.addEventListener('click', () => { 
  expr = expr.slice(0, -1); 
  updateDisplay(); 
});

calcEquals.addEventListener('click', () => {
  try {
    // Process power operator
    const processedExpr = processPowerOperator(expr);
    const val = safeEval(processedExpr);
    
    // Round to reasonable precision
    const rounded = Math.round(val * 1e10) / 1e10;
    lastResult = rounded;
    expr = String(rounded);
    updateDisplay();
  } catch (e) {
    const oldExpr = expr;
    expr = '';
    calcDisplay.value = 'Error';
    setTimeout(() => {
      expr = oldExpr;
      updateDisplay();
    }, 1000);
  }
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  // Only handle keyboard when calculator section is visible
  const calcSection = document.getElementById('calculator');
  if (!calcSection) return;
  
  const key = e.key;
  
  // Numbers and basic operators
  if (/^[0-9+\-*/().%]$/.test(key)) {
    expr += key;
    updateDisplay();
    e.preventDefault();
  }
  // Enter = equals
  else if (key === 'Enter') {
    calcEquals.click();
    e.preventDefault();
  }
  // Backspace
  else if (key === 'Backspace') {
    calcBack.click();
    e.preventDefault();
  }
  // Escape = clear
  else if (key === 'Escape') {
    calcClear.click();
    e.preventDefault();
  }
  // ^ for power
  else if (key === '^') {
    expr += '^';
    updateDisplay();
    e.preventDefault();
  }
});

// Initialize
updateDisplay();
window.calcExpr = { set: (s) => { expr = s; updateDisplay(); } };