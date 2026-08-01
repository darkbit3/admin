import { api, setTokens, clearTokens } from './client'

export const authApi = {
  async login(phone, password) {
    const data = await api.post('/auth/login', { phone, password })
    setTokens(data.data.accessToken, data.data.refreshToken)
    sessionStorage.setItem('admin_auth', 'true')
    return data.data.admin
  },

  async logout() {
    const refreshToken = sessionStorage.getItem('refresh_token')
    try {
      await api.post('/auth/logout', { refreshToken })
    } finally {
      clearTokens()
    }
  },

  async getMe() {
    const data = await api.get('/auth/me')
    return data.data
  },

  async changePassword(currentPassword, newPassword) {
    return api.put('/auth/change-password', { currentPassword, newPassword })
  },
}
