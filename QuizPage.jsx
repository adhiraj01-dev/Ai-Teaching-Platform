import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, CheckCircle, XCircle, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import Topbar from '../components/Topbar'
import DifficultyPicker from '../components/DifficultyPicker'
import Loader from '../components/Loader'
import { useApp } from '../context/AppContext'
import { fetchQuiz } from '../utils/api'

export default function QuizPage() {
  const [topic, setTopic] = useState('')
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { lastTopic, difficulty, addQuizScore } = useApp()

  const generate = async () => {
    const q = topic.trim() || lastTopic
    if (!q) { toast.error('Enter a topic or explain something first!'); return }

    setLoading(true)
    setQuestions([])
    setAnswers({})
    setSubmitted(false)

    try {
      const data = await fetchQuiz(q, difficulty)
      setQuestions(data.questions || data)
      if (!topic) setTopic(q)
      toast.success('Quiz generated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Backend error.')
    } finally {
      setLoading(false)
    }
  }

  const select = (qi, oi) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qi]: oi }))
  }

  const submit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error(`Answer all ${questions.length} questions!`)
      return
    }
    setSubmitted(true)
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
    const pct = Math.round((score / questions.length) * 100)
    addQuizScore(pct, topic || lastTopic)
  }

  const score = submitted
    ? questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0)
    : 0
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0

  const OPTS = ['A', 'B', 'C', 'D']

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Auto Quiz Generator" subtitle="Test your understanding with AI-generated MCQs" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Input */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="card mb-5">
          <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Auto <span className="gradient-text">Quiz Generator</span>
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>
            Generate 4 MCQ questions on any topic with instant grading and explanations.
          </p>

          <div className="flex gap-2 mb-4">
            <input
              className="input-base flex-1"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder={lastTopic ? `Quiz on "${lastTopic}" or enter new topic...` : 'Enter topic for quiz...'}
            />
            <button className="btn-primary" onClick={generate} disabled={loading}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Brain size={14} /> Generate Quiz</>
              }
            </button>
          </div>

          <DifficultyPicker />
        </motion.div>

        {loading && <Loader text="Generating quiz questions..." />}

        {!loading && questions.length > 0 && (
          <div>
            {/* Score banner (after submit) */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
                  className="mb-5 p-6 rounded-2xl text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(16,217,168,0.15))',
                    border: '1px solid rgba(108,99,255,0.3)'
                  }}
                >
                  <Award size={32} className="mx-auto mb-2" style={{ color: 'var(--accent3)' }} />
                  <div className="text-5xl font-bold gradient-text">{pct}%</div>
                  <div className="text-sm mt-2" style={{ color: 'var(--text2)' }}>
                    {pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '👍 Good job!' : '📚 Keep studying!'}
                    {' '}You got {score} / {questions.length} correct.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Questions */}
            {questions.map((q, qi) => (
              <motion.div
                key={qi}
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay: qi * 0.07 }}
                className="card mb-4"
              >
                <p className="font-medium mb-4" style={{ fontSize: 15, color: 'var(--text)' }}>
                  <span className="mr-2" style={{ color: 'var(--text3)' }}>{qi + 1}.</span>
                  {q.question || q.q}
                </p>

                <div className="space-y-2">
                  {(q.options || []).map((opt, oi) => {
                    const selected = answers[qi] === oi
                    const isCorrect = submitted && oi === q.answer
                    const isWrong   = submitted && selected && oi !== q.answer

                    return (
                      <div
                        key={oi}
                        onClick={() => select(qi, oi)}
                        className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-150"
                        style={{
                          cursor: submitted ? 'default' : 'pointer',
                          background: isCorrect ? 'rgba(16,217,168,0.1)' : isWrong ? 'rgba(255,92,122,0.1)' : selected ? 'rgba(108,99,255,0.1)' : 'transparent',
                          borderColor: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : selected ? 'var(--accent)' : 'var(--border2)',
                          color: isCorrect ? 'var(--green)' : isWrong ? 'var(--red)' : selected ? 'var(--accent3)' : 'var(--text2)',
                        }}
                      >
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                          style={{
                            background: isCorrect ? 'rgba(16,217,168,0.2)' : isWrong ? 'rgba(255,92,122,0.2)' : 'var(--bg3)',
                          }}
                        >
                          {submitted && isCorrect ? <CheckCircle size={14} /> : submitted && isWrong ? <XCircle size={14} /> : OPTS[oi]}
                        </div>
                        <span style={{ fontSize: 14 }}>{opt}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Explanation after submit */}
                <AnimatePresence>
                  {submitted && q.explanation && (
                    <motion.div
                      initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                      className="mt-3 p-3 rounded-lg text-xs"
                      style={{ background: 'var(--bg3)', color: 'var(--text2)', lineHeight: 1.6 }}
                    >
                      💡 {q.explanation}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {!submitted && (
              <div className="text-center pb-6">
                <button className="btn-primary" onClick={submit} style={{ padding: '12px 32px', fontSize: 15 }}>
                  Submit Answers
                </button>
              </div>
            )}

            {submitted && (
              <div className="text-center pb-6">
                <button className="btn-secondary" onClick={generate}>
                  <Brain size={14} /> Try Another Quiz
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && questions.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 48, opacity: 0.2 }}>◈</div>
            <p style={{ color: 'var(--text2)', fontSize: 15 }}>No quiz yet</p>
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>Generate an explanation first, then quiz yourself</p>
          </div>
        )}
      </div>
    </div>
  )
}
