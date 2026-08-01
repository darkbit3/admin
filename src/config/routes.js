// Encrypted (base64) route paths — never expose readable names in the URL
// btoa('dashboard') = 'ZGFzaGJvYXJk'
// btoa('manage')    = 'bWFuYWdl'
// btoa('forgot')    = 'Zm9yZ290'

export const ROUTES = {
  LOGIN: '/',
  FORGOT_PASSWORD: '/Zm9yZ290',
  DASHBOARD: '/ZGFzaGJvYXJk',
  MANAGE: '/bWFuYWdl',
}
