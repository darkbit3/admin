import { api } from './client'

export const manageApi = {
  // Stats
  getStats:      ()              => api.get('/users/stats').then(r => r.data),

  // Single operations
  getAll:        ()              => api.get('/users').then(r => r.data),
  getOne:        (id)            => api.get(`/users/${id}`).then(r => r.data),
  getPassword:   (id)            => api.get(`/users/${id}/password`).then(r => r.data.password),
  create:        (body)          => api.post('/users', body).then(r => r.data),
  update:        (id, body)      => api.put(`/users/${id}`, body).then(r => r.data),
  delete:        (id)            => api.delete(`/users/${id}`),
  updateStatus:  (id, status)    => api.patch(`/users/${id}/status`, { status }),
  resetPassword: (id, password)  => api.patch(`/users/${id}/reset-password`, { password }),

  // Bulk operations
  bulkDelete:        (ids)              => api.post('/users/bulk/delete', { ids }),
  bulkStatus:        (ids, status)      => api.post('/users/bulk/status', { ids, status }),
  bulkResetPassword: (ids, password)    => api.post('/users/bulk/reset-password', { ids, password }),
}
