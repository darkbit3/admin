import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import { api } from '../api/client'

// ── colour tokens ──────────────────────────────────────────────────────────
const GOLD        = '#C8A96E'
const GOLD_LIGHT  = 'rgba(200,169,110,0.10)'
const GOLD_BORDER = 'rgba(200,169,110,0.20)'
const DARK        = '#1C1C1C'
const SA_PURPLE   = '#7C3AED'
const SA_BG       = 'rgba(124,58,237,0.10)'
const SA_BORDER   = 'rgba(124,58,237,0.22)'

const palette = [GOLD, '#8A5A44', '#4D7C6A', '#7B8FA1', '#A56A6A', '#5C6AC4', SA_PURPLE]

function formatTime(value) {
  if (!value) return 'Now'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(d)
}

function initials(name) {
  return (name || 'U').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || 'U'
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name, isSuperAdmin, color, size = 44 }) {
  const bg = isSuperAdmin ? SA_PURPLE : (color || GOLD)
  return (
    <div className="relative flex-shrink-0">
      <div className="flex items-center justify-center rounded-full font-semibold text-xs text-white"
        style={{ width: size, height: size, backgroundColor: bg, fontSize: size < 36 ? 10 : 12 }}>
        {initials(name)}
      </div>
      {isSuperAdmin && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[8px] text-white font-bold"
          style={{ width: 16, height: 16, backgroundColor: SA_PURPLE, border: '1.5px solid #fff' }}>
          ★
        </span>
      )}
    </div>
  )
}

// ── Role badge ─────────────────────────────────────────────────────────────
function RoleBadge({ role, isSuperAdmin }) {
  if (isSuperAdmin) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
        style={{ backgroundColor: SA_BG, color: SA_PURPLE, border: `1px solid ${SA_BORDER}` }}>
        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Super Admin
      </span>
    )
  }
  const roleColors = {
    Manufacturer: { bg: 'rgba(16,185,129,0.10)', text: '#047857', border: 'rgba(16,185,129,0.25)' },
    Reseller:     { bg: 'rgba(59,130,246,0.10)',  text: '#1d4ed8', border: 'rgba(59,130,246,0.25)' },
    Cashier:      { bg: 'rgba(245,158,11,0.10)',  text: '#b45309', border: 'rgba(245,158,11,0.25)' },
    Cutter:       { bg: 'rgba(168,85,247,0.10)',  text: '#7e22ce', border: 'rgba(168,85,247,0.25)' },
  }
  const c = roleColors[role] || { bg: GOLD_LIGHT, text: '#7A5C2E', border: GOLD_BORDER }
  return (
    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
      {role}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
export default function Chat() {
  const [people,           setPeople]           = useState([])
  const [search,           setSearch]           = useState('')
  const [selectedPersonId, setSelectedPersonId] = useState('')
  const [messages,         setMessages]         = useState([])
  const [draft,            setDraft]            = useState('')
  const [loadingPeople,    setLoadingPeople]    = useState(true)
  const [loadingMessages,  setLoadingMessages]  = useState(false)
  const [sending,          setSending]          = useState(false)
  const [mobileShowChat,   setMobileShowChat]   = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef       = useRef(null)

  // ── Load people ──────────────────────────────────────────────────────────
  const fetchPeople = useCallback(async (query = '') => {
    try {
      setLoadingPeople(true)
      const res  = await api.get(`/chat/people${query ? `?search=${encodeURIComponent(query)}` : ''}`)
      const list = res?.data || []
      setPeople(list)
      if (!selectedPersonId && list[0]) setSelectedPersonId(list[0].id)
    } catch (err) {
      console.error('Failed to load contacts', err)
      setPeople([])
    } finally {
      setLoadingPeople(false)
    }
  }, [])  // eslint-disable-line

  useEffect(() => { fetchPeople(search) }, [search])   // eslint-disable-line

  // ── Load messages ────────────────────────────────────────────────────────
  const loadMessages = useCallback(async (personId) => {
    if (!personId) return
    try {
      setLoadingMessages(true)
      const res  = await api.get(`/chat/messages/${personId}`)
      setMessages((res?.data || []).map(m => ({
        id:     m.id,
        sender: m.isMine ? 'me' : 'them',
        text:   m.message,
        time:   formatTime(m.createdAt),
      })))
    } catch (err) {
      console.error('Failed to load messages', err)
      setMessages([])
    } finally {
      setLoadingMessages(false)
    }
  }, [])

  useEffect(() => { loadMessages(selectedPersonId) }, [selectedPersonId])   // eslint-disable-line

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-refresh every 8 seconds
  useEffect(() => {
    if (!selectedPersonId) return
    const id = setInterval(() => loadMessages(selectedPersonId), 8000)
    return () => clearInterval(id)
  }, [selectedPersonId, loadMessages])

  // ── Filtered / grouped contacts ──────────────────────────────────────────
  const filteredPeople = useMemo(() => {
    if (!search) return people
    const q = search.toLowerCase()
    return people.filter(p => `${p.name || ''} ${p.role || ''}`.toLowerCase().includes(q))
  }, [people, search])

  const superAdminContacts = filteredPeople.filter(p => p.isSuperAdmin)
  const otherContacts      = filteredPeople.filter(p => !p.isSuperAdmin)
  const selectedPerson     = people.find(p => p.id === selectedPersonId) || null

  // ── Send ─────────────────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!selectedPerson || !draft.trim() || sending) return
    const text = draft.trim()
    setDraft('')
    setSending(true)
    // Optimistic
    setMessages(prev => [...prev, {
      id: `tmp-${Date.now()}`, sender: 'me', text, time: formatTime(new Date().toISOString()),
    }])
    try {
      await api.post('/chat/send', {
        receiverId:   selectedPerson.id,
        receiverRole: selectedPerson.isSuperAdmin ? 'super_admin' : 'user',
        message:      text,
      })
      await loadMessages(selectedPerson.id)
    } catch (err) {
      console.error('Failed to send message', err)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const selectPerson = (id) => {
    setSelectedPersonId(id)
    setMobileShowChat(true)
  }

  // ── Person row ───────────────────────────────────────────────────────────
  const PersonRow = ({ person, colorIdx }) => {
    const color      = palette[colorIdx % palette.length]
    const isSelected = person.id === selectedPersonId
    return (
      <button type="button"
        onClick={() => selectPerson(person.id)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-all border-b"
        style={{
          backgroundColor: isSelected ? (person.isSuperAdmin ? SA_BG : GOLD_LIGHT) : 'transparent',
          borderColor:      GOLD_BORDER,
          borderLeft:       isSelected
            ? `3px solid ${person.isSuperAdmin ? SA_PURPLE : GOLD}`
            : '3px solid transparent',
        }}>
        <Avatar name={person.name} isSuperAdmin={person.isSuperAdmin} color={color} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold mb-0.5" style={{ color: DARK }}>{person.name}</p>
          <RoleBadge role={person.role} isSuperAdmin={person.isSuperAdmin} />
        </div>
        <span className="flex-shrink-0 w-2 h-2 rounded-full"
          style={{ backgroundColor: person.status === 'Active' ? '#10B981' : '#9CA3AF' }} />
      </button>
    )
  }

  // ── Full chat panel (used for both desktop right + mobile full-screen) ───
  const ConversationPanel = () => (
    <section className="flex flex-col min-h-0 flex-1">
      {selectedPerson ? (
        <>
          {/* Header */}
          <div className="flex items-center gap-3 border-b px-4 py-3 flex-shrink-0"
            style={{ borderColor: GOLD_BORDER, backgroundColor: '#FFFDF9' }}>
            {/* Mobile back button */}
            <button type="button"
              onClick={() => setMobileShowChat(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg mr-1 transition-colors"
              style={{ backgroundColor: GOLD_LIGHT }}
              aria-label="Back to contacts">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <Avatar name={selectedPerson.name} isSuperAdmin={selectedPerson.isSuperAdmin}
              color={GOLD} size={40} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-tight" style={{ color: DARK }}>
                {selectedPerson.name}
              </p>
              <div className="mt-0.5">
                <RoleBadge role={selectedPerson.role} isSuperAdmin={selectedPerson.isSuperAdmin} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium"
              style={{ color: selectedPerson.status === 'Active' ? '#059669' : '#6B7280' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: selectedPerson.status === 'Active' ? '#10B981' : '#9CA3AF' }} />
              {selectedPerson.status || 'Active'}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-white px-5 py-4 space-y-3 min-h-0">
            {loadingMessages ? (
              <div className="flex items-center gap-2 text-sm py-6" style={{ color: '#9A8070' }}>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Loading messages…
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: GOLD_LIGHT }}>
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: '#9A8070' }}>
                  Start the conversation with {selectedPerson.name}
                </p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender !== 'me' && (
                    <Avatar name={selectedPerson.name} isSuperAdmin={selectedPerson.isSuperAdmin}
                      color={GOLD} size={30} />
                  )}
                  <div className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm shadow-sm mx-2 ${msg.sender === 'me' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                    style={{
                      backgroundColor: msg.sender === 'me'
                        ? (selectedPerson.isSuperAdmin ? SA_PURPLE : GOLD)
                        : '#F5EDE0',
                      color: msg.sender === 'me' ? '#fff' : DARK,
                    }}>
                    <p className="leading-relaxed break-words">{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${msg.sender === 'me' ? 'opacity-70' : ''}`}
                      style={{ color: msg.sender === 'me' ? 'inherit' : '#9A8070' }}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t px-4 py-3 flex-shrink-0"
            style={{ borderColor: GOLD_BORDER, backgroundColor: '#FFFDF9' }}>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ backgroundColor: '#F8F2EA', border: `1px solid ${GOLD_BORDER}` }}>
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message ${selectedPerson.name}…`}
                className="flex-1 bg-transparent text-sm outline-none resize-none leading-relaxed"
                style={{ color: DARK, maxHeight: 96 }}
              />
              <button type="button" onClick={sendMessage}
                disabled={!draft.trim() || sending}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all disabled:opacity-40 flex-shrink-0"
                style={{ backgroundColor: selectedPerson.isSuperAdmin ? SA_PURPLE : GOLD, color: selectedPerson.isSuperAdmin ? '#fff' : DARK }}>
                {sending ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
                Send
              </button>
            </div>
            <p className="mt-1 text-[10px] text-right" style={{ color: '#C0A882' }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: GOLD_LIGHT }}>
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke={GOLD} strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: '#9A8070' }}>
            Select a contact to start chatting
          </p>
        </div>
      )}
    </section>
  )

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: DARK }}>Chat</h1>
          <p className="mt-1 text-sm" style={{ color: '#6B5D4F' }}>
            Message your users and super admin
          </p>
        </div>

        {/* Panel */}
        <div className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: '#FFFDF9', border: `1px solid ${GOLD_BORDER}` }}>
          <div className="min-h-[680px]">

            {/* ── Mobile: full screen views ─────────────────────────── */}
            <div className="lg:hidden flex flex-col" style={{ minHeight: 680 }}>
              {!mobileShowChat ? (
                /* Mobile contacts */
                <aside className="flex flex-col flex-1" style={{ backgroundColor: '#FAF4EC' }}>
                  <ContactsSidebar
                    loadingPeople={loadingPeople}
                    superAdminContacts={superAdminContacts}
                    otherContacts={otherContacts}
                    PersonRow={PersonRow}
                    search={search}
                    setSearch={setSearch}
                    filteredPeople={filteredPeople}
                  />
                </aside>
              ) : (
                <ConversationPanel />
              )}
            </div>

            {/* ── Desktop: side by side ─────────────────────────────── */}
            <div className="hidden lg:grid lg:grid-cols-[320px_minmax(0,1fr)]" style={{ minHeight: 680 }}>
              <aside className="flex flex-col border-r" style={{ backgroundColor: '#FAF4EC', borderColor: GOLD_BORDER }}>
                <ContactsSidebar
                  loadingPeople={loadingPeople}
                  superAdminContacts={superAdminContacts}
                  otherContacts={otherContacts}
                  PersonRow={PersonRow}
                  search={search}
                  setSearch={setSearch}
                  filteredPeople={filteredPeople}
                />
              </aside>
              <ConversationPanel />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

// ── Contacts sidebar (reused for mobile + desktop) ─────────────────────────
function ContactsSidebar({ loadingPeople, superAdminContacts, otherContacts, PersonRow, search, setSearch, filteredPeople }) {
  const GOLD_BORDER = 'rgba(200,169,110,0.20)'
  const GOLD_LIGHT  = 'rgba(200,169,110,0.10)'
  const DARK        = '#1C1C1C'

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
        style={{ borderColor: GOLD_BORDER }}>
        <div>
          <h2 className="text-base font-bold" style={{ color: DARK }}>Contacts</h2>
          <p className="text-[10px] mt-0.5" style={{ color: '#9A8070' }}>
            {filteredPeople.length} contact{filteredPeople.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b flex-shrink-0" style={{ borderColor: GOLD_BORDER }}>
        <div className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ backgroundColor: '#F3E9DD', border: `1px solid ${GOLD_BORDER}` }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24"
            stroke="#9A8070" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="w-full bg-transparent text-sm outline-none"
            style={{ color: DARK }}
          />
          {search && (
            <button type="button" onClick={() => setSearch('')}
              className="text-xs flex-shrink-0" style={{ color: '#9A8070' }}>✕</button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loadingPeople ? (
          <div className="flex items-center gap-2 p-6 text-sm" style={{ color: '#9A8070' }}>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading contacts…
          </div>
        ) : filteredPeople.length === 0 ? (
          <div className="p-6 text-sm text-center" style={{ color: '#9A8070' }}>
            No contacts found.
          </div>
        ) : (
          <>
            {/* ── Super Admin section ─────────────────────────────── */}
            {superAdminContacts.length > 0 && (
              <div>
                <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                    style={{ color: '#7C3AED' }}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#7C3AED' }}>
                    Super Admin
                  </p>
                </div>
                {superAdminContacts.map((p, i) => (
                  <PersonRow key={p.id} person={p} colorIdx={i} />
                ))}
              </div>
            )}

            {/* ── Divider ─────────────────────────────────────────── */}
            {superAdminContacts.length > 0 && otherContacts.length > 0 && (
              <div className="px-4 pt-3 pb-1.5 border-t flex items-center gap-2 mt-1"
                style={{ borderColor: GOLD_BORDER }}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#9A8070" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9A8070' }}>
                  Your Users
                </p>
              </div>
            )}
            {otherContacts.length > 0 && !superAdminContacts.length && (
              <div className="px-4 pt-3 pb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#9A8070' }}>
                  Your Users
                </p>
              </div>
            )}

            {/* ── Other contacts ───────────────────────────────────── */}
            {otherContacts.map((p, i) => (
              <PersonRow key={p.id} person={p} colorIdx={i + superAdminContacts.length} />
            ))}
          </>
        )}
      </div>
    </>
  )
}
