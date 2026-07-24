import * as dns from 'dns/promises';
import type { DnsResult } from './types';

const SMTP_PROVIDERS: Record<string, string> = {
  'aspmx.l.google.com': 'Google',
  'alt1.aspmx.l.google.com': 'Google',
  'alt2.aspmx.l.google.com': 'Google',
  'alt3.aspmx.l.google.com': 'Google',
  'alt4.aspmx.l.google.com': 'Google',
  'mail.protection.outlook.com': 'Microsoft',
  'outlook.com': 'Microsoft',
  'mx1.hotmail.com': 'Microsoft',
  'mx2.hotmail.com': 'Microsoft',
  'mx0b-00181b01.pphosted.com': 'Microsoft',
  'mxa-00181b01.gslb.pphosted.com': 'Microsoft',
};

export function identifySmtpProvider(mxRecords: string[]): string | undefined {
  for (const mx of mxRecords) {
    for (const [pattern, provider] of Object.entries(SMTP_PROVIDERS)) {
      if (mx.toLowerCase().includes(pattern)) {
        return provider;
      }
    }
  }
  return undefined;
}

export async function checkDns(domain: string): Promise<DnsResult> {
  try {
    let mxRecords: string[] = [];
    let hasMxRecord = false;
    let hasARecord = false;

    try {
      const mxData = await dns.resolveMx(domain);
      mxRecords = mxData
        .sort((a, b) => a.priority - b.priority)
        .map((mx) => mx.exchange);
      hasMxRecord = mxRecords.length > 0;
    } catch {
      hasMxRecord = false;
    }

    try {
      const aRecords = await dns.resolve4(domain);
      hasARecord = aRecords.length > 0;
    } catch {
      try {
        const aaaaRecords = await dns.resolve6(domain);
        hasARecord = aaaaRecords.length > 0;
      } catch {
        hasARecord = false;
      }
    }

    if (!hasMxRecord && !hasARecord) {
      return {
        pass: false,
        hasMxRecord: false,
        hasARecord: false,
        reason: 'Domain has no MX or A records',
      };
    }

    const smtpProvider = identifySmtpProvider(mxRecords);

    return {
      pass: true,
      mxRecords,
      smtpProvider,
      hasMxRecord,
      hasARecord,
    };
  } catch (error) {
    return {
      pass: false,
      hasMxRecord: false,
      hasARecord: false,
      reason: `DNS lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
