# Responsive Product Pricing Cards (Commercial Portfolio Grade)

A production-quality, accessible, and high-performance SaaS product pricing page built exclusively with vanilla **HTML5**, **CSS3**, and modern **JavaScript (ES6+)**. No frameworks, no external libraries, zero build steps, and zero CDN dependencies.

Live demo ready for instant preview with **VS Code Live Server**, **GitHub Pages**, or **Netlify**.

---

## 🌟 Key Features

- **Interactive Team Seat Slider (Volume-Based Pricing)**:
  - Accessible `<input type="range">` built right into the **Team** plan card with ARIA roles (`role="group"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`).
  - Automated tier volume discounts:
    - **5–10 seats**: ₹499/seat/mo
    - **11–25 seats**: ₹449/seat/mo
    - **26–50 seats**: ₹399/seat/mo
    - **51–100 seats**: ₹349/seat/mo
  - Real-time animated counter updates recalculating monthly/annual totals, struck-through regular totals, and net annual savings.
- **Semantic HTML5 & WAI-ARIA Accessibility**:
  - Proper landmark hierarchy (`<header>`, `<main>`, `<section>`, `<article>`, `<table>`, `<details>`, `<footer>`).
  - Native `<button>` elements with `role="group"`, `aria-pressed`, `aria-label`, and `tabindex`.
  - Accessible roving tabindex (Arrow keys, Home, End).
  - Dynamic `aria-live="polite"` billing mode announcements for screen readers.
  - WCAG AAA / AA compliance with text contrast $\ge 4.5:1$ across both light and dark themes.
  - Visible `:focus-visible` focus indicators and touch targets exceeding $44 \times 44\text{ px}$.
- **Data-Driven Architecture**:
  - Zero hardcoded prices in rendering logic; prices are read directly from HTML `data-monthly` and `data-yearly` attributes.
  - Single source of truth in `js/data.js` with self-checking dev assertions verifying discount rules and feature quotas.
- **Micro-Interactions & Fluid Animations**:
  - **Sliding Pill Toggle**: Pure CSS sliding background indicator using hardware-accelerated transforms (`transform: translateX()`).
  - **Animated Price Rolls**: Smooth numeric count-up and easeOutCubic transitions via `requestAnimationFrame` (~400ms) with in-flight cancellation.
  - **Reduced Motion Guard**: `@media (prefers-reduced-motion: reduce)` fallbacks disabling all animations and transitions.
  - **Button Ripple**: Fluid pointer-driven ripple animations on call-to-action buttons.
  - **Feature Tooltips**: Keyboard-navigable (`aria-describedby` and `Escape` dismiss) tooltips.
- **State Persistence & URL Deep Linking**:
  - Synced with URL search params (`?billing=yearly`) using `history.replaceState`.
  - Persisted in `localStorage` with fail-safe error handling.
- **Theme Switcher**:
  - Seamless Dark/Light theme switching respecting OS `prefers-color-scheme` with `localStorage` memory.
- **Responsive Layout**:
  - CSS Grid with equal card heights and flexbox sticky action bars.
  - Breakpoints tested at $360\text{ px}$, $768\text{ px}$, $1024\text{ px}$, and $1280\text{ px}+$.
  - Below $800\text{ px}$, transforms into a single column with the **Popular** plan ordered first (`order: -1`).
- **Feature Comparison Matrix & FAQ**:
  - Semantic `<table>` with horizontal scroll wrapper and sticky first column on mobile.
  - Accessible native `<details>`/`<summary>` accordion with animated state indicators.
- **Print Optimization**:
  - Custom `@media print` stylesheet for clean, black-and-white page-break-aware exports.

---

## 📁 Project Structure

```text
/pricing-cards
  ├── index.html          # Semantic HTML5 markup & no-JS static fallback
  ├── css/
  │    ├── base.css       # Reset, CSS variables/design tokens, fluid typography
  │    ├── components.css # Sliding toggle, cards, ribbons, buttons, table, FAQ
  │    └── responsive.css # Breakpoints, reduced-motion, print stylesheet
  ├── js/
  │    ├── data.js        # Plan data object, comparison matrix, dev assertions
  │    ├── pricing.js     # Rendering engine, count-up RAF animation, calculations
  │    └── main.js        # Theme manager, keyboard roving tabindex, FAQs, interactions
  └── README.md           # Documentation and guide
```

---

## 💳 Pricing Tiers

All prices are specified in Indian Rupees (**₹**) with approximately 20% annual discount:

| Plan | Monthly Billing | Annual Billing | Highlight Ribbon | CTA Style |
| :--- | :--- | :--- | :--- | :--- |
| **Starter** | ₹499 / mo | ₹4,790 / yr (Save ₹1,198) | — | Outline Button |
| **Pro** | ₹999 / mo | ₹9,590 / yr (Save ₹2,398) | **Popular** | Primary Filled Button |
| **Team** | ₹2,499 / mo | ₹23,990 / yr (Save ₹5,998) | **Best Value** | Outline Button |

---

## ⚙️ How the Billing Toggle Works (Data-Attribute Approach)

1. The HTML price elements specify values via data attributes:
   ```html
   <span class="price-value" data-monthly="999" data-yearly="9590">₹999</span>
   <span class="price-unit" data-monthly-text="/month" data-yearly-text="/year">/month</span>
   ```
2. When the user clicks **Monthly** or **Yearly** (or presses `ArrowLeft`/`ArrowRight`), `pricing.js` queries all `.price-value` and `.price-unit` nodes.
3. The JavaScript contains **no hardcoded numbers**:
   ```javascript
   const monthly = parseInt(el.getAttribute('data-monthly'), 10);
   const yearly = parseInt(el.getAttribute('data-yearly'), 10);
   const target = isYearly ? yearly : monthly;
   animatePriceValue(el, fromVal, target, 400);
   ```
4. `requestAnimationFrame` interpolates the numbers smoothly using cubic ease-out, while `Intl.NumberFormat('en-IN')` applies localized Indian currency formatting.

---

## 🚀 Running Locally

1. Clone or download this repository.
2. Open the directory in **VS Code**:
   ```bash
   code .
   ```
3. Right-click `index.html` and select **"Open with Live Server"** (or use any static web server).
4. Alternatively, run with Python:
   ```bash
   python -m http.server 8000
   ```
   Open `http://localhost:8000` in your browser.

---

## 🌐 Deployment

### GitHub Pages
1. Push the code to a GitHub repository.
2. Navigate to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. The site will be published at `https://<username>.github.io/<repo>/`.

### Netlify
1. Drag and drop the project folder directly into the Netlify Drop console at `app.netlify.com/drop`.
2. Instant SSL and CDN deployment without any build command needed!

---

## 📸 Screenshots (Placeholders)

### Monthly Billing View
![Monthly View](assets/screenshot-monthly.png)

### Yearly Billing View (with 20% Discount & Strikethrough)
![Yearly View](assets/screenshot-yearly.png)
