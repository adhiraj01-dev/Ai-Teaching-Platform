import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, HelpCircle } from 'lucide-react'
import { fetchDoubt } from '../utils/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function DoubtBox({ topic }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const { difficulty } = useApp()

  const ask = async () => {
    if (!question.trim()) return
    setLoading(true)
    setAnswer('')
    try {
      const res = await fetchDoubt(question, topic, difficulty)
      setAnswer(res.answer)
    } catch (err) {
      toast.error('Could not get answer. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask() }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle size={15} style={{ color: 'var(--text3)' }} />
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
          Ask a Follow-up Question
        </p>
      </div>

      <div className="flex gap-2">
        <input
          className="input-base flex-1"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. What's the time complexity? Why is this important?"
        />
        <button className="btn-primary" onClick={ask} disabled={loading || !question.trim()}>
          {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 rounded-xl"
            style={{
              background: 'rgba(108,99,255,0.08)',
              borderLeft: '3px solid var(--accent)',
              fontSize: 14,
              color: 'var(--text)',
              lineHeight: 1.7
            }}
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
