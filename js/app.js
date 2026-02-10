// app.js - Main application controller with theme management and event binding

const toggleBtn = document.querySelector('.dark-toggle');

// Initialize theme from localStorage with smooth transition
const savedTheme = localStorage.getItem('convertli-theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
toggleBtn.textContent = savedTheme === 'light' ? '🌙' : '☀️';

// Theme toggle with animation
toggleBtn.onclick = () => {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  document.body.setAttribute('data-theme', newTheme);
  toggleBtn.textContent = newTheme === 'light' ? '🌙' : '☀️';
  localStorage.setItem('convertli-theme', newTheme);
  
  // Add a subtle animation effect
  toggleBtn.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    toggleBtn.style.transform = 'rotate(0deg)';
  }, 300);
};

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Currency event listeners
const currencyInput = document.getElementById('currency-input');
const currencyFrom = document.getElementById('currency-from');
const currencyTo = document.getElementById('currency-to');

if (currencyInput && currencyFrom && currencyTo) {
  const debouncedConvert = debounce(() => {
    if (typeof convertCurrency === 'function') convertCurrency();
  }, 300);
  
  currencyInput.addEventListener('input', debouncedConvert);
  currencyFrom.addEventListener('change', () => {
    if (typeof convertCurrency === 'function') convertCurrency();
    if (typeof fetchCurrencyHistory === 'function') fetchCurrencyHistory();
  });
  currencyTo.addEventListener('change', () => {
    if (typeof convertCurrency === 'function') convertCurrency();
    if (typeof fetchCurrencyHistory === 'function') fetchCurrencyHistory();
  });
}

// Time event listeners
const timeInput = document.getElementById('time-input');
const timeFrom = document.getElementById('time-from');
const timeTo = document.getElementById('time-to');

if (timeInput && timeFrom && timeTo) {
  timeInput.addEventListener('input', () => {
    if (typeof convertTime === 'function') convertTime();
  });
  timeFrom.addEventListener('change', () => {
    if (typeof convertTime === 'function') convertTime();
  });
  timeTo.addEventListener('change', () => {
    if (typeof convertTime === 'function') convertTime();
  });
}

// Distance event listeners
const distanceInput = document.getElementById('distance-input');
const distanceFrom = document.getElementById('distance-from');
const distanceTo = document.getElementById('distance-to');

if (distanceInput && distanceFrom && distanceTo) {
  distanceInput.addEventListener('input', () => {
    if (typeof convertDistance === 'function') convertDistance();
  });
  distanceFrom.addEventListener('change', () => {
    if (typeof convertDistance === 'function') convertDistance();
  });
  distanceTo.addEventListener('change', () => {
    if (typeof convertDistance === 'function') convertDistance();
  });
}

// Temperature event listeners
const tempInput = document.getElementById('temp-input');
const tempFrom = document.getElementById('temp-from');
const tempTo = document.getElementById('temp-to');

if (tempInput && tempFrom && tempTo) {
  tempInput.addEventListener('input', () => {
    if (typeof convertTemperatureUI === 'function') convertTemperatureUI();
  });
  tempFrom.addEventListener('change', () => {
    if (typeof convertTemperatureUI === 'function') convertTemperatureUI();
  });
  tempTo.addEventListener('change', () => {
    if (typeof convertTemperatureUI === 'function') convertTemperatureUI();
  });
}

// Speed event listeners
const speedInput = document.getElementById('speed-input');
const speedFrom = document.getElementById('speed-from');
const speedTo = document.getElementById('speed-to');

if (speedInput && speedFrom && speedTo) {
  const convertSpeedUI = () => {
    if (typeof convertSpeed !== 'function') return;
    
    const val = Number(speedInput.value);
    const from = speedFrom.value;
    const to = speedTo.value;
    const resultEl = document.getElementById('speed-result');
    
    if (!resultEl) return;
    
    if (speedInput.value === '' || isNaN(val) || val < 0) {
      resultEl.textContent = '';
      resultEl.classList.remove('show');
      return;
    }
    
    const result = convertSpeed(val, from, to);
    
    if (result === 'Invalid') {
      resultEl.textContent = '❌ Invalid input';
      resultEl.classList.remove('show');
      return;
    }
    
    const formatted = result < 0.001 ? result.toExponential(4) :
                     result < 1000 ? result.toFixed(4) :
                     result.toLocaleString('en-US', { maximumFractionDigits: 2 });
    
    resultEl.textContent = `${val} ${from} = ${formatted} ${to}`;
    resultEl.classList.add('show');
  };
  
  speedInput.addEventListener('input', convertSpeedUI);
  speedFrom.addEventListener('change', convertSpeedUI);
  speedTo.addEventListener('change', convertSpeedUI);
}

// Weight event listeners (already handled in weight.js but adding safety check)
const weightInput = document.getElementById('weight-input');
if (weightInput) {
  // Event listeners are in weight.js, just trigger initial conversion
}

// Data event listeners (already handled in data.js but adding safety check)
const dataInput = document.getElementById('data-input');
if (dataInput) {
  // Event listeners are in data.js, just trigger initial conversion
}

// Volume event listeners (handled in volume.js)
const volumeInput = document.getElementById('volume-input');
if (volumeInput) {
  // Event listeners are in volume.js
}

// Area event listeners (handled in area.js)
const areaInput = document.getElementById('area-input');
if (areaInput) {
  // Event listeners are in area.js
}

// Smooth scroll to sections with offset for header
document.querySelectorAll('header nav a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.style.boxShadow = 'rgba(0, 0, 0, 0.1) 0px 2px 8px';
  } else {
    header.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 4px 12px';
  }
  
  lastScroll = currentScroll;
});

// Intersection Observer for section animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(section);
});

// Initial conversion triggers on page load
window.addEventListener('DOMContentLoaded', () => {
  // Give modules time to initialize
  setTimeout(() => {
    // Trigger initial conversions if values exist
    if (timeInput && timeInput.value && typeof convertTime === 'function') {
      convertTime();
    }
    if (distanceInput && distanceInput.value && typeof convertDistance === 'function') {
      convertDistance();
    }
    if (speedInput && speedInput.value) {
      speedInput.dispatchEvent(new Event('input'));
    }
    if (weightInput && weightInput.value && typeof convertWeightUI === 'function') {
      convertWeightUI();
    }
    if (dataInput && dataInput.value && typeof convertDataUI === 'function') {
      convertDataUI();
    }
    if (volumeInput && volumeInput.value && typeof convertVolume === 'function') {
      convertVolume();
    }
    if (areaInput && areaInput.value && typeof convertArea === 'function') {
      convertArea();
    }
    if (currencyInput && currencyInput.value && typeof convertCurrency === 'function') {
      convertCurrency();
    }
  }, 500);
});

// Add keyboard shortcuts info
document.addEventListener('keydown', (e) => {
  // Ctrl/Cmd + K to focus search/nav
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const firstNavLink = document.querySelector('header nav a');
    if (firstNavLink) firstNavLink.focus();
  }
});

// Performance optimization: lazy load chart library if needed
if ('IntersectionObserver' in window) {
  const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id === 'currency') {
        // Currency section is visible, chart.js should already be loaded
        chartObserver.unobserve(entry.target);
      }
    });
  });
  
  const currencySection = document.getElementById('currency');
  if (currencySection) {
    chartObserver.observe(currencySection);
  }
}

// Add visual feedback for copy actions
document.addEventListener('click', (e) => {
  if (e.target.textContent.includes('Copied') || e.target.textContent.includes('✓')) {
    // Add a subtle pulse effect
    e.target.style.animation = 'pulse 0.3s ease-in-out';
    setTimeout(() => {
      e.target.style.animation = '';
    }, 300);
  }
});

// Prevent form submission on Enter key (except in calculator)
document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Trigger conversion instead
      input.dispatchEvent(new Event('input'));
    }
  });
});

// Add loading state management
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Remove any loading indicators
  const loadingEls = document.querySelectorAll('.loading');
  loadingEls.forEach(el => el.classList.remove('loading'));
});

// Error handling for missing functions
window.addEventListener('error', (e) => {
  console.error('Application error:', e);
  // Don't show errors to users, just log them
});

// Service worker registration for PWA (future enhancement)
if ('serviceWorker' in navigator) {
  // Commented out for now, can be enabled with service worker file
  // navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration failed'));
}

console.log('ConvertLi initialized successfully ✓');