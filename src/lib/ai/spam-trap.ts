const KNOWN_SPAM_TRAPS = new Set([
  'spamtrap@mailinator.com',
  'abuse@spamtrap.net',
  'nobody@spamtraporg',
  'test@spamtraporg',
  'mailtest@spamtraporg',
  'sexy@spamtraporg',
  'spam@uce.gov',
  'spam@ftc.gov',
  'spam@spamcop.net',
  'blackhole@mailinator.com',
  'trap@mailinator.com',
  'honeypot@mailinator.com',
]);

const TRAP_PATTERNS = [
  /^spam.?trap/i,
  /^honeypot/i,
  /^blackhole/i,
  /^mailtest/i,
  /^test\.?spam/i,
  /^nobody\d*@/i,
  /^abuse\d*@/i,
  /^returned\b/i,
  /^bounce\b.*@/i,
];

export interface SpamTrapResult {
  pass: boolean;
  isSpamTrap: boolean;
  reason?: string;
}

export function checkSpamTrap(email: string): SpamTrapResult {
  const lower = email.toLowerCase().trim();

  if (KNOWN_SPAM_TRAPS.has(lower)) {
    return { pass: false, isSpamTrap: true, reason: 'Known spam trap address' };
  }

  const patternMatch = TRAP_PATTERNS.some((p) => p.test(lower));
  if (patternMatch) {
    return { pass: false, isSpamTrap: true, reason: 'Address matches spam trap pattern' };
  }

  return { pass: true, isSpamTrap: false };
}
