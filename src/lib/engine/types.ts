export type VerificationState = 'deliverable' | 'risky' | 'undeliverable' | 'unknown';

export interface StageResult {
  pass: boolean;
  reason?: string;
}

export interface SyntaxResult extends StageResult {
  normalizedEmail?: string;
}

export interface DnsResult {
  pass: boolean;
  reason?: string;
  mxRecords?: string[];
  smtpProvider?: string;
  hasMxRecord: boolean;
  hasARecord: boolean;
}

export interface DisposableResult extends StageResult {
  isDisposable: boolean;
  domain: string;
}

export interface SpamTrapStageResult extends StageResult {
  isSpamTrap: boolean;
}

export interface RoleBasedStageResult extends StageResult {
  isRole: boolean;
  roleType?: string;
}

export interface SmtpResult extends StageResult {
  responseCode?: number;
  responseMessage?: string;
  isCatchAll?: boolean;
  isGreylisted?: boolean;
  mxHost?: string;
}

export interface FreeEmailResult extends StageResult {
  isFreeEmail: boolean;
  provider?: string;
}

export interface VerificationResult {
  email: string;
  state: VerificationState;
  qualityScore: number;
  stages: {
    syntax: SyntaxResult;
    dns: DnsResult;
    disposable: DisposableResult;
    smtp?: SmtpResult;
    spamTrap?: SpamTrapStageResult;
    roleBased?: RoleBasedStageResult;
    freeEmail?: FreeEmailResult;
  };
  didYouMean?: string;
  latencyMs: number;
}
