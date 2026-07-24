'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { SpecNav } from '@/components/marketing/spec-nav';
import { SpecFooter } from '@/components/marketing/spec-footer';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for trying out Veriflow',
    monthlyPrice: 0,
    annualPrice: 0,
    credits: '250',
    features: ['250 free validations per month', 'Single email validation', 'Basic API access', 'Community support'],
    cta: 'Start free',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For professional developers and small teams',
    monthlyPrice: 29,
    annualPrice: 24,
    credits: '5,000',
    features: ['5,000 monthly credits', 'Real-time & batch validation', 'Full API access + webhooks', 'Spam trap detection', 'Priority email support', '5 API keys', 'Credit auto-refill'],
    cta: 'Start Pro',
    href: '/auth/signup',
    popular: true,
  },
  {
    name: 'Scale',
    description: 'For high-volume businesses and agencies',
    monthlyPrice: 99,
    annualPrice: 79,
    credits: '25,000',
    features: ['25,000 monthly credits', 'Everything in Pro', 'Dedicated account manager', 'Custom sender score monitoring', '99.99% SLA', 'Unlimited API keys', 'Early access to new features'],
    cta: 'Contact sales',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    monthlyPrice: 299,
    annualPrice: 249,
    credits: '100,000',
    features: ['100,000 monthly credits', 'Everything in Scale', 'Custom contracts & pricing', 'On-premise deployment option', 'SSO / SAML', '24/7 phone & email support', 'Custom integrations'],
    cta: 'Contact us',
    href: '#',
    popular: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />
      <div className="relative z-10">
        <SpecNav />
        <section className="px-6 pb-32 pt-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight sm:text-5xl"
              >
                Simple, transparent pricing
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-muted-foreground"
              >
                Choose the plan that fits your needs. No hidden fees. Upgrade or cancel anytime.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex items-center justify-center gap-3"
              >
                <span className={`text-sm ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
                <button
                  onClick={() => setAnnual(!annual)}
                  className={`relative h-6 w-12 rounded-full transition-colors ${annual ? 'bg-[oklch(0.67_0.16_210)]' : 'bg-muted'}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${annual ? 'translate-x-6' : ''}`} />
                </button>
                <span className={`text-sm ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Annual <span className="text-[oklch(0.62_0.19_160)]">Save 20%</span>
                </span>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border bg-card/50 p-6 backdrop-blur transition-all hover:shadow-lg ${
                    plan.popular ? 'border-[oklch(0.67_0.16_210)] shadow-[0_0_30px_-8px_oklch(0.67_0.16_210)]' : 'border-border/50'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[oklch(0.67_0.16_210)] px-3 py-1 text-[11px] font-medium text-white">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">${annual ? plan.annualPrice : plan.monthlyPrice}</span>
                    {plan.monthlyPrice > 0 && <span className="text-sm text-muted-foreground">/month</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.credits} credits/mo</p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.62_0.19_160)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`mt-6 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      plan.popular
                        ? 'bg-[oklch(0.67_0.16_210)] text-white hover:opacity-90'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </motion.div>

            <div className="mt-16 rounded-2xl border border-border/50 bg-card/50 p-8 text-center backdrop-blur-sm">
              <h2 className="text-2xl font-bold">Need a custom plan?</h2>
              <p className="mt-2 text-muted-foreground">We offer custom pricing for high-volume senders and special requirements.</p>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[oklch(0.67_0.16_210)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
        <SpecFooter />
      </div>
    </main>
  );
}
