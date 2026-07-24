import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const CREDIT_PACKS = [
  { id: 'credit_1k',  credits: 1_000,  price: 500,   label: '1,000 credits',  desc: '$5 one-time' },
  { id: 'credit_10k', credits: 10_000, price: 4_500,  label: '10,000 credits', desc: '$45 one-time' },
  { id: 'credit_50k', credits: 50_000, price: 19_900, label: '50,000 credits', desc: '$199 one-time' },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]['id'];

export function getCreditPack(id: string) {
  return CREDIT_PACKS.find((p) => p.id === id);
}
