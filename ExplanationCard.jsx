import React from 'react'
import { motion } from 'framer-motion'
import { Volume2, MessageSquare } from 'lucide-react'
import { useApp } from '../context/AppContext'
import DoubtBox from './DoubtBox'

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.3 } })
}

export default function ExplanationCard({ data, topic }) {
  const { difficulty } = useApp()

  const readAloud = () => {
    if (!data) return
    window.speechSynthesis.cancel()
    const text = [data.definition, data.steps?.join('. '), data.example?.content, data.summary].join(' ')
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.9
    utt.pitch = 1
    window.speechSynthesis.speak(utt)
  }

  const diffTag = {
    beginner: 'tag-green',
    intermediate: 'tag-blue',
    advanced: 'tag-amber',
    eli5: 'tag-green'
  }[difficulty] || 'tag-purple'

  if (!data) return null

  return (
    <motion.div initial="hidden" animate="visible">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>{topic}</h2>
        <span className={`tag ${diffTag}`}>{difficulty}</span>
        {(data.tags || []).map(t => (
          <span key={t} className="tag tag-purple">{t}</span>
        ))}
        <button onClick={readAloud} className="btn-secondary ml-auto" style={{ padding: '6px 14px', fontSize: 12 }}>
          <Volume2 size={12} /> Read Aloud
        </button>
      </div>

      {/* 2-col grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Definition */}
        <motion.div custom={0} variants={cardVariants} className="card">
          <p className="section-label" style={{ color: 'var(--blue)' }}>◈ Definition</p>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{data.definition}</p>
        </motion.div>

        {/* Summary */}
        <motion.div custom={1} variants={cardVariants} className="card">
          <p className="section-label" style={{ color: 'var(--pink)' }}>◎ Key Takeaway</p>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{data.summary}</p>
        </motion.div>

        {/* Steps — full width */}
        <motion.div custom={2} variants={cardVariants} className="card md:col-span-2">
          <p className="section-label" style={{ color: 'var(--green)' }}>✦ Step-by-Step Breakdown</p>
          <ul className="space-y-0">
            {(data.steps || []).map((step, i) => (
              <li key={i} className="flex gap-3 py-3" style={{ borderBottom: i < data.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold"
                     style={{ background: 'rgba(108,99,255,0.2)', color: 'var(--accent3)' }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{step}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Example — full width */}
        <motion.div custom={3} variants={cardVariants} className="card md:col-span-2">
          <p className="section-label" style={{ color: 'var(--amber)' }}>
            ◉ Example: {data.example?.title}
          </p>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{data.example?.content}</p>
          {data.example?.code && (
            <div className="code-block">{data.example.code}</div>
          )}
        </motion.div>
      </div>

      {/* Doubt box */}
      <DoubtBox topic={topic} />
    </motion.div>
  )
}
