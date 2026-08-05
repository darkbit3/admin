import { useState, useRef, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import { manageApi } from '../api/manageApi'

// ── Icons ──────────────────────────────────────────────────────────────────
const EyeOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)
const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
)
const IconAdd = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
)
const IconEdit = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 2.828L11.828 15.828A2 2 0 0110.414 16H8v-2.414a2 2 0 01.586-1.414z" />
  </svg>
)
const IconDelete = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1m-4 0h10" />
  </svg>
)
const IconForgot = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 11h4m-2-2v4" />
  </svg>
)
const IconToggleOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z"/>
  </svg>
)
const IconToggleOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm-10 8a3 3 0 110-6 3 3 0 010 6z"/>
  </svg>
)
const IconRefresh = ({ spinning }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

// ── Date helpers ──────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return null
  try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return iso }
}
function todayISO() { return new Date().toISOString().split('T')[0] }
function isExpired(freeUntil) { return !!freeUntil && new Date(freeUntil) < new Date() }

// ── Modal wrapper (click-outside closes, full-screen on mobile) ───────────
function Modal({ onClose, children }) {
  const overlayRef = useRef(null)
  const handleOverlayClick = (e) => { if (e.target === overlayRef.current) onClose() }
  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
    >
      {children}
    </div>
  )
}

// ── Modal inner panel (full-screen mobile, card on desktop) ──────────────
function ModalPanel({ children }) {
  return (
    <div
      className="bg-white w-full sm:max-w-md sm:rounded-2xl shadow-xl overflow-y-auto"
      style={{ maxHeight: '95dvh', borderRadius: '1rem 1rem 0 0' }}
    >
      {children}
    </div>
  )
}

// ── Confirm-delete modal ──────────────────────────────────────────────────
function ConfirmDeleteModal({ message, subMessage, onConfirm, onCancel, loading }) {
  return (
    <Modal onClose={onCancel}>
      <ModalPanel>
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 00-1-1h-4a1 1 0 00-1 1m-4 0h10" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-1">{message}</h2>
          {subMessage && <p className="text-sm text-gray-500 mb-6">{subMessage}</p>}
          {!subMessage && <div className="mb-6" />}
          <div className="flex gap-3">
            <button onClick={onCancel} disabled={loading}
              className="flex-1 px-4 py-3 text-sm border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 min-h-[44px]">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="flex-1 px-4 py-3 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 min-h-[44px]">
              {loading ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </ModalPanel>
    </Modal>
  )
}

// ── Phone input ───────────────────────────────────────────────────────────
function PhoneInput({ value, onChange, error }) {
  const handleChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')
    if (raw.startsWith('0')) raw = raw.slice(1)
    if (raw.length === 1 && raw !== '9' && raw !== '7') return
    if (raw.length > 9) return
    onChange(raw)
  }
  return (
    <>
      <div className={`flex items-center border rounded-xl overflow-hidden ${error ? 'border-red-400' : 'border-gray-300'}`}>
        <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm font-medium border-r border-gray-300 select-none">0</span>
        <input type="tel" value={value} onChange={handleChange}
          placeholder="9xxxxxxxx  or  7xxxxxxxx" inputMode="numeric" maxLength={9}
          className="flex-1 px-3 py-3 text-sm outline-none bg-white min-h-[44px]" />
      </div>
      <p className="text-xs text-gray-400 mt-1">Format: 09xxxxxxxxx or 07xxxxxxxxx (10 digits)</p>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </>
  )
}

// ── Password field ────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, show, onToggle, error }) {
  return (
    <>
      <div className={`flex items-center border rounded-xl overflow-hidden ${error ? 'border-red-400' : 'border-gray-300'}`}>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder="••••••••" className="flex-1 px-3 py-3 text-sm outline-none bg-white min-h-[44px]" />
        <button type="button" onClick={onToggle} className="px-3 text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center">
          {show ? <EyeOff /> : <EyeOn />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </>
  )
}

// ── Account Type picker ───────────────────────────────────────────────────
function AccountTypePicker({ accountType, freeUntil, onAccountTypeChange, onFreeUntilChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onAccountTypeChange('Free')}
          className={`py-3 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${accountType === 'Free' ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <span>🆓</span> Free
        </button>
        <button type="button" onClick={() => onAccountTypeChange('Paid')}
          className={`py-3 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${accountType === 'Paid' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <span>⭐</span> Paid
        </button>
      </div>
      {accountType === 'Free' && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
          <label className="block text-xs font-semibold text-sky-700 mb-2">📅 Free Trial Until (optional)</label>
          <input type="date" value={freeUntil || ''} min={todayISO()}
            onChange={e => onFreeUntilChange(e.target.value || null)}
            className="w-full border border-sky-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white min-h-[44px]" />
          {freeUntil
            ? <p className="text-xs text-sky-600 mt-1.5">Trial ends: <strong>{fmtDate(freeUntil)}</strong> <button type="button" onClick={() => onFreeUntilChange(null)} className="ml-1 text-sky-400 hover:text-red-400 underline">Clear</button></p>
            : <p className="text-xs text-sky-500 mt-1.5">No expiry — unlimited free access</p>
          }
        </div>
      )}
    </div>
  )
}

const emptyAddForm  = { name: '', phone: '', password: '', confirmPassword: '', role: 'Manufacturer', accountType: 'Free', freeUntil: null }
const emptyEditForm = { name: '', phone: '', role: 'Manufacturer', accountType: 'Free', freeUntil: null }

// ── Account type badge ────────────────────────────────────────────────────
function AccountBadge({ user }) {
  const isPaid = user.account_type === 'Paid'
  const expired = isExpired(user.free_until)
  if (isPaid)    return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">⭐ Paid</span>
  if (expired)   return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-200">⌛ Expired</span>
  return              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200">🆓 Free</span>
}

// ── Status badge ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
      {status}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────
export default function Manage() {
  const [users, setUsers]             = useState([])
  const [loading, setLoading]         = useState(true)
  const [apiError, setApiError]       = useState('')
  const [selected, setSelected]       = useState([])
  const [visiblePwd, setVisiblePwd]   = useState({})
  const [revealedPwd, setRevealedPwd] = useState({})

  const [showAddModal,   setShowAddModal]   = useState(false)
  const [showEditModal,  setShowEditModal]  = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(null)
  const [deleteLoading,  setDeleteLoading]  = useState(false)

  const [resetTargetIds,   setResetTargetIds]   = useState([])
  const [resetForm,        setResetForm]         = useState({ password: '', confirmPassword: '' })
  const [resetErrors,      setResetErrors]       = useState({})
  const [showResetPwd,     setShowResetPwd]      = useState(false)
  const [showResetConfirm, setShowResetConfirm]  = useState(false)

  const [addForm,        setAddForm]        = useState(emptyAddForm)
  const [addErrors,      setAddErrors]      = useState({})
  const [showAddPwd,     setShowAddPwd]     = useState(false)
  const [showAddConfirm, setShowAddConfirm] = useState(false)

  const [editForm,   setEditForm]   = useState(emptyEditForm)
  const [editTarget, setEditTarget] = useState(null)

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true); setApiError('')
    try {
      const data = await manageApi.getAll()
      setUsers(data); setRevealedPwd({}); setVisiblePwd({})
    } catch (err) { setApiError(err.message || 'Failed to load users') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const selCount    = selected.length
  const allChecked  = users.length > 0 && users.every(u => selected.includes(u.id))
  const someChecked = users.some(u => selected.includes(u.id))

  // ── Selection ─────────────────────────────────────────────────────────
  const toggleRow = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(allChecked ? [] : users.map(u => u.id))

  // ── Add ────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setAddForm(emptyAddForm); setAddErrors({})
    setShowAddPwd(false); setShowAddConfirm(false); setShowAddModal(true)
  }
  const handleAdd = async () => {
    const errs = {}
    if (!addForm.name) errs.name = 'Name is required'
    if (!addForm.phone || addForm.phone.length !== 9) errs.phone = 'Enter a valid 10-digit number (09/07)'
    if (!addForm.password) errs.password = 'Password is required'
    else if (addForm.password.length < 6) errs.password = 'Minimum 6 characters'
    if (!addForm.confirmPassword) errs.confirmPassword = 'Please confirm password'
    else if (addForm.password !== addForm.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length > 0) { setAddErrors(errs); return }
    try {
      const { confirmPassword, ...rest } = addForm
      await manageApi.create({ ...rest, phone: '0' + addForm.phone })
      await fetchUsers(); setShowAddModal(false)
    } catch (err) { setAddErrors({ phone: err.message }) }
  }

  // ── Edit ───────────────────────────────────────────────────────────────
  const openEdit = (userId) => {
    const id = userId ?? (selCount === 1 ? selected[0] : null)
    if (!id) return
    const user = users.find(u => u.id === id)
    setEditTarget(user)
    const stripped = user.phone.startsWith('0') ? user.phone.slice(1) : user.phone
    setEditForm({ name: user.name, phone: stripped, role: user.role, accountType: user.account_type || 'Free', freeUntil: user.free_until || null })
    setShowEditModal(true)
  }
  const handleEdit = async () => {
    if (!editForm.name || editForm.phone.length !== 9) return
    try {
      await manageApi.update(editTarget.id, { name: editForm.name, phone: '0' + editForm.phone, role: editForm.role, accountType: editForm.accountType, freeUntil: editForm.freeUntil })
      await fetchUsers(); setShowEditModal(false)
    } catch (err) { alert(err.message) }
  }

  // ── Delete ─────────────────────────────────────────────────────────────
  const openDelete = (ids) => {
    const names = ids.map(id => users.find(u => u.id === id)?.name).filter(Boolean)
    setConfirmDelete({
      ids,
      message: `Delete ${ids.length} user${ids.length > 1 ? 's' : ''}?`,
      subMessage: ids.length === 1
        ? `"${names[0]}" will be permanently removed.`
        : `${names.slice(0, 3).join(', ')}${names.length > 3 ? ` and ${names.length - 3} more` : ''} will be permanently removed.`,
    })
  }
  const handleDeleteSelected  = () => { if (selCount > 0) openDelete([...selected]) }
  const handleConfirmDelete = async () => {
    if (!confirmDelete) return
    setDeleteLoading(true)
    try {
      await manageApi.bulkDelete(confirmDelete.ids)
      await fetchUsers(); setSelected([]); setConfirmDelete(null)
    } catch (err) { alert(err.message) }
    finally { setDeleteLoading(false) }
  }

  // ── Toggle status ──────────────────────────────────────────────────────
  const handleToggleActiveSelected = async () => {
    if (selCount === 0) return
    const allActive = selected.every(id => users.find(u => u.id === id)?.status === 'Active')
    try { await manageApi.bulkStatus(selected, allActive ? 'Inactive' : 'Active'); await fetchUsers() }
    catch (err) { alert(err.message) }
  }
  const selectedAllActive = selCount > 0 && selected.every(id => users.find(u => u.id === id)?.status === 'Active')

  // ── Reset password ─────────────────────────────────────────────────────
  const openReset = (ids) => {
    setResetTargetIds(ids)
    setResetForm({ password: '', confirmPassword: '' })
    setResetErrors({}); setShowResetPwd(false); setShowResetConfirm(false); setShowResetModal(true)
  }
  const handleResetSelected = () => { if (selCount > 0) openReset([...selected]) }
  const handleResetSave = async () => {
    const errs = {}
    if (!resetForm.password) errs.password = 'Password is required'
    else if (resetForm.password.length < 6) errs.password = 'Minimum 6 characters'
    if (!resetForm.confirmPassword) errs.confirmPassword = 'Please confirm password'
    else if (resetForm.password !== resetForm.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length > 0) { setResetErrors(errs); return }
    try {
      await manageApi.bulkResetPassword(resetTargetIds, resetForm.password)
      await fetchUsers(); setShowResetModal(false); setSelected([])
    } catch (err) { alert(err.message) }
  }

  // ── Per-row password reveal ────────────────────────────────────────────
  const toggleRowPwd = async (id) => {
    if (visiblePwd[id]) { setVisiblePwd(v => ({ ...v, [id]: false })); return }
    if (revealedPwd[id]) { setVisiblePwd(v => ({ ...v, [id]: true })); return }
    try {
      const pwd = await manageApi.getPassword(id)
      setRevealedPwd(v => ({ ...v, [id]: pwd }))
      setVisiblePwd(v => ({ ...v, [id]: true }))
    } catch { /* fail silently */ }
  }

  // ── Per-row status toggle ──────────────────────────────────────────────
  const handleRowToggle = async (user) => {
    try {
      await manageApi.updateStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')
      await fetchUsers()
    } catch (err) { alert(err.message) }
  }

  return (
    <Layout>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: '#1C1C1C', fontFamily: 'Georgia, serif' }}>Manage Users</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8A7060' }}>
            {users.length} total · {users.filter(u => u.status === 'Active').length} active
            {selCount > 0 && <span className="ml-2 font-semibold" style={{ color: '#C8A96E' }}>· {selCount} selected</span>}
          </p>
        </div>
        {/* Reload - icon only on mobile */}
        <button onClick={fetchUsers} disabled={loading} aria-label="Reload" title="Reload"
          className="flex items-center justify-center gap-1.5 rounded-xl border transition-colors disabled:opacity-50 w-11 h-11 sm:w-auto sm:h-auto sm:px-3 sm:py-2"
          style={{ backgroundColor: 'white', borderColor: '#D4C4B0', color: '#3A2E24' }}>
          <IconRefresh spinning={loading} />
          <span className="hidden sm:inline text-sm font-medium">{loading ? 'Loading…' : 'Reload'}</span>
        </button>
      </div>

      {/* ── Bulk action bar (only visible when items selected) ────── */}
      {selCount > 0 && (
        <div className="mb-4 flex flex-wrap gap-2 p-3 rounded-xl border"
          style={{ backgroundColor: 'rgba(200,169,110,0.08)', borderColor: 'rgba(200,169,110,0.3)' }}>
          <span className="text-sm font-semibold self-center mr-1" style={{ color: '#7A6A5A' }}>{selCount} selected</span>
          {/* Edit — only 1 */}
          <button onClick={() => openEdit()} disabled={selCount !== 1}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors min-h-[36px] ${selCount === 1 ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-300 border-indigo-100 cursor-not-allowed'}`}>
            <IconEdit /> Edit
          </button>
          {/* Delete */}
          <button onClick={handleDeleteSelected}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border bg-red-500 text-white border-red-500 hover:bg-red-600 transition-colors min-h-[36px]">
            <IconDelete /> Delete{selCount > 1 ? ` (${selCount})` : ''}
          </button>
          {/* Toggle status */}
          <button onClick={handleToggleActiveSelected}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors min-h-[36px] ${selectedAllActive ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : 'bg-gray-400 text-white border-gray-400 hover:bg-gray-500'}`}>
            {selectedAllActive ? <IconToggleOn /> : <IconToggleOff />}
            {selectedAllActive ? 'Active' : 'Inactive'}
          </button>
          {/* Reset password */}
          <button onClick={handleResetSelected}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600 transition-colors min-h-[36px]">
            <IconForgot /> Reset Pwd{selCount > 1 ? ` (${selCount})` : ''}
          </button>
          {/* Deselect all */}
          <button onClick={() => setSelected([])}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors min-h-[36px] ml-auto">
            ✕ Clear
          </button>
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────── */}
      {apiError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{apiError}</div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MOBILE: card list (hidden on lg+)
          ══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden space-y-3">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse" style={{ border: '1px solid #E8D9C5' }}>
              <div className="h-4 w-1/2 rounded mb-2" style={{ backgroundColor: '#E8D9C5' }} />
              <div className="h-3 w-1/3 rounded" style={{ backgroundColor: '#F0E6D6' }} />
            </div>
          ))
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No users found</div>
        ) : (
          users.map(user => {
            const isSelected = selected.includes(user.id)
            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl p-4 transition-all"
                style={{
                  border: isSelected ? '2px solid #C8A96E' : '1px solid #E8D9C5',
                  boxShadow: isSelected ? '0 0 0 3px rgba(200,169,110,0.15)' : '0 1px 4px rgba(0,0,0,0.05)',
                }}
              >
                {/* Top row: checkbox + name + status */}
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleRow(user.id)}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 accent-yellow-500 cursor-pointer flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm" style={{ color: '#1C1C1C' }}>{user.name}</span>
                      <StatusBadge status={user.status} />
                    </div>
                    <p className="text-xs mt-0.5 font-mono" style={{ color: '#8A7060' }}>{user.phone}</p>
                  </div>
                </div>

                {/* Middle row: role + account type */}
                <div className="mt-3 flex items-center gap-2 flex-wrap ml-8">
                  <span className="text-xs px-2 py-0.5 rounded-lg font-medium" style={{ backgroundColor: '#F5EDE0', color: '#7A6A5A' }}>
                    {user.role}
                  </span>
                  <AccountBadge user={user} />
                  {!user.account_type !== 'Paid' && user.free_until && (
                    <span className={`text-xs ${isExpired(user.free_until) ? 'text-red-400' : 'text-sky-500'}`}>
                      {isExpired(user.free_until) ? 'Expired ' : 'Until '}{fmtDate(user.free_until)}
                    </span>
                  )}
                </div>

                {/* Password row */}
                <div className="mt-2 ml-8 flex items-center gap-2">
                  <span className="text-xs font-mono tracking-widest" style={{ color: '#8A7060' }}>
                    {visiblePwd[user.id] ? (revealedPwd[user.id] || '…') : '••••••••'}
                  </span>
                  <button type="button" onClick={() => toggleRowPwd(user.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 min-w-[32px] min-h-[32px] flex items-center justify-center">
                    {visiblePwd[user.id] ? <EyeOff /> : <EyeOn />}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="mt-3 ml-8 flex items-center gap-2">
                  {/* Edit */}
                  <button onClick={() => openEdit(user.id)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    aria-label="Edit user" title="Edit">
                    <IconEdit />
                  </button>
                  {/* Delete */}
                  <button onClick={() => openDelete([user.id])}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    aria-label="Delete user" title="Delete">
                    <IconDelete />
                  </button>
                  {/* Toggle status */}
                  <button onClick={() => handleRowToggle(user)}
                    className={`flex items-center justify-center w-9 h-9 rounded-xl transition-colors ${user.status === 'Active' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    aria-label="Toggle status" title={user.status === 'Active' ? 'Deactivate' : 'Activate'}>
                    {user.status === 'Active' ? <IconToggleOn /> : <IconToggleOff />}
                  </button>
                  {/* Reset password */}
                  <button onClick={() => openReset([user.id])}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition-colors"
                    aria-label="Reset password" title="Reset password">
                    <IconForgot />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          DESKTOP: traditional table (hidden below lg)
          ══════════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex flex-wrap gap-2">
            <button onClick={openAdd}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <IconAdd /> Add User
            </button>
            <button onClick={() => openEdit()} disabled={selCount !== 1}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${selCount === 1 ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700' : 'bg-indigo-50 text-indigo-300 border-indigo-100 cursor-not-allowed'}`}>
              <IconEdit /> Edit
            </button>
            <button onClick={handleDeleteSelected} disabled={selCount === 0}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${selCount > 0 ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' : 'bg-red-50 text-red-300 border-red-100 cursor-not-allowed'}`}>
              <IconDelete /> Delete{selCount > 1 ? ` (${selCount})` : ''}
            </button>
            <button onClick={handleToggleActiveSelected} disabled={selCount === 0}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${selCount > 0 ? (selectedAllActive ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : 'bg-gray-400 text-white border-gray-400 hover:bg-gray-500') : 'bg-green-50 text-green-300 border-green-100 cursor-not-allowed'}`}>
              {selectedAllActive ? <IconToggleOn /> : <IconToggleOff />}
              {selCount > 0 ? (selectedAllActive ? 'Active' : 'Inactive') : 'Active'}
            </button>
            <button onClick={handleResetSelected} disabled={selCount === 0}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${selCount > 0 ? 'bg-yellow-500 text-white border-yellow-500 hover:bg-yellow-600' : 'bg-yellow-50 text-yellow-300 border-yellow-100 cursor-not-allowed'}`}>
              <IconForgot /> Reset Pwd{selCount > 1 ? ` (${selCount})` : ''}
            </button>
          </div>
        </div>

        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allChecked}
                  ref={el => { if (el) el.indeterminate = someChecked && !allChecked }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600" />
              </th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Username</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Phone Number</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Account Type</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Password</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading…</td></tr>
            ) : apiError ? (
              <tr><td colSpan={8} className="text-center py-10 text-red-400">{apiError}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No users found</td></tr>
            ) : (
              users.map(user => {
                const isSelected = selected.includes(user.id)
                return (
                  <tr key={user.id} onClick={() => toggleRow(user.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleRow(user.id)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600" />
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">{user.name}</td>
                    <td className="px-4 py-4 text-gray-500">{user.phone}</td>
                    <td className="px-4 py-4 text-gray-600">{user.role}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <AccountBadge user={user} />
                        {user.account_type !== 'Paid' && user.free_until && (
                          <span className={`text-xs ${isExpired(user.free_until) ? 'text-red-400' : 'text-sky-500'}`}>
                            {isExpired(user.free_until) ? 'Expired ' : 'Until '}<strong>{fmtDate(user.free_until)}</strong>
                          </span>
                        )}
                        {user.account_type !== 'Paid' && !user.free_until && <span className="text-xs text-gray-400">No expiry</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-mono text-xs tracking-widest">
                          {visiblePwd[user.id] ? (revealedPwd[user.id] || '…') : '••••••••'}
                        </span>
                        <button type="button" onClick={e => { e.stopPropagation(); toggleRowPwd(user.id) }}
                          className="text-gray-400 hover:text-gray-600 transition-colors">
                          {visiblePwd[user.id] ? <EyeOff /> : <EyeOn />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button onClick={() => openEdit(user.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                          <IconEdit /> Edit
                        </button>
                        <button onClick={() => openDelete([user.id])}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          <IconDelete /> Delete
                        </button>
                        <button onClick={() => handleRowToggle(user)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${user.status === 'Active' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                          {user.status === 'Active' ? <IconToggleOn /> : <IconToggleOff />}
                          {user.status === 'Active' ? 'Active' : 'Inactive'}
                        </button>
                        <button onClick={() => openReset([user.id])}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                          <IconForgot /> Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
                          {visiblePwd[user.id] ? (revealedPwd[user.id] || '…') : '••••••••'}
                        </span>
                        <button type="button" onClick={e => { e.stopPropagation(); toggleRowPwd(user.id) }}
                          className="text-gray-400 hover:text-gray-600 transition-colors">
                          {visiblePwd[user.id] ? <EyeOff /> : <EyeOn />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button onClick={() => openEdit(user.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                          <IconEdit /> Edit
                        </button>
                        <button onClick={() => openDelete([user.id])}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          <IconDelete /> Delete
                        </button>
                        <button onClick={() => handleRowToggle(user)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${user.status === 'Active' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                          {user.status === 'Active' ? <IconToggleOn /> : <IconToggleOff />}
                          {user.status === 'Active' ? 'Active' : 'Inactive'}
                        </button>
                        <button onClick={() => openReset([user.id])}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors">
                          <IconForgot /> Reset
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile FAB: Add User (only on mobile, above bottom nav) ── */}
      <button
        onClick={openAdd}
        className="lg:hidden fixed z-30 flex items-center gap-2 px-5 py-3.5 rounded-full shadow-lg font-semibold text-sm transition-all active:scale-95"
        style={{
          backgroundColor: '#1C1C1C',
          color: '#F5EDE0',
          bottom: 'calc(64px + env(safe-area-inset-bottom) + 16px)',
          right: '16px',
          boxShadow: '0 4px 20px rgba(28,28,28,0.35)',
        }}
      >
        <IconAdd />
        Add User
      </button>

      {/* ════════════════════════════════════════════════════════════════
          MODALS
          ══════════════════════════════════════════════════════════════ */}

      {/* ── Add User Modal ───────────────────────────────────────────── */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <ModalPanel>
            <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add New User</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(95dvh - 120px)' }}>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Abebe Kebede" className={`w-full border rounded-xl px-3 py-3 text-sm outline-none min-h-[44px] ${addErrors.name ? 'border-red-400' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500`} />
                {addErrors.name && <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>}
              </div>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <PhoneInput value={addForm.phone} onChange={v => setAddForm(f => ({ ...f, phone: v }))} error={addErrors.phone} />
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Manufacturer', 'Reseller'].map(r => (
                    <button key={r} type="button" onClick={() => setAddForm(f => ({ ...f, role: r }))}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all min-h-[44px] ${addForm.role === r ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              {/* Account type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Type</label>
                <AccountTypePicker accountType={addForm.accountType} freeUntil={addForm.freeUntil}
                  onAccountTypeChange={v => setAddForm(f => ({ ...f, accountType: v }))}
                  onFreeUntilChange={v => setAddForm(f => ({ ...f, freeUntil: v }))} />
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <PasswordInput value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
                  show={showAddPwd} onToggle={() => setShowAddPwd(v => !v)} error={addErrors.password} />
              </div>
              {/* Confirm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <PasswordInput value={addForm.confirmPassword} onChange={e => setAddForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  show={showAddConfirm} onToggle={() => setShowAddConfirm(v => !v)} error={addErrors.confirmPassword} />
              </div>
            </div>
            <div className="px-5 pb-5 pt-3 flex gap-3 border-t border-gray-100">
              <button onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]">
                Cancel
              </button>
              <button onClick={handleAdd}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors min-h-[44px]">
                Add User
              </button>
            </div>
          </ModalPanel>
        </Modal>
      )}

      {/* ── Edit User Modal ──────────────────────────────────────────── */}
      {showEditModal && (
        <Modal onClose={() => setShowEditModal(false)}>
          <ModalPanel>
            <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(95dvh - 120px)' }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <PhoneInput value={editForm.phone} onChange={v => setEditForm(f => ({ ...f, phone: v }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Manufacturer', 'Reseller'].map(r => (
                    <button key={r} type="button" onClick={() => setEditForm(f => ({ ...f, role: r }))}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all min-h-[44px] ${editForm.role === r ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Type</label>
                <AccountTypePicker accountType={editForm.accountType} freeUntil={editForm.freeUntil}
                  onAccountTypeChange={v => setEditForm(f => ({ ...f, accountType: v }))}
                  onFreeUntilChange={v => setEditForm(f => ({ ...f, freeUntil: v }))} />
              </div>
            </div>
            <div className="px-5 pb-5 pt-3 flex gap-3 border-t border-gray-100">
              <button onClick={() => setShowEditModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]">
                Cancel
              </button>
              <button onClick={handleEdit}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors min-h-[44px]">
                Save Changes
              </button>
            </div>
          </ModalPanel>
        </Modal>
      )}

      {/* ── Reset Password Modal ─────────────────────────────────────── */}
      {showResetModal && (
        <Modal onClose={() => setShowResetModal(false)}>
          <ModalPanel>
            <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Reset Password</h2>
              <button onClick={() => setShowResetModal(false)} className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <PasswordInput value={resetForm.password} onChange={e => setResetForm(f => ({ ...f, password: e.target.value }))}
                  show={showResetPwd} onToggle={() => setShowResetPwd(v => !v)} error={resetErrors.password} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <PasswordInput value={resetForm.confirmPassword} onChange={e => setResetForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  show={showResetConfirm} onToggle={() => setShowResetConfirm(v => !v)} error={resetErrors.confirmPassword} />
              </div>
            </div>
            <div className="px-5 pb-5 pt-3 flex gap-3 border-t border-gray-100">
              <button onClick={() => setShowResetModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors min-h-[44px]">
                Cancel
              </button>
              <button onClick={handleResetSave}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm font-semibold transition-colors min-h-[44px]">
                Reset Password
              </button>
            </div>
          </ModalPanel>
        </Modal>
      )}

      {/* ── Confirm Delete Modal ─────────────────────────────────────── */}
      {confirmDelete && (
        <ConfirmDeleteModal
          message={confirmDelete.message}
          subMessage={confirmDelete.subMessage}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleteLoading}
        />
      )}

    </Layout>
  )
}
