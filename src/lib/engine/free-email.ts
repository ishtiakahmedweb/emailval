import type { FreeEmailResult } from './types';

const FREE_PROVIDERS: Record<string, string> = {
  'gmail.com': 'Google',
  'googlemail.com': 'Google',
  'outlook.com': 'Microsoft',
  'hotmail.com': 'Microsoft',
  'hotmail.co.uk': 'Microsoft',
  'live.com': 'Microsoft',
  'live.co.uk': 'Microsoft',
  'msn.com': 'Microsoft',
  'yahoo.com': 'Yahoo',
  'yahoo.co.uk': 'Yahoo',
  'yahoo.fr': 'Yahoo',
  'yahoo.de': 'Yahoo',
  'yahoo.in': 'Yahoo',
  'ymail.com': 'Yahoo',
  'rocketmail.com': 'Yahoo',
  'icloud.com': 'Apple',
  'me.com': 'Apple',
  'mac.com': 'Apple',
  'protonmail.com': 'Proton',
  'proton.me': 'Proton',
  'pm.me': 'Proton',
  'aol.com': 'AOL',
  'aim.com': 'AOL',
  'zoho.com': 'Zoho',
  'yandex.com': 'Yandex',
  'yandex.ru': 'Yandex',
  'mail.com': 'Mail.com',
  'gmx.com': 'GMX',
  'gmx.net': 'GMX',
  'gmx.de': 'GMX',
  'fastmail.com': 'Fastmail',
  'fastmail.fm': 'Fastmail',
  'tutanota.com': 'Tuta',
  'tutanota.de': 'Tuta',
  'rediffmail.com': 'Rediffmail',
  'rediffmail.net': 'Rediffmail',
  'cox.net': 'Cox',
  'verizon.net': 'Verizon',
  'att.net': 'AT&T',
  'sbcglobal.net': 'AT&T',
  'bellsouth.net': 'AT&T',
  'earthlink.net': 'EarthLink',
  'comcast.net': 'Comcast',
  'optonline.net': 'Optimum',
};

export function checkFreeEmail(domain: string): FreeEmailResult {
  const lowerDomain = domain.toLowerCase();
  const provider = FREE_PROVIDERS[lowerDomain];

  return {
    pass: !provider,
    isFreeEmail: !!provider,
    provider: provider ?? undefined,
  };
}
