export function PrismaticRibbon({ className = '' }: { className?: string }) {
  return (
    <div className={`prism-ribbon h-px w-full ${className}`} />
  );
}

export function PrismaticOrb({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-full ${className}`}
      style={{
        background: 'radial-gradient(circle, rgba(34,211,238,0.15) 0%, rgba(217,70,239,0.1) 40%, rgba(251,191,36,0.05) 70%, transparent 100%)',
      }}
    />
  );
}
