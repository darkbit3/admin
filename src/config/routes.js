// Encrypted (base64) route paths — never expose readable names in the URL
// btoa('dashboard') = 'ZGFzaGJvYXJk'
// btoa('manage')    = 'bWFuYWdl'
// btoa('forgot')    = 'Zm9yZ290'
// btoa('chat')      = 'Y2hhdA=='
// btoa('history')   = 'aGlzdG9yeQ=='

export const ROUTES = {
  LOGIN: '/',
  FORGOT_PASSWORD: '/Zm9yZ290',
  DASHBOARD: '/ZGFzaGJvYXJk',
  MANAGE: '/bWFuYWdl',
  CHAT: '/Y2hhdA==',
  HISTORY: '/aGlzdG9yeQ==',
}
