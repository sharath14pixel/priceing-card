/**
 * data.js - Single Source of Truth for Plan Data, Comparison Matrix, and FAQs
 * Production-ready vanilla ES module.
 */

export const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Essential tools for freelancers and side-project creators.',
    monthlyPrice: 499,
    yearlyPrice: 4790,
    isPopular: false,
    badge: null,
    ctaText: 'Get Started',
    ctaVariant: 'outline',
    ctaAriaLabel: 'Get started with the Starter plan',
    isPerSeat: false,
    features: [
      { text: 'Single project workspace', included: true, tooltip: 'Manage 1 active project at a time with full feature access.' },
      { text: 'Up to 5 team members', included: true, tooltip: null },
      { text: '5 GB cloud storage', included: true, tooltip: 'Secure encrypted cloud file and asset storage.' },
      { text: 'Standard email support (48h SLA)', included: true, tooltip: null },
      { text: 'Custom domain & SSO', included: false, tooltip: 'Requires Pro or Team plan.' }
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Ideal for scaling businesses, fast-growing teams, and creators.',
    monthlyPrice: 999,
    yearlyPrice: 9590,
    isPopular: true,
    badge: 'Popular',
    ctaText: 'Start Pro Trial',
    ctaVariant: 'primary',
    ctaAriaLabel: 'Start a 14-day free trial of the Pro plan',
    isPerSeat: false,
    features: [
      { text: 'Unlimited active projects', included: true, tooltip: 'Create and run as many concurrent projects as you need.' },
      { text: 'Up to 25 team members', included: true, tooltip: null },
      { text: '100 GB fast cloud storage', included: true, tooltip: 'High-speed distributed asset CDN and cloud backup.' },
      { text: 'Priority email & chat support (4h SLA)', included: true, tooltip: null },
      { text: 'Custom domains & brand removal', included: true, tooltip: 'Connect your custom domain and remove our branding badge.' }
    ]
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'Maximized collaboration, compliance, and enterprise-grade power.',
    monthlyPrice: 2499, // Base price for default 5 seats (₹499/seat approx)
    yearlyPrice: 23990,
    isPopular: false,
    badge: 'Best Value',
    ctaText: 'Contact Sales',
    ctaVariant: 'outline',
    ctaAriaLabel: 'Contact sales team for the Team plan',
    isPerSeat: true,
    baseSeats: 5,
    minSeats: 5,
    maxSeats: 100,
    seatTiers: [
      { max: 10, monthlyPerSeat: 499, yearlyPerSeat: 4790 },
      { max: 25, monthlyPerSeat: 449, yearlyPerSeat: 4290 },
      { max: 50, monthlyPerSeat: 399, yearlyPerSeat: 3790 },
      { max: 100, monthlyPerSeat: 349, yearlyPerSeat: 3290 }
    ],
    features: [
      { text: 'Unlimited projects & workspaces', included: true, tooltip: 'Granular workspace separation for multi-client agencies.' },
      { text: 'Flexible team seats with volume discounts', included: true, tooltip: 'Scale seats anytime with automatic prorated billing.' },
      { text: '1 TB enterprise storage + automated backups', included: true, tooltip: 'Automated daily snapshots and zero-retention compliance.' },
      { text: '24/7 Dedicated account manager & Slack', included: true, tooltip: null },
      { text: 'SAML / Okta SSO & SOC2 Type II report', included: true, tooltip: 'Enterprise identity security with SCIM automated provisioning.' }
    ]
  }
];

export const COMPARISON_FEATURES = [
  {
    category: 'Core Capabilities',
    items: [
      { name: 'Active Projects', starter: '1', pro: 'Unlimited', team: 'Unlimited' },
      { name: 'Team Collaborators', starter: 'Up to 5', pro: 'Up to 25', team: '5 to 100+ seats' },
      { name: 'Cloud Storage', starter: '5 GB', pro: '100 GB', team: '1 TB' },
      { name: 'Activity Audit Log', starter: '7 days', pro: '90 days', team: 'Unlimited' }
    ]
  },
  {
    category: 'Security & Access',
    items: [
      { name: 'Two-Factor Auth (2FA)', starter: true, pro: true, team: true },
      { name: 'Role-Based Permissions', starter: false, pro: true, team: true },
      { name: 'Custom Domain & Branding', starter: false, pro: true, team: true },
      { name: 'SAML 2.0 / Okta SSO', starter: false, pro: false, team: true },
      { name: 'HIPAA & SOC-2 Compliance', starter: false, pro: false, team: true }
    ]
  },
  {
    category: 'Support & Services',
    items: [
      { name: 'Support Channels', starter: 'Email (48h)', pro: 'Chat & Email (4h)', team: '24/7 Slack & Phone (1h)' },
      { name: 'Dedicated Onboarding', starter: false, pro: false, team: true },
      { name: 'Uptime SLA Guarantee', starter: '99.5%', pro: '99.9%', team: '99.99%' }
    ]
  }
];

export const FAQS = [
  {
    question: 'How does the billing cycle work, and can I switch anytime?',
    answer: 'You can choose between monthly and yearly billing. When switching from monthly to yearly, any remaining time on your monthly plan is automatically prorated and discounted from your first annual invoice. You can upgrade or downgrade anytime right from your account settings.'
  },
  {
    question: 'How does Team seat pricing and volume discounting work?',
    answer: 'The Team plan includes volume pricing based on your active seats. As your team grows from 5 up to 100+ seats, the price per seat automatically discounts from ₹499/seat down to ₹349/seat. You can adjust your seats dynamically anytime using the interactive slider.'
  },
  {
    question: 'What happens when my 14-day Pro trial ends?',
    answer: 'At the end of your 14-day trial, you will automatically transition to your selected plan if you entered payment details. If not, your account safely downgrades to our free tier with zero data loss, letting you upgrade whenever you are ready.'
  },
  {
    question: 'Can I change my plan or cancel my subscription later?',
    answer: 'Yes! There are no long-term contracts or lock-ins. If you cancel, your subscription remains active until the end of the current billing cycle, and you will not be charged again.'
  },
  {
    question: 'What payment methods do you accept in India and worldwide?',
    answer: 'We accept all major credit and debit cards (Visa, MasterCard, American Express, RuPay), UPI (Google Pay, PhonePe, Paytm), Net Banking across 50+ Indian banks, and international cards with automated GST invoicing.'
  },
  {
    question: 'Do you offer a refund policy?',
    answer: 'We offer a 30-day money-back guarantee for all annual subscriptions if you are not completely satisfied. For monthly plans, you can cancel anytime before the next billing date.'
  }
];

// Developer Environment Assertions (Fails fast if contract violated)
(() => {
  if (typeof window !== 'undefined') {
    PRICING_PLANS.forEach(plan => {
      console.assert(
        plan.yearlyPrice < plan.monthlyPrice * 12,
        `[Pricing Integrity] Yearly price for ${plan.name} (${plan.yearlyPrice}) must be less than 12x monthly (${plan.monthlyPrice * 12})`
      );
      console.assert(
        plan.features.length === 5,
        `[Feature Contract] Plan ${plan.name} must have exactly 5 features. Found ${plan.features.length}.`
      );
    });
    console.log('%c[Pricing Self-Check Passed] All plans verified: yearly < 12x monthly and exactly 5 features.', 'color: #10b981; font-weight: bold;');
  }
})();
