'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const testimonials = [
  {
    quote: 'We reduced our bounce rate from 8% to 0.3% in two weeks. Veriflow catches spam traps that other tools completely miss.',
    author: 'Sarah Chen',
    role: 'Email Marketing Lead',
    seed: 'sarah.chen@veriflow.com',
  },
  {
    quote: 'SOC 2 compliance was non-negotiable for us. Veriflow checked every box — enterprise-ready from day one.',
    author: 'Priya Sharma',
    role: 'Security Engineer',
    seed: 'priya.sharma@veriflow.com',
  },
  {
    quote: 'Our deliverability score went from 72 to 96. It\'s like having a deliverability engineer on staff.',
    author: 'Tom Anderson',
    role: 'Head of Operations',
    seed: 'tom.anderson@veriflow.com',
  },
  {
    quote: 'The API is a dream. We integrated in 20 minutes and process 50K verifications daily without a hiccup.',
    author: 'Marcus Johnson',
    role: 'Senior Developer',
    seed: 'marcus.johnson@veriflow.com',
  },
  {
    quote: 'We evaluated 6 email verification tools. Veriflow\'s accuracy and speed were unmatched. Plus the AI spam detection is incredible.',
    author: 'Emily Rodriguez',
    role: 'CTO, MailScale',
    seed: 'emily.rodriguez@veriflow.com',
  },
  {
    quote: 'Setup took 15 minutes. The documentation is excellent, and the support team helped us tune our confidence thresholds.',
    author: 'David Kim',
    role: 'Growth Engineer',
    seed: 'david.kim@veriflow.com',
  },
  {
    quote: 'We catch 3x more invalid emails than with our previous provider. The ROI was immediate.',
    author: 'Lisa Patel',
    role: 'Marketing Director',
    seed: 'lisa.patel@veriflow.com',
  },
  {
    quote: 'Bulk verification is a game-changer. We cleaned our entire database of 200K contacts in under 4 minutes.',
    author: 'Alex Novak',
    role: 'Data Engineer',
    seed: 'alex.novak@veriflow.com',
  },
  {
    quote: 'The webhooks integration meant we could build a custom verification pipeline in hours, not days.',
    author: 'Jordan Taylor',
    role: 'Product Manager',
    seed: 'jordan.taylor@veriflow.com',
  },
  {
    quote: 'Reliability is everything for our transactional email service. Veriflow has 99.99% uptime and it shows.',
    author: 'Rachel Green',
    role: 'Infrastructure Lead',
    seed: 'rachel.green@veriflow.com',
  },
];

function AvatarImg({ seed, size = 36 }: { seed: string; size?: number }) {
  return (
    <img
      src={`https://i.pravatar.cc/${size * 2}?u=${seed}`}
      alt=""
      loading="lazy"
      width={size}
      height={size}
      className="rounded-full ring-2 ring-white/10 shrink-0 object-cover"
    />
  );
}

export function SpecReviews() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const row1 = testimonials.slice(0, 5);
  const row2 = testimonials.slice(5, 10);

  const row1cards = [...row1, ...row1];
  const row2cards = [...row2, ...row2];

  return (
    <section ref={ref} className="bg-section-glow-amber bg-dot-grid" id="reviews">
      <div className="max-w-7xl mx-auto pt-24 pb-20 relative px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-8"
        >
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-zinc-400">Loved by deliverability teams</p>
            <h2 className="text-4xl font-semibold text-white tracking-tighter text-left pt-6 pb-6">
              Testimonials
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="overflow-hidden relative mt-8"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 bg-gradient-to-l from-slate-950 to-transparent z-10" />

          <div className="py-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 sm:gap-5"
              style={{ animation: 'marquee-ltr 60s linear infinite', width: 'max-content' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
            >
              {row1cards.map((t, i) => (
                <article
                  key={`r1-${i}`}
                  className="shrink-0 w-[300px] sm:w-[380px] md:w-[440px] glass-card rounded-2xl p-5 hover:border-accent/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <AvatarImg seed={t.seed} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-white truncate">{t.author}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-accent shrink-0">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-zinc-200 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </article>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4 sm:gap-5"
              style={{ animation: 'marquee-rtl 60s linear infinite', width: 'max-content' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'paused'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.animationPlayState = 'running'; }}
            >
              {row2cards.map((t, i) => (
                <article
                  key={`r2-${i}`}
                  className="shrink-0 w-[300px] sm:w-[380px] md:w-[440px] glass-card rounded-2xl p-5 hover:border-accent/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <AvatarImg seed={t.seed} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-white truncate">{t.author}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-accent shrink-0">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m9 12 2 2 4-4" />
                        </svg>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{t.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm sm:text-base text-zinc-200 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                </article>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
