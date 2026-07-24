'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const features = [
  {
    id: 'api',
    title: 'Real-time API',
    description: 'Verify individual emails in under 12ms with our RESTful API. Returns syntax validation, MX record checks, SMTP handshake results, and AI risk scoring.',
    detail: 'POST /v1/verify with a single email address. Get back comprehensive results including is_valid, risk_score, disposable detection, and suggested corrections.',
  },
  {
    id: 'bulk',
    title: 'Bulk Verification',
    description: 'Upload CSV files with up to 100K emails. Parallel processing validates your entire list in minutes, not hours.',
    detail: 'Drag-and-drop CSV upload with real-time progress tracking. Download validated results with per-email status codes and a summary report.',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Track verification volume, pass/fail rates, bounce risk trends, and domain-level analytics over any time period.',
    detail: 'Interactive charts show daily/weekly/monthly trends. Filter by verification method, domain, or risk score range. Export raw data as JSON or CSV.',
  },
  {
    id: 'webhooks',
    title: 'Webhook Integrations',
    description: 'Stream verification results to your app in real time. Supports Zapier, Make, and custom webhook endpoints.',
    detail: 'Configure webhooks to receive verification events instantly. Payload includes full verification data with retry logic and delivery receipts.',
  },
];

const mockups: Record<string, React.ReactNode> = {
  api: (
    <div className="flex-1 flex flex-col bg-[#111] relative overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-[#0a0a0a]">
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
        <div className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
        <div className="flex-1 text-center">
          <span className="text-[10px] text-neutral-500 font-mono">api.veriflow.io/v1/verify</span>
        </div>
        <span className="text-[9px] text-signal-green bg-signal-green/10 px-1.5 py-0.5 rounded font-mono">200 OK (12ms)</span>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-neutral-400 font-mono font-semibold">POST /v1/verify</span>
            <div className="flex gap-1">
              <span className="text-[9px] bg-accent/10 text-accent-light px-1.5 py-0.5 rounded">Request</span>
            </div>
          </div>
          <div className="bg-neutral-900 rounded p-2 font-mono text-[10px] leading-relaxed">
            <div className="text-neutral-500">{'{'}</div>
            <div className="pl-3 text-neutral-400">&quot;email&quot;: <span className="text-signal-cyan">&quot;user@example.com&quot;</span>,</div>
            <div className="pl-3 text-neutral-400">&quot;check_dns&quot;: <span className="text-signal-green">true</span>,</div>
            <div className="pl-3 text-neutral-400">&quot;check_smtp&quot;: <span className="text-signal-green">true</span></div>
            <div className="text-neutral-500">{'}'}</div>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-neutral-400 font-mono font-semibold">Response</span>
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">12ms</span>
          </div>
          <div className="bg-neutral-900 rounded p-2 font-mono text-[10px] leading-relaxed">
            <div className="text-neutral-500">{'{'}</div>
            <div className="pl-3 text-neutral-400">&quot;valid&quot;: <span className="text-signal-green">true</span>,</div>
            <div className="pl-3 text-neutral-400">&quot;score&quot;: <span className="text-accent-light">0.98</span>,</div>
            <div className="pl-3 text-neutral-400">&quot;checks&quot;: <span className="text-neutral-400">{'{'}</span></div>
            <div className="pl-6 text-neutral-400">&quot;syntax&quot;: <span className="text-signal-green">&quot;pass&quot;</span>,</div>
            <div className="pl-6 text-neutral-400">&quot;mx&quot;: <span className="text-signal-green">&quot;pass&quot;</span>,</div>
            <div className="pl-6 text-neutral-400">&quot;smtp&quot;: <span className="text-signal-green">&quot;pass&quot;</span>,</div>
            <div className="pl-6 text-neutral-400">&quot;ai&quot;: <span className="text-signal-green">&quot;pass&quot;</span></div>
            <div className="pl-3 text-neutral-400">{'}'}</div>
            <div className="text-neutral-500">{'}'}</div>
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 text-[9px] text-zinc-500 border-t border-neutral-800 pt-2">
          <div className="w-1 h-1 rounded-full bg-signal-green" />
          <span>All 4 checks passed</span>
          <span className="ml-auto text-accent-light font-medium">Try it &rarr;</span>
        </div>
      </div>
    </div>
  ),
  bulk: (
    <div className="flex-1 flex flex-col bg-[#111] relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          <span className="text-[10px] text-neutral-400">Bulk Verification</span>
        </div>
        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded">2,847 / 12,400</span>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg flex-1 overflow-hidden">
          <table className="w-full text-[9px] font-mono">
            <thead>
              <tr className="text-neutral-500 border-b border-neutral-800">
                <th className="text-left p-2 font-medium">Email</th>
                <th className="text-left p-2 font-medium">Status</th>
                <th className="text-left p-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {[
                { email: 'user@example.com', status: 'Valid', score: '98%', color: 'text-signal-green' },
                { email: 'bounce@bad.com', status: 'Invalid', score: '02%', color: 'text-signal-red' },
                { email: 'test@spam.net', status: 'Spam Trap', score: '05%', color: 'text-signal-red' },
                { email: 'info@co.io', status: 'Disposable', score: '21%', color: 'text-signal-amber' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-neutral-800/30">
                  <td className="p-2 text-neutral-300">{r.email}</td>
                  <td className={`p-2 ${r.color}`}>{r.status}</td>
                  <td className={`p-2 ${r.color}`}>{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full w-[23%] bg-gradient-to-r from-signal-cyan to-accent rounded-full" />
        </div>
        <div className="flex items-center justify-between text-[9px] text-neutral-500">
          <span>contacts.csv &mdash; 12.4K emails</span>
          <span>Estimated: 45s remaining</span>
        </div>
      </div>
    </div>
  ),
  analytics: (
    <div className="flex-1 flex flex-col bg-[#111] relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-[#0a0a0a]">
        <span className="text-[10px] text-neutral-300 font-medium">Verification Analytics</span>
        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-mono">+12.3% vs last month</span>
      </div>
      <div className="flex-1 p-3 flex gap-3">
        <div className="flex-1 flex flex-col justify-end">
          <div className="flex items-end gap-1 h-28">
            {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95, 70, 88, 62].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: 'linear-gradient(to top, rgba(34,211,238,0.4), rgba(34,211,238,0.1))' }} />
            ))}
          </div>
          <div className="grid grid-cols-5 mt-1">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
              <span key={d} className="text-[7px] text-neutral-600 text-center">{d}</span>
            ))}
          </div>
        </div>
        <div className="w-28 flex flex-col justify-center gap-3">
          <div className="relative w-20 h-20 mx-auto">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#27272a" strokeWidth="3" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22d3ee" strokeWidth="3" strokeDasharray="66, 100" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#b4a4ef" strokeWidth="3" strokeDasharray="20, 100" strokeDashoffset="-66" />
            </svg>
          </div>
          <div className="flex items-center justify-between text-[8px]">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-signal-cyan" /> Valid</div>
            <span className="text-neutral-400">66%</span>
          </div>
          <div className="flex items-center justify-between text-[8px]">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-accent" /> Bounce</div>
            <span className="text-neutral-400">20%</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-3 pb-3">
        <div className="bg-neutral-800/50 rounded p-1.5 text-center">
          <div className="text-[9px] text-neutral-500">Total</div>
          <div className="text-[11px] text-white font-mono">284.7K</div>
        </div>
        <div className="bg-neutral-800/50 rounded p-1.5 text-center">
          <div className="text-[9px] text-neutral-500">Valid</div>
          <div className="text-[11px] text-emerald-400 font-mono">96.2%</div>
        </div>
        <div className="bg-neutral-800/50 rounded p-1.5 text-center">
          <div className="text-[9px] text-neutral-500">Avg ms</div>
          <div className="text-[11px] text-accent-light font-mono">12ms</div>
        </div>
      </div>
    </div>
  ),
  webhooks: (
    <div className="flex-1 flex flex-col bg-[#111] relative overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-[#0a0a0a]">
        <span className="text-[10px] text-neutral-300 font-medium">Webhook Events</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-[9px] text-neutral-500">Live</span>
        </div>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2">
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-medium text-neutral-200">verify.complete</span>
            <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">200 OK</span>
          </div>
          <div className="bg-neutral-900 rounded p-2 font-mono text-[9px] leading-relaxed">
            <div className="text-neutral-500">{'{'}</div>
            <div className="pl-2 text-neutral-400">&quot;event&quot;: <span className="text-signal-cyan">&quot;verify.complete&quot;</span>,</div>
            <div className="pl-2 text-neutral-400">&quot;email&quot;: <span className="text-signal-cyan">&quot;user@example.com&quot;</span>,</div>
            <div className="pl-2 text-neutral-400">&quot;valid&quot;: <span className="text-signal-green">true</span>,</div>
            <div className="pl-2 text-neutral-400">&quot;risk_score&quot;: <span className="text-accent-light">0.02</span></div>
            <div className="text-neutral-500">{'}'}</div>
          </div>
        </div>
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-neutral-200">verify.failed</span>
            <span className="text-[8px] bg-signal-red/20 text-signal-red px-1.5 py-0.5 rounded">422</span>
          </div>
          <div className="text-[9px] text-neutral-500 font-mono">Invalid email format — missing @domain</div>
        </div>
        <div className="bg-accent/10 border border-accent/30 rounded-lg p-2 text-center text-[10px] text-accent-light cursor-pointer hover:bg-accent/20 transition-colors mt-auto">
          + Add endpoint
        </div>
      </div>
    </div>
  ),
};

export function SpecScrollFeatures() {
  const [activeId, setActiveId] = useState('api');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const featureElements = features.map((f) => ({
      id: f.id,
      el: section.querySelector(`[data-feature-id="${f.id}"]`),
    })).filter((f) => f.el);

    const handleScroll = () => {
      const viewportMid = window.scrollY + window.innerHeight / 2;
      let closest = featureElements[0];
      let closestDist = Infinity;

      featureElements.forEach(({ id, el }) => {
        const rect = el!.getBoundingClientRect();
        const elMid = rect.top + window.scrollY + rect.height / 2;
        const dist = Math.abs(elMid - viewportMid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = { id, el };
        }
      });

      if (closest) {
        setActiveId(closest.id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="overflow-hidden sm:pb-40 sm:pt-40 pt-24 pb-24 relative border-t border-white/10 bg-section-glow-cyan bg-dot-grid"
      id="feature-scroll-section"
    >
      <div className="absolute -translate-x-1/2 blur-[120px] pointer-events-none -z-10 bg-accent/5 w-full h-[500px] max-w-3xl rounded-full top-0 left-1/2" />

      <div className="lg:px-8 max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mb-24">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-white leading-[0.95] mb-6">
            Verify, analyze, improve.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 lg:gap-24 items-start">
          <div className="flex flex-col w-full space-y-2 lg:sticky lg:top-32">
            {features.map((feat) => (
              <div
                key={feat.id}
                className="relative pl-8 py-4 border-l border-white/20 cursor-pointer transition-all duration-500 ease-in-out"
                onClick={() => setActiveId(feat.id)}
              >
                <div
                  className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-accent transition-all duration-500 ease-in-out"
                  style={{ opacity: activeId === feat.id ? 1 : 0, height: activeId === feat.id ? '100%' : 0 }}
                />
                <h3
                  className="text-xl md:text-2xl font-medium transition-colors duration-300"
                  style={{ color: activeId === feat.id ? '#f4f4f5' : '#71717a' }}
                >
                  {feat.title}
                </h3>
                <div
                  className="overflow-hidden transition-all duration-700 ease-in-out"
                  style={{ maxHeight: activeId === feat.id ? '200px' : '0px', opacity: activeId === feat.id ? 1 : 0 }}
                >
                  <p className="text-zinc-400 text-base leading-relaxed mt-4 mb-6 font-light">
                    {feat.description}
                  </p>
                  <p className="text-zinc-500 text-sm leading-relaxed font-light">
                    {feat.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full h-[480px] rounded-xl border border-neutral-800 overflow-hidden shadow-2xl bg-neutral-900 flex flex-col">
            <div className="flex border-b border-neutral-800 bg-[#0d0d0d] px-3 py-2.5 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
              </div>
              <div className="flex items-center gap-3 text-[10px] font-medium text-neutral-500">
                {features.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveId(f.id)}
                    className={`transition-colors duration-200 ${activeId === f.id ? 'text-accent-light' : ''}`}
                  >
                    {f.id === 'api' ? 'API' : f.id.charAt(0).toUpperCase() + f.id.slice(1)}
                  </button>
                ))}
              </div>
              <div className="w-12" />
            </div>
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  {mockups[activeId]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {features.map((feat) => (
            <div key={feat.id} data-feature-id={feat.id} className="h-0 w-0 overflow-hidden" />
          ))}
        </div>
      </div>
    </section>
  );
}
