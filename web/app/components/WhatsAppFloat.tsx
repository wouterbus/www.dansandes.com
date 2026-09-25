'use client'

import { useEffect, useId, useRef, useState } from 'react'

import { useSplashComplete } from '../lib/useSplashComplete'
import { whatsappSiteMessage, whatsappUrl } from '../lib/whatsapp'

type ChatMessage = {
  from: 'bot' | 'user'
  text: string
}

const GREETING: ChatMessage = {
  from: 'bot',
  text: 'Oi! Seja bem-vindo à Sandes :) ',
}

const FOLLOW_UP: ChatMessage = {
  from: 'bot',
  text: 'O que vamos criar juntos? ',
}

const QUICK_REPLIES = [
  'Um novo projeto',
  'Conteúdo para minha marca',
  'Uma parceria criativa',
  'Conhecer melhor a Sandes',
]

export default function WhatsAppFloat() {
  const splashComplete = useSplashComplete()

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)

  const panelId = useId()

  const scrollRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Prevent the automatic popup from happening more than once.
  const autoOpenedRef = useRef(false)

  /**
   * Automatically open the WhatsApp chat when
   * .cases-section__head reaches the middle of the viewport.
   */
  useEffect(() => {
    const target = document.querySelector('.cases-section__head')

    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        if (autoOpenedRef.current) return

        autoOpenedRef.current = true
        setOpen(true)
      },
      {
        // The element is considered "in the middle"
        // when the center of the viewport intersects it.
        root: null,
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      },
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [])

  /**
   * Show the follow-up message after the chat opens.
   */
  useEffect(() => {
    if (!open) return

    setTyping(true)

    const timer = window.setTimeout(() => {
      setTyping(false)

      setMessages((current) =>
        current.length === 1 ? [...current, FOLLOW_UP] : current,
      )
    }, 900)

    return () => window.clearTimeout(timer)
  }, [open])

  /**
   * Keep the chat scrolled to the latest message.
   */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, typing, open])

  /**
   * Close on Escape and outside click.
   */
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node

      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }

      setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointerDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  const sendToWhatsApp = (text: string) => {
    const trimmed = text.trim()

    if (!trimmed) return

    setMessages((current) => [
      ...current,
      {
        from: 'user',
        text: trimmed,
      },
    ])

    setDraft('')

    const url = whatsappUrl(whatsappSiteMessage(trimmed))

    window.setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer')
    }, 350)
  }

  return (
    <div
      className={`wa-float${open ? ' wa-float--open' : ''}${
        splashComplete ? ' wa-float--ready' : ''
      }`}
    >
      {/* Panel stays mounted so CSS can animate it. */}
      <div
        ref={panelRef}
        id={panelId}
        className="wa-float__panel"
        aria-hidden={!open}
        role="dialog"
        aria-modal="false"
        aria-label="Fala com a Sandes"
      >
        <header className="wa-float__header">
          <span
            className="wa-float__avatar"
            aria-hidden="true"
          >
            <MessageIcon />
          </span>

          <div className="wa-float__header-text">
            <p className="wa-float__name">
              Fala com a Sandes
            </p>

            <p className="wa-float__status">
              Converse com nossa equipe pelo WhatsApp
            </p>
          </div>

          <button
            type="button"
            className="wa-float__close"
            onClick={() => setOpen(false)}
            aria-label="Fechar conversa"
          >
            <CloseIcon />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="wa-float__thread"
        >
          {messages.map((message, index) => (
            <div
              key={`${message.from}-${index}`}
              className={`wa-float__row wa-float__row--${message.from}`}
            >
              <p
                className={`wa-float__bubble wa-float__bubble--${message.from}`}
              >
                {message.text}
              </p>
            </div>
          ))}

          {typing && (
            <div
              className="wa-float__typing"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        <div className="wa-float__quick">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              type="button"
              className="wa-float__chip"
              onClick={() => sendToWhatsApp(reply)}
              data-cursor="link"
            >
              {reply}
            </button>
          ))}
        </div>

        <form
          className="wa-float__form"
          onSubmit={(event) => {
            event.preventDefault()
            sendToWhatsApp(draft)
          }}
        >
          <input
            className="wa-float__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escreva sua mensagem…"
            aria-label="Escreva sua mensagem"
          />

          <button
            type="submit"
            className="wa-float__send"
            aria-label="Enviar no WhatsApp"
            disabled={!draft.trim()}
            data-cursor="link"
          >
            <SendIcon />
          </button>
        </form>
      </div>

      {/* Floating button */}
      <button
        ref={triggerRef}
        type="button"
        className="wa-float__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Fechar contato' : 'Abrir contato'}
        data-cursor="link"
        onClick={() => setOpen((current) => !current)}
      >
        <span
          className="wa-float__pulse"
          aria-hidden="true"
        />

        {open ? <CloseIcon /> : <MessageIcon />}
      </button>
    </div>
  )
}

function MessageIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5c-5.1 0-9.2 3.7-9.2 8.3 0 2.7 1.4 5.1 3.6 6.7v3.2l3.3-1.8c.7.2 1.5.3 2.3.3 5.1 0 9.2-3.7 9.2-8.3S17.1 2.5 12 2.5z"
        fill="currentColor"
      />

      <circle
        cx="8.2"
        cy="10.8"
        r="1.15"
        fill="var(--color-orange)"
      />

      <circle
        cx="12"
        cy="10.8"
        r="1.15"
        fill="var(--color-orange)"
      />

      <circle
        cx="15.8"
        cy="10.8"
        r="1.15"
        fill="var(--color-orange)"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}