import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import Topbar from '../components/Topbar'
import DifficultyPicker from '../components/DifficultyPicker'
import ExplanationCard from '../components/ExplanationCard'
import Loader from '../components/Loader'
import { useApp } from '../context/AppContext'
import { fetchExplanation } from '../utils/api'

const SUGGESTIONS = [
  'Binary Search', 'Photosynthesis', 'Compound Interest',
  'How WiFi Works', 'DNA Replication', 'Gradient Descent',
  'The Water Cycle', 'Recursion', 'Supply & Demand', 'Black Holes'
]

export default function ExplainPage() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    lastTopic, setLastTopic,
    lastExplanation, setLastExplanation,
    difficulty, addHistory, addTopic
  } = useApp()

  // If navigated from history, auto-explain
  useEffect(() => {
    if (lastTopic && !lastExplanation) {
      setTopic(lastTopic)
    }
  }, [lastTopic])

  const explain = async (t) => {
    const q = (t || topic).trim()
    if (!q) { toast.error('Enter a topic first!'); return }

    setLoading(true)
    setLastExplanation(null)

    try {
      const data = await fetchExplanation(q, difficulty)
      setLastExplanation(data)
      setLastTopic(q)
      addHistory(q)
      addTopic(q, difficulty)
      toast.success('Explanation ready!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Backend error. Check that FastAPI is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') explain() }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Explain Topic" subtitle="AI-powered structured explanations" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Input card */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="card mb-5">
          <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Teach me about{' '}
            <span className="gradient-text">{lastTopic || 'anything'}</span>
          </h2>
          <p className="text-sm mb-5" style={{ color: 'var(--text2)' }}>
            Enter any topic — science, math, tech, history — and get a step-by-step explanation.
          </p>

          <div className="flex gap-2 mb-4">
            <input
              className="input-base flex-1"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. Binary Search, Photosynthesis, Compound Interest..."
            />
            <button className="btn-primary" onClick={() => explain()} disabled={loading}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Sparkles size={14} /> Explain</>
              }
            </button>
          </div>

          <DifficultyPicker />

          {/* Suggestion chips */}
          <div className="flex gap-2 mt-4 flex-wrap">
            <span className="text-xs" style={{ color: 'var(--text3)', alignSelf: 'center' }}>Try:</span>
            {SUGGESTIONS.slice(0, 6).map(s => (
              <button
                key={s}
                onClick={() => { setTopic(s); explain(s) }}
                className="px-3 py-1 rounded-lg text-xs transition-all"
                style={{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border2)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border2)'}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Output */}
        <AnimatePresence mode="wait">
          {loading && <Loader key="loader" text={`Teaching you about "${topic}"...`} />}

          {!loading && lastExplanation && (
            <motion.div key="result" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <ExplanationCard data={lastExplanation} topic={lastTopic} />
            </motion.div>
          )}

          {!loading && !lastExplanation && (
            <motion.div key="empty" className="empty-state">
              <div style={{ fontSize: 48, opacity: 0.2 }}>✦</div>
              <p style={{ color: 'var(--text2)', fontSize: 15 }}>Enter a topic and click Explain</p>
              <p style={{ color: 'var(--text3)', fontSize: 13 }}>Get structured explanations with examples</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
