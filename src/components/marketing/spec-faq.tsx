'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Plus, MessageCircle, Search, Mail, Clock, ArrowRight, Headphones, Zap, Check } from 'lucide-react';

const categories = [
  {
    name: 'Getting Started',
    faqs: [
      { q: 'Do I need a credit card to start?', a: 'No. Our Starter plan includes 250 free credits per month with no credit card required. You can upgrade to a paid plan whenever you need more capacity.' },
      { q: 'How long does it take to integrate?', a: 'Most developers integrate Veriflow in under 15 minutes. Our REST API and SDKs make it straightforward — just generate an API key and make your first request.' },
      { q: 'Can I try before committing to a plan?', a: 'Absolutely. The Starter plan is free forever with 250 monthly credits. Upgrade only when you need more volume.' },
    ],
  },
  {
    name: 'Technical',
    faqs: [
      { q: 'How accurate is Veriflow?', a: 'Veriflow achieves 99.7% accuracy across all email types. Our ML models are trained on billions of email signals and continuously updated to catch edge cases that simpler validators miss.' },
      { q: 'What checks does Veriflow perform?', a: 'Every email goes through 4 layers: syntax validation (RFC 5322), DNS/MX record lookup, SMTP handshake verification, and AI-powered pattern detection for spam traps, disposable domains, and role-based accounts.' },
      { q: 'Can I verify emails in bulk?', a: 'Yes. Pro and Business plans support CSV uploads of up to 100K emails. Processing is parallelized and typically completes in under 5 minutes for 50K emails.' },
    ],
  },
  {
    name: 'Billing & Plans',
    faqs: [
      { q: 'What happens when I run out of credits?', a: 'Credits reset monthly. On Starter, verification pauses until the next cycle. On Pro and Business, you can purchase additional credit packs or enable auto-refill to avoid interruptions.' },
      { q: 'Can I export verification data?', a: 'Yes. Pro and Business plans allow you to export verification history as CSV or JSON. You can also set up webhooks to stream results to your own systems in real time.' },
      { q: 'Is there a discount for annual plans?', a: 'Yes. Annual plans save approximately 20% compared to monthly billing. You pay a single annual invoice and get all the same features.' },
    ],
  },
];

const supportChannels = [
  { icon: MessageCircle, label: 'Live Chat', desc: 'Instant reply from our team', color: 'text-accent-light', bg: 'bg-accent/10' },
  { icon: Mail, label: 'Email Support', desc: 'We reply within 2 hours', color: 'text-signal-cyan', bg: 'bg-signal-cyan/10' },
  { icon: Headphones, label: 'Phone Support', desc: 'For Business plans only', color: 'text-signal-green', bg: 'bg-signal-green/10' },
  { icon: Zap, label: 'Knowledge Base', desc: 'API docs & guides', color: 'text-signal-amber', bg: 'bg-signal-amber/10' },
];

const supportTeam = [
  { name: 'Alex Chen', seed: 'alex.chen.support@veriflow.com' },
  { name: 'Jamie Park', seed: 'jamie.park.support@veriflow.com' },
  { name: 'Sam Rivera', seed: 'sam.rivera.support@veriflow.com' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function FaqSvg() {
  return (
    <svg viewBox="0 0 200 120" fill="none" className="w-full h-auto max-h-28">
      <defs>
        <linearGradient id="faq-grad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7458db" />
          <stop offset="100%" stopColor="#b4a4ef" />
        </linearGradient>
      </defs>
      <path d="M25 45C25 25 55 12 100 12S175 25 175 45v30c0 20-30 32-75 32H65l-25 18 5-20C30 102 25 90 25 75V45z" fill="url(#faq-grad1)" opacity="0.12" stroke="url(#faq-grad1)" strokeWidth="1.5" strokeOpacity="0.3" />
      <circle cx="85" cy="55" r="4" fill="#b4a4ef" opacity="0.7" />
      <circle cx="100" cy="55" r="4" fill="#b4a4ef" opacity="0.7" />
      <circle cx="115" cy="55" r="4" fill="#b4a4ef" opacity="0.7" />
      <circle cx="35" cy="68" r="7" fill="#7458db" opacity="0.25" />
      <circle cx="170" cy="48" r="5" fill="#22d3ee" opacity="0.25" />
      <circle cx="160" cy="78" r="4" fill="#b4a4ef" opacity="0.15" />
    </svg>
  );
}

export function SpecFaq() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const allFaqs = useMemo(() => {
    const flat: Array<{ q: string; a: string; category: string }> = [];
    categories.forEach((cat) => {
      cat.faqs.forEach((faq) => {
        flat.push({ ...faq, category: cat.name });
      });
    });
    return flat;
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return allFaqs;
    const q = searchQuery.toLowerCase();
    return allFaqs.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [searchQuery, allFaqs]);

  return (
    <section ref={ref} className="relative py-28 md:py-36 bg-section-glow-purple bg-dot-grid">
      <div className="mx-auto max-w-6xl px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-white/5 ring-1 ring-white/20 rounded-full px-3 py-1.5 mb-5">
            <div className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse" />
            Support
          </div>
          <h2 className="text-4xl font-semibold text-white tracking-tighter">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-zinc-400">Everything you need to know about Veriflow.</p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md mx-auto relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-xl border border-zinc-700/40 bg-zinc-900/60 backdrop-blur-sm py-3 pl-10 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 text-xs">
                Clear
              </button>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            {searchQuery.trim() ? (
              <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/80 backdrop-blur-sm p-6 md:p-8">
                <p className="text-sm text-zinc-500 mb-6">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;</p>
                {filtered.length === 0 ? (
                  <p className="text-zinc-400 text-sm text-center py-8">No matching questions. Try a different search term.</p>
                ) : (
                  <div className="space-y-3">
                    {filtered.map((faq, i) => {
                      const key = `search-${i}`;
                      return <FaqItem key={key} faq={faq} isOpen={openIndex === key} onToggle={() => setOpenIndex(openIndex === key ? null : key)} />;
                    })}
                  </div>
                )}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={inView ? 'show' : 'hidden'}
                className="space-y-8"
              >
                {categories.map((cat, ci) => (
                  <motion.div key={cat.name} variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-sm font-semibold text-accent-light tracking-wider uppercase">{cat.name}</h3>
                      <div className="h-px flex-1 bg-gradient-to-r from-accent/20 to-transparent" />
                    </div>
                    <div className="space-y-3">
                      {cat.faqs.map((faq, i) => {
                        const key = `${cat.name}-${i}`;
                        return <FaqItem key={key} faq={{ ...faq, category: cat.name }} isOpen={openIndex === key} onToggle={() => setOpenIndex(openIndex === key ? null : key)} />;
                      })}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-zinc-700/40 bg-zinc-900/80 backdrop-blur-sm p-5">
                <FaqSvg />
                <div className="flex items-center gap-3 mb-4 pt-2">
                  <div className="flex -space-x-2">
                    {supportTeam.map((m) => (
                      <img
                        key={m.seed}
                        src={`https://i.pravatar.cc/40?u=${m.seed}`}
                        alt={m.name}
                        className="w-8 h-8 rounded-full ring-2 ring-zinc-900 object-cover"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Live support</div>
                    <div className="flex items-center gap-1.5 text-[11px] text-signal-green">
                      <span className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse" />
                      Online — reply in &lt; 2min
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {supportChannels.map((ch) => (
                    <button key={ch.label} className="w-full flex items-center gap-3 rounded-xl p-3 border border-zinc-700/30 bg-zinc-900/60 hover:bg-zinc-800/80 hover:border-zinc-600/50 transition-all text-left">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ch.bg}`}>
                        <ch.icon className={`h-4 w-4 ${ch.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-zinc-300">{ch.label}</div>
                        <div className="text-[10px] text-zinc-500">{ch.desc}</div>
                      </div>
                      <ArrowRight className="h-3 w-3 text-zinc-600 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-700/40 bg-gradient-to-br from-accent/[0.08] to-zinc-900/80 backdrop-blur-sm p-5 text-center">
                <Clock className="h-5 w-5 text-accent-light mx-auto mb-2" />
                <div className="text-sm font-medium text-white">Response time guarantee</div>
                <p className="text-xs text-zinc-400 mt-1">We reply to all inquiries within 2 hours during business hours.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 rounded-2xl border border-zinc-700/40 bg-zinc-900/80 backdrop-blur-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {supportTeam.map((m) => (
                <img
                  key={m.seed}
                  src={`https://i.pravatar.cc/40?u=${m.seed}-cta`}
                  alt={m.name}
                  className="w-8 h-8 rounded-full ring-2 ring-zinc-900 object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-zinc-400">Still have questions? We&apos;re here to help.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 bg-zinc-800/80 border border-zinc-700/40 rounded-full px-5 py-2.5 hover:bg-accent/10 hover:border-accent/30 transition-all">
              <Headphones className="h-4 w-4" />
              Contact Support
            </Link>
            <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-900 bg-white rounded-full px-5 py-2.5 shadow hover:shadow-lg hover:scale-[1.02] transition-all">
              Start Building <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-accent text-white px-4 py-3 shadow-lg hover:brightness-110 transition-all"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Chat</span>
      </motion.button>
    </section>
  );
}

function FaqItem({ faq, isOpen, onToggle }: { faq: { q: string; a: string; category: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? 'border-accent/25 bg-gradient-to-r from-accent/[0.10] to-zinc-900/80'
          : 'border-zinc-700/40 bg-zinc-900/80 hover:border-zinc-600/50'
      }`}
    >
      {isOpen && (
        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent via-accent-light to-accent rounded-full" />
      )}
      <button
        type="button"
        onClick={onToggle}
        className="flex text-left w-full gap-4 items-center justify-between p-4 md:p-5"
      >
        <div className="flex items-center gap-3 min-w-0">
          {!isOpen && <div className="h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />}
          {isOpen && <div className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse shrink-0" />}
          <span className={`text-base leading-6 tracking-tight ${isOpen ? 'text-white font-semibold' : 'text-zinc-200 font-medium'}`}>{faq.q}</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors ${
            isOpen ? 'bg-accent/10 border-accent/20' : 'border-zinc-700/40 bg-zinc-800/60'
          }`}
        >
          <Plus className={`h-3.5 w-3.5 ${isOpen ? 'text-accent-light' : 'text-zinc-500'}`} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5">
              <div className="text-sm leading-6 text-zinc-300">{faq.a}</div>
              <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
                <span>Was this helpful?</span>
                <button className="hover:text-zinc-300 transition-colors">Yes</button>
                <button className="hover:text-zinc-300 transition-colors">No</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
