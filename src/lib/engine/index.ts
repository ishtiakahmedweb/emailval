export { verify } from './pipeline';
export { validateSyntax } from './syntax';
export { checkDns } from './dns';
export { checkDisposable } from './disposable';
export type {
  VerificationResult,
  VerificationState,
  SyntaxResult,
  DnsResult,
  DisposableResult,
  SpamTrapStageResult,
  RoleBasedStageResult,
} from './types';
