/**
 * Shortcode Processor
 *
 * Converts shortcode syntax in markdown content → styled HTML components.
 * Called BEFORE markdown-to-HTML conversion so shortcodes survive parsing.
 *
 * Available shortcodes:
 *
 *   [key-takeaways]
 *   - Point one
 *   - Point two
 *   [/key-takeaways]
 *
 *   [pro-tip title="Optional title"]
 *   Your tip text here.
 *   [/pro-tip]
 *
 *   [warning title="Optional title"]
 *   Important caution for the reader.
 *   [/warning]
 *
 *   [quick-verdict]
 *   Our expert verdict text.
 *   [/quick-verdict]
 *
 *   [stats]
 *   Repo Rate | 6.50% | success
 *   Inflation | 5.1% | warning
 *   GDP Growth | 6.8% | info
 *   [/stats]
 *
 *   [comparison-card title="Product A"]
 *   - Feature one
 *   - Feature two
 *   [/comparison-card]
 *
 *   [fact-box source="RBI, 2025"]
 *   Key fact or statistic goes here.
 *   [/fact-box]
 *
 *   [expert-quote name="CA Priya Sharma" role="Certified Financial Planner"]
 *   Quote text goes here.
 *   [/expert-quote]
 */

/** Pre-process markdown: expand all shortcodes to HTML before md→HTML conversion */
export function processShortcodes(markdown: string): string {
  let out = markdown

  // ── [key-takeaways] ───────────────────────────────────────────────────────
  out = out.replace(/\[key-takeaways\]([\s\S]*?)\[\/key-takeaways\]/gi, (_m, body) => {
    const items = body
      .split('\n')
      .map((l: string) => l.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean)
      .map((item: string) => `<li>${item}</li>`)
      .join('\n')
    return `<div class="key-takeaways"><h3>📌 Key Takeaways</h3><ul>${items}</ul></div>`
  })

  // ── [pro-tip] ─────────────────────────────────────────────────────────────
  out = out.replace(/\[pro-tip(?:\s+title="([^"]*)")?\]([\s\S]*?)\[\/pro-tip\]/gi, (_m, title, body) => {
    return `<div class="pro-tip"><h4>💡 ${title || 'Pro Tip'}</h4><p>${body.trim()}</p></div>`
  })

  // ── [warning] ─────────────────────────────────────────────────────────────
  out = out.replace(/\[warning(?:\s+title="([^"]*)")?\]([\s\S]*?)\[\/warning\]/gi, (_m, title, body) => {
    return `<div class="warning-box"><h4>⚠️ ${title || 'Important'}</h4><p>${body.trim()}</p></div>`
  })

  // ── [quick-verdict] ───────────────────────────────────────────────────────
  out = out.replace(/\[quick-verdict\]([\s\S]*?)\[\/quick-verdict\]/gi, (_m, body) => {
    return `<div class="quick-verdict"><strong>⚡ Quick Verdict</strong><p>${body.trim()}</p></div>`
  })

  // ── [fact-box] ────────────────────────────────────────────────────────────
  out = out.replace(/\[fact-box(?:\s+source="([^"]*)")?\]([\s\S]*?)\[\/fact-box\]/gi, (_m, source, body) => {
    const sourceTag = source ? `<span class="badge badge-info">${source}</span>` : ''
    return `<div class="pro-tip"><h4>📊 Did You Know? ${sourceTag}</h4><p>${body.trim()}</p></div>`
  })

  // ── [expert-quote] ────────────────────────────────────────────────────────
  out = out.replace(
    /\[expert-quote(?:\s+name="([^"]*)")?(?:\s+role="([^"]*)")?\]([\s\S]*?)\[\/expert-quote\]/gi,
    (_m, name, role, body) => {
      const attribution = name
        ? `<cite><strong>${name}</strong>${role ? `, ${role}` : ''}</cite>`
        : ''
      return `<blockquote><p>${body.trim()}</p>${attribution}</blockquote>`
    }
  )

  // ── [stats] — metric data table ───────────────────────────────────────────
  // Format per line: Label | Value | color (success/info/warning/danger)
  out = out.replace(/\[stats\]([\s\S]*?)\[\/stats\]/gi, (_m, body) => {
    const rows = body
      .split('\n')
      .map((l: string) => l.trim())
      .filter(Boolean)
      .map((line: string) => {
        const parts = line.split('|').map((s: string) => s.trim())
        const [label = '', value = '', color = 'success'] = parts
        return `
          <div class="metric-card">
            <div class="metric-label">${label}</div>
            <div class="metric-value" style="color:var(--color-${color})">${value}</div>
          </div>`
      })
      .join('\n')
    return `<div class="metrics-grid">${rows}</div>`
  })

  // ── [comparison-grid] container ──────────────────────────────────────────
  out = out.replace(/\[comparison-grid\]([\s\S]*?)\[\/comparison-grid\]/gi, (_m, body) => {
    return `<div class="comparison-grid">${body.trim()}</div>`
  })

  // ── [comparison-card] ────────────────────────────────────────────────────
  out = out.replace(
    /\[comparison-card(?:\s+title="([^"]*)")?\]([\s\S]*?)\[\/comparison-card\]/gi,
    (_m, title, body) => {
      const items = body
        .split('\n')
        .map((l: string) => l.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean)
        .map((item: string) => `<li>${item}</li>`)
        .join('\n')
      return `<div class="comparison-card"><h4>${title || 'Option'}</h4><ul>${items}</ul></div>`
    }
  )

  // ── [allocation] — portfolio allocation display ──────────────────────────
  // Format per line: Asset Class | Percentage | bar-width
  out = out.replace(/\[allocation(?:\s+title="([^"]*)")?\]([\s\S]*?)\[\/allocation\]/gi, (_m, title, body) => {
    const items = body
      .split('\n')
      .map((l: string) => l.trim())
      .filter(Boolean)
      .map((line: string) => {
        const parts = line.split('|').map((s: string) => s.trim())
        const [label = '', value = '', barWidth = '50'] = parts
        return `
          <div class="allocation-item">
            <span class="item-label">${label}</span>
            <span class="item-value">${value}</span>
          </div>`
      })
      .join('\n')

    const titleHTML = title ? `<h4>${title}</h4>` : ''
    return `<div class="allocation-container">${titleHTML}${items}</div>`
  })

  // ── [badge type="success|info|warning"] ──────────────────────────────────
  out = out.replace(/\[badge(?:\s+type="([^"]*)")?\]([\s\S]*?)\[\/badge\]/gi, (_m, type, body) => {
    const cls = `badge badge-${type || 'info'}`
    return `<span class="${cls}">${body.trim()}</span>`
  })

  return out
}

/**
 * Strip shortcode tags from content (for plain-text excerpts / search indexing).
 * Keeps the inner text, removes the shortcode wrappers.
 */
export function stripShortcodes(text: string): string {
  return text
    .replace(/\[\/?[\w-]+(?:\s[^\]]+)?\]/g, '')
    .trim()
}
