'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Code2, Check } from 'lucide-react';

function AnimatedBorderMockup({ children, gradientFrom, gradientVia, gradientTo }: { children: React.ReactNode; gradientFrom: string; gradientVia: string; gradientTo: string }) {
  return (
    <div className="relative group">
      <div
        className="absolute -inset-[1px] rounded-2xl bg-[length:200%_200%] animate-gradient opacity-30 group-hover:opacity-60 transition-all duration-700 blur-[0.5px]"
        style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientVia}, ${gradientTo}, ${gradientFrom})`, backgroundSize: '200% 200%' }}
      />
      <div className="relative bg-[#0a0a0a] rounded-2xl">
        {children}
      </div>
    </div>
  );
}

const benefitRows = [
  {
    id: 'accuracy',
    accent: 'accent',
    tag: 'Accuracy',
    tagColor: 'text-accent-light',
    tagBg: 'bg-accent/10',
    sectionBg: 'bg-section-glow-purple',
    title: '99.7% verification accuracy',
    subtitle: 'Multi-layer validation catches what single-pass tools miss.',
    points: [
      'Syntax & RFC compliance — rejects malformed addresses before they reach your list',
      'DNS/MX lookup — verifies the domain accepts mail',
      'SMTP handshake — confirms the mailbox actually exists without sending',
      'ML pattern detection — catches spam traps, role accounts, and disposable domains',
    ],
    mockup: (
      <AnimatedBorderMockup gradientFrom="#a78bfa" gradientVia="#6366f1" gradientTo="#8b5cf6">
        <div className="bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-signal-red/60" />
                <div className="w-2 h-2 rounded-full bg-signal-amber/60" />
                <div className="w-2 h-2 rounded-full bg-signal-green/60" />
              </div>
              4-Layer Verification Report
            </div>
            <span className="text-[10px] text-accent-light font-mono bg-accent/10 px-2 py-0.5 rounded">#v-2847</span>
          </div>
          <div className="space-y-2 mb-4">
            {[
              { label: 'Syntax Check', pass: true, detail: 'RFC 5322 compliant', time: '2ms' },
              { label: 'DNS / MX Records', pass: true, detail: '5 MX records found', time: '4ms' },
              { label: 'SMTP Handshake', pass: true, detail: '250 OK — mailbox exists', time: '6ms' },
              { label: 'AI Pattern Detection', pass: true, detail: 'Low risk score', time: '3ms' },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between bg-black/30 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-signal-green" />
                  <span className="text-xs text-zinc-300">{c.label}</span>
                  <span className="text-[9px] text-zinc-600 font-mono">{c.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-zinc-600">{c.detail}</span>
                  <span className="flex items-center gap-1 text-xs text-signal-green">
                    <Check className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-xs text-zinc-500">Overall Confidence</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[99%] bg-gradient-to-r from-accent to-signal-green rounded-full" />
              </div>
              <span className="text-sm font-mono text-accent-light font-semibold">99.7%</span>
            </div>
          </div>
        </div>
      </AnimatedBorderMockup>
    ),
  },
  {
    id: 'speed',
    accent: 'signal-cyan',
    tag: 'Speed',
    tagColor: 'text-signal-cyan',
    tagBg: 'bg-signal-cyan/10',
    sectionBg: 'bg-section-glow-blue',
    title: 'Blazing fast — under 12ms',
    subtitle: 'Every microsecond counts when you are verifying millions of emails.',
    points: [
      'Average response time of 12ms per email — industry-leading speed',
      'Batch up to 100 emails in a single request for bulk efficiency',
      'Intelligent result caching avoids redundant lookups on repeated addresses',
      'Global edge infrastructure with auto-scaling for traffic spikes',
    ],
    mockup: (
      <AnimatedBorderMockup gradientFrom="#22d3ee" gradientVia="#06b6d4" gradientTo="#0891b2">
        <div className="bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-zinc-500 font-mono">Latency Breakdown (ms)</span>
            <span className="text-[10px] text-signal-cyan font-mono bg-signal-cyan/10 px-2 py-0.5 rounded">Veriflow: 12ms avg</span>
          </div>
          <div className="flex items-end gap-2 h-32 mb-3">
            {[
              { label: 'Veriflow', height: 18, value: '12ms', color: 'from-signal-cyan to-cyan-600' },
              { label: 'Competitor A', height: 55, value: '48ms', color: 'from-zinc-600 to-zinc-700' },
              { label: 'Competitor B', height: 70, value: '62ms', color: 'from-zinc-600 to-zinc-700' },
              { label: 'Competitor C', height: 90, value: '84ms', color: 'from-zinc-600 to-zinc-700' },
            ].map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[9px] text-zinc-400 font-mono">{bar.value}</span>
                <div className={`w-full rounded-t bg-gradient-to-t ${bar.color} relative overflow-hidden`} style={{ height: `${bar.height}%` }}>
                  {bar.label === 'Veriflow' && (
                    <div className="absolute inset-0 animate-pulse bg-white/10" />
                  )}
                </div>
                <span className={`text-[8px] ${bar.label === 'Veriflow' ? 'text-signal-cyan' : 'text-zinc-600'} text-center`}>{bar.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-xs text-zinc-500">Batch throughput</span>
            <span className="text-sm font-mono text-signal-cyan font-semibold">50K+ emails/min</span>
          </div>
        </div>
      </AnimatedBorderMockup>
    ),
  },
  {
    id: 'api',
    accent: 'signal-green',
    tag: 'Developer Experience',
    tagColor: 'text-signal-green',
    tagBg: 'bg-signal-green/10',
    sectionBg: 'bg-section-glow-amber',
    title: 'Clean API, loved by developers',
    subtitle: 'Integrate in minutes with SDKs for every major language.',
    points: [
      'RESTful API with straightforward JSON request/response — no convoluted schemas',
      'SDKs for Python, TypeScript, Node.js, Go, and Ruby with full type hints',
      'Comprehensive documentation with interactive examples and quickstart guides',
      'Webhook support to stream results to your app with automatic retries',
    ],
    mockup: (
      <AnimatedBorderMockup gradientFrom="#34d399" gradientVia="#10b981" gradientTo="#059669">
        <div className="bg-gradient-to-br from-white/[0.08] to-transparent rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-signal-red/60" />
              <div className="w-2 h-2 rounded-full bg-signal-amber/60" />
              <div className="w-2 h-2 rounded-full bg-signal-green/60" />
            </div>
            <div className="flex gap-1 text-[10px]">
              <span className="text-zinc-500 font-mono border-b-2 border-signal-green pb-0.5 px-1">cURL</span>
              <span className="text-zinc-600 font-mono px-1">Python</span>
              <span className="text-zinc-600 font-mono px-1">Node</span>
              <span className="text-zinc-600 font-mono px-1">Go</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono flex-1 text-right">api.veriflow.io</span>
          </div>
          <div className="bg-black/40 rounded-lg p-3 font-mono text-[10px] leading-relaxed space-y-1">
            <div className="flex gap-2">
              <span className="text-signal-green font-semibold">$</span>
              <span className="text-zinc-300">curl -X POST</span>
              <span className="text-signal-cyan">https://api.veriflow.io/v1/verify</span>
            </div>
            <div className="text-zinc-500">  -H &quot;Authorization: Bearer sk_...&quot; \</div>
            <div className="text-zinc-500">  -d &#123;&quot;email&quot;:&quot;user@example.com&quot;&#125;</div>
            <div className="border-t border-white/5 pt-1 mt-1">
              <span className="text-signal-green">&rarr; 200 OK</span>
            </div>
            <div className="text-zinc-400 pl-4">&#123;</div>
            <div className="text-zinc-500 pl-6">&quot;valid&quot;: <span className="text-signal-green">true</span>,</div>
            <div className="text-zinc-500 pl-6">&quot;score&quot;: <span className="text-accent-light">0.98</span>,</div>
            <div className="text-zinc-500 pl-6">&quot;checks&quot;: [<span className="text-signal-green">4 passed</span>],</div>
            <div className="text-zinc-400 pl-4">&#125;</div>
          </div>
          <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-3">
            <span className="text-xs text-zinc-500">Webhook delivery</span>
            <span className="text-xs font-mono text-signal-green">POST /webhooks &rarr; 200 OK (always)</span>
          </div>
        </div>
      </AnimatedBorderMockup>
    ),
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const sideVariants = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const sideVariantsReversed = {
  hidden: { opacity: 0, x: 30 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export function SpecBenefits() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="bg-dot-grid">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto pt-24 pb-6 px-6 lg:px-8"
      >
        <h2 className="text-4xl font-semibold text-white tracking-tighter pt-6 pb-2">
          Everything you need to verify at scale
        </h2>
        <p className="text-zinc-400 text-base max-w-xl">
          Three pillars. One platform. Unmatched deliverability.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {benefitRows.map((row, i) => {
          const isReversed = i % 2 === 1;
          return (
            <motion.section
              key={row.id}
              variants={rowVariants}
              className={`${row.sectionBg} bg-dot-grid border-y border-white/5`}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                  <motion.div
                    variants={isReversed ? sideVariantsReversed : sideVariants}
                    className={`space-y-6 ${isReversed ? 'lg:order-2' : ''}`}
                  >
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${row.tagColor} ${row.tagBg} ring-1 ring-white/20 rounded-lg px-2.5 py-1`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${row.tagColor.replace('text-', 'bg-')}`} />
                      {row.tag}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">{row.title}</h3>
                    <p className="text-zinc-400 leading-relaxed">{row.subtitle}</p>
                    <ul className="space-y-3">
                      {row.points.map((pt) => (
                        <li key={pt} className="flex items-start gap-3 text-sm text-zinc-300">
                          <div className={`w-5 h-5 rounded-full ${row.tagBg} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Check className={`h-3 w-3 ${row.tagColor}`} />
                          </div>
                          {pt}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={row.id === 'api' ? '/docs' : '#features'}
                      className={`inline-flex items-center gap-2 text-sm font-medium ${row.tagColor} hover:underline underline-offset-4 mt-2`}
                    >
                      Learn more <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </motion.div>
                  <motion.div
                    variants={isReversed ? sideVariants : sideVariantsReversed}
                    className={isReversed ? 'lg:order-1' : ''}
                  >
                    {row.mockup}
                  </motion.div>
                </div>
              </div>
            </motion.section>
          );
        })}
      </motion.div>
    </section>
  );
}
