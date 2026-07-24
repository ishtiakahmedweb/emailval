import type { SyntaxResult } from './types';

const EMAIL_REGEX = /^(?!\.)(?!.*\.\.)(?!.*\.@)(?!.*@\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const MAX_LOCAL_LENGTH = 64;
const MAX_DOMAIN_LENGTH = 255;
const MAX_EMAIL_LENGTH = 254;

export function validateSyntax(email: string): SyntaxResult {
  if (!email || typeof email !== 'string') {
    return { pass: false, reason: 'Email is empty or not a string' };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return { pass: false, reason: `Email exceeds ${MAX_EMAIL_LENGTH} characters` };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    if (!trimmed.includes('@')) {
      return { pass: false, reason: 'Missing @ symbol' };
    }
    const [local, domain] = trimmed.split('@');
    if (!domain || !domain.includes('.')) {
      return { pass: false, reason: 'Invalid domain format' };
    }
    if (local && local.length > MAX_LOCAL_LENGTH) {
      return { pass: false, reason: `Local part exceeds ${MAX_LOCAL_LENGTH} characters` };
    }
    if (domain && domain.length > MAX_DOMAIN_LENGTH) {
      return { pass: false, reason: `Domain exceeds ${MAX_DOMAIN_LENGTH} characters` };
    }
    return { pass: false, reason: 'Email format is invalid' };
  }

  return { pass: true, normalizedEmail: trimmed };
}
