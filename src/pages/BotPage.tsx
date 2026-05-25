// src/pages/BotPage.tsx
import { useState, useEffect, useRef } from 'react'
import { useDebuggerStore } from '@/store/useDebuggerStore'

interface Message {
  sender: 'user' | 'bot'
  text: string
  time: string
  isRead?: boolean
}

interface Chat {
  id: string
  name: string
  avatarText: string
  avatarBg: string
  isVerified?: boolean
  isSaved?: boolean
  lastMessage: string
  lastMessageTime: string
  unreadCount?: number
  messages: Message[]
}

export default function BotPage() {
  const isPlaying = useDebuggerStore((s) => s.isPlaying)
  const totalSteps = useDebuggerStore((s) => s.totalSteps)

  const [activeChatId, setActiveChatId] = useState('internships')
  const [inputText, setInputText] = useState('')
  const [showCommandsMenu, setShowCommandsMenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const initialChats: Chat[] = [
    {
      id: 'internships',
      name: 'InternShips',
      avatarText: 'I',
      avatarBg: 'bg-emerald-600',
      isVerified: false,
      lastMessage: 'Unknown command /rolesactive Send /help for the list.',
      lastMessageTime: '00:09',
      messages: [
        {
          sender: 'bot',
          text: `/filter india on — India/remote only\n/filter india off — Include global roles\n/filter year 2028 — 2028-batch roles only\n/filter year 2026, 2028 — Multiple years\n/filter year all — Clear year filter\n/filter type intern — Internships only\n/filter type all — Intern + new grad\n\n/status — Stats\n/rolesactive — 🔥 Show ALL active India roles right now\n\nATS types: greenhouse lever ashby smartrecruiters\nNote: /add and /filter changes apply on next scan cycle`,
          time: '00:07'
        },
        { sender: 'user', text: '/rolesactive', time: '00:07', isRead: true },
        { sender: 'bot', text: 'Unknown command /rolesactive Send /help for the list.', time: '00:08' },
        { sender: 'user', text: '/rolesactive', time: '00:08', isRead: true },
        { sender: 'bot', text: 'Unknown command /rolesactive Send /help for the list.', time: '00:08' },
        { sender: 'user', text: '/rolesactive', time: '00:09', isRead: true },
        { sender: 'bot', text: 'Unknown command /rolesactive Send /help for the list.', time: '00:09' }
      ]
    },
    {
      id: 'rawdatabot',
      name: 'RawDataBot',
      avatarText: 'R',
      avatarBg: 'bg-blue-600',
      lastMessage: 'Chat ID : 1616644895 First Name : janak Last Name : undefin...',
      lastMessageTime: '23:17',
      messages: [
        {
          sender: 'bot',
          text: 'Chat ID : 1616644895 First Name : janak Last Name : undefined Username : janakkabra Language Code : en',
          time: '23:17'
        }
      ]
    },
    {
      id: 'botfather',
      name: 'BotFather',
      avatarText: 'BF',
      avatarBg: 'bg-zinc-700',
      isVerified: true,
      lastMessage: 'Here is the token for bot InternShips @InternByJBot: ...',
      lastMessageTime: '23:15',
      messages: [
        {
          sender: 'bot',
          text: 'Done! Congratulations on your new bot. You will find it at t.me/InternByJBot. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you\'re done creating your bot, share it with your friends!\n\nUse this token to access the HTTP API:\n6889429188:AAHjB5P111sL9qJ3n4m8oX9-k...',
          time: '23:15'
        }
      ]
    },
    {
      id: 'savedmessages',
      name: 'Saved Messages',
      avatarText: '🔖',
      avatarBg: 'bg-indigo-500',
      isSaved: true,
      lastMessage: '97 paint',
      lastMessageTime: '07-04-2026',
      messages: [
        {
          sender: 'user',
          text: '97 paint',
          time: '07-04-2026',
          isRead: true
        }
      ]
    }
  ]

  const [chats, setChats] = useState<Chat[]>(initialChats)

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeChat.messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputText(val)
    if (val.startsWith('/')) {
      setShowCommandsMenu(true)
    } else {
      setShowCommandsMenu(false)
    }
  }

  const handleSelectCommand = (cmd: string) => {
    setInputText(cmd)
    setShowCommandsMenu(false)
  }

  const triggerBotReply = (userMsg: string) => {
    let replyText = ''
    const timeNow = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    const cleanMsg = userMsg.trim().toLowerCase()

    if (cleanMsg === '/help') {
      replyText = `Available commands for InternShips bot:\n\n/rolesactive — Show all currently active India & Remote roles\n/filter india [on/off] — Toggle remote-only roles\n/filter year [all/2026/2028] — Filter by target batch year\n/status — Check debugger simulation metrics\n/visualize — Trigger execution replay\n/clear — Clear chat messages`
    } else if (cleanMsg === '/rolesactive') {
      replyText = `🔥 Active Roles Found in India / Remote:\n\n1. 🏢 Google India — Software Engineering Intern (2026/2027) [Greenhouse]\n2. ⚡ Vercel — Frontend Engineering Intern (Remote) [Lever]\n3. 🧠 DeepMind — AI Research Intern (Remote) [Lever]\n4. 🎨 Stripe India — Product Design Intern (Bangalore) [Ashby]\n5. 🧩 Atlassian — Graduate Software Engineer (2026) [SmartRecruiters]\n\nType /filter to refine these results.`
    } else if (cleanMsg === '/status') {
      replyText = `⚙️ AlgoPlay System Status:\n\n- Render Engine: 60 FPS Hardware-Accelerated Canvas\n- Total Steps Pre-Calculated: ${totalSteps}\n- Debbuger State: ${isPlaying ? 'PLAYING' : 'PAUSED'}\n- Performance: Sub-500ms filter processing speed\n- Local Status: Online & Healthy.`
    } else if (cleanMsg.startsWith('/filter india')) {
      const mode = cleanMsg.includes('on') ? 'ON' : 'OFF'
      replyText = `✅ India/Remote filter set to: ${mode}. Target roles will update on the next scan cycle.`
    } else if (cleanMsg.startsWith('/filter year')) {
      const year = cleanMsg.replace('/filter year', '').trim()
      replyText = `✅ Target batch year filter applied: ${year || 'all'}`
    } else if (cleanMsg === '/visualize') {
      replyText = `⚡ Command received! Starting visualization playback inside the AlgoPlay controller.`
    } else if (cleanMsg === '/clear') {
      setChats((prevChats) =>
        prevChats.map((c) => (c.id === activeChatId ? { ...c, messages: [] } : c))
      )
      return
    } else {
      replyText = `🤖 InternShips Companion Bot:\n\nI didn't recognize "${userMsg}". Try typing /help to see my available commands, or /rolesactive to view matching jobs.`
    }

    setTimeout(() => {
      setChats((prevChats) =>
        prevChats.map((c) => {
          if (c.id === activeChatId) {
            const updatedMessages: Message[] = [
              ...c.messages,
              { sender: 'bot', text: replyText, time: timeNow }
            ]
            return {
              ...c,
              lastMessage: replyText.replace(/\n/g, ' ').substring(0, 60) + '...',
              lastMessageTime: timeNow,
              messages: updatedMessages
            }
          }
          return c
        })
      )
    }, 600)
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim()) return

    const userMsg = inputText
    const timeNow = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    setChats((prevChats) =>
      prevChats.map((c) => {
        if (c.id === activeChatId) {
          const updatedMessages: Message[] = [
            ...c.messages,
            { sender: 'user', text: userMsg, time: timeNow, isRead: true }
          ]
          return {
            ...c,
            lastMessage: userMsg,
            lastMessageTime: timeNow,
            messages: updatedMessages
          }
        }
        return c
      })
    )

    setInputText('')
    setShowCommandsMenu(false)
    triggerBotReply(userMsg)
  }

  const commandsList = [
    { cmd: '/rolesactive', desc: '🔥 Show ALL active India roles right now' },
    { cmd: '/filter india on', desc: 'India/remote only' },
    { cmd: '/filter india off', desc: 'Include global roles' },
    { cmd: '/filter year 2028', desc: '2028-batch roles only' },
    { cmd: '/filter type intern', desc: 'Internships only' },
    { cmd: '/status', desc: 'Check debugger status metrics' },
    { cmd: '/visualize', desc: 'Trigger algorithm animation playback' },
    { cmd: '/help', desc: 'Show bot commands help' }
  ]

  return (
    <div className="flex h-full overflow-hidden bg-[#0e1621] select-none">
      {/* Chats List Sidebar (Left Panel) */}
      <div className="w-80 border-r border-[#101921] bg-[#17212b] flex flex-col shrink-0">
        {/* Search Header */}
        <div className="p-3 shrink-0 flex items-center gap-3">
          <button className="text-zinc-400 hover:text-zinc-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#24303f] border-none text-sm text-zinc-100 rounded-full pl-9 pr-4 py-1.5 focus:ring-0 focus:outline-none placeholder-zinc-500"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
            </svg>
          </div>
        </div>

        {/* Chats Listing */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId
            return (
              <div
                key={chat.id}
                onClick={() => {
                  setActiveChatId(chat.id)
                  setInputText('')
                  setShowCommandsMenu(false)
                }}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-[#131b22]/40
                  ${isActive ? 'bg-[#2b5278] text-white' : 'hover:bg-[#202b36] text-zinc-300'}`}
              >
                {/* Avatar */}
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shrink-0 shadow-sm ${chat.avatarBg}`}>
                  {chat.avatarText}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-zinc-100'}`}>
                        {chat.name}
                      </span>
                      {chat.isVerified && (
                        <svg className="w-4 h-4 text-sky-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${isActive ? 'text-zinc-200' : 'text-zinc-400'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Chat Messages Panel (Right Panel) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="h-14 bg-[#17212b] border-b border-[#101921] px-4 flex items-center justify-between shrink-0">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-zinc-100 tracking-wide">{activeChat.name}</span>
            <span className="text-[10px] text-zinc-500 lowercase tracking-wider font-semibold">bot</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <button className="hover:text-zinc-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4.5 h-4.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
              </svg>
            </button>
            <button className="hover:text-zinc-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor" className="w-4.5 h-4.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0e1621] relative">
          <div className="absolute inset-0 bg-[radial-gradient(#17212b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
          
          {activeChat.messages.map((msg, idx) => {
            const isBot = msg.sender === 'bot'
            return (
              <div
                key={idx}
                className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in duration-200`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl relative shadow-md flex flex-col gap-1.5
                    ${isBot ? 'bg-[#182533] text-zinc-100 rounded-bl-none' : 'bg-[#2b5278] text-white rounded-br-none'}`}
                >
                  <p className="text-xs leading-relaxed whitespace-pre-wrap select-text font-sans">
                    {msg.text}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 self-end text-[9px] text-zinc-400 select-none">
                    <span>{msg.time}</span>
                    {!isBot && msg.isRead && (
                      <svg className="w-3.5 h-3.5 text-sky-400 fill-current" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Command Overlay Menu (Floating above input) */}
        {showCommandsMenu && activeChatId === 'internships' && (
          <div className="absolute bottom-[58px] left-4 right-4 bg-[#17212b] border border-[#101921] rounded-xl shadow-2xl p-2 z-50 flex flex-col gap-1 max-h-48 overflow-y-auto">
            {commandsList.map((cmdItem) => (
              <div
                key={cmdItem.cmd}
                onClick={() => handleSelectCommand(cmdItem.cmd)}
                className="flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-[#2b5278] hover:text-white cursor-pointer transition-colors text-xs text-zinc-300"
              >
                <span className="font-mono font-semibold text-indigo-400 hover:text-white">{cmdItem.cmd}</span>
                <span className="text-[10px] text-zinc-500 hover:text-zinc-200">{cmdItem.desc}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Input Area */}
        <form
          onSubmit={handleSendMessage}
          className="h-14 bg-[#17212b] border-t border-[#101921] px-4 flex items-center gap-3 shrink-0 relative"
        >
          <button
            type="button"
            onClick={() => setShowCommandsMenu((prev) => !prev)}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <span className="text-sm font-mono font-bold">/</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Write a message..."
            className="flex-1 bg-transparent border-none text-xs text-zinc-100 rounded-none px-0 py-2 focus:ring-0 focus:outline-none placeholder-zinc-500"
            style={{ background: 'transparent !important', border: 'none !important' }}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="text-[#2a87d0] hover:text-sky-400 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}
