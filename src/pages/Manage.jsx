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
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
// ── Date helpers ─────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return null
  try { return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
  catch { return iso }
}
function todayISO() { return new Date().toISOString().split('T')[0] }
function isExpired(freeUntil) { return !!freeUntil && new Date(freeUntil) < new Date() }

// Toggle switch icon
const IconToggleOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6z"/>
  </svg>
)
const IconToggleOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm-10 8a3 3 0 110-6 3 3 0 010 6z"/>
  </svg>
)

// ── Reusable modal wrapper (click outside to close) ────────────────────────
function Modal({ onClose, children }) {
  const overlayRef = useRef(null)
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }
  return (
    <div ref={overlayRef} onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {children}
    </div>
  )
}

// ── Delete confirmation modal ──────────────────────────────────────────────
function ConfirmDeleteModal({ message, subMessage, onConfirm, onCancel, loading }) {
  return (
    <Modal onClose={onCancel}>
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
        {/* Icon */}
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
            className="flex-1 px-4 py-2.5 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// ── Phone input (09/07, 10 digits, same as login) ──────────────────────────
function PhoneInput({ value, onChange, error, ringColor = 'blue' }) {
  const handleChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '')
    if (raw.startsWith('0')) raw = raw.slice(1)
    if (raw.length === 1 && raw !== '9' && raw !== '7') return
    if (raw.length > 9) return
    onChange(raw)
  }
  return (
    <>
      <div className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-${ringColor}-500 ${error ? 'border-red-400' : 'border-gray-300'}`}>
        <span className="px-3 py-2 bg-gray-50 text-gray-500 text-sm font-medium border-r border-gray-300 select-none">0</span>
        <input type="tel" value={value} onChange={handleChange}
          placeholder="9xxxxxxxx  or  7xxxxxxxx" inputMode="numeric" maxLength={9}
          className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
      </div>
      <p className="text-xs text-gray-400 mt-1">Format: 09xxxxxxxxx or 07xxxxxxxxx (10 digits)</p>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </>
  )
}

// ── Password field with eye toggle ─────────────────────────────────────────
function PasswordInput({ value, onChange, show, onToggle, error }) {
  return (
    <>
      <div className={`flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 ${error ? 'border-red-400' : 'border-gray-300'}`}>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder="••••••••" className="flex-1 px-3 py-2 text-sm outline-none bg-white" />
        <button type="button" onClick={onToggle} className="px-3 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <EyeOff /> : <EyeOn />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </>
  )
}

// ── Account Type picker (Free/Paid + optional free_until date) ────────────
function AccountTypePicker({ accountType, freeUntil, onAccountTypeChange, onFreeUntilChange }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onAccountTypeChange('Free')}
          className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${accountType === 'Free' ? 'border-sky-500 bg-sky-50 text-sky-700 ring-2 ring-sky-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <span>🆓</span> Free Account
        </button>
        <button type="button" onClick={() => onAccountTypeChange('Paid')}
          className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-1.5 transition-all ${accountType === 'Paid' ? 'border-purple-500 bg-purple-50 text-purple-700 ring-2 ring-purple-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
          <span>⭐</span> Paid Account
        </button>
      </div>
      {accountType === 'Free' && (
        <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
          <label className="block text-xs font-semibold text-sky-700 mb-2">📅 Free Trial Until (optional)</label>
          <input type="date" value={freeUntil || ''} min={todayISO()}
            onChange={e => onFreeUntilChange(e.target.value || null)}
            className="w-full border border-sky-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white" />
          {freeUntil
            ? <p className="text-xs text-sky-600 mt-1.5">Trial ends: <strong>{fmtDate(freeUntil)}</strong> <button type="button" onClick={() => onFreeUntilChange(null)} className="ml-1 text-sky-400 hover:text-red-400 underline">Clear</button></p>
            : <p className="text-xs text-sky-500 mt-1.5">No expiry set — unlimited free access</p>
          }
        </div>
      )}
    </div>
  )
}

const emptyAddForm  = { name: '', phone: '', password: '', confirmPassword: '', role: 'Manufacturer', accountType: 'Free', freeUntil: null }
const emptyEditForm = { name: '', phone: '', role: 'Manufacturer', accountType: 'Free', freeUntil: null }

export default function Manage() {
  const [users, setUsers]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [apiError, setApiError]     = useState('')
  const [selected, setSelected]     = useState([])
  const [visiblePwd, setVisiblePwd]   = useState({}) // { [id]: bool }
  const [revealedPwd, setRevealedPwd] = useState({}) // { [id]: plain-text password fetched from API}

  const [showAddModal,    setShowAddModal]    = useState(false)
  const [showEditModal,   setShowEditModal]   = useState(false)
  const [showResetModal,  setShowResetModal]  = useState(false)
  const [confirmDelete,   setConfirmDelete]   = useState(null)  // { ids, message, subMessage }
  const [deleteLoading,   setDeleteLoading]   = useState(false)

  const [resetTargetIds,    setResetTargetIds]    = useState([])
  const [resetForm,         setResetForm]         = useState({ password: '', confirmPassword: '' })
  const [resetErrors,       setResetErrors]       = useState({})
  const [showResetPwd,      setShowResetPwd]      = useState(false)
  const [showResetConfirm,  setShowResetConfirm]  = useState(false)

  const [addForm,        setAddForm]        = useState(emptyAddForm)
  const [addErrors,      setAddErrors]      = useState({})
  const [showAddPwd,     setShowAddPwd]     = useState(false)
  const [showAddConfirm, setShowAddConfirm] = useState(false)

  const [editForm,   setEditForm]   = useState(emptyEditForm)
  const [editTarget, setEditTarget] = useState(null)

  // ── Fetch users from API ───────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const data = await manageApi.getAll()
      setUsers(data)
      setRevealedPwd({})  // clear cached passwords on refresh
      setVisiblePwd({})
    } catch (err) {
      setApiError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const selCount   = selected.length
  const allChecked = users.length > 0 && users.every(u => selected.includes(u.id))
  const someChecked = users.some(u => selected.includes(u.id))

  // ── Selection helpers ──────────────────────────────────────────────────
  const toggleRow = (id) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

  const toggleAll = () =>
    setSelected(allChecked ? [] : users.map(u => u.id))

  // ── Add ────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setAddForm(emptyAddForm); setAddErrors({})
    setShowAddPwd(false); setShowAddConfirm(false)
    setShowAddModal(true)
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
      await fetchUsers()
      setShowAddModal(false)
    } catch (err) {
      setAddErrors({ phone: err.message })
    }
  }

  // ── Edit (only when exactly 1 selected) ───────────────────────────────
  const openEdit = () => {
    if (selCount !== 1) return
    const user = users.find(u => u.id === selected[0])
    setEditTarget(user)
    const stripped = user.phone.startsWith('0') ? user.phone.slice(1) : user.phone
    setEditForm({ name: user.name, phone: stripped, role: user.role, accountType: user.account_type || 'Free', freeUntil: user.free_until || null })
    setShowEditModal(true)
  }
  const handleEdit = async () => {
    if (!editForm.name || editForm.phone.length !== 9) return
    try {
      await manageApi.update(editTarget.id, { name: editForm.name, phone: '0' + editForm.phone, role: editForm.role, accountType: editForm.accountType, freeUntil: editForm.freeUntil })
      await fetchUsers()
      setShowEditModal(false)
    } catch (err) {
      alert(err.message)
    }
  }

  // ── Delete selected ────────────────────────────────────────────────────
  const handleDeleteSelected = () => {
    if (selCount === 0) return
    const names = selected.map(id => users.find(u => u.id === id)?.name).filter(Boolean)
    setConfirmDelete({
      ids: [...selected],
      message: `Delete ${selCount} user${selCount > 1 ? 's' : ''}?`,
      subMessage: selCount === 1
        ? `"${names[0]}" will be permanently removed.`
        : `${names.slice(0, 3).join(', ')}${names.length > 3 ? ` and ${names.length - 3} more` : ''} will be permanently removed.`,
    })
  }

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return
    setDeleteLoading(true)
    try {
      await manageApi.bulkDelete(confirmDelete.ids)
      await fetchUsers()
      setSelected([])
      setConfirmDelete(null)
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  // ── Toggle active for selected ─────────────────────────────────────────
  const handleToggleActiveSelected = async () => {
    if (selCount === 0) return
    const allActive = selected.every(id => users.find(u => u.id === id)?.status === 'Active')
    const newStatus = allActive ? 'Inactive' : 'Active'
    try {
      await manageApi.bulkStatus(selected, newStatus)
      await fetchUsers()
    } catch (err) { alert(err.message) }
  }
  const selectedAllActive = selCount > 0 && selected.every(id => users.find(u => u.id === id)?.status === 'Active')

  // ── Reset password for selected ────────────────────────────────────────
  const handleResetSelected = () => {
    if (selCount === 0) return
    setResetTargetIds([...selected])
    setResetForm({ password: '', confirmPassword: '' })
    setResetErrors({})
    setShowResetPwd(false)
    setShowResetConfirm(false)
    setShowResetModal(true)
  }

  const handleResetSave = async () => {
    const errs = {}
    if (!resetForm.password) errs.password = 'Password is required'
    else if (resetForm.password.length < 6) errs.password = 'Minimum 6 characters'
    if (!resetForm.confirmPassword) errs.confirmPassword = 'Please confirm password'
    else if (resetForm.password !== resetForm.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (Object.keys(errs).length > 0) { setResetErrors(errs); return }
    try {
      await manageApi.bulkResetPassword(resetTargetIds, resetForm.password)
      await fetchUsers()
      setShowResetModal(false)
      setSelected([])
    } catch (err) { alert(err.message) }
  }

  // ── Per-row actions ────────────────────────────────────────────────────
  const toggleRowPwd = async (id) => {
    // If already visible → just hide
    if (visiblePwd[id]) {
      setVisiblePwd(v => ({ ...v, [id]: false }))
      return
    }
    // If already fetched → just show
    if (revealedPwd[id]) {
      setVisiblePwd(v => ({ ...v, [id]: true }))
      return
    }
    // Fetch from API, cache, then show
    try {
      const pwd = await manageApi.getPassword(id)
      setRevealedPwd(v => ({ ...v, [id]: pwd }))
      setVisiblePwd(v => ({ ...v, [id]: true }))
    } catch {
      // fail silently — keep showing ••••••••
    }
  }

  return (
    <Layout>

      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="mb-6 bg-white rounded-xl shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {users.length} total · {users.filter(u => u.status === 'Active').length} active
            {selCount > 0 && <span className="ml-2 text-blue-500 font-medium">· {selCount} selected</span>}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">

          {/* Reload */}
          <button onClick={fetchUsers} disabled={loading}
            title="Refresh table"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg border border-gray-200 transition-colors disabled:opacity-50">
            <svg xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Loading...' : 'Reload'}
          </button>

          {/* Add — always enabled */}
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <IconAdd /> Add User
          </button>

          {/* Edit — only 1 selected */}
          <button onClick={openEdit} disabled={selCount !== 1}
            title={selCount !== 1 ? 'Select exactly 1 user to edit' : 'Edit selected user'}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              selCount === 1
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
                : 'bg-indigo-50 text-indigo-300 border-indigo-100 cursor-not-allowed'}`}>
            <IconEdit /> Edit
          </button>

          {/* Delete — 1 or more */}
          <button onClick={handleDeleteSelected} disabled={selCount === 0}
            title={selCount === 0 ? 'Select users to delete' : `Delete ${selCount} user${selCount > 1 ? 's' : ''}`}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              selCount > 0
                ? 'bg-red-500 hover:bg-red-600 text-white border-red-500'
                : 'bg-red-50 text-red-300 border-red-100 cursor-not-allowed'}`}>
            <IconDelete /> Delete{selCount > 1 ? ` (${selCount})` : ''}
          </button>

          {/* Active toggle — 1 or more */}
          <button onClick={handleToggleActiveSelected} disabled={selCount === 0}
            title={selCount === 0 ? 'Select users to toggle active' : (selectedAllActive ? 'Deactivate selected' : 'Activate selected')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              selCount > 0
                ? selectedAllActive
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500'
                  : 'bg-gray-400 hover:bg-gray-500 text-white border-gray-400'
                : 'bg-green-50 text-green-300 border-green-100 cursor-not-allowed'}`}>
            {selCount > 0 && selectedAllActive ? <IconToggleOn /> : <IconToggleOff />}
            {selCount > 0 ? (selectedAllActive ? 'Active' : 'Inactive') : 'Active'}
          </button>

          {/* Reset Password — 1 or more */}
          <button onClick={handleResetSelected} disabled={selCount === 0}
            title={selCount === 0 ? 'Select users to reset password' : `Reset password for ${selCount} user${selCount > 1 ? 's' : ''}`}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              selCount > 0
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500'
                : 'bg-yellow-50 text-yellow-300 border-yellow-100 cursor-not-allowed'}`}>
            <IconForgot /> Reset Pwd{selCount > 1 ? ` (${selCount})` : ''}
          </button>

        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allChecked} ref={el => { if (el) el.indeterminate = someChecked && !allChecked }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600" />
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
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : apiError ? (
              <tr><td colSpan={8} className="text-center py-8 text-red-400">{apiError}</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-gray-400">No users found</td></tr>
            ) : (
              users.map(user => {
                const isSelected = selected.includes(user.id)
                const isPaid = user.account_type === 'Paid'
                return (
                  <tr key={user.id}
                    onClick={() => toggleRow(user.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleRow(user.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer accent-blue-600" />
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-800">{user.name}</td>
                    <td className="px-4 py-4 text-gray-500">{user.phone}</td>
                    <td className="px-4 py-4 text-gray-600">{user.role}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${isPaid ? 'bg-purple-100 text-purple-700 border border-purple-200' : isExpired(user.free_until) ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-sky-100 text-sky-700 border border-sky-200'}`}>
                          {isPaid ? '⭐ Paid' : isExpired(user.free_until) ? '⌛ Expired' : '🆓 Free'}
                        </span>
                        {!isPaid && user.free_until && (
                          <span className={`text-xs ${isExpired(user.free_until) ? 'text-red-400' : 'text-sky-500'}`}>
                            {isExpired(user.free_until) ? 'Expired ' : 'Until '}<strong>{fmtDate(user.free_until)}</strong>
                          </span>
                        )}
                        {!isPaid && !user.free_until && <span className="text-xs text-gray-400">No expiry</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-mono text-xs tracking-widest">
                          {visiblePwd[user.id] ? (revealedPwd[user.id] || '...') : '••••••••'}
                        </span>
                        <button type="button" onClick={e => { e.stopPropagation(); toggleRowPwd(user.id) }}
                          className="text-gray-400 hover:text-gray-600 transition-colors">
                          {visiblePwd[user.id] ? <EyeOff /> : <EyeOn />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* per-row edit */}
                        <button onClick={() => { setSelected([user.id]); setTimeout(openEdit, 0) }}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                          <IconEdit /> Edit
                        </button>
                        {/* per-row delete */}
                        <button onClick={() => {
                          setConfirmDelete({
                            ids: [user.id],
                            message: 'Delete this user?',
                            subMessage: `"${user.name}" will be permanently removed.`,
                          })
                        }}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          <IconDelete /> Delete
                        </button>
                        {/* per-row active toggle */}
                        <button onClick={async () => {
                          try {
                            await manageApi.updateStatus(user.id, user.status === 'Active' ? 'Inactive' : 'Active')
                            await fetchUsers()
                          } catch (err) { alert(err.message) }
                        }}
                          className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${user.status === 'Active' ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}>
                          {user.status === 'Active' ? <IconToggleOn /> : <IconToggleOff />}
                          {user.status === 'Active' ? 'Active' : 'Inactive'}
                        </button>
                        {/* per-row reset */}
                        <button onClick={() => {
                          setResetTargetIds([user.id])
                          setResetForm({ password: '', confirmPassword: '' })
                          setResetErrors({})
                          setShowResetPwd(false)
                          setShowResetConfirm(false)
                          setShowResetModal(true)
                        }}
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

      {/* ── Add User Modal ─────────────────────────────────────────────── */}
      {showAddModal && (
        <Modal onClose={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><IconAdd /></div>
              <h2 className="text-lg font-bold text-gray-800">Add New User</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Full name"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${addErrors.name ? 'border-red-400' : 'border-gray-300'}`} />
                {addErrors.name && <p className="text-xs text-red-500 mt-1">{addErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <PhoneInput value={addForm.phone} onChange={v => setAddForm({ ...addForm, phone: v })} error={addErrors.phone} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <PasswordInput value={addForm.password} onChange={e => setAddForm({ ...addForm, password: e.target.value })}
                  show={showAddPwd} onToggle={() => setShowAddPwd(!showAddPwd)} error={addErrors.password} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <PasswordInput value={addForm.confirmPassword} onChange={e => setAddForm({ ...addForm, confirmPassword: e.target.value })}
                  show={showAddConfirm} onToggle={() => setShowAddConfirm(!showAddConfirm)} error={addErrors.confirmPassword} />
                {addForm.password && addForm.confirmPassword && (
                  <p className={`text-xs mt-1 ${addForm.password === addForm.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                    {addForm.password === addForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Manufacturer</option>
                  <option>Reseller</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <AccountTypePicker
                  accountType={addForm.accountType}
                  freeUntil={addForm.freeUntil}
                  onAccountTypeChange={val => setAddForm({ ...addForm, accountType: val, freeUntil: val === 'Paid' ? null : addForm.freeUntil })}
                  onFreeUntilChange={val => setAddForm({ ...addForm, freeUntil: val })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium">Add User</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Edit User Modal ────────────────────────────────────────────── */}
      {showEditModal && editTarget && (
        <Modal onClose={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><IconEdit /></div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Edit User</h2>
                <p className="text-xs text-gray-400">Editing: {editTarget.name}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <PhoneInput value={editForm.phone} onChange={v => setEditForm({ ...editForm, phone: v })} ringColor="indigo" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>Manufacturer</option>
                  <option>Reseller</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <AccountTypePicker
                  accountType={editForm.accountType}
                  freeUntil={editForm.freeUntil}
                  onAccountTypeChange={val => setEditForm({ ...editForm, accountType: val, freeUntil: val === 'Paid' ? null : editForm.freeUntil })}
                  onFreeUntilChange={val => setEditForm({ ...editForm, freeUntil: val })}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleEdit} className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium">Save Changes</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Reset Password Modal ──────────────────────────────────────── */}
      {showResetModal && (
        <Modal onClose={() => setShowResetModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <IconForgot />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Reset Password</h2>
                <p className="text-xs text-gray-400">
                  {resetTargetIds.length === 1
                    ? `For: ${users.find(u => u.id === resetTargetIds[0])?.name}`
                    : `For ${resetTargetIds.length} selected users`}
                </p>
              </div>
            </div>

            {/* User list when multiple */}
            {resetTargetIds.length > 1 && (
              <div className="mb-4 mt-3 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 max-h-24 overflow-y-auto">
                {resetTargetIds.map(id => {
                  const u = users.find(x => x.id === id)
                  return <p key={id} className="text-xs text-yellow-700">• {u?.name} ({u?.phone})</p>
                })}
              </div>
            )}

            <div className="space-y-4 mt-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <PasswordInput
                  value={resetForm.password}
                  onChange={e => setResetForm({ ...resetForm, password: e.target.value })}
                  show={showResetPwd}
                  onToggle={() => setShowResetPwd(!showResetPwd)}
                  error={resetErrors.password}
                />
              </div>
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <PasswordInput
                  value={resetForm.confirmPassword}
                  onChange={e => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                  show={showResetConfirm}
                  onToggle={() => setShowResetConfirm(!showResetConfirm)}
                  error={resetErrors.confirmPassword}
                />
                {resetForm.password && resetForm.confirmPassword && (
                  <p className={`text-xs mt-1 ${resetForm.password === resetForm.confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                    {resetForm.password === resetForm.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleResetSave}
                className="px-4 py-2 text-sm text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg font-medium">
                Reset Password
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Confirm Delete Modal ──────────────────────────────────────── */}
      {confirmDelete && (
        <ConfirmDeleteModal
          message={confirmDelete.message}
          subMessage={confirmDelete.subMessage}
          loading={deleteLoading}
          onConfirm={handleConfirmDelete}
          onCancel={() => !deleteLoading && setConfirmDelete(null)}
        />
      )}

    </Layout>
  )
}
