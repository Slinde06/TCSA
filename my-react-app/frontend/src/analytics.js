function send(eventName, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

function eventNameFor(href) {
  if (!href) return 'button_click'
  if (href.includes('wa.me') || href.includes('whatsapp')) return 'whatsapp_click'
  if (href.startsWith('mailto:')) return 'email_click'
  if (href.startsWith('tel:')) return 'phone_click'
  if (href.includes('facebook.com')) return 'facebook_click'
  if (href.startsWith('#')) return 'nav_click'
  return 'link_click'
}

export function setupClickTracking() {
  document.addEventListener(
    'click',
    (e) => {
      const el = e.target.closest('a, button')
      if (!el) return

      const href = el.getAttribute('href') || ''
      const label =
        el.dataset.track ||
        el.getAttribute('aria-label') ||
        el.textContent.trim().replace(/\s+/g, ' ')
// i dont know it said i could add this line
      send(eventNameFor(href), {
        button_text: label.slice(0, 100),
        link_url: href.slice(0, 100),
        page_path: window.location.pathname,
      })
    },
    true,
  )
}
