import { useMemo, useState } from 'react'
import Layout from '../components/Layout'

const people = [
  { id: 1, name: 'Nadia Rahman', role: 'Manufacturer', status: 'Online', avatar: 'NR', color: '#C8A96E' },
  { id: 2, name: 'Samuel Bekele', role: 'Cashier', status: 'Away', avatar: 'SB', color: '#8A5A44' },
  { id: 3, name: 'Mihret Yisak', role: 'Reseller', status: 'Online', avatar: 'MY', color: '#4D7C6A' },
  { id: 4, name: 'Selam Hailu', role: 'Admin', status: 'Offline', avatar: 'SH', color: '#7B8FA1' },
  { id: 5, name: 'Abel Tadesse', role: 'Support', status: 'Online', avatar: 'AT', color: '#A56A6A' },
  { id: 6, name: 'Hanna Daniel', role: 'Manager', status: 'Online', avatar: 'HD', color: '#5C6AC4' },
]

const chats = {
  1: [
    { id: 1, sender: 'them', text: 'Hi, can we confirm the leather order for tomorrow?', time: '09:12 AM' },
    { id: 2, sender: 'me', text: 'Yes, we have 4 rolls ready for dispatch.', time: '09:14 AM' },
    { id: 3, sender: 'them', text: 'Perfect, I will send the driver details shortly.', time: '09:15 AM' },
  ],
  2: [
    { id: 1, sender: 'them', text: 'The sales report has been uploaded.', time: '08:40 AM' },
    { id: 2, sender: 'me', text: 'Thanks, I will review it before lunch.', time: '08:41 AM' },
  ],
  3: [
    { id: 1, sender: 'them', text: 'We are running low on packaging materials.', time: 'Yesterday' },
    { id: 2, sender: 'me', text: 'I will check the stock level and update you.', time: 'Yesterday' },
  ],
  4: [
    { id: 1, sender: 'them', text: 'Please review the monthly inventory summary.', time: 'Mon' },
  ],
  5: [
    { id: 1, sender: 'them', text: 'The customer issue is now resolved.', time: 'Sun' },
    { id: 2, sender: 'me', text: 'Great, thanks for the quick follow-up.', time: 'Sun' },
  ],
  6: [
    { id: 1, sender: 'them', text: 'Let’s schedule a quick planning meeting.', time: 'Last week' },
  ],
}

export default function Chat() {
  const [search, setSearch] = useState('')
  const [selectedPersonId, setSelectedPersonId] = useState(1)

  const filteredPeople = useMemo(() => {
    return people.filter((person) =>
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.role.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  const selectedPerson = filteredPeople.find((person) => person.id === selectedPersonId)
    || people.find((person) => person.id === selectedPersonId)
    || people[0]

  const conversation = chats[selectedPerson.id] || []

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#2D2D2D' }}>
              Chat
            </h1>
            <p className="mt-2 text-base" style={{ color: '#5A5A5A' }}>
              People and conversations
            </p>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-2xl shadow-sm"
          style={{ backgroundColor: '#FFFDF9', border: '1px solid rgba(200,169,110,0.18)' }}
        >
          <div className="grid min-h-[680px] lg:grid-cols-[340px_minmax(0,1fr)]">
            <aside
              className="border-b lg:border-b-0 lg:border-r"
              style={{ backgroundColor: '#F8F2EA', borderColor: 'rgba(200,169,110,0.2)' }}
            >
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
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search people"
                    className="w-full bg-transparent text-sm outline-none"
                    style={{ color: '#2D2D2D' }}
                  />
                </div>
              </div>

              <div className="max-h-[560px] overflow-y-auto">
                {filteredPeople.length === 0 ? (
                  <div className="p-6 text-sm" style={{ color: '#5A5A5A' }}>No people found.</div>
                ) : (
                  filteredPeople.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => setSelectedPersonId(person.id)}
                      className="flex w-full items-center gap-3 border-b px-4 py-3 text-left transition"
                      style={{
                        backgroundColor: person.id === selectedPerson.id ? 'rgba(200,169,110,0.1)' : 'transparent',
                        borderColor: 'rgba(200,169,110,0.12)',
                      }}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full font-semibold text-xs" style={{ backgroundColor: person.color, color: '#fff' }}>
                        {person.avatar}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate font-semibold" style={{ color: '#2D2D2D' }}>{person.name}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: person.status === 'Online' ? 'rgba(76,175,80,0.1)' : 'rgba(150,150,150,0.1)', color: person.status === 'Online' ? '#2E7D32' : '#6B7280' }}>
                            {person.status}
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: '#6B5D4F' }}>{person.role}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </aside>

            <section className="flex min-h-0 flex-col">
              <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'rgba(200,169,110,0.18)' }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full font-semibold text-xs" style={{ backgroundColor: selectedPerson.color, color: '#fff' }}>
                    {selectedPerson.avatar}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#2D2D2D' }}>{selectedPerson.name}</p>
                    <p className="text-xs" style={{ color: '#6B5D4F' }}>{selectedPerson.role}</p>
                  </div>
                </div>
                <span className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(76,175,80,0.1)', color: '#2E7D32' }}>
                  {selectedPerson.status}
                </span>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto bg-white px-5 py-5">
                {conversation.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className="max-w-[75%] rounded-2xl px-4 py-3 text-sm"
                      style={{
                        backgroundColor: message.sender === 'me' ? '#C8A96E' : '#F2E9DF',
                        color: message.sender === 'me' ? '#fff' : '#2D2D2D',
                      }}
                    >
                      <p>{message.text}</p>
                      <p className={`mt-2 text-[10px] ${message.sender === 'me' ? 'text-white/80' : 'text-[#7A6A57]'}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t px-4 py-3" style={{ borderColor: 'rgba(200,169,110,0.18)', backgroundColor: '#FFFDF9' }}>
                <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ backgroundColor: '#F8F2EA', border: '1px solid rgba(200,169,110,0.14)' }}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent py-2 text-sm outline-none"
                    style={{ color: '#2D2D2D' }}
                  />
                  <button
                    type="button"
                    className="rounded-lg px-4 py-2 text-sm font-medium"
                    style={{ backgroundColor: '#C8A96E', color: '#1A1A1A' }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  )
}
