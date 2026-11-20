/**
 * pricing.js - Pricing Render Engine, Calculation, & Animation Logic
 * Production-ready vanilla ES module.
 */

import { PRICING_PLANS } from './data.js';

// Reusable Indian Rupee formatter
export const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

// Calculate yearly savings
export function calculateYearlySavings(monthly, yearly) {
  const yearlyEquivalent = monthly * 12;
  const savings = yearlyEquivalent - yearly;
  const percent = Math.round((savings / yearlyEquivalent) * 100);
  const effectiveMonthly = Math.round(yearly / 12);
  return { savings, percent, effectiveMonthly, yearlyEquivalent };
}

// Calculate team price dynamically based on seat count
export function calculateTeamPrice(seats, plan) {
  if (!plan || !plan.seatTiers) {
    return { monthly: 2499, yearly: 23990, perSeatMonthly: 499 };
  }
  const tier = plan.seatTiers.find(t => seats <= t.max) || plan.seatTiers[plan.seatTiers.length - 1];
  const monthly = seats * tier.monthlyPerSeat;
  const yearly = seats * tier.yearlyPerSeat;
  return {
    monthly,
    yearly,
    perSeatMonthly: tier.monthlyPerSeat,
    perSeatYearly: tier.yearlyPerSeat
  };
}

// Cubic ease-out timing function
function easeOutCubic(t) {
  return --t * t * t + 1;
}

// Global map to track active RAF animations per element
const activeAnimations = new Map();

/**
 * Animate numeric value change with cancelable RAF and reduced-motion guard
 */
export function animatePriceValue(element, startVal, endVal, duration = 400) {
  if (activeAnimations.has(element)) {
    cancelAnimationFrame(activeAnimations.get(element));
    activeAnimations.delete(element);
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || startVal === endVal) {
    element.textContent = inrFormatter.format(endVal);
    return;
  }

  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentVal = Math.round(startVal + (endVal - startVal) * easedProgress);

    element.textContent = inrFormatter.format(currentVal);

    if (progress < 1) {
      const frameId = requestAnimationFrame(update);
      activeAnimations.set(element, frameId);
    } else {
      activeAnimations.delete(element);
      element.textContent = inrFormatter.format(endVal);
    }
  }

  const frameId = requestAnimationFrame(update);
  activeAnimations.set(element, frameId);
}

/**
 * Generate checkmark / cross SVG icon markup
 */
function getFeatureIconSvg(included) {
  if (included) {
    return `
      <svg class="feature__icon feature__icon--check" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.6666 5L7.49992 14.1667L3.33325 10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }
  return `
    <svg class="feature__icon feature__icon--cross" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

/**
 * Generate Info tooltip SVG markup
 */
function getTooltipSvg(tooltipText, id) {
  if (!tooltipText) return '';
  return `
    <span class="tooltip-container">
      <button type="button" class="tooltip-trigger" aria-describedby="tooltip-${id}" aria-label="More information">
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
      <span class="tooltip-popup" id="tooltip-${id}" role="tooltip">${tooltipText}</span>
    </span>
  `;
}

/**
 * Render pricing cards into container
 */
export function renderPricingCards(container, currentPeriod = 'monthly', currentSeats = 5) {
  if (!container) return;

  const cardsHtml = PRICING_PLANS.map((plan) => {
    const isYearly = currentPeriod === 'yearly';
    let displayMonthly = plan.monthlyPrice;
    let displayYearly = plan.yearlyPrice;

    if (plan.isPerSeat) {
      const calc = calculateTeamPrice(currentSeats, plan);
      displayMonthly = calc.monthly;
      displayYearly = calc.yearly;
    }

    const displayPrice = isYearly ? displayYearly : displayMonthly;
    const { savings, percent, effectiveMonthly, yearlyEquivalent } = calculateYearlySavings(displayMonthly, displayYearly);

    const ribbonHtml = plan.badge ? `
      <div class="card__ribbon ${plan.isPopular ? 'card__ribbon--popular' : 'card__ribbon--best-value'}">
        <span>${plan.badge}</span>
      </div>
    ` : '';

    const featuresHtml = plan.features.map((feat, featIdx) => {
      const tooltipId = `tt-${plan.id}-${featIdx}`;
      return `
        <li class="feature ${feat.included ? 'feature--included' : 'feature--excluded'}">
          ${getFeatureIconSvg(feat.included)}
          <span class="feature__text">${feat.text}</span>
          ${getTooltipSvg(feat.tooltip, tooltipId)}
        </li>
      `;
    }).join('');

    // Dynamic Seat Slider for Team Plan
    const seatSliderHtml = plan.isPerSeat ? `
      <div class="seat-slider-widget" role="group" aria-label="Team seat calculator">
        <div class="seat-slider-header">
          <label for="seat-range-input" class="seat-slider-label">
            Team Size: <strong id="seat-count-display">${currentSeats} members</strong>
          </label>
          <span class="seat-tier-badge" id="seat-tier-badge">₹${Math.round(displayMonthly / currentSeats)}/seat</span>
        </div>
        <div class="seat-slider-control-wrap">
          <input type="range" 
                 id="seat-range-input" 
                 class="seat-range-input" 
                 min="${plan.minSeats}" 
                 max="${plan.maxSeats}" 
                 step="1" 
                 value="${currentSeats}" 
                 aria-valuemin="${plan.minSeats}" 
                 aria-valuemax="${plan.maxSeats}" 
                 aria-valuenow="${currentSeats}" 
                 aria-valuetext="${currentSeats} team members" />
          <div class="seat-slider-ticks" aria-hidden="true">
            <span>5</span>
            <span>25</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>
    ` : '';

    return `
      <article class="card ${plan.isPopular ? 'card--popular' : ''} ${plan.id === 'team' ? 'card--team' : ''}" id="card-${plan.id}">
        ${ribbonHtml}
        <div class="card__header">
          <h3 class="card__title">${plan.name}</h3>
          <p class="card__tagline">${plan.tagline}</p>
        </div>

        ${seatSliderHtml}

        <div class="card__price-box">
          <div class="price-row">
            <span class="price-value" data-monthly="${displayMonthly}" data-yearly="${displayYearly}">
              ${inrFormatter.format(displayPrice)}
            </span>
            <span class="price-unit" data-monthly-text="/month" data-yearly-text="/year">
              ${isYearly ? '/year' : '/month'}
            </span>
          </div>

          <div class="savings-container ${isYearly ? 'savings-container--visible' : ''}">
            <span class="strikethrough-original">
              <span class="sr-only">Original price was</span>
              <s>${inrFormatter.format(yearlyEquivalent)}</s>
            </span>
            <span class="savings-pill">Save ${inrFormatter.format(savings)} (${percent}%)</span>
            <span class="effective-monthly">≈ ${inrFormatter.format(effectiveMonthly)}/mo billed yearly</span>
          </div>
        </div>

        <div class="card__cta-wrap">
          <a href="#checkout-${plan.id}" 
             class="btn btn--block ${plan.ctaVariant === 'primary' ? 'btn--primary' : 'btn--outline'}" 
             aria-label="${plan.ctaAriaLabel}">
            ${plan.ctaText}
          </a>
        </div>

        <div class="card__features">
          <p class="features-heading">Plan includes:</p>
          <ul class="features-list" role="list">
            ${featuresHtml}
          </ul>
        </div>
      </article>
    `;
  }).join('');

  container.innerHTML = cardsHtml;
}

/**
 * Switch pricing mode across cards with animated roll and accessibility announcement
 */
export function updateBillingPeriod(newPeriod, previousPeriod) {
  const isYearly = newPeriod === 'yearly';
  const priceElements = document.querySelectorAll('.price-value');
  const unitElements = document.querySelectorAll('.price-unit');
  const savingsBoxes = document.querySelectorAll('.savings-container');

  priceElements.forEach(el => {
    const monthly = parseInt(el.getAttribute('data-monthly'), 10);
    const yearly = parseInt(el.getAttribute('data-yearly'), 10);

    const fromVal = previousPeriod === 'yearly' ? yearly : monthly;
    const toVal = isYearly ? yearly : monthly;

    animatePriceValue(el, fromVal, toVal, 400);
  });

  unitElements.forEach(el => {
    const monthlyText = el.getAttribute('data-monthly-text') || '/month';
    const yearlyText = el.getAttribute('data-yearly-text') || '/year';
    el.textContent = isYearly ? yearlyText : monthlyText;
  });

  savingsBoxes.forEach(box => {
    if (isYearly) {
      box.classList.add('savings-container--visible');
    } else {
      box.classList.remove('savings-container--visible');
    }
  });

  // Update live region for screen readers
  const liveRegion = document.getElementById('billing-announcement');
  if (liveRegion) {
    liveRegion.textContent = isYearly 
      ? 'Prices updated to yearly billing. You are saving up to 20% on all plans.' 
      : 'Prices updated to monthly billing.';
  }
}

/**
 * Updates Team Plan price specifically on slider input
 */
export function updateTeamSeatsUI(seats, currentPeriod) {
  const teamCard = document.getElementById('card-team');
  if (!teamCard) return;

  const plan = PRICING_PLANS.find(p => p.id === 'team');
  const calc = calculateTeamPrice(seats, plan);
  const isYearly = currentPeriod === 'yearly';

  const priceEl = teamCard.querySelector('.price-value');
  const countDisplay = teamCard.querySelector('#seat-count-display');
  const tierBadge = teamCard.querySelector('#seat-tier-badge');
  const strikethrough = teamCard.querySelector('.strikethrough-original s');
  const savingsPill = teamCard.querySelector('.savings-pill');
  const effectiveMonthly = teamCard.querySelector('.effective-monthly');

  if (countDisplay) countDisplay.textContent = `${seats} members`;
  if (tierBadge) tierBadge.textContent = `₹${calc.perSeatMonthly}/seat`;

  const prevVal = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''), 10) || (isYearly ? calc.yearly : calc.monthly);
  const targetVal = isYearly ? calc.yearly : calc.monthly;

  priceEl.setAttribute('data-monthly', calc.monthly);
  priceEl.setAttribute('data-yearly', calc.yearly);

  animatePriceValue(priceEl, prevVal, targetVal, 200);

  const { savings, percent, effectiveMonthly: effM, yearlyEquivalent } = calculateYearlySavings(calc.monthly, calc.yearly);
  if (strikethrough) strikethrough.textContent = inrFormatter.format(yearlyEquivalent);
  if (savingsPill) savingsPill.textContent = `Save ${inrFormatter.format(savings)} (${percent}%)`;
  if (effectiveMonthly) effectiveMonthly.textContent = `≈ ${inrFormatter.format(effM)}/mo billed yearly`;
}
