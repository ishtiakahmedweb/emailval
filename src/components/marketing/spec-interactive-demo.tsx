'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  Loader2, Search, Shield, Mail, Bot, Gauge, Zap, Clock,
  CheckCheck, Activity, Sparkles,
} from 'lucide-react';

const stages = [
  { id: 'syntax', label: 'Syntax Check', icon: Search, color: 'text-signal-green' },
  { id: 'dns', label: 'DNS / MX Records', icon: Mail, color: 'text-signal-cyan' },
  { id: 'smtp', label: 'SMTP Verification', icon: Shield, color: 'text-accent-light' },
  { id: 'ai', label: 'AI Pattern Detection', icon: Bot, color: 'text-signal-magenta' },
];

const presets = [
  'hello@gmail.com',
  'spam@trap.com',
  'admin@company.co',
  'user@tempmail.io',
  'notanemail',
  'test@asdfghjkl.xyz',
];

interface CheckResult { stage: string; passed: boolean; detail: string; }
interface VerificationResult {
  valid: boolean; confidence: number; time: string; credits: string;
  checks: CheckResult[]; flags: string[]; email: string;
}

function analyzeEmail(email: string): VerificationResult {
  const trimmed = email.trim().toLowerCase();
  const checks: CheckResult[] = [];
  const flags: string[] = [];

  const atIndex = trimmed.indexOf('@');
  const local = atIndex > 0 ? trimmed.slice(0, atIndex) : '';
  const domain = atIndex > 0 ? trimmed.slice(atIndex + 1) : '';
  const hasValidFormat = atIndex > 0 && domain.length >= 3 && domain.includes('.');
  const tld = domain.split('.').pop() || '';

  const knownDomains = new Set(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'aol.com', 'mail.com', 'zoho.com', 'yandex.com', 'fastmail.com', 'gmx.com', 'tutanota.com']);
  const disposableDomains = new Set(['tempmail.io', 'guerrillamail.com', 'mailinator.com', '10minutemail.com', 'throwaway.io', 'yopmail.com', 'sharklasers.com', 'trashmail.com', 'mailnator.com', 'dispostable.com']);
  const rolePrefixes = ['admin', 'info', 'support', 'sales', 'contact', 'help', 'webmaster', 'postmaster', 'noreply', 'no-reply', 'abuse', 'billing'];
  const typoTlds = new Set(['.cm', '.cmo', '.con', '.ocm', '.gmial', '.gmil']);
  const commonTlds = ['com', 'org', 'net', 'io', 'co', 'app', 'dev', 'ai', 'me', 'edu', 'gov', 'mil', 'info', 'biz', 'pro', 'name', 'uk', 'de', 'fr', 'ca', 'au', 'jp', 'in', 'br', 'nl', 'eu', 'it', 'es', 'se', 'no', 'dk', 'fi', 'pl', 'cz', 'at', 'ch', 'be', 'nz', 'sg', 'hk', 'kr', 'za', 'mx', 'ar', 'cl'];

  if (!hasValidFormat) checks.push({ stage: 'syntax', passed: false, detail: 'Invalid email format — missing or malformed @domain part' });
  else if (local.length > 64) checks.push({ stage: 'syntax', passed: false, detail: 'Local part exceeds 64 character limit' });
  else if (!/^[a-z0-9._%+\-]+$/.test(local)) checks.push({ stage: 'syntax', passed: false, detail: 'Invalid characters in local part' });
  else if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) checks.push({ stage: 'syntax', passed: false, detail: 'Domain format appears invalid' });
  else checks.push({ stage: 'syntax', passed: true, detail: 'RFC 5322 compliant format' });

  const syntaxPassed = checks[0].passed;
  if (!syntaxPassed) checks.push({ stage: 'dns', passed: false, detail: 'Skipped — syntax check failed' });
  else if (domain === 'example.com' || domain === 'test.com' || domain === 'localhost') checks.push({ stage: 'dns', passed: false, detail: 'Reserved domain — not routable' });
  else if (knownDomains.has(domain)) { checks.push({ stage: 'dns', passed: true, detail: `${domain} — 5 MX records, priority 10` }); flags.push('Known mail provider'); }
  else if (disposableDomains.has(domain)) { checks.push({ stage: 'dns', passed: true, detail: `${domain} — 2 MX records, priority 10` }); flags.push('Disposable email domain detected'); }
  else if (domain.includes('spam') || domain.includes('trap') || domain.includes('bounce')) { checks.push({ stage: 'dns', passed: true, detail: `${domain} — 1 MX record found` }); flags.push('Known spam trap domain'); }
  else if (domain.length < 5 || !domain.includes('.')) checks.push({ stage: 'dns', passed: false, detail: `No DNS records for ${domain}` });
  else if (typoTlds.has(tld) || tld.length < 2) checks.push({ stage: 'dns', passed: false, detail: `TLD "${tld}" looks suspicious` });
  else if (commonTlds.includes(tld) && domain.split('.')[0].length >= 2) checks.push({ stage: 'dns', passed: true, detail: `${domain} — 3 MX records, priority 10` });
  else checks.push({ stage: 'dns', passed: false, detail: `No MX records found for ${domain}` });

  const dnsPassed = checks[1].passed;
  if (!dnsPassed) checks.push({ stage: 'smtp', passed: false, detail: 'Skipped — DNS/MX check failed' });
  else if (disposableDomains.has(domain)) { checks.push({ stage: 'smtp', passed: true, detail: 'Mailbox exists (250 OK)' }); flags.push('Disposable — temporary address'); }
  else if (domain.includes('spam') || domain.includes('trap')) { checks.push({ stage: 'smtp', passed: false, detail: '550 — Rejected as spam trap' }); flags.push('SPAM TRAP — Do not send'); }
  else if (knownDomains.has(domain)) checks.push({ stage: 'smtp', passed: true, detail: 'Mailbox exists (250 OK)' });
  else if (rolePrefixes.some(p => local.startsWith(p))) { checks.push({ stage: 'smtp', passed: true, detail: 'Mailbox exists (250 OK)' }); flags.push('Role-based account — may bounce'); }
  else checks.push({ stage: 'smtp', passed: false, detail: '550 — Mailbox not found' });

  const smtpPassed = checks[2].passed;
  if (!smtpPassed) checks.push({ stage: 'ai', passed: false, detail: 'Skipped — SMTP check failed' });
  else if (flags.filter(f => f.includes('SPAM TRAP')).length > 0) checks.push({ stage: 'ai', passed: false, detail: 'High-risk: spam trap signatures detected' });
  else {
    const highRiskFlags = flags.filter(f => f.includes('SPAM TRAP'));
    const medRiskFlags = flags.filter(f => /disposable|role[- ]/i.test(f));
    if (highRiskFlags.length > 0) checks.push({ stage: 'ai', passed: false, detail: 'High-risk patterns detected' });
    else if (medRiskFlags.length > 0) checks.push({ stage: 'ai', passed: true, detail: 'Medium confidence — patterns noted' });
    else if (knownDomains.has(domain)) checks.push({ stage: 'ai', passed: true, detail: 'Low risk: known provider' });
    else checks.push({ stage: 'ai', passed: false, detail: 'Unverified domain — no reputation data' });
  }

  const passedChecks = checks.filter(c => c.passed).length;
  const confidence = Math.round((passedChecks / checks.length) * 100);
  const valid = checks.every(c => c.passed);
  let timeMs = 0;
  for (const c of checks) timeMs += c.passed ? 45 + Math.random() * 80 : 120 + Math.random() * 200;

  return { valid, confidence, time: `${Math.round(timeMs)}ms`, credits: valid ? '1' : '0', checks, flags: [...new Set(flags)], email };
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-zinc-800/30 bg-white/[0.06] p-10 text-center"
    >
      <svg viewBox="0 0 200 140" className="w-32 h-24 mx-auto mb-4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="30" width="140" height="80" rx="8" stroke="#52525b" strokeWidth="1.5" fill="rgba(255,255,255,0.02)" />
        <rect x="42" y="44" width="80" height="12" rx="3" fill="rgba(255,255,255,0.06)" />
        <circle cx="140" cy="50" r="6" fill="rgba(255,255,255,0.04)" />
        <rect x="42" y="62" width="116" height="6" rx="3" fill="rgba(255,255,255,0.03)" />
        <rect x="42" y="74" width="90" height="6" rx="3" fill="rgba(255,255,255,0.03)" />
        <rect x="42" y="86" width="60" height="6" rx="3" fill="rgba(255,255,255,0.03)" />
        <path d="M80 110 L100 120 L120 110" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        <circle cx="100" cy="120" r="2" fill="#22d3ee" opacity="0.6" />
      </svg>
      <Activity className="h-5 w-5 text-zinc-600 mx-auto mb-2" />
      <span className="text-base text-zinc-400 block">Ready to verify</span>
      <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-1">Type an email above or click a preset to see the full verification pipeline in action.</p>
    </motion.div>
  );
}

function SparkleEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent-light/40"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], x: Math.cos((i * 45) * Math.PI / 180) * 40, y: Math.sin((i * 45) * Math.PI / 180) * 40 }}
          transition={{ duration: 0.8, delay: 0.1 * i, ease: 'easeOut' }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </div>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-6">
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-accent via-accent-light to-signal-cyan"
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  );
}

export function SpecInteractiveDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [email, setEmail] = useState('hello@gmail.com');
  const [verifying, setVerifying] = useState(false);
  const [currentStage, setCurrentStage] = useState(-1);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [inputError, setInputError] = useState(false);

  const validateAndRun = useCallback(async (input: string) => {
    const text = input || email;
    if (!text.trim() || !text.includes('@')) {
      setInputError(true);
      return;
    }
    setInputError(false);
    setEmail(text); setResult(null); setVerifying(true); setCurrentStage(-1);
    for (let i = 0; i < stages.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
      setCurrentStage(i);
    }
    await new Promise((r) => setTimeout(r, 500));
    const res = analyzeEmail(text);
    setResult(res); setCurrentStage(stages.length); setVerifying(false);
  }, [email]);

  const runVerification = useCallback(async (input: string) => {
    await validateAndRun(input);
  }, [validateAndRun]);

  const passedCount = result?.checks.filter(c => c.passed).length ?? 0;
  const totalCount = result?.checks.length ?? 4;

  const statItems = result ? [
    { label: 'Response', value: result.time, icon: Clock, color: 'text-accent-light' },
    { label: 'Credits', value: result.credits, icon: Zap, color: 'text-signal-green' },
    { label: 'Verdict', value: result.valid ? 'PASS' : 'FAIL', icon: Gauge, color: result.valid ? 'text-signal-green' : 'text-signal-red' },
    { label: 'Checks', value: `${passedCount}/${totalCount}`, icon: Search, color: 'text-signal-cyan' },
  ] : [];

  return (
    <section id="demo" ref={ref} className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute top-[-250px] left-[-120px] w-[550px] h-[550px] rounded-full bg-accent/[0.07] blur-[200px]" />
      <div className="absolute bottom-[-200px] right-[-120px] w-[450px] h-[450px] rounded-full bg-signal-cyan/[0.04] blur-[180px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-signal-cyan/10 to-transparent" />

      <div className="mx-auto max-w-full px-8 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-700/30 bg-white/[0.07] px-3.5 py-1.5 text-xs font-medium text-zinc-400 mb-5">
            <div className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse shadow-[0_0_8px_rgba(39,201,63,0.5)]" />
            Live Demo <span className="text-[9px] text-zinc-600 ml-1 font-mono">v2.4</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-medium tracking-[-0.02em] text-white leading-[1.08]">
            See it in{' '}
            <span className="bg-gradient-to-r from-accent-light to-signal-cyan bg-clip-text text-transparent">action</span>
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Type any email to see how Veriflow validates it in real-time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-zinc-800/50 bg-white/[0.06] backdrop-blur-xl overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setInputError(false); }}
                    onKeyDown={(e) => e.key === 'Enter' && runVerification(email)}
                    placeholder="Enter any email address..."
                    aria-invalid={inputError}
                    aria-describedby={inputError ? 'email-error' : undefined}
                    className={`w-full rounded-xl border py-3.5 pl-11 pr-4 text-sm font-mono transition-all outline-none focus:ring-1 ${
                      inputError
                        ? 'border-signal-red/40 bg-signal-red/[0.06] text-white placeholder:text-zinc-600 focus:border-signal-red/50 focus:ring-signal-red/30'
                        : 'border-zinc-700/60 bg-black/35 text-white placeholder:text-zinc-600 focus:border-accent/30 focus:ring-accent/20'
                    }`}
                  />
                  {inputError && <p id="email-error" className="text-xs text-signal-red/70 mt-1 ml-1" role="alert">Enter a valid email address (e.g., name@domain.com)</p>}
                </div>
                <button
                  onClick={() => runVerification(email)}
                  disabled={verifying}
                  className="btn-state-default inline-flex items-center justify-center gap-2 rounded-xl bg-btn-primary-bg px-8 py-3.5 text-sm font-medium text-btn-primary-text transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_30px_rgba(116,88,219,0.15)] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                  aria-label={verifying ? 'Verifying email' : 'Verify email'}
                >
                  {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {verifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Try one of these:</span>
                <div className="h-px flex-1 bg-gradient-to-r from-accent/10 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setEmail(p); setResult(null); setCurrentStage(-1); setInputError(false); }}
                    className="rounded-lg border border-zinc-700/40 bg-black/35 px-3 py-1.5 text-xs font-mono text-zinc-500 hover:text-zinc-200 hover:border-accent/25 hover:bg-accent/[0.06] transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                    aria-label={`Try ${p}`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {verifying && <ProgressBar current={currentStage + 1} total={stages.length} />}

              <div className="relative mb-6">
                <div className="space-y-3 relative">
                  {stages.map((stage, i) => {
                    const StageIcon = stage.icon;
                    const isActive = currentStage === i && verifying;
                    const isDone = currentStage > i || (currentStage === stages.length && result);
                    const stageResult = result?.checks.find(c => c.stage === stage.id);
                    return (
                      <motion.div
                        key={stage.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`relative flex items-start gap-4 rounded-xl px-5 py-4 transition-all duration-500 ${
                          isActive
                            ? 'bg-accent/[0.06] border border-accent/25 shadow-[0_0_24px_rgba(116,88,219,0.08)]'
                            : isDone
                            ? 'bg-white/[0.06] border border-white/15'
                            : 'border border-transparent hover:bg-white/[0.015]'
                        }`}
                      >
                        {i < stages.length - 1 && (
                          <div className={`absolute left-[22px] top-[52px] w-px transition-opacity duration-500 bg-gradient-to-b from-accent/30 via-accent/15 to-transparent ${isActive || isDone ? 'opacity-100' : 'opacity-30'}`}
                            style={{ height: 'calc(100% + 12px)' }}
                          />
                        )}
                        <div className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                          isActive
                            ? 'bg-accent/10 ring-2 ring-accent/25'
                            : isDone
                            ? 'bg-signal-green/10 ring-1 ring-signal-green/20'
                            : 'bg-zinc-800/50 ring-1 ring-zinc-700/50'
                        }`}>
                          {isDone && stageResult?.passed ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                              <CheckCircle2 className="h-5 w-5 text-signal-green" />
                            </motion.div>
                          ) : isDone && stageResult && !stageResult.passed ? (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                              <XCircle className="h-5 w-5 text-signal-red" />
                            </motion.div>
                          ) : (
                            <StageIcon className={`h-5 w-5 ${isActive ? `${stage.color} animate-pulse` : 'text-zinc-500'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-medium ${isActive ? 'text-white' : isDone ? 'text-zinc-200' : 'text-zinc-400'}`}>{stage.label}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium ${
                              isActive ? 'bg-accent/10 text-accent-light' : isDone && stageResult ? (stageResult.passed ? 'bg-signal-green/10 text-signal-green' : 'bg-signal-red/10 text-signal-red') : 'bg-zinc-800/50 text-zinc-600'
                            }`}>
                              {isActive ? `Step ${i + 1}/${stages.length}` : isDone && stageResult ? (stageResult.passed ? 'Passed' : 'Failed') : `Step ${i + 1}/${stages.length}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-zinc-400 flex items-center gap-1.5"
                              >
                                <div className="flex gap-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" style={{ animationDelay: '0ms' }} />
                                  <div className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" style={{ animationDelay: '200ms' }} />
                                  <div className="h-1.5 w-1.5 rounded-full bg-accent-light animate-pulse" style={{ animationDelay: '400ms' }} />
                                </div>
                                Running...
                              </motion.span>
                            )}
                            {isDone && stageResult && (
                              <motion.span
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-xs font-mono ${stageResult.passed ? 'text-zinc-300' : 'text-signal-red/80'}`}
                              >
                                {stageResult.detail}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {!result && !verifying && <EmptyState />}

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.98 }}
                    transition={{ duration: 0.5 }}
                    aria-live="polite"
                    className="relative"
                  >
                    {result.valid && <SparkleEffect />}
                    <div className={`rounded-xl border p-6 relative z-10 ${
                      result.valid
                        ? 'border-signal-green/20 bg-gradient-to-br from-signal-green/[0.04] to-transparent'
                        : 'border-signal-red/20 bg-gradient-to-br from-signal-red/[0.04] to-transparent'
                    }`}>
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${result.valid ? 'bg-signal-green/10' : 'bg-signal-red/10'}`}
                          >
                            {result.valid
                              ? <CheckCheck className="h-6 w-6 text-signal-green" />
                              : <XCircle className="h-6 w-6 text-signal-red" />
                            }
                          </motion.div>
                          <div>
                            <div className={`text-base font-semibold ${result.valid ? 'text-signal-green' : 'text-signal-red'}`}>
                              {result.valid ? 'Deliverable' : 'Undeliverable / Risky'}
                              {result.valid && <Sparkles className="h-4 w-4 inline ml-1.5 text-signal-green/60" />}
                            </div>
                            <div className="text-sm text-zinc-400 font-mono">{result.email}</div>
                          </div>
                        </div>
                        <div className={`rounded-xl px-4 py-3 text-center border ${result.valid ? 'border-signal-green/15 bg-signal-green/[0.04]' : 'border-signal-red/15 bg-signal-red/[0.04]'}`}>
                          <div className={`text-xl font-light tracking-tight ${result.valid ? 'text-signal-green' : 'text-signal-red'}`}>{result.confidence}%</div>
                          <div className="text-xs text-zinc-500 mt-1">Confidence</div>
                        </div>
                      </div>

                      <motion.div
                        className="grid grid-cols-4 gap-3 mb-5"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: {},
                          show: { transition: { staggerChildren: 0.08 } },
                        }}
                      >
                        {statItems.map((stat) => (
                          <motion.div
                            key={stat.label}
                            variants={{
                              hidden: { opacity: 0, y: 12 },
                              show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                            }}
                            className="rounded-xl bg-black/50 border border-zinc-800/40 px-3 py-3 text-center"
                          >
                            <stat.icon className="h-4 w-4 mx-auto mb-1.5 text-zinc-600" />
                            <div className={`text-sm font-mono font-medium ${stat.color}`}>{stat.value}</div>
                            <div className="text-[10px] text-zinc-500 mt-0.5">{stat.label}</div>
                          </motion.div>
                        ))}
                      </motion.div>

                      {result.flags.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="space-y-1.5 mb-4"
                        >
                          <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-2">Flags</div>
                          {result.flags.map((flag, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className={`h-4 w-4 shrink-0 ${flag.includes('SPAM') || flag.includes('trap') ? 'text-signal-red' : 'text-signal-amber'}`} />
                              <span className={flag.includes('SPAM') || flag.includes('trap') ? 'text-signal-red/80' : 'text-signal-amber/80'}>{flag}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => runVerification(email)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-700/40 bg-black/35 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:border-accent/25 hover:bg-accent/[0.06] transition-all focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                        aria-label="Re-check email"
                      >
                        <RefreshCw className="h-4 w-4" /> Re-check
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-4 text-[10px] text-zinc-600 font-mono text-center">Simulation for demo. Results may vary with production data.</div>
        </motion.div>
      </div>
    </section>
  );
}
