import { SpecNav } from '@/components/marketing/spec-nav';
import { SpecHero } from '@/components/marketing/spec-hero';
import { SpecHowItWorks } from '@/components/marketing/spec-how-it-works';
import { SpecBenefits } from '@/components/marketing/spec-benefits';
import { SpecFeatureGrid } from '@/components/marketing/spec-feature-grid';
import { SpecScrollFeatures } from '@/components/marketing/spec-scroll-features';
import { SpecInteractiveDemo } from '@/components/marketing/spec-interactive-demo';
import { SpecPricing } from '@/components/marketing/spec-pricing';
import { SpecReviews } from '@/components/marketing/spec-reviews';
import { SpecFaq } from '@/components/marketing/spec-faq';
import { SpecCta } from '@/components/marketing/spec-cta';
import { SpecFooter } from '@/components/marketing/spec-footer';

export const metadata = {
  title: 'Veriflow — AI-Powered Email Verification Platform',
  description: 'Industrial-grade email verification. Detect spam traps, fix typos, protect your sender score. 99.7% accuracy, 12ms latency, 50K+ emails/min.',
  openGraph: {
    title: 'Veriflow — AI-Powered Email Verification Platform',
    description: 'Industrial-grade email verification. Detect spam traps, fix typos, protect your sender score.',
    type: 'website',
  },
};

export default function MarketingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-10">
        <SpecNav />
        <SpecHero />
        <SpecHowItWorks />
        <SpecBenefits />
        <SpecFeatureGrid />
        <SpecScrollFeatures />
        <SpecInteractiveDemo />
        <SpecPricing />
        <SpecReviews />
        <SpecFaq />
        <SpecCta />
        <SpecFooter />
      </div>
    </main>
  );
}
