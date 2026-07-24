import net from 'net';
import type { SmtpResult } from './types';

const CONNECT_TIMEOUT = 8000;
const RESPONSE_TIMEOUT = 6000;
const MAX_CONCURRENT_PER_DOMAIN = 10;

const activeConnections = new Map<string, number>();

const KNOWN_CATCH_ALL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com',
  'live.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de',
  'icloud.com', 'me.com', 'protonmail.com', 'proton.me',
  'aol.com', 'zoho.com', 'mail.com', 'gmx.com', 'gmx.net',
  'yandex.com', 'fastmail.com', 'tutanota.com',
]);

function getConnectionCount(domain: string): number {
  if (!domain) return 0;
  const key = domain.toLowerCase();
  return activeConnections.get(key) ?? 0;
}

function incrementConnectionCount(domain: string) {
  const key = domain.toLowerCase();
  activeConnections.set(key, (activeConnections.get(key) ?? 0) + 1);
}

function decrementConnectionCount(domain: string) {
  const key = domain.toLowerCase();
  const count = (activeConnections.get(key) ?? 1) - 1;
  if (count <= 0) {
    activeConnections.delete(key);
  } else {
    activeConnections.set(key, count);
  }
}

async function waitForSlot(domain: string): Promise<void> {
  while (getConnectionCount(domain) >= MAX_CONCURRENT_PER_DOMAIN) {
    await new Promise((r) => setTimeout(r, 200));
  }
}

function isMultiLineResponse(data: string): boolean {
  const lines = data.trim().split('\r\n');
  for (const line of lines) {
    if (line.length >= 4 && line[3] === ' ') continue;
    if (line.length >= 4 && line[3] === '-') continue;
    return false;
  }
  return true;
}

function parseResponseCode(data: string): number | null {
  const match = data.match(/^(\d{3})/);
  return match ? parseInt(match[1], 10) : null;
}

function isContinuation(line: string): boolean {
  return line.length >= 4 && line[3] === '-';
}

function readCode(data: string): number | null {
  const lines = data.trim().split('\r\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) continue;
    const code = parseInt(line.substring(0, 3), 10);
    if (!isNaN(code) && line.length >= 4 && line[3] === ' ') {
      return code;
    }
  }
  return null;
}

function readLastLine(data: string): string {
  const lines = data.trim().split('\r\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.length >= 4 && line[3] === ' ') {
      return line.substring(4).trim();
    }
  }
  return lines[lines.length - 1]?.trim() ?? '';
}

function smtpHandshake(
  mxHost: string,
  mailFrom: string,
  rcptTo: string,
): Promise<SmtpResult> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let expired = false;
    let step: 'banner' | 'ehlo' | 'mail_from' | 'rcpt_to' | 'done' = 'banner';
    let buffer = '';

    const cleanup = () => {
      expired = true;
      socket.removeAllListeners();
      if (socket.writable) {
        socket.end();
      }
      socket.destroy();
    };

    const onData = (data: Buffer) => {
      if (expired) return;
      buffer += data.toString();

      const code = readCode(buffer);
      if (code === null) return;

      const message = readLastLine(buffer);

      switch (step) {
        case 'banner':
          if (code === 220) {
            step = 'ehlo';
            socket.write(`EHLO veriflow.app\r\n`);
            buffer = '';
          } else {
            cleanup();
            resolve({ pass: false, reason: `Unexpected banner: ${code} ${message}`, responseCode: code, mxHost });
          }
          break;

        case 'ehlo':
          if (code === 250) {
            step = 'mail_from';
            socket.write(`MAIL FROM:<${mailFrom}>\r\n`);
            buffer = '';
          } else {
            cleanup();
            resolve({ pass: false, reason: `EHLO rejected: ${code} ${message}`, responseCode: code, mxHost });
          }
          break;

        case 'mail_from':
          if (code === 250 || code === 251) {
            step = 'rcpt_to';
            socket.write(`RCPT TO:<${rcptTo}>\r\n`);
            buffer = '';
          } else {
            cleanup();
            resolve({ pass: false, reason: `MAIL FROM rejected: ${code} ${message}`, responseCode: code, mxHost });
          }
          break;

        case 'rcpt_to':
          step = 'done';
          cleanup();
          if (code === 250) {
            resolve({ pass: true, responseCode: code, responseMessage: message, mxHost });
          } else if (code >= 450 && code <= 452) {
            resolve({
              pass: true,
              isGreylisted: true,
              responseCode: code,
              responseMessage: message,
              mxHost,
            });
          } else if (code >= 500 && code <= 599) {
            resolve({ pass: false, responseCode: code, responseMessage: message, mxHost });
          } else {
            resolve({ pass: false, responseCode: code, responseMessage: message, mxHost });
          }
          break;
      }
    };

    socket.setTimeout(RESPONSE_TIMEOUT);
    socket.on('data', onData);

    socket.on('timeout', () => {
      if (expired) return;
      cleanup();
      resolve({ pass: false, reason: `SMTP timeout at step: ${step}`, mxHost });
    });

    socket.on('error', (err) => {
      if (expired) return;
      cleanup();
      resolve({ pass: false, reason: `Connection error: ${err.message}`, mxHost });
    });

    socket.on('close', () => {
      if (!expired && step !== 'done') {
        cleanup();
        resolve({ pass: false, reason: `Connection closed unexpectedly at step: ${step}`, mxHost });
      }
    });

    socket.connect(25, mxHost, () => {
      if (expired) return;
    });

    setTimeout(() => {
      if (!expired) {
        cleanup();
        resolve({ pass: false, reason: 'Overall SMTP timeout', mxHost });
      }
    }, CONNECT_TIMEOUT);
  });
}

async function checkCatchAll(
  mxRecords: string[],
  mailFrom: string,
  domain: string,
): Promise<boolean | undefined> {
  if (KNOWN_CATCH_ALL_DOMAINS.has(domain.toLowerCase())) {
    return false;
  }

  const fakeEmail = `verify-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@${domain}`;

  for (const mx of mxRecords.slice(0, 2)) {
    const result = await smtpHandshake(mx, mailFrom, fakeEmail);
    if (result.responseCode === 250) {
      return true;
    }
    if (result.responseCode && result.responseCode >= 500) {
      return false;
    }
  }
  return undefined;
}

export async function checkSmtp(
  domain: string,
  email: string,
  mxRecords: string[],
): Promise<SmtpResult> {
  const mailFrom = 'verify@veriflow.app';

  if (!mxRecords || mxRecords.length === 0) {
    return { pass: false, reason: 'No MX records available' };
  }

  await waitForSlot(domain);
  incrementConnectionCount(domain);

  try {
    let lastError: SmtpResult | null = null;

    for (const mx of mxRecords.slice(0, 3)) {
      const result = await smtpHandshake(mx, mailFrom, email);
      if (result.pass && result.responseCode === 250) {
        const catchAll = await checkCatchAll(mxRecords, mailFrom, domain);
        decrementConnectionCount(domain);
        return { ...result, isCatchAll: catchAll };
      }
      if (result.isGreylisted) {
        decrementConnectionCount(domain);
        return result;
      }
      if (result.responseCode && result.responseCode >= 500) {
        decrementConnectionCount(domain);
        return result;
      }
      lastError = result;
    }

    decrementConnectionCount(domain);
    return lastError ?? { pass: false, reason: 'All MX servers rejected or unreachable', mxHost: undefined };
  } catch (err) {
    decrementConnectionCount(domain);
    return { pass: false, reason: err instanceof Error ? err.message : 'SMTP check failed' };
  }
}

export function isKnownCatchAllDomain(domain: string): boolean {
  return KNOWN_CATCH_ALL_DOMAINS.has(domain.toLowerCase());
}

export function resetConnectionCounters() {
  activeConnections.clear();
}
