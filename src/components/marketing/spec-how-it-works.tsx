'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Terminal, Code2, BarChart3 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Sign up & get your API key',
    description: 'Create your account in seconds. No credit card needed. Your API key and 250 free credits are ready instantly.',
    Icon: Terminal,
  },
  {
    number: '02',
    title: 'Integrate with one line of code',
    description: 'Drop our SDK into your stack. REST API, webhooks, and real-time validation — works with any language or framework.',
    Icon: Code2,
  },
  {
    number: '03',
    title: 'Verify emails in milliseconds',
    description: 'Get comprehensive results: syntax, MX records, SMTP handshake, disposable detection, spam traps, and more.',
    Icon: BarChart3,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function SpecHowItWorks() {
  const ref = useRef(null);
  const lineRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const lineInView = useInView(lineRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-section-glow-purple bg-dot-grid" id="how-it-works" ref={ref}>
      <div className="max-w-7xl mx-auto pt-24 pb-20 relative px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-semibold text-white tracking-tighter text-left pt-6 pb-6"
        >
          Start verifying in 10 seconds
        </motion.h2>

        <div className="relative mt-12" ref={lineRef}>
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-px -translate-y-1/2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent/10 via-accent/30 to-accent/10"
              initial={{ width: '0%' }}
              animate={lineInView ? { width: '100%' } : {}}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
          >
            {steps.map((step) => {
              const StepIcon = step.Icon;
              return (
                <motion.div
                  key={step.number}
                  variants={cardVariants}
                  className="group glass-card rounded-2xl relative overflow-hidden hover:border-accent/20 hover:shadow-[0_0_30px_rgba(116,88,219,0.06)] transition-all duration-500"
                >
                  <span className="absolute top-2 right-4 text-8xl font-bold text-white/5 select-none pointer-events-none">
                    {step.number}
                  </span>
                  <div className="pt-8 px-8 pb-8 relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="inline-flex text-zinc-200 bg-accent/20 ring-1 ring-accent/20 w-10 h-10 rounded-lg items-center justify-center group-hover:bg-accent/30 transition-all duration-300">
                        <StepIcon className="h-5 w-5 text-accent-light" />
                      </div>
                      <span className="text-xs font-mono tracking-widest text-zinc-600">{step.number}</span>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight text-neutral-100 mb-2 group-hover:text-white transition-colors">{step.title}</h3>
                    <p className="leading-relaxed text-sm text-neutral-300 group-hover:text-neutral-200 transition-colors">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Link
            href="#demo"
            className="inline-flex items-center gap-2 hover:bg-white/5 transition-colors text-sm text-zinc-300 border border-zinc-700 rounded-full px-6 py-3 hover:border-accent/30"
          >
            See the live demo <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
