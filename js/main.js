/**
 * main.js - Application Initialization, Theme Manager, Keyboard Navigation, Seat Slider, FAQ, and Micro-interactions
 * Production-ready vanilla ES module.
 */

import { PRICING_PLANS, COMPARISON_FEATURES, FAQS } from './data.js';
import { renderPricingCards, updateBillingPeriod, updateTeamSeatsUI, inrFormatter } from './pricing.js';

// Application State
const state = {
  billingPeriod: 'monthly',
  theme: 'light',
  teamSeats: 5
};

/* =====================================================================
   1. Theme Management (Light / Dark with prefers-color-scheme & storage)
   ===================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem('theme');
  } catch (e) {
    console.warn('LocalStorage unavailable for theme storage:', e);
  }

  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // React to OS-level theme changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    let stored = null;
    try {
      stored = localStorage.getItem('theme');
    } catch (err) {}
    if (!stored) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);

  try {
    localStorage.setItem('theme', theme);
  } catch (e) {
    // Non-blocking fallback
  }

  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    const sunIcon = themeToggleBtn.querySelector('.icon-sun');
    const moonIcon = themeToggleBtn.querySelector('.icon-moon');
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  }
}

/* =====================================================================
   2. Billing Period Management (URL Params, LocalStorage & Roving Tabindex)
   ===================================================================== */
function initBillingToggle() {
  const toggleGroup = document.querySelector('.billing-toggle');
  const monthlyBtn = document.getElementById('billing-monthly');
  const yearlyBtn = document.getElementById('billing-yearly');

  if (!toggleGroup || !monthlyBtn || !yearlyBtn) return;

  // Determine initial period: 1. URL Query, 2. LocalStorage, 3. Default 'monthly'
  const urlParams = new URLSearchParams(window.location.search);
  const paramBilling = urlParams.get('billing');
  let storedBilling = null;
  try {
    storedBilling = localStorage.getItem('billing_period');
  } catch (e) {}

  let initialPeriod = 'monthly';
  if (paramBilling === 'yearly' || paramBilling === 'monthly') {
    initialPeriod = paramBilling;
  } else if (storedBilling === 'yearly' || storedBilling === 'monthly') {
    initialPeriod = storedBilling;
  }

  setPeriod(initialPeriod, false);

  // Click listeners
  monthlyBtn.addEventListener('click', () => setPeriod('monthly', true));
  yearlyBtn.addEventListener('click', () => setPeriod('yearly', true));

  // Accessible Roving Tabindex & Keyboard Navigation
  const buttons = [monthlyBtn, yearlyBtn];
  toggleGroup.addEventListener('keydown', (e) => {
    const currentIndex = buttons.indexOf(document.activeElement);
    if (currentIndex === -1) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % buttons.length;
      buttons[nextIndex].focus();
      setPeriod(buttons[nextIndex].dataset.period, true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
      buttons[prevIndex].focus();
      setPeriod(buttons[prevIndex].dataset.period, true);
    } else if (e.key === 'Home') {
      e.preventDefault();
      buttons[0].focus();
      setPeriod('monthly', true);
    } else if (e.key === 'End') {
      e.preventDefault();
      buttons[1].focus();
      setPeriod('yearly', true);
    }
  });
}

function setPeriod(period, animate = true) {
  const previousPeriod = state.billingPeriod;
  if (previousPeriod === period && animate) return;

  state.billingPeriod = period;

  const monthlyBtn = document.getElementById('billing-monthly');
  const yearlyBtn = document.getElementById('billing-yearly');
  const toggleGroup = document.querySelector('.billing-toggle');

  if (monthlyBtn && yearlyBtn && toggleGroup) {
    const isYearly = period === 'yearly';

    monthlyBtn.setAttribute('aria-pressed', isYearly ? 'false' : 'true');
    monthlyBtn.setAttribute('tabindex', isYearly ? '-1' : '0');
    monthlyBtn.classList.toggle('active', !isYearly);

    yearlyBtn.setAttribute('aria-pressed', isYearly ? 'true' : 'false');
    yearlyBtn.setAttribute('tabindex', isYearly ? '0' : '-1');
    yearlyBtn.classList.toggle('active', isYearly);

    toggleGroup.setAttribute('data-active-period', period);
  }

  // Persist choice safely
  try {
    localStorage.setItem('billing_period', period);
  } catch (e) {}

  // Sync URL query without reloading
  try {
    const url = new URL(window.location);
    url.searchParams.set('billing', period);
    window.history.replaceState({}, '', url);
  } catch (e) {}

  // Trigger DOM updates on pricing cards
  if (animate) {
    updateBillingPeriod(period, previousPeriod);
  }
}

/* =====================================================================
   3. Interactive Team Seat Slider Listener
   ===================================================================== */
function initSeatSlider() {
  const seatSlider = document.getElementById('seat-range-input');
  if (!seatSlider) return;

  const handleSeatChange = (val) => {
    const seats = parseInt(val, 10);
    state.teamSeats = seats;
    seatSlider.setAttribute('aria-valuenow', seats);
    seatSlider.setAttribute('aria-valuetext', `${seats} team members`);
    updateTeamSeatsUI(seats, state.billingPeriod);
  };

  seatSlider.addEventListener('input', (e) => handleSeatChange(e.target.value));
}

/* =====================================================================
   4. Comparison Table Renderer
   ===================================================================== */
function renderComparisonTable() {
  const tableContainer = document.getElementById('comparison-table-wrap');
  if (!tableContainer) return;

  const getCellMarkup = (val) => {
    if (typeof val === 'boolean') {
      if (val) {
        return `
          <svg class="table-icon table-icon--check" aria-label="Included" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      }
      return `
        <svg class="table-icon table-icon--cross" aria-label="Not included" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    }
    return `<span>${val}</span>`;
  };

  const rowsHtml = COMPARISON_FEATURES.map(group => {
    const groupHeader = `
      <tr class="table-group-header">
        <th colspan="4" scope="colgroup">${group.category}</th>
      </tr>
    `;
    const itemsHtml = group.items.map(item => `
      <tr>
        <th scope="row" class="feature-col">${item.name}</th>
        <td class="plan-col">${getCellMarkup(item.starter)}</td>
        <td class="plan-col plan-col--popular">${getCellMarkup(item.pro)}</td>
        <td class="plan-col">${getCellMarkup(item.team)}</td>
      </tr>
    `).join('');

    return groupHeader + itemsHtml;
  }).join('');

  tableContainer.innerHTML = `
    <div class="table-responsive-wrapper" tabindex="0" role="region" aria-label="Feature Comparison Table. Scroll horizontally to view all plans on smaller screens.">
      <table class="comparison-table">
        <caption class="sr-only">Detailed feature comparison across Starter, Pro, and Team plans</caption>
        <thead>
          <tr>
            <th scope="col" class="feature-col">Features</th>
            <th scope="col" class="plan-col">Starter</th>
            <th scope="col" class="plan-col plan-col--popular">
              Pro <span class="badge-mini">Popular</span>
            </th>
            <th scope="col" class="plan-col">Team</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

/* =====================================================================
   5. FAQ Accordion Renderer
   ===================================================================== */
function renderFaqAccordion() {
  const faqContainer = document.getElementById('faq-accordion-wrap');
  if (!faqContainer) return;

  const faqHtml = FAQS.map((faq, idx) => `
    <details class="faq-item" id="faq-${idx}">
      <summary class="faq-summary">
        <span class="faq-question">${faq.question}</span>
        <svg class="faq-chevron" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </summary>
      <div class="faq-content">
        <p>${faq.answer}</p>
      </div>
    </details>
  `).join('');

  faqContainer.innerHTML = faqHtml;
}

/* =====================================================================
   6. Micro-Interactions (Button Ripple & Tooltip Keyboard Dismiss)
   ===================================================================== */
function initMicroInteractions() {
  // Ripple effect on buttons
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // Tooltip dismiss on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeTooltipTrigger = document.querySelector('.tooltip-trigger:focus');
      if (activeTooltipTrigger) {
        activeTooltipTrigger.blur();
      }
    }
  });

  // Staggered card entrance using IntersectionObserver (disabled if reduced motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .comparison-section, .faq-section').forEach(el => {
      el.classList.add('reveal-on-scroll');
      observer.observe(el);
    });
  }
}

/* =====================================================================
   7. App Bootstrap
   ===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Render cards
  const cardsGrid = document.getElementById('pricing-grid');
  renderPricingCards(cardsGrid, state.billingPeriod, state.teamSeats);

  // Initialize modules
  initTheme();
  initBillingToggle();
  initSeatSlider();
  renderComparisonTable();
  renderFaqAccordion();
  initMicroInteractions();
});
