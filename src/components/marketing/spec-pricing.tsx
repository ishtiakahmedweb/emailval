'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight, Shield, Star, Sparkles, X, TrendingUp, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for trying out Veriflow',
    monthlyPrice: 0,
    annualPrice: 0,
    credits: '250',
    features: ['250 free validations per month', 'Single email validation', 'Basic API access', 'Community support'],
    cta: 'Start free',
    href: '/signup',
    creditPrice: 'Free',
    gradient: 'from-zinc-700/20 to-zinc-900/90',
    borderColor: 'border-zinc-700/40',
    accentLine: 'bg-zinc-500',
    badge: null,
  },
  {
    name: 'Pro',
    description: 'For professional developers and small teams',
    monthlyPrice: 29,
    annualPrice: 24,
    credits: '5,000',
    features: ['5,000 monthly credits', 'Real-time & batch validation', 'Full API access + webhooks', 'Spam trap detection', 'Priority email support', '5 API keys', 'Credit auto-refill'],
    highlighted: true,
    cta: 'Get started',
    href: '/signup',
    creditPrice: '$0.0058/credit',
    gradient: 'from-accent/[0.20] to-zinc-900/90',
    borderColor: 'border-accent/30',
    accentLine: 'bg-accent',
    badge: 'Most popular',
  },
  {
    name: 'Business',
    description: 'For growing teams and high-volume needs',
    monthlyPrice: 99,
    annualPrice: 79,
    credits: '25,000',
    features: ['25,000 monthly credits', 'Everything in Pro', 'Role-based access control', 'Validation history & exports', 'Dedicated account manager', '99.99% uptime SLA', 'Unlimited API keys'],
    cta: 'Get started',
    href: '/signup',
    creditPrice: '$0.0039/credit',
    gradient: 'from-sky-500/[0.12] to-zinc-900/90',
    borderColor: 'border-zinc-700/40',
    accentLine: 'bg-sky-500',
    badge: 'Best value',
  },
];

const comparisonRows = [
  { label: 'Monthly validations', starter: '250', pro: '5,000', business: '25,000' },
  { label: 'Email syntax check', starter: true, pro: true, business: true },
  { label: 'DNS / MX validation', starter: true, pro: true, business: true },
  { label: 'SMTP handshake', starter: false, pro: true, business: true },
  { label: 'AI pattern detection', starter: false, pro: true, business: true },
  { label: 'Spam trap detection', starter: false, pro: true, business: true },
  { label: 'Bulk CSV processing', starter: false, pro: true, business: true },
  { label: 'Webhook integrations', starter: false, pro: true, business: true },
  { label: 'API keys', starter: '1', pro: '5', business: 'Unlimited' },
  { label: 'Role-based access', starter: false, pro: false, business: true },
  { label: 'Dedicated support', starter: false, pro: 'Email', business: 'Priority + Phone' },
  { label: 'Uptime SLA', starter: '99.9%', pro: '99.9%', business: '99.99%' },
];

const heroAvatars = [
  { name: 'sarah.chen', seed: 'sarah.chen@veriflow.com' },
  { name: 'marcus.johnson', seed: 'marcus.johnson@veriflow.com' },
  { name: 'priya.sharma', seed: 'priya.sharma@veriflow.com' },
  { name: 'tom.anderson', seed: 'tom.anderson@veriflow.com' },
  { name: 'emily.rodriguez', seed: 'emily.rodriguez@veriflow.com' },
];

function CheckCell({ checked, value }: { checked: boolean | string; value?: string }) {
  if (typeof checked === 'boolean') {
    return checked
      ? <Check className="h-4 w-4 text-accent mx-auto" />
      : <X className="h-4 w-4 text-zinc-600 mx-auto" />;
  }
  return <span className="text-zinc-400">{checked}</span>;
}

export function SpecPricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [annual, setAnnual] = useState(false);
  const [creditSlider, setCreditSlider] = useState(5000);

  const recommendedPlan = creditSlider <= 5000 ? 'Pro' : creditSlider <= 25000 ? 'Business' : 'Business';

  return (
    <section id="pricing" ref={ref} className="relative py-28 md:py-36 bg-section-glow-blue bg-dot-grid">
      <div className="mx-auto max-w-6xl px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-white/5 ring-1 ring-white/20 rounded-full px-3 py-1.5 mb-5">
            <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-zinc-100 leading-[1.1]">
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-[#b4a4ef] to-[#22d3ee] bg-clip-text text-transparent">pricing</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Pay only for what you use. Credits never expire. Upgrade or cancel anytime.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-lg mx-auto mb-10 p-6 rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-400 font-medium">Monthly emails to verify</span>
            <span className="text-sm text-white font-semibold font-mono">{creditSlider.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={250}
            max={100000}
            step={250}
            value={creditSlider}
            onChange={(e) => setCreditSlider(parseInt(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #7458db 0%, #7458db ${(creditSlider / 100000) * 100}%, rgba(255,255,255,0.1) ${(creditSlider / 100000) * 100}%, rgba(255,255,255,0.1) 100%)`,
              WebkitAppearance: 'none',
              accentColor: '#7458db',
            }}
          />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>250</span>
            <span>25K</span>
            <span>50K</span>
            <span>100K</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs">
            <span className="text-zinc-500">Recommended:</span>
            <span className="text-accent-light font-semibold">{recommendedPlan}</span>
            <Zap className="h-3 w-3 text-amber-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex items-center justify-center mb-12"
        >
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm p-2">
            <div className="inline-flex items-center gap-1 rounded-xl bg-white/[0.05] p-1 relative">
              <button onClick={() => setAnnual(false)} className={`relative z-10 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${!annual ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                Monthly
              </button>
              <button onClick={() => setAnnual(true)} className={`relative z-10 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${annual ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>
                Annual{' '}
                <span className="ml-1 text-[10px] bg-emerald-500/30 text-emerald-300 rounded-full px-2 py-0.5 font-bold shadow-[0_0_12px_rgba(52,211,153,0.2)]">Save 20%</span>
              </button>
              <motion.div
                className="absolute inset-y-1 rounded-lg bg-accent"
                layout
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{ width: '50%', left: annual ? 'calc(50% + 2px)' : '2px' }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const annualSavings = plan.monthlyPrice > 0 && annual
              ? `Save $${(plan.monthlyPrice - plan.annualPrice) * 12}/yr`
              : null;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative rounded-2xl border ${plan.borderColor} bg-gradient-to-b ${plan.gradient} backdrop-blur-sm p-7 transition-all duration-500 hover:shadow-[0_0_40px_rgba(116,88,219,0.08)]`}
              >
                <div className={`absolute top-0 left-8 right-8 h-0.5 rounded-full ${plan.accentLine} opacity-60`} />

                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-0.5 text-[10px] font-semibold text-white tracking-wider shadow-lg ${
                      plan.badge === 'Most popular'
                        ? 'bg-gradient-to-r from-accent to-accent-light shadow-accent/30'
                        : 'bg-gradient-to-r from-sky-500 to-cyan-400 shadow-sky-500/30'
                    }`}>
                      <Star className={`h-2.5 w-2.5 ${plan.badge === 'Most popular' ? 'fill-white' : 'fill-white/80'}`} />
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-semibold text-zinc-100">{plan.name}</h3>
                    {price === 0 ? (
                      <span className="text-[10px] text-white bg-gradient-to-r from-emerald-500/40 to-emerald-400/20 px-2 py-0.5 rounded-full font-semibold">Free</span>
                    ) : (
                      <div className="text-right">
                        <div className="relative">
                          <div className="absolute -inset-3 rounded-xl bg-accent/[0.04]" />
                          <div className="flex items-baseline gap-0.5 relative">
                            <span className="text-4xl font-bold bg-gradient-to-br from-zinc-100 to-zinc-400 bg-clip-text text-transparent">${price}</span>
                            <span className="text-[11px] text-zinc-500">/mo</span>
                          </div>
                        </div>
                        {annual && price > 0 && (
                          <div className="flex items-center justify-end gap-1.5 mt-0.5">
                            <span className="text-[10px] text-zinc-500 line-through">${plan.monthlyPrice * 12}/yr</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">${price * 12}/yr</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {annualSavings && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-300 rounded-full px-2 py-0.5 font-medium">
                      <TrendingUp className="h-2.5 w-2.5" />
                      {annualSavings}
                    </div>
                  )}

                  <p className="text-xs text-zinc-500 mt-1.5">{plan.description}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-accent-light font-mono">{plan.credits} credits</span>
                    {plan.highlighted && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        2,341 active
                      </span>
                    )}
                  </div>

                  <Link href={plan.href} className={`group/btn relative flex items-center justify-between rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-300 mt-5 ${
                    plan.highlighted
                      ? 'bg-accent text-white hover:brightness-110 hover:shadow-[0_0_30px_rgba(116,88,219,0.3)]'
                      : 'border border-zinc-700/50 text-zinc-300 hover:border-accent/30 hover:text-white'
                  }`}>
                    <span>{plan.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Link>

                  {plan.highlighted && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-zinc-500">
                      <Shield className="h-3 w-3" />
                      30-day money-back guarantee
                    </div>
                  )}

                  <div className="mt-5 space-y-2.5">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/10 shrink-0 mt-0.5">
                          <Check className="h-2.5 w-2.5 text-accent-light" />
                        </div>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600">Cost per credit</span>
                    <span className="text-[11px] font-mono text-zinc-400">{plan.creditPrice}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
            <div className="p-1">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs font-medium text-zinc-300">Full feature comparison</span>
                <span className="text-[10px] text-zinc-600 ml-auto">Scroll horizontally for more</span>
              </div>
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 pr-4 text-zinc-400 font-medium">Feature</th>
                      <th className="text-center py-3 px-4 text-zinc-400 font-medium">Starter</th>
                      <th className="text-center py-3 px-4 text-accent-light font-medium">Pro</th>
                      <th className="text-center py-3 pl-4 text-zinc-400 font-medium">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={row.label} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                        <td className="py-3 pr-4 text-zinc-300">{row.label}</td>
                        <td className="py-3 px-4 text-center"><CheckCell checked={row.starter} /></td>
                        <td className="py-3 px-4 text-center"><CheckCell checked={row.pro} /></td>
                        <td className="py-3 pl-4 text-center"><CheckCell checked={row.business} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center rounded-2xl border border-white/10 bg-zinc-900/70 backdrop-blur-sm p-8"
        >
          <Sparkles className="h-5 w-5 text-accent-light mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-zinc-100">Need more volume?</h3>
          <p className="text-sm text-zinc-400 mt-2 max-w-lg mx-auto">Custom credit packs, dedicated infrastructure, SSO/SAML, and 24/7 phone support for enterprise teams.</p>
          <Link href="/contact" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent/10 px-6 py-3 text-sm font-medium text-accent-light hover:bg-accent/20 border border-accent/10 hover:border-accent/30 transition-all">
            Contact sales <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-600"
        >
          <div className="flex -space-x-2">
            {heroAvatars.slice(0, 4).map((a) => (
              <img
                key={a.seed}
                src={`https://i.pravatar.cc/40?u=${a.seed}`}
                alt=""
                className="w-6 h-6 rounded-full ring-2 ring-slate-950 object-cover"
              />
            ))}
          </div>
          <span>Joined by <span className="text-zinc-400 font-medium">2,000+</span> teams this month</span>
          <span className="w-1 h-1 rounded-full bg-zinc-700" />
          <span className="flex items-center gap-1 text-emerald-400">
            <TrendingUp className="h-3 w-3" />
            +31% this week
          </span>
        </motion.div>
      </div>
    </section>
  );
}
