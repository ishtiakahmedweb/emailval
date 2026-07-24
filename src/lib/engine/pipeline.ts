import { validateSyntax } from './syntax';
import { checkDns } from './dns';
import { checkDisposable } from './disposable';
import { checkSmtp } from './smtp';
import { checkFreeEmail } from './free-email';
import { checkSpamTrap, suggestDomainFix, checkRoleBased } from '@/lib/ai';
import type { VerificationResult, VerificationState, DnsResult, DisposableResult } from './types';

function extractDomain(email: string): string {
  const atIndex = email.lastIndexOf('@');
  return atIndex >= 0 ? email.slice(atIndex + 1) : '';
}

function extractLocal(email: string): string {
  const atIndex = email.lastIndexOf('@');
  return atIndex >= 0 ? email.slice(0, atIndex) : email;
}

function computeQualityScore(stages: VerificationResult['stages']): number {
  let score = 0;

  if (stages.syntax.pass) score += 5;
  if (stages.dns.hasMxRecord) score += 15;
  else if (stages.dns.hasARecord) score += 5;
  if (stages.disposable.pass) score += 10;
  if (stages.spamTrap && !stages.spamTrap.isSpamTrap) score += 10;
  if (stages.roleBased && !stages.roleBased.isRole) score += 5;
  if (stages.freeEmail && !stages.freeEmail.isFreeEmail) score += 5;

  if (stages.smtp) {
    if (stages.smtp.pass && stages.smtp.responseCode === 250) {
      score += 50;
    } else if (stages.smtp.isGreylisted) {
      score += 30;
    }
  }

  return Math.min(score, 100);
}

function determineState(result: VerificationResult): VerificationState {
  const { syntax, dns, disposable, spamTrap, roleBased, smtp } = result.stages;

  if (!syntax.pass) {
    return 'undeliverable';
  }

  if (spamTrap?.isSpamTrap) {
    return 'undeliverable';
  }

  if (disposable.isDisposable) {
    return 'risky';
  }

  if (!dns.pass) {
    return 'undeliverable';
  }

  if (smtp) {
    if (smtp.pass && smtp.responseCode === 250) {
      if (smtp.isCatchAll === true && roleBased?.isRole) {
        return 'risky';
      }
      if (smtp.isCatchAll === true) {
        return 'risky';
      }
      return 'deliverable';
    }
    if (smtp.isGreylisted) {
      return 'risky';
    }
    if (smtp.responseCode && smtp.responseCode >= 500) {
      return 'undeliverable';
    }
    if (!smtp.pass && smtp.reason) {
      return 'risky';
    }
  }

  if (roleBased?.isRole) {
    return 'risky';
  }

  if (dns.hasMxRecord && dns.pass) {
    return 'deliverable';
  }

  return 'unknown';
}

export async function verify(
  email: string,
): Promise<VerificationResult> {
  const startTime = performance.now();

  const emailStr = String(email).trim();

  const syntaxResult = validateSyntax(emailStr);

  let dnsResult: DnsResult = { pass: false, hasMxRecord: false, hasARecord: false, reason: 'Skipped due to invalid syntax' };
  let disposableResult: DisposableResult = { pass: true, isDisposable: false, domain: '' };
  let smtpResult = undefined as VerificationResult['stages']['smtp'];
  let spamTrapResult = undefined as VerificationResult['stages']['spamTrap'];
  let roleBasedResult = undefined as VerificationResult['stages']['roleBased'];
  let freeEmailResult = undefined as VerificationResult['stages']['freeEmail'];
  let didYouMean: string | undefined;

  if (syntaxResult.pass && syntaxResult.normalizedEmail) {
    const local = extractLocal(syntaxResult.normalizedEmail);
    const domain = extractDomain(syntaxResult.normalizedEmail);

    disposableResult = checkDisposable(domain);
    dnsResult = await checkDns(domain);
    freeEmailResult = checkFreeEmail(domain);

    if (dnsResult.pass && dnsResult.mxRecords && dnsResult.mxRecords.length > 0) {
      smtpResult = await checkSmtp(domain, syntaxResult.normalizedEmail, dnsResult.mxRecords);
    }

    spamTrapResult = checkSpamTrap(syntaxResult.normalizedEmail);
    roleBasedResult = checkRoleBased(local);

    const typoCheck = suggestDomainFix(domain);
    if (!typoCheck.pass && typoCheck.didYouMean) {
      didYouMean = typoCheck.didYouMean;
    }
  }

  const stages = {
    syntax: syntaxResult,
    dns: dnsResult,
    disposable: disposableResult,
    smtp: smtpResult,
    spamTrap: spamTrapResult,
    roleBased: roleBasedResult,
    freeEmail: freeEmailResult,
  };

  const result: VerificationResult = {
    email: emailStr,
    state: 'unknown',
    qualityScore: 0,
    stages,
    didYouMean,
    latencyMs: Math.round(performance.now() - startTime),
  };

  result.state = determineState(result);
  result.qualityScore = computeQualityScore(result.stages);

  return result;
}
