// Server-side email helper using Resend.
// Safe: if RESEND_API_KEY is not configured, it silently skips (form still works).

function splitName(full = '') {
  const parts = String(full).trim().split(/\s+/)
  const nome = parts.shift() || ''
  const cognome = parts.join(' ')
  return { nome, cognome }
}

function nowRome() {
  try {
    return new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(new Date())
  } catch {
    return new Date().toLocaleString('it-IT')
  }
}

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function emailConfigured() {
  return !!process.env.RESEND_API_KEY
}

/**
 * Sends a notification email for a form submission.
 * @param {Object} p
 * @param {'booking'|'contact'} p.type
 */
export async function sendRequestEmail(p) {
  if (!process.env.RESEND_API_KEY) return { skipped: true }

  const from = process.env.RESEND_FROM_EMAIL || 'Sito Dott.ssa Giulia Flori <onboarding@resend.dev>'
  const to = process.env.CONTACT_RECIPIENT_EMAIL || 'giuliaflori.1093@gmail.com'

  const { nome, cognome } = splitName(p.name)
  const when = nowRome()
  const subject = p.type === 'booking'
    ? 'Nuova richiesta di primo colloquio'
    : 'Nuovo messaggio dal sito (modulo contatti)'

  const rows = [
    ['Nome', nome],
    ['Cognome', cognome || '—'],
    ['Email', p.email],
    ['Telefono', p.phone || '—'],
    ['Modalità del colloquio', p.modality || '—'],
    p.service ? ['Servizio', p.service] : null,
    (p.date || p.time) ? ['Data/orario richiesti', `${p.date || ''} ${p.time || ''}`.trim()] : null,
    ['Messaggio', p.message || '—'],
    ['Richiesta inviata il', when],
  ].filter(Boolean)

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n')

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2E3A33">
    <div style="background:#7C9B73;color:#fff;padding:20px 24px;border-radius:16px 16px 0 0">
      <h2 style="margin:0;font-size:18px">${esc(subject)}</h2>
    </div>
    <div style="border:1px solid #e3e9e0;border-top:none;border-radius:0 0 16px 16px;padding:20px 24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows.map(([k, v]) => `
          <tr>
            <td style="padding:8px 0;color:#707070;width:180px;vertical-align:top">${esc(k)}</td>
            <td style="padding:8px 0;color:#2E3A33;font-weight:500">${esc(v).replace(/\n/g, '<br/>')}</td>
          </tr>`).join('')}
      </table>
    </div>
    <p style="font-size:12px;color:#9aa39a;text-align:center;margin-top:12px">
      Email automatica inviata dal sito web della Dott.ssa Giulia Flori.
    </p>
  </div>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: p.email || undefined,
      subject,
      html,
      text,
    }),
  })

  if (!res.ok) {
    let detail = ''
    try { const j = await res.json(); detail = j?.message || j?.error || JSON.stringify(j) } catch { detail = await res.text() }
    throw new Error(`Resend ${res.status}: ${detail}`)
  }
  const data = await res.json()
  return { id: data?.id }
}
