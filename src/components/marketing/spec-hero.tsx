'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

const sampleData = [
  { email: 'user@gmail.com', status: 'Valid', score: '98%', color: 'text-signal-green', bg: 'bg-signal-green/10' },
  { email: 'spam@trap.com', status: 'Blocked', score: '04%', color: 'text-signal-red', bg: 'bg-signal-red/10' },
  { email: 'admin@company.co', status: 'Risky', score: '62%', color: 'text-signal-amber', bg: 'bg-signal-amber/10' },
  { email: 'hello@tempmail.io', status: 'Disposable', score: '21%', color: 'text-signal-amber', bg: 'bg-signal-amber/10' },
];

const companyLogos = [
  { name: 'Stripe', path: 'M13.976 0c.217 0 .421.113.535.302l.058.1 5.09 10.112c.147.29.022.637-.261.787l-.095.046-5.09 2.083a.592.592 0 01-.528-.019l-.088-.055-4.25-3.524a.601.601 0 01-.168-.725l.038-.074 2.382-4.73a.592.592 0 01.49-.303h.013zm-4.476 7.316c.187 0 .365.074.497.206.132.132.206.31.206.497v3.048a.703.703 0 01-.703.703H5.712a.703.703 0 01-.703-.703V7.737c0-.388.315-.703.703-.703h3.788z', color: '#635bff' },
  { name: 'Shopify', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', color: '#95bf47' },
  { name: 'Notion', path: 'M4.207 2.852c.518.407.62.444 1.198.37l14.125-1.333c.133-.015.207-.074.207-.148v-.085c0-.07-.074-.148-.185-.163L6.346.012c-.389-.037-.63.037-.852.222L4.17 1.383c-.13.111-.148.185-.148.259v.889c0 .1.074.241.185.321zm1.753 4.28v15.407c0 .474.259.8.704.837l15.822 1.63c.482.037.852-.296.852-.778V7.677c0-.4-.334-.726-.778-.726H6.738c-.445 0-.778.33-.778.73v1.45h13.581v12.531l-12.882-1.26V7.133h-1.7v-.001zM.016 6.996l2.547.726V21.99c0 .63-.36 1.023-.876 1.023-.36 0-.634-.143-1.083-.43L0 21.839l7.65 4.285c.498.28.96.48 1.564.48.82 0 1.367-.417 1.367-1.28V6.568c0-.528-.325-.832-.857-.832H.857c-.48 0-.84.304-.84.75v.51z', color: '#151515' },
  { name: 'Figma', path: 'M12 2C9.243 2 7 4.243 7 7c0 2.757 2.243 5 5 5 2.757 0 5-2.243 5-5s-2.243-5-5-5zm-5 7c-2.757 0-5 2.243-5 5s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5z', color: '#a259ff' },
  { name: 'Intercom', path: 'M20.286 8.143V4a4 4 0 00-4-4H4a4 4 0 00-4 4v12.286a4 4 0 004 4h12.286a4 4 0 004-4v-4.143h.714a3.714 3.714 0 100-7.428h-.714z', color: '#1f8ded' },
  { name: 'Vercel', path: 'M12 .972L24 20.972H0z', color: '#fff' },
];

export function SpecHero() {
  return (
    <>
      <section className="relative overflow-hidden bg-section-glow-amber bg-dot-grid">
        <div className="glow-orb bg-accent/5 w-[600px] h-[600px] -top-40 -left-40" />
        <div className="glow-orb bg-signal-cyan/5 w-[400px] h-[400px] -bottom-40 -right-40" />

        <div className="max-w-4xl mx-auto pt-28 pb-12 px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 bg-white/[0.06] ring-1 ring-white/20 rounded-full px-3 py-1.5 mb-6">
              <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
              AI-Powered Email Verification &middot; 99.7% accuracy
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white tracking-tighter leading-[0.92]">
              Stop bad emails <br />before they cost you.
            </h1>
            <p className="text-lg text-zinc-400 mt-5 max-w-2xl mx-auto leading-relaxed">
              AI detects spam traps, suggests corrections, and protects your sender score &mdash; in under 12ms.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <div className="flex -space-x-2">
                {['sarah.chen@veriflow.com', 'marcus.johnson@veriflow.com', 'priya.sharma@veriflow.com', 'tom.anderson@veriflow.com', 'emily.rodriguez@veriflow.com'].map((seed) => (
                  <img
                    key={seed}
                    src={`https://i.pravatar.cc/40?u=${seed}`}
                    alt=""
                    className="w-7 h-7 rounded-full ring-2 ring-slate-950 object-cover"
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-zinc-500">4.9/5 from 200+ reviews</span>
            </div>
            <div className="flex flex-wrap mt-8 gap-3 justify-center">
              <div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white bg-accent rounded-full px-8 py-3.5 transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(116,88,219,0.25)]"
                >
                  Start verifying free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-[11px] text-zinc-600 mt-1.5">No credit card &middot; 250 free credits</p>
              </div>
              <div>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 transition-colors text-sm text-zinc-300 border border-zinc-700 rounded-full px-8 py-3.5 hover:border-accent/30 hover:text-white"
                >
                  See how it works
                </Link>
                <p className="text-[11px] text-zinc-600 mt-1.5">Watch a 60-second demo</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-500">
              <span className="flex items-center gap-1">12ms avg response</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="flex items-center gap-1">99.7% accuracy</span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="flex items-center gap-1">2,000+ teams</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="flex w-screen pt-4 pb-40 px-2 items-center justify-center"
          style={{
            maskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 15%, rgb(0,0,0) 85%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(0deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 15%, rgb(0,0,0) 85%, rgba(0,0,0,0) 100%)',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex flex-col overflow-hidden bg-neutral-900 w-full h-[550px] max-w-7xl max-h-[95vh] border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-xl">
            <div className="flex border-b border-neutral-700/50 px-4 py-3 backdrop-blur items-center justify-between" style={{ background: 'rgba(40, 40, 40, 0.5)' }}>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
                <div className="w-3 h-3 rounded-full bg-neutral-600" />
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-neutral-400">
                <span className="text-white">Veriflow Dashboard</span>
                <span>/</span>
                <span>Email Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-accent hover:brightness-110 text-white text-[10px] px-2 py-1 rounded font-medium transition-all">Verify</button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <aside className="flex flex-col w-60 border-r border-neutral-800/50" style={{ background: 'rgba(30, 30, 30, 0.8)' }}>
                <div className="p-3 border-b border-neutral-800/50 flex justify-between items-center">
                  <span className="text-xs font-semibold text-neutral-400">Menu</span>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="px-2 py-1 text-xs text-white bg-accent/20 rounded mx-2 flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /></svg>
                    Quick Verify
                  </div>
                  <div className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800/50 rounded mx-2 flex items-center gap-2 mb-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /></svg>
                    Bulk Check
                  </div>
                  <div className="px-2 py-1 text-xs text-neutral-400 hover:bg-neutral-800/50 rounded mx-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>
                    Analytics
                  </div>
                </div>
                <div className="border-t border-neutral-800/50 px-3 py-3">
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold mb-2">Recent</div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="aspect-square bg-neutral-800 rounded" />
                    <div className="aspect-square bg-neutral-800 rounded" />
                    <div className="aspect-square bg-neutral-800 rounded" />
                    <div className="aspect-square bg-neutral-800 rounded" />
                  </div>
                </div>
              </aside>

              <main className="flex-1 flex flex-col bg-[#111] relative overflow-hidden">
                <div className="opacity-[0.04] absolute inset-0" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-medium text-neutral-200">Verification Results</h2>
                    <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded">4 emails</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                    <div className="w-2 h-2 rounded-full bg-signal-green" />
                    <span>12ms avg</span>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                        <th className="pb-2 font-medium">Email</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Score</th>
                        <th className="pb-2 font-medium">Checks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleData.map((row, i) => (
                        <tr key={i} className="border-b border-neutral-800/50 text-sm">
                          <td className="py-3 text-neutral-300 font-mono text-xs">{row.email}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1 text-xs font-medium ${row.bg} ${row.color} px-2 py-0.5 rounded-full`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${row.color.replace('text-', 'bg-').replace('signal-', 'signal-')}`} />
                              {row.status}
                            </span>
                          </td>
                          <td className={`py-3 text-xs font-mono ${row.color}`}>{row.score}</td>
                          <td className="py-3">
                            <div className="flex gap-1">
                              {['S','D','M','A'].map((c, j) => (
                                <span key={j} className={`text-[8px] w-4 h-4 rounded flex items-center justify-center ${
                                  parseInt(row.score) > 50 ? 'bg-signal-green/20 text-signal-green' : 'bg-signal-red/20 text-signal-red'
                                }`}>{c}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </main>

              <aside className="w-64 border-l border-neutral-800/50 flex flex-col" style={{ background: 'rgba(30, 30, 30, 0.8)' }}>
                <div className="px-4 py-3 border-b border-neutral-800/50 flex justify-between items-center">
                  <div className="text-xs font-semibold text-neutral-400">Summary</div>
                  <div className="w-2 h-2 bg-signal-green rounded-full" />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase mb-2">Overall</div>
                    <div className="bg-neutral-800/50 rounded p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-neutral-400">Valid</span>
                        <span className="text-xs text-signal-green">1/4</span>
                      </div>
                      <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                        <div className="h-full w-1/4 bg-signal-green rounded-full" />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-neutral-500">
                        <span>Risky: 2</span>
                        <span>Blocked: 1</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-500 font-bold uppercase mb-2">Breakdown</div>
                    <div className="space-y-2">
                      {[
                        { label: 'Syntax', pass: true },
                        { label: 'DNS/MX', pass: true },
                        { label: 'SMTP', pass: false },
                        { label: 'AI Pattern', pass: true },
                      ].map((c) => (
                        <div key={c.label} className="bg-neutral-800/50 rounded p-1.5 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-500">{c.label}</span>
                          <span className={`text-xs ${c.pass ? 'text-signal-green' : 'text-signal-red'}`}>{c.pass ? 'Pass' : 'Fail'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="pb-16 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs text-zinc-500 mb-6 uppercase tracking-wider">Trusted by leading companies</p>
            <div className="relative">
              <div className="flex gap-10 marquee-animate">
                {[...companyLogos, ...companyLogos].map((logo, i) => (
                  <div key={`${logo.name}-${i}`} className="flex items-center gap-2.5 shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={logo.color}>
                      <path d={logo.path} />
                    </svg>
                    <span className="text-sm text-zinc-500 font-medium">{logo.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <style>{`
          .marquee-animate {
            animation: marquee-scroll 30s linear infinite;
            width: max-content;
          }
          .marquee-animate:hover {
            animation-play-state: paused;
          }
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>
    </>
  );
}
