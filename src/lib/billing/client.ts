export async function redirectToCheckout(opts: {
  mode: 'subscription' | 'payment';
  priceId?: string;
  creditPackId?: string;
}) {
  try {
    const res = await fetch('/api/v1/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opts),
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error ?? 'Failed to create checkout session');
    }
  } catch (err) {
    throw err;
  }
}

export async function openPortal() {
  try {
    const res = await fetch('/api/v1/billing/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok && data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error ?? 'Failed to open portal');
    }
  } catch (err) {
    throw err;
  }
}
