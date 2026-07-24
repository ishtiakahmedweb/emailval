const COMMON_DOMAINS: Record<string, string> = {
  'gmail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmaul.com': 'gmail.com',
  'gmaiil.com': 'gmail.com',
  'yahoo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahho.com': 'yahoo.com',
  'yhaoo.com': 'yahoo.com',
  'ymail.com': 'yahoo.com',
  'hotmail.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'htomail.com': 'hotmail.com',
  'outlook.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'utlook.com': 'outlook.com',
  'aol.com': 'aol.com',
  'aol.co': 'aol.com',
  'icloud.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'iclud.com': 'icloud.com',
  'me.com': 'me.com',
  'protonmail.com': 'protonmail.com',
  'protomail.com': 'protonmail.com',
  'proton.me': 'proton.me',
  'yahoo.co.uk': 'yahoo.co.uk',
  'live.com': 'live.com',
  'msn.com': 'msn.com',
};

const DISTANCE_DOMAINS = Object.keys(COMMON_DOMAINS);

export interface TypoResult {
  pass: boolean;
  didYouMean?: string;
  reason?: string;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function suggestDomainFix(domain: string): TypoResult {
  const lower = domain.toLowerCase().trim();

  if (COMMON_DOMAINS[lower]) {
    return { pass: true };
  }

  const exactMatch = COMMON_DOMAINS[lower];
  if (exactMatch && exactMatch !== lower) {
    return { pass: false, didYouMean: exactMatch, reason: `Did you mean ${exactMatch}?` };
  }

  let bestDist = Infinity;
  let bestDomain: string | null = null;
  let bestTarget: string | null = null;

  for (const known of DISTANCE_DOMAINS) {
    const target = COMMON_DOMAINS[known];
    const dist = levenshtein(lower, known);
    if (dist < bestDist && dist <= 2) {
      bestDist = dist;
      bestDomain = known;
      bestTarget = target;
    }
  }

  if (bestTarget && bestDist <= 2) {
    return { pass: false, didYouMean: bestTarget, reason: `Did you mean ${bestTarget}?` };
  }

  return { pass: true };
}
