import React from 'react'
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Topbar({ title, subtitle }) {
  const { darkMode, toggleDark } = useApp()
  const [speaking, setSpeaking] = React.useState(false)

  const stopSpeech = () => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 flex-shrink-0"
      style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', minHeight: 56 }}
    >
      <div>
        <h1 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{title}</h1>
        {subtitle && <p className="text-xs" style={{ color: 'var(--text3)' }}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {speaking && (
          <button
            onClick={stopSpeech}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ background: 'rgba(255,92,122,0.1)', color: 'var(--red)', border: '1px solid rgba(255,92,122,0.2)' }}
          >
            <VolumeX size={12} /> Stop
          </button>
        )}
        <button
          onClick={toggleDark}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
          style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border2)' }}
          title="Toggle dark/light mode"
        >
          {darkMode ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  )
}
