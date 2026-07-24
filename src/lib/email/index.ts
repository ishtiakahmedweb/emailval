const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'Veriflow <noreply@veriflow.app>';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email send');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('Resend error:', data);
      return { success: false, error: data.message };
    }

    return { success: true, id: data.id };
  } catch (err) {
    console.error('Failed to send email:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export async function sendWelcomeEmail(email: string, name: string, credits: number) {
  const { subject, bodyHtml } = await getTemplate('welcome', {
    name,
    credits: String(credits),
  });
  return sendEmail({ to: email, subject, html: bodyHtml });
}

export async function sendCreditLowEmail(email: string, name: string, credits: number) {
  const { subject, bodyHtml } = await getTemplate('credit_low', {
    name,
    credits: String(credits),
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`,
  });
  return sendEmail({ to: email, subject, html: bodyHtml });
}

export async function sendPaymentReceipt(email: string, name: string, amount: number, credits: number) {
  const { subject, bodyHtml } = await getTemplate('payment_receipt', {
    name,
    amount: String(amount),
    credits: String(credits),
  });
  return sendEmail({ to: email, subject, html: bodyHtml });
}

export async function sendBulkCompleteEmail(email: string, name: string, data: { filename: string; deliverable: number; undeliverable: number; total: number }) {
  const { subject, bodyHtml } = await getTemplate('bulk_complete', {
    name,
    filename: data.filename,
    deliverable: String(data.deliverable),
    undeliverable: String(data.undeliverable),
    total: String(data.total),
  });
  return sendEmail({ to: email, subject, html: bodyHtml });
}

async function getTemplate(key: string, vars: Record<string, string>) {
  try {
    const { createSupabaseAdminClient } = await import('@/lib/supabase/admin');
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase
      .from('email_templates')
      .select('subject, body_html')
      .eq('key', key)
      .single();

    if (data) {
      let subject = data.subject;
      let bodyHtml = data.body_html;
      for (const [k, v] of Object.entries(vars)) {
        subject = subject.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
        bodyHtml = bodyHtml.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
      }
      return { subject, bodyHtml };
    }
  } catch (e) {
    console.error('Failed to load email template:', e);
  }

  const defaults: Record<string, { subject: string; html: string }> = {
    welcome: { subject: 'Welcome to Veriflow!', html: `<h1>Welcome!</h1><p>Hi ${vars.name}, thanks for joining.</p>` },
    credit_low: { subject: 'Your credits are running low', html: `<h1>Low Credits</h1><p>Hi ${vars.name}, you have ${vars.credits} credits left.</p>` },
    payment_receipt: { subject: 'Payment received', html: `<h1>Thanks!</h1><p>Received $${vars.amount}.</p>` },
    bulk_complete: { subject: 'Bulk verification complete', html: `<h1>Done!</h1><p>${vars.deliverable} deliverable, ${vars.undeliverable} undeliverable.</p>` },
  };

  return { subject: defaults[key]?.subject ?? key, bodyHtml: defaults[key]?.html ?? '' };
}
