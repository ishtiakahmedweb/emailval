'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Activity, ShieldOff, Package, Webhook, BarChart4, Brain } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-time API',
    description: 'Single email verification in under 12ms. RESTful endpoints with JSON responses and SDKs for Python, TypeScript, Node.js, Go, and Ruby.',
  },
  {
    icon: ShieldOff,
    title: 'Spam Trap Detection',
    description: 'ML-powered identification of honeypots, role-based addresses, disposable domains, and known spam traps before they damage your sender score.',
  },
  {
    icon: Package,
    title: 'Bulk Processing',
    description: 'Upload CSVs of up to 100K emails. Parallel validation with real-time progress tracking and downloadable results in CSV or JSON format.',
  },
  {
    icon: Webhook,
    title: 'Webhook Integrations',
    description: 'Stream verification results to your app in real time. Native support for Zapier, Make, and custom webhook endpoints with retry logic.',
  },
  {
    icon: BarChart4,
    title: 'Analytics Dashboard',
    description: 'Real-time charts for verification volume, pass/fail rates, bounce risk scoring, domain-level trends, and exportable raw data.',
  },
  {
    icon: Brain,
    title: 'AI Correction Engine',
    description: 'Autocorrect common typos (gmial.com → gmail.com), suggest valid alternatives, and learn from your verification patterns over time.',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function SpecFeatureGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="bg-section-glow-purple bg-dot-grid"
      id="features"
      style={{
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="max-w-7xl mx-auto pt-24 pb-20 relative px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-semibold text-white tracking-tighter text-left pt-6 pb-6"
        >
          A complete verification suite
        </motion.h2>

        <motion.div
          className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {features.map((feat) => {
            const FeatIcon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                variants={cardVariants}
                className="glass-card rounded-2xl p-6 hover:border-accent/20 hover:shadow-[0_0_30px_rgba(116,88,219,0.06)] transition-all duration-500 group"
              >
                <div className="inline-flex bg-accent/20 ring-1 ring-accent/20 w-10 h-10 rounded-lg items-center justify-center mb-4 group-hover:bg-accent/30 transition-all duration-300">
                  <FeatIcon className="h-5 w-5 text-accent-light" />
                </div>
                <h3 className="font-semibold text-sm text-zinc-200 mb-1">{feat.title}</h3>
                <p className="text-sm text-zinc-300 mt-2 leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
