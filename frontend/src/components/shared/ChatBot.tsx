import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AIForge assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This feature will be connected to your AI backend. For now, I\'m a placeholder response.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    }, 800)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Panel */}
      <div className={cn(
        'chat-panel fixed bottom-20 right-6 z-50 backdrop-blur-xl border rounded-2xl shadow-2xl transition-all duration-300 ease-out overflow-hidden',
        isOpen
          ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
          : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-[var(--text-on-accent)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">AIForge Assistant</p>
              <p className="text-[10px] text-[var(--success)] flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={cn(
              'flex gap-2.5',
              msg.role === 'user' && 'flex-row-reverse'
            )}>
              {msg.role === 'assistant' && (
                <div className="h-7 w-7 rounded-lg bg-[var(--accent-light)] border border-[var(--border-accent)] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="h-3.5 w-3.5 text-[var(--accent)]" />
                </div>
              )}
              <div className={cn(
                'max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-[var(--accent-medium)] text-[var(--text-primary)] rounded-br-md'
                  : 'bg-[var(--bg-muted)] text-[var(--text-secondary)] rounded-bl-md'
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-[var(--border-primary)]">
          <div className="flex items-center gap-2 bg-[var(--bg-muted)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 focus-within:border-[var(--border-accent)] focus-within:ring-2 focus-within:ring-[var(--accent-light)] transition-all">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="flex-1 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none"
            />
          <button
            onClick={handleSend}
              disabled={!input.trim()}
              className={cn(
                'p-1.5 rounded-lg transition-all',
                input.trim()
                  ? 'text-[var(--accent)] hover:bg-[var(--accent-light)]'
                  : 'text-[var(--text-tertiary)] cursor-not-allowed'
              )}
          >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 group cursor-pointer',
          isOpen
            ? 'chat-toggle--open'
            : 'chat-toggle--closed'
        )}
        aria-label={isOpen ? 'Close AIForge assistant' : 'Open AIForge assistant'}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-[var(--text-primary)]" />
        ) : (
          <MessageCircle className="h-5 w-5 text-[var(--text-on-accent)]" />
        )}
      </button>
    </>
  )
}
