import React from 'react'
import { useApp } from '../context/AppContext'

const levels = [
  { id: 'beginner',     label: '🌱 Beginner',     color: 'var(--green)' },
  { id: 'intermediate', label: '⚡ Intermediate',  color: 'var(--blue)' },
  { id: 'advanced',     label: '🔥 Advanced',      color: 'var(--amber)' },
  { id: 'eli5',         label: '🧒 ELI5',          color: 'var(--pink)' },
]

export default function DifficultyPicker() {
  const { difficulty, setDifficulty } = useApp()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs" style={{ color: 'var(--text3)' }}>Level:</span>
      {levels.map(({ id, label, color }) => {
        const active = difficulty === id
        return (
          <button
            key={id}
            onClick={() => setDifficulty(id)}
            className="px-3 py-1.5 rounded-full text-xs transition-all duration-150 border"
            style={{
              background: active ? color : 'transparent',
              color: active ? 'white' : 'var(--text2)',
              borderColor: active ? color : 'var(--border2)',
              fontWeight: active ? 500 : 400,
            }}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
