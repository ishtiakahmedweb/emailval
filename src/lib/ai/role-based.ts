const ROLE_PREFIXES = [
  'info', 'admin', 'administrator', 'support', 'sales', 'contact',
  'help', 'enquiries', 'inquiries', 'enquiry', 'inquiry', 'hello',
  'hi', 'marketing', 'pr', 'press', 'media', 'billing', 'accounts',
  'finance', 'payments', 'legal', 'compliance', 'security', 'abuse',
  'postmaster', 'hostmaster', 'webmaster', 'noreply', 'no-reply',
  'donotreply', 'do-not-reply', 'mailer-daemon', 'mailer',
  'team', 'office', 'hr', 'jobs', 'recruitment', 'careers',
  'newsletter', 'news', 'register', 'registration', 'signup',
  'unsubscribe', 'subscribe', 'feedback', 'test', 'testing',
  'dev', 'developer', 'root', 'mail', 'contact-us',
];

export interface RoleBasedResult {
  pass: boolean;
  isRole: boolean;
  roleType?: string;
  reason?: string;
}

export function checkRoleBased(local: string): RoleBasedResult {
  const lower = local.toLowerCase().trim();

  for (const prefix of ROLE_PREFIXES) {
    const exact = lower === prefix;
    const withPlus = lower.startsWith(prefix + '+');
    const withDash = lower.startsWith(prefix + '-');
    const withDot = lower.startsWith(prefix + '.');
    const withUnderscore = lower.startsWith(prefix + '_');

    if (exact || withPlus || withDash || withDot || withUnderscore) {
      return {
        pass: false,
        isRole: true,
        roleType: prefix,
        reason: `Role-based email (${prefix}@). May cause bounces or low engagement.`,
      };
    }
  }

  return { pass: true, isRole: false };
}
