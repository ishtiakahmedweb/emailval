'use client';

import { SpecNav } from '@/components/marketing/spec-nav';
import { SpecFooter } from '@/components/marketing/spec-footer';

const codeExamples = {
  curl: `curl -X POST https://api.veriflow.app/v1/verify \\
  -H "Authorization: Bearer vf_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com"}'`,

  node: `import { Veriflow } from 'veriflow-sdk';

const vf = new Veriflow({ apiKey: 'vf_your_api_key_here' });

const result = await vf.verify('user@example.com');
console.log(result.state); // 'deliverable' | 'risky' | 'undeliverable' | 'unknown'
console.log(result.qualityScore); // 0-100`,

  python: `from veriflow import Veriflow

vf = Veriflow(api_key='vf_your_api_key_here')

result = vf.verify('user@example.com')
print(result.state)
print(result.quality_score)`,

  response: `{
  "email": "user@example.com",
  "state": "deliverable",
  "qualityScore": 87,
  "latencyMs": 45,
  "didYouMean": null,
  "stages": {
    "syntax": { "pass": true, "normalizedEmail": "user@example.com" },
    "dns": { "pass": true, "hasMxRecord": true, "mxRecords": ["mx.example.com"] },
    "smtp": { "pass": true, "responseCode": 250 },
    "disposable": { "pass": true, "isDisposable": false, "domain": "example.com" },
    "spamTrap": { "pass": true, "isSpamTrap": false },
    "roleBased": { "pass": true, "isRole": false },
    "freeEmail": { "pass": true, "isFreeEmail": false }
  }
}`,
};

export default function DocsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="grain-overlay" />
      <div className="relative z-10">
        <SpecNav />
        <section className="px-6 pb-32 pt-28">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight">API Documentation</h1>
            <p className="mt-2 text-lg text-muted-foreground">Integrate email verification into your application.</p>

            <div className="mt-12 space-y-12">
              <Section title="Authentication" id="auth">
                <p className="text-muted-foreground">All API requests require authentication via an API key passed in the <code className="rounded bg-muted px-1.5 py-0.5 text-sm">Authorization</code> header.</p>
                <CodeBlock code={`Authorization: Bearer vf_your_api_key_here`} lang="text" />
                <p className="mt-2 text-sm text-muted-foreground">Get your API key from the <a href="/dashboard/api-keys" className="text-[oklch(0.67_0.16_210)] hover:underline">dashboard</a>.</p>
              </Section>

              <Section title="Verify a Single Email" id="verify">
                <p className="text-muted-foreground">The verification endpoint accepts an email address and returns detailed deliverability analysis.</p>
                <h4 className="mt-4 text-sm font-semibold">Endpoint</h4>
                <CodeBlock code="POST https://api.veriflow.app/v1/verify" lang="text" />
                <h4 className="mt-4 text-sm font-semibold">Example</h4>
                <CodeBlock code={codeExamples.curl} lang="bash" />
                <h4 className="mt-4 text-sm font-semibold">Response</h4>
                <CodeBlock code={codeExamples.response} lang="json" />
              </Section>

              <Section title="Node.js SDK" id="node">
                <CodeBlock code={codeExamples.node} lang="typescript" />
              </Section>

              <Section title="Python SDK" id="python">
                <CodeBlock code={codeExamples.python} lang="python" />
              </Section>

              <Section title="Rate Limits" id="rates">
                <p className="text-muted-foreground">Rate limits are applied per API key.</p>
                <div className="mt-3 overflow-x-auto rounded-lg border border-border/50 bg-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">Plan</th>
                        <th className="px-4 py-2.5 font-medium">Requests per minute</th>
                        <th className="px-4 py-2.5 font-medium">Bulk limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50"><td className="px-4 py-2.5">Free</td><td className="px-4 py-2.5">10</td><td className="px-4 py-2.5">100</td></tr>
                      <tr className="border-b border-border/50"><td className="px-4 py-2.5">Pro</td><td className="px-4 py-2.5">60</td><td className="px-4 py-2.5">10,000</td></tr>
                      <tr className="border-b border-border/50"><td className="px-4 py-2.5">Scale</td><td className="px-4 py-2.5">300</td><td className="px-4 py-2.5">50,000</td></tr>
                      <tr><td className="px-4 py-2.5">Enterprise</td><td className="px-4 py-2.5">Unlimited</td><td className="px-4 py-2.5">500,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </Section>

              <Section title="Webhooks" id="webhooks">
                <p className="text-muted-foreground">Configure webhooks to receive real-time verification results. Webhooks are sent as HTTP POST requests to your endpoint.</p>
                <h4 className="mt-4 text-sm font-semibold">Events</h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li><code className="rounded bg-muted px-1.5 py-0.5">verification.completed</code> — A single email verification finished</li>
                  <li><code className="rounded bg-muted px-1.5 py-0.5">bulk.completed</code> — A bulk verification job finished</li>
                  <li><code className="rounded bg-muted px-1.5 py-0.5">verification.failed</code> — A verification request failed</li>
                </ul>
              </Section>
            </div>
          </div>
        </section>
        <SpecFooter />
      </div>
    </main>
  );
}

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <div id={id}>
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-border/50 bg-card">
      <div className="border-b border-border/50 px-4 py-1.5 text-[11px] text-muted-foreground">{lang}</div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}
