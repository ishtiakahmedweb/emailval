'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Check, Sparkles, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Shield, label: 'Accuracy', value: '99.7%' },
  { icon: Zap, label: 'Response', value: '12ms' },
  { icon: TrendingUp, label: 'Teams', value: '2,000+' },
];

const benefits = [
  'No credit card required — 250 free credits',
  'Cancel anytime, no lock-in contracts',
  'SOC 2 & GDPR compliant from day one',
];

const ctaAvatars = [
  { seed: 'alex.cta@veriflow.com' },
  { seed: 'jamie.cta@veriflow.com' },
  { seed: 'sam.cta@veriflow.com' },
  { seed: 'taylor.cta@veriflow.com' },
  { seed: 'jordan.cta@veriflow.com' },
];

function CtaSvg() {
  return (
    <svg viewBox="0 0 200 100" fill="none" className="w-full h-auto max-h-24">
      <defs>
        <linearGradient id="cta-grad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7458db" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="cta-grad2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b4a4ef" />
          <stop offset="100%" stopColor="#7458db" />
        </linearGradient>
      </defs>
      <path d="M100 75 L100 20 M85 38 L100 20 L115 38" stroke="url(#cta-grad1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M65 85 L135 85 L135 70 L155 85 L135 100 L135 90 L65 90 Z" fill="url(#cta-grad2)" opacity="0.12" stroke="url(#cta-grad1)" strokeWidth="1.5" strokeOpacity="0.3" />
      <circle cx="135" cy="30" r="5" fill="#b4a4ef" opacity="0.5" />
      <circle cx="158" cy="45" r="3.5" fill="#22d3ee" opacity="0.35" />
      <circle cx="60" cy="42" r="4" fill="#7458db" opacity="0.3" />
      <circle cx="48" cy="60" r="2.5" fill="#b4a4ef" opacity="0.2" />
    </svg>
  );
}

export function SpecCta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="cta" ref={ref} className="relative py-28 md:py-36 overflow-hidden bg-section-glow-purple bg-dot-grid">
      <div className="glow-orb bg-accent/5 w-[500px] h-[500px] -top-40 -right-40" />
      <div className="glow-orb bg-signal-cyan/[0.03] w-[400px] h-[400px] -bottom-40 -left-40" />

      <div className="relative z-10 mx-auto max-w-6xl px-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-white/5 ring-1 ring-white/20 rounded-full px-3 py-1.5">
              <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Get started in 60 seconds
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.1]">
              Ready to launch?
              <span className="block text-zinc-400 text-xl md:text-2xl font-normal mt-2">Start verifying in under 60 seconds.</span>
            </h2>

            <div className="flex flex-wrap gap-6 pt-2">
              {stats.map((s) => {
                const SIcon = s.icon;
                return (
                  <div key={s.label} className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                      <SIcon className="h-4 w-4 text-accent-light" />
                    </div>
                    <div>
                      <span className="text-xl font-bold text-white">{s.value}</span>
                      <span className="text-xs text-zinc-500 ml-1">{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <ul className="space-y-2.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-zinc-300">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 shrink-0">
                    <Check className="h-3 w-3 text-accent-light" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/15 via-accent-light/[0.07] to-transparent rounded-3xl blur-2xl" />
              <div className="relative bg-zinc-900/80 border border-zinc-700/40 backdrop-blur-sm rounded-2xl p-6 space-y-5">
                <CtaSvg />

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex -space-x-2">
                    {ctaAvatars.map((a) => (
                      <img
                        key={a.seed}
                        src={`https://i.pravatar.cc/40?u=${a.seed}`}
                        alt=""
                        className="w-8 h-8 rounded-full ring-2 ring-zinc-900 object-cover"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-zinc-500">
                    Joined by <span className="text-zinc-300 font-medium">2,000+</span> teams
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="space-y-3"
                >
                  <Link
                    href="/signup"
                    className="group flex items-center justify-between text-sm font-semibold text-white bg-accent rounded-xl px-5 py-3.5 shadow-lg transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(116,88,219,0.3)] hover:scale-[1.01]"
                  >
                    <span>Start for Free</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/docs"
                    className="flex items-center justify-between text-sm font-medium text-zinc-300 border border-zinc-700/40 bg-zinc-900/60 rounded-xl px-5 py-3.5 hover:border-accent/30 hover:bg-accent/5 hover:text-white transition-all"
                  >
                    <span>Read the docs</span>
                    <span className="text-xs text-zinc-500">API reference</span>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-zinc-500 pt-2 border-t border-zinc-700/30"
                >
                  <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> SOC 2</span>
                  <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> GDPR</span>
                  <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> 99.99% uptime</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
