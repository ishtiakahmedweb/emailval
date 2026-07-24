import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Veriflow — Email Verification API';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          background: '#0a0a0f',
          fontFamily: 'Geist, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#06b6d4',
              color: '#0a0a0f',
              fontWeight: 800,
              fontSize: '28px',
              lineHeight: 1,
            }}
          >
            V
          </div>
          <span
            style={{ color: '#fafafa', fontSize: '28px', fontWeight: 600, letterSpacing: '-0.01em' }}
          >
            Veriflow
          </span>
        </div>

        <h1
          style={{
            color: '#fafafa',
            fontSize: '56px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: 0,
            maxWidth: '760px',
          }}
        >
          Verify email lists
          <br />
          with{' '}
          <span style={{ color: '#10b981' }}>zero bounce risk</span>.
        </h1>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginTop: '40px',
          }}
        >
          <Pill label="Deliverable" color="#10b981" />
          <Pill label="Risky" color="#f59e0b" />
          <Pill label="Undeliverable" color="#ef4444" />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '48px',
            color: '#a1a1aa',
            fontSize: '20px',
            letterSpacing: '-0.01em',
          }}
        >
          <span style={{ borderBottom: '1px solid #27272a', paddingBottom: '2px' }}>
            Sub-200ms Edge Validation
          </span>
          <span style={{ color: '#3f3f46' }}>·</span>
          <span>6-Stage Pipeline</span>
          <span style={{ color: '#3f3f46' }}>·</span>
          <span>Silent SMTP Probe</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 20px',
        borderRadius: '999px',
        border: `1px solid ${color}40`,
        background: `${color}15`,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" style={{ borderRadius: '50%' }}>
        <circle cx="6" cy="6" r="5" fill={color} />
      </svg>
      <span style={{ color, fontSize: '18px', fontWeight: 500 }}>{label}</span>
    </div>
  );
}
