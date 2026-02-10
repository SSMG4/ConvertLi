// formulas.js - Comprehensive formulas and conversion reference
const formulasContent = document.getElementById('formulas-content');

const formulas = [
  { 
    group: '💱 Currency', 
    items: [
      '<strong>Conversion Formula:</strong> result = (amount ÷ base_rate) × target_rate',
      '<strong>Example:</strong> To convert 100 USD to EUR when USD rate is 1.0 and EUR rate is 0.92: (100 ÷ 1.0) × 0.92 = 92 EUR',
      '<strong>Data Source:</strong> Live rates from exchangerate.host API. Updates in real-time when available.',
      '<strong>Historical Data:</strong> Charts show exchange rate trends over selected timeframes (1 week to 5 years).',
      '<strong>Note:</strong> All rates are based on a common base currency (typically EUR) and converted accordingly.'
    ]
  },
  { 
    group: '⏰ Time', 
    items: [
      '<strong>Base Unit:</strong> Seconds (s)',
      '<strong>Method:</strong> Convert input to seconds, then to target unit',
      '<strong>Conversions:</strong>',
      '• 1 millisecond (ms) = 0.001 seconds',
      '• 1 minute (m) = 60 seconds',
      '• 1 hour (h) = 3,600 seconds',
      '• 1 day (d) = 86,400 seconds',
      '• 1 week (w) = 604,800 seconds',
      '• 1 month (mo) = 2,629,800 seconds (average)',
      '• 1 year (y) = 31,557,600 seconds (average)',
      '<strong>Example:</strong> 2 hours = 2 × 3,600 = 7,200 seconds → 7,200 ÷ 60 = 120 minutes'
    ]
  },
  { 
    group: '🕐 UNIX Timestamp', 
    items: [
      '<strong>Definition:</strong> Number of seconds since January 1, 1970, 00:00:00 UTC (the Unix epoch)',
      '<strong>Seconds vs Milliseconds:</strong> Standard UNIX uses seconds; JavaScript often uses milliseconds (multiply by 1000)',
      '<strong>Conversion to Date:</strong> Multiply timestamp by 1000 and create new Date object',
      '<strong>Example:</strong> UNIX timestamp 1234567890 = February 13, 2009, 11:31:30 PM UTC',
      '<strong>Live Counter:</strong> Shows real-time timestamp progression from a starting point',
      '<strong>Relative Time:</strong> Automatically calculates "time ago" or "time from now"',
      '<strong>Use Cases:</strong> Databases, APIs, file systems, and any system requiring standardized time representation'
    ]
  },
  { 
    group: '📏 Distance', 
    items: [
      '<strong>Base Unit:</strong> Meters (m)',
      '<strong>Method:</strong> Convert input to meters, then to target unit',
      '<strong>Metric Conversions:</strong>',
      '• 1 millimeter (mm) = 0.001 m',
      '• 1 centimeter (cm) = 0.01 m',
      '• 1 kilometer (km) = 1,000 m',
      '<strong>Imperial Conversions:</strong>',
      '• 1 inch (in) = 0.0254 m',
      '• 1 foot (ft) = 0.3048 m',
      '• 1 yard (yd) = 0.9144 m',
      '• 1 mile (mi) = 1,609.34 m',
      '<strong>Astronomical Conversions:</strong>',
      '• 1 astronomical unit (au) = 149,597,870,700 m',
      '• 1 light-year (ly) = 9.4607 × 10¹⁵ m',
      '• 1 parsec (pc) = 3.0857 × 10¹⁶ m',
      '<strong>Example:</strong> 1 km = 1,000 m → 1,000 ÷ 1,609.34 ≈ 0.621 miles'
    ]
  },
  { 
    group: '🌡️ Temperature', 
    items: [
      '<strong>Celsius (°C) Conversions:</strong>',
      '• To Fahrenheit: °F = (°C × 9/5) + 32',
      '• To Kelvin: K = °C + 273.15',
      '• To Rankine: °R = (°C + 273.15) × 9/5',
      '<strong>Fahrenheit (°F) Conversions:</strong>',
      '• To Celsius: °C = (°F − 32) × 5/9',
      '• To Kelvin: K = (°F − 32) × 5/9 + 273.15',
      '• To Rankine: °R = °F + 459.67',
      '<strong>Kelvin (K) Conversions:</strong>',
      '• To Celsius: °C = K − 273.15',
      '• To Fahrenheit: °F = (K − 273.15) × 9/5 + 32',
      '• To Rankine: °R = K × 9/5',
      '<strong>Rankine (°R) Conversions:</strong>',
      '• To Celsius: °C = (°R − 491.67) × 5/9',
      '• To Fahrenheit: °F = °R − 459.67',
      '• To Kelvin: K = °R × 5/9',
      '<strong>Key Points:</strong>',
      '• Kelvin and Rankine use absolute zero as their zero point',
      '• Water freezes at 0°C = 32°F = 273.15K = 491.67°R',
      '• Water boils at 100°C = 212°F = 373.15K = 671.67°R'
    ]
  },
  { 
    group: '⚡ Speed', 
    items: [
      '<strong>Base Unit:</strong> Meters per second (m/s)',
      '<strong>Method:</strong> Convert input to m/s, then to target unit',
      '<strong>Conversions:</strong>',
      '• 1 kilometer/hour (km/h) = 0.277778 m/s (divide by 3.6)',
      '• 1 mile/hour (mph) = 0.44704 m/s',
      '• 1 foot/second (ft/s) = 0.3048 m/s',
      '• 1 knot = 0.514444 m/s',
      '<strong>Example:</strong> 36 km/h = 36 ÷ 3.6 = 10 m/s',
      '<strong>Common Reference Speeds:</strong>',
      '• Walking: ~1.4 m/s (~5 km/h)',
      '• Running: ~6 m/s (~22 km/h)',
      '• Car highway: ~30 m/s (~108 km/h)',
      '• Speed of sound: ~343 m/s (Mach 1)',
      '• Speed of light: ~299,792,458 m/s'
    ]
  },
  { 
    group: '⚖️ Weight/Mass', 
    items: [
      '<strong>Base Unit:</strong> Kilograms (kg)',
      '<strong>Method:</strong> Convert input to kg, then to target unit',
      '<strong>Metric Conversions:</strong>',
      '• 1 milligram (mg) = 0.000001 kg',
      '• 1 gram (g) = 0.001 kg',
      '• 1 metric ton (t) = 1,000 kg',
      '<strong>Imperial Conversions:</strong>',
      '• 1 ounce (oz) = 0.0283495 kg',
      '• 1 pound (lb) = 0.453592 kg',
      '• 1 stone (st) = 6.35029 kg (14 pounds)',
      '<strong>Example:</strong> 500 g = 0.5 kg → 0.5 ÷ 0.453592 ≈ 1.102 lb',
      '<strong>Note:</strong> This converter measures mass, not weight (force). Weight = mass × gravity.'
    ]
  },
  { 
    group: '💾 Data Size', 
    items: [
      '<strong>Base Unit:</strong> Bytes (B)',
      '<strong>Method:</strong> Uses binary (base-2) system with powers of 1024',
      '<strong>Conversions:</strong>',
      '• 1 byte (B) = 8 bits',
      '• 1 kilobyte (KB) = 1,024 bytes',
      '• 1 megabyte (MB) = 1,024 KB = 1,048,576 bytes',
      '• 1 gigabyte (GB) = 1,024 MB = 1,073,741,824 bytes',
      '• 1 terabyte (TB) = 1,024 GB = 1,099,511,627,776 bytes',
      '• 1 petabyte (PB) = 1,024 TB',
      '<strong>Example:</strong> 2 GB = 2 × 1,073,741,824 = 2,147,483,648 bytes',
      '<strong>Binary vs Decimal:</strong> True binary uses 1024 (2¹⁰); decimal uses 1000. We use binary (industry standard).',
      '<strong>Common File Sizes:</strong>',
      '• Text file: ~1-100 KB',
      '• Photo: ~2-10 MB',
      '• Song: ~3-5 MB',
      '• Movie (HD): ~4-8 GB'
    ]
  },
  { 
    group: '🧪 Volume', 
    items: [
      '<strong>Base Unit:</strong> Milliliters (ml)',
      '<strong>Method:</strong> Convert input to ml, then to target unit',
      '<strong>Metric Conversions:</strong>',
      '• 1 liter (l) = 1,000 ml',
      '• 1 cubic meter (m³) = 1,000,000 ml',
      '<strong>US Customary Conversions:</strong>',
      '• 1 teaspoon (tsp) = 4.92892 ml',
      '• 1 tablespoon (tbsp) = 14.7868 ml',
      '• 1 fluid ounce (fl oz) = 29.5735 ml',
      '• 1 cup = 236.588 ml',
      '• 1 pint (pt) = 473.176 ml',
      '• 1 quart (qt) = 946.353 ml',
      '• 1 gallon (gal) = 3,785.41 ml',
      '<strong>Example:</strong> 1 gallon = 3,785.41 ml → 3,785.41 ÷ 1,000 = 3.785 liters',
      '<strong>Cooking Note:</strong> US and UK measurements differ (UK uses imperial, we use US customary)'
    ]
  },
  { 
    group: '📐 Area', 
    items: [
      '<strong>Base Unit:</strong> Square meters (m²)',
      '<strong>Method:</strong> Convert input to m², then to target unit',
      '<strong>Metric Conversions:</strong>',
      '• 1 mm² = 0.000001 m²',
      '• 1 cm² = 0.0001 m²',
      '• 1 km² = 1,000,000 m²',
      '• 1 hectare (ha) = 10,000 m²',
      '<strong>Imperial Conversions:</strong>',
      '• 1 in² = 0.00064516 m²',
      '• 1 ft² = 0.092903 m²',
      '• 1 yd² = 0.836127 m²',
      '• 1 acre (ac) = 4,046.86 m²',
      '• 1 mi² = 2,589,988 m²',
      '<strong>Example:</strong> 1 acre = 4,046.86 m² → 4,046.86 ÷ 10,000 ≈ 0.405 hectares',
      '<strong>Common Areas:</strong>',
      '• Tennis court: ~260 m²',
      '• Football field: ~5,300 m²',
      '• Central Park: ~3.41 km²'
    ]
  },
  { 
    group: '🔢 Scientific Calculator', 
    items: [
      '<strong>Basic Operations:</strong> +, −, ×, ÷, parentheses ( )',
      '<strong>Power Functions:</strong>',
      '• x² = square',
      '• x³ = cube',
      '• x^y or pow(x,y) = x to the power of y',
      '• √x or sqrt(x) = square root',
      '<strong>Trigonometric Functions:</strong>',
      '• sin, cos, tan = basic trig functions',
      '• asin, acos, atan = inverse trig functions',
      '• Toggle DEG/RAD for degree or radian mode',
      '<strong>Logarithms:</strong>',
      '• log(x) = logarithm base 10',
      '• ln(x) = natural logarithm (base e)',
      '• exp(x) = e raised to power x',
      '<strong>Special Functions:</strong>',
      '• |x| or abs(x) = absolute value',
      '• n! = factorial (example: 5! = 120)',
      '• gcd(a,b) = greatest common divisor',
      '• lcm(a,b) = least common multiple',
      '• % = percent (converts to decimal: 50% = 0.5)',
      '<strong>Constants:</strong>',
      '• π (pi) ≈ 3.14159265359',
      '• e (Euler\'s number) ≈ 2.71828182846',
      '• ANS = last calculated answer',
      '<strong>Keyboard Shortcuts:</strong>',
      '• Enter = calculate (=)',
      '• Escape = clear',
      '• Backspace = delete last character',
      '<strong>Order of Operations:</strong> PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction)'
    ]
  }
];

function renderFormulas() {
  if (!formulasContent) return;
  
  formulasContent.innerHTML = '';
  
  formulas.forEach(fg => {
    const card = document.createElement('div');
    card.style.cssText = 'margin-bottom: 2rem; padding: 1.5rem; background: rgba(33, 150, 243, 0.05); border-radius: 12px; border-left: 4px solid var(--accent);';
    
    const title = document.createElement('h3');
    title.textContent = fg.group;
    title.style.cssText = 'color: var(--accent); margin-top: 0; margin-bottom: 1rem; font-size: 1.4rem;';
    card.appendChild(title);
    
    const list = document.createElement('ul');
    list.style.cssText = 'line-height: 1.8; padding-left: 1.5rem; margin: 0;';
    
    fg.items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = item;
      li.style.cssText = 'margin-bottom: 0.6rem;';
      list.appendChild(li);
    });
    
    card.appendChild(list);
    formulasContent.appendChild(card);
  });
  
  // Add a footer note
  const footer = document.createElement('div');
  footer.style.cssText = 'margin-top: 2rem; padding: 1rem; text-align: center; opacity: 0.7; font-size: 0.9rem;';
  footer.innerHTML = '<p>💡 <strong>Pro Tip:</strong> All conversions use internationally recognized standard values and formulas. For the most accurate results, ensure your input values are correct and use appropriate significant figures.</p>';
  formulasContent.appendChild(footer);
}

renderFormulas();