import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../api/client'

const palette = ['#C8A96E', '#8A5A44', '#4D7C6A', '#7B8FA1', '#A56A6A', '#5C6AC4', '#7C3AED']

function formatTime(value) {
  if (!value) return 'Now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export default function Chat() {
  const [people, setPeople] = useState([])
  const [search, setSearch] = useState('')
  const [selectedPersonId, setSelectedPersonId] = useState('')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loadingPeople, setLoadingPeople] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const fetchPeople = async (query = '') => {
    try {
      setLoadingPeople(true)
      const res = await api.get(`/chat/people${query ? `?search=${encodeURIComponent(query)}` : ''}`)
      const list = res?.data || []
      setPeople(list)
      if (!selectedPersonId && list[0]) setSelectedPersonId(list[0].id)
      if (selectedPersonId && !list.some((person) => person.id === selectedPersonId) && list[0]) {
        setSelectedPersonId(list[0].id)
      }
    } catch (err) {
      console.error('Failed to load chat people', err)
      setPeople([])
    } finally {
      setLoadingPeople(false)
    }
  }

  useEffect(() => {
    fetchPeople(search)
  }, [search])

  useEffect(() => {
    if (!selectedPersonId) return
    const loadMessages = async () => {
      try {
        setLoadingMessages(true)
        const res = await api.get(`/chat/messages/${selectedPersonId}`)
        const list = (res?.data || []).map((message) => ({
          id: message.id,
          sender: message.isMine ? 'me' : 'them',
          text: message.message,
          time: formatTime(message.createdAt),
        }))
        setMessages(list)
      } catch (err) {
        console.error('Failed to load chat messages', err)
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessages()
  }, [selectedPersonId])

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      const haystack = `${person.name || ''} ${person.role || ''}`.toLowerCase()
      return haystack.includes(search.toLowerCase())
    })
  }, [people, search])

  const selectedPerson = filteredPeople.find((person) => person.id === selectedPersonId)
    || people.find((person) => person.id === selectedPersonId)
    || null

  const sendMessage = async () => {
    if (!selectedPerson || !draft.trim()) return
    try {
      await api.post('/chat/send', {
        receiverId: selectedPerson.id,
        message: draft.trim(),
      })
      setDraft('')
      const res = await api.get(`/chat/messages/${selectedPerson.id}`)
      const list = (res?.data || []).map((message) => ({
        id: message.id,
        sender: message.isMine ? 'me' : 'them',
        text: message.message,
        time: formatTime(message.createdAt),
      }))
      setMessages(list)
    } catch (err) {
      console.error('Failed to send chat message', err)
    }
  }

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#2D2D2D' }}>Chat</h1>
            <p className="mt-2 text-base" style={{ color: '#5A5A5A' }}>People and conversations</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl shadow-sm" style={{ backgroundColor: '#FFFDF9', border: '1px solid rgba(200,169,110,0.18)' }}>
          <div className="grid min-h-[680px] lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="border-b lg:border-b-0 lg:border-r" style={{ backgroundColor: '#F8F2EA', borderColor: 'rgba(200,169,110,0.2)' }}>
              <div className="flex items-center justify-between px-4 py-4 border-b" style={{ borderColor: 'rgba(200,169,110,0.18)' }}>
                <h2 className="text-lg font-semibold" style={{ color: '#2D2D2D' }}>People</h2>
                <button type="button" className="rounded-full p-2 transition hover:opacity-80" style={{ backgroundColor: 'rgba(200,169,110,0.12)', color: '#C8A96E' }} aria-label="Search people">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              <div className="px-3 py-3 border-b" style={{ borderColor: 'rgba(200,169,110,0.18)' }}>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ backgroundColor: '#F3E9DD', border: '1px solid rgba(200,169,110,0.18)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: '#7A6A57' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people" className="w-full bg-transparent text-sm outline-none" style={{ color: '#2D2D2D' }} />
                </div>
              </div>

              <div className="max-h-[560px] overflow-y-auto">
                {loadingPeople ? (
                  <div className="p-6 text-sm" style={{ color: '#5A5A5A' }}>Loading people…</div>
                ) : filteredPeople.length === 0 ? (
                  <div className="p-6 text-sm" style={{ color: '#5A5A5A' }}>No people found.</div>
                ) : (
                  filteredPeople.map((person, index) => {
                    const color = palette[index % palette.length]
                    const avatar = person.avatar || (person.name || 'U').split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()
                    const isSelected = person.id === selectedPersonId
                    return (
                      <button key={person.id} type="button" onClick={() => setSelectedPersonId(person.id)} className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition" style={{ backgroundColor: isSelected ? 'rgba(200,169,110,0.1)' : 'transparent', borderColor: 'rgba(200,169,110,0.12)' }}>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full font-semibold text-xs" style={{ backgroundColor: color, color: '#fff' }}>{avatar}</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="truncate font-semibold" style={{ color: '#2D2D2D' }}>{person.name}</p>
                            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: person.status === 'Active' ? 'rgba(76,175,80,0.1)' : 'rgba(150,150,150,0.1)', color: person.status === 'Active' ? '#2E7D32' : '#6B7280' }}>{person.status || 'Active'}</span>
                          </div>
                          <p className="text-xs" style={{ color: '#6B5D4F' }}>{person.role}</p>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </aside>

            <section className="flex min-h-0 flex-col">
              {selectedPerson ? (
                <>
                  <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'rgba(200,169,110,0.18)' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full font-semibold text-xs" style={{ backgroundColor: palette[0], color: '#fff' }}>{(selectedPerson.name || 'U').split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()}</div>
                      <div>
                        <p className="font-semibold" style={{ color: '#2D2D2D' }}>{selectedPerson.name}</p>
                        <p className="text-xs" style={{ color: '#6B5D4F' }}>{selectedPerson.role}</p>
                      </div>
                    </div>
                    <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(76,175,80,0.1)', color: '#2E7D32' }}>{selectedPerson.status || 'Active'}</span>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto bg-white px-5 py-5">
                    {loadingMessages ? (
                      <div className="text-sm text-gray-400">Loading messages…</div>
                    ) : messages.length === 0 ? (
                      <div className="text-sm text-gray-400">No messages yet.</div>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: message.sender === 'me' ? '#C8A96E' : '#F2E9DF', color: message.sender === 'me' ? '#fff' : '#2D2D2D' }}>
                            <p>{message.text}</p>
                            <p className={`mt-2 text-[10px] ${message.sender === 'me' ? 'text-white/80' : 'text-[#7A6A57]'}`}>{message.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(200,169,110,0.18)', backgroundColor: '#FFFDF9' }}>
                    <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ backgroundColor: '#F8F2EA', border: '1px solid rgba(200,169,110,0.14)' }}>
                      <input type="text" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." className="flex-1 bg-transparent py-2 text-sm outline-none" style={{ color: '#2D2D2D' }} onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }} />
                      <button type="button" onClick={sendMessage} className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: '#C8A96E', color: '#1A1A1A' }}>Send</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">Select a person to start chatting</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}
