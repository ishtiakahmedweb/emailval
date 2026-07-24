import type { DisposableResult } from './types';

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.org',
  'guerrillamail.net', 'temp-mail.org', '10minutemail.com',
  '10minutemail.org', 'yopmail.com', 'throwaway.email',
  'trashmail.com', 'trashmail.org', 'trashmail.net',
  'sharklasers.com', 'maildrop.cc', 'getairmail.com',
  'tempinbox.com', 'tempmail.com', 'tempmail.org',
  'tempemail.co', 'mailnator.com', 'mailinator.net',
  'mailinator.org', 'mailinator2.com', 'mailexpire.com',
  'spamgourmet.com', 'spamgourmet.org', 'spamgourmet.net',
  'spambox.us', 'spambox.info', 'spambox.org',
  'discard.email', 'discardmail.com', 'discardmail.org',
  'minutemail.com', 'minutemail.org', 'minutemail.net',
  'mintemail.com', 'moburl.com', 'mytrashmail.com',
  'mt2009.com', 'mx0.com', 'my10minutemail.com',
  'mailmetrash.com', 'mailmetrash.org', 'mailmoat.com',
  'mailcatch.com', 'maileater.com', 'mailexpire.com',
  'mailfreeonline.com', 'mailin8r.com', 'mailinatar.com',
  'mailinator.co.uk', 'mailinator.com', 'mailinator.info',
  'mailinator.org', 'mailinator.us', 'mailinator2.com',
  'mailnator.com', 'mailnull.com', 'mailsac.com',
  'mailsiphon.com', 'mailslapping.com', 'mailzilla.com',
  'mailzilla.org', 'mailzilla.net', 'momentmail.com',
  'nospam.ze.tc', 'nowmymail.com', 'oneoffemail.com',
  'oneoffmail.com', 'nospamfor.us', 'nospammail.net',
  'spamavert.com', 'spamfree24.com', 'spamfree24.de',
  'spamfree24.eu', 'spamfree24.info', 'spamfree24.net',
  'spamfree24.org', 'spamgoes.in', 'spamherelots.com',
  'spamherethrow.com', 'spamhole.com', 'spamify.com',
  'spaminator.de', 'spamkill.info', 'spaml.com',
  'spamlot.net', 'spamoff.xyz', 'spamspot.com',
  'spamthis.co.uk', 'spamtrail.com', 'spamtroll.net',
  'thankyou2010.com', 'thismail.net', 'thisurl.com',
  'throwaway.email', 'throwaway.org', 'throwaway.xyz',
  'tmpeml.com', 'tmpeml.info', 'trash2009.com',
  'trashdevil.com', 'trashdevil.de', 'trashemail.de',
  'trashmail.at', 'trashmail.com', 'trashmail.de',
  'trashmail.me', 'trashmail.net', 'trashmail.org',
  'trashmail.ws', 'trashmailer.com', 'trashymail.com',
  'trashymail.net', 'tyldd.com', 'uggsrock.com',
  'wegwerfmail.de', 'wegwerfmail.net', 'wegwerfmail.org',
  'wh4f.org', 'whyspam.me', 'willselfdestruct.com',
  'winemaven.info', 'wronghead.com', 'wuzup.net',
  'xagloo.com', 'xemaps.com', 'xents.com', 'xmaily.com',
  'xoxy.net', 'yep.it', 'yogamaven.com', 'yopmail.com',
  'yopmail.fr', 'yopmail.net', 'ypmail.webarnak.fr.eu.org',
  'zehnminutenmail.de', 'zippymail.info', 'zoaxe.com',
  'zoemail.org', 'temp-mail.org', 'tempmail.net',
  'tempmailo.com', 'fakemail.com', 'fakemail.net',
  'fakemail.org', 'fakemailgenerator.com', 'fakemailgenerator.net',
  'emailfake.com', 'emailfake.net', 'emailfake.org',
  'emailfake.ml', 'emailfake.ga', 'emailfake.gq',
  'mailnator.com', 'mailinator.net', 'mailinator.org',
  'mailinator.info', 'mailinator.us', 'mailinator.co.uk',
  'incognitomail.com', 'incognitomail.net', 'incognitomail.org',
  '20minutemail.com', '20minutemail.org', '20minutemail.net',
  '30minutemail.com', '30minutemail.org', '30minutemail.net',
  '60minutemail.com', '60minutemail.org', '60minutemail.net',
]);

const DISPOSABLE_PATTERNS = [
  /^temp-?mail/i,
  /^dispos?o?b?l?e/i,
  /^throw.?away/i,
  /^trash.?mail/i,
  /^junk.?mail/i,
  /^fake.?mail/i,
  /^10.?minut/i,
  /^guerrilla/i,
];

export function checkDisposable(domain: string): DisposableResult {
  const lowerDomain = domain.toLowerCase();

  const exactMatch = DISPOSABLE_DOMAINS.has(lowerDomain);
  const patternMatch = DISPOSABLE_PATTERNS.some((pattern) => pattern.test(lowerDomain));

  return {
    pass: !exactMatch && !patternMatch,
    isDisposable: exactMatch || patternMatch,
    domain: lowerDomain,
  };
}
