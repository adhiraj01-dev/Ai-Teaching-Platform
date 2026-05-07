import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import Topbar from '../components/Topbar'
import { useApp } from '../context/AppContext'
import { fetchDoubt } from '../utils/api'

export default function VoicePage() {
  const [listening, setListening]     = useState(false)
  const [transcript, setTranscript]   = useState('')
  const [answer, setAnswer]           = useState('')
  const [answerLoading, setAnswerLoading] = useState(false)
  const [speaking, setSpeaking]       = useState(false)
  const recogRef = useRef(null)
  const { lastTopic, lastExplanation, difficulty } = useApp()

  // Build flat explanation text for TTS
  const explanationText = lastExplanation
    ? [lastExplanation.definition, ...(lastExplanation.steps || []), lastExplanation.example?.content, lastExplanation.summary]
        .filter(Boolean).join('. ')
    : ''

  const readAloud = (text) => {
    if (!text) { toast.error('Nothing to read.'); return }
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.rate = 0.9; utt.pitch = 1
    utt.onstart = () => setSpeaking(true)
    utt.onend   = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utt)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { toast.error('Speech recognition not supported. Use Chrome or Edge.'); return }

    if (listening) {
      recogRef.current?.stop()
      setListening(false)
      return
    }

    const r = new SR()
    r.lang = 'en-US'
    r.interimResults = true
    r.continuous = false

    r.onresult = (e) => {
      const t = Array.from(e.results).map(x => x[0].transcript).join('')
      setTranscript(t)
      if (e.results[0].isFinal) handleVoiceQuestion(t)
    }
    r.onend  = () => setListening(false)
    r.onerror = (e) => { toast.error('Mic error: ' + e.error); setListening(false) }

    r.start()
    recogRef.current = r
    setListening(true)
    setTranscript('')
    setAnswer('')
  }

  const handleVoiceQuestion = async (q) => {
    if (!q.trim()) return
    setAnswerLoading(true)
    try {
      const data = await fetchDoubt(q, lastTopic || 'general', difficulty)
      setAnswer(data.answer)
      readAloud(data.answer)
    } catch (err) {
      toast.error('Backend error.')
    } finally {
      setAnswerLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Voice Teaching Mode" subtitle="Speak your questions, hear AI answers" />

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="card mb-5">
          <h2 className="text-xl font-semibold mb-1">
            Voice <span className="gradient-text">Teaching Mode</span>
          </h2>
          <p className="text-sm" style={{ color: 'var(--text2)' }}>
            Hear your last explanation read aloud, or speak a question and get an AI answer instantly.
          </p>
        </motion.div>

        {/* TTS Section */}
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="card mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 size={15} style={{ color: 'var(--blue)' }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
              Read Explanation Aloud
            </p>
          </div>

          {lastTopic ? (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 text-sm p-3 rounded-xl" style={{ background: 'var(--bg3)', color: 'var(--text2)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text)' }}>{lastTopic}</strong> — click to hear explanation
              </div>
              <div className="flex gap-2">
                <button className="btn-primary" onClick={() => readAloud(explanationText)} disabled={speaking || !explanationText}>
                  <Volume2 size={14} /> {speaking ? 'Reading...' : 'Read Aloud'}
                </button>
                {speaking && (
                  <button className="btn-secondary" onClick={stopSpeaking}>
                    <VolumeX size={14} /> Stop
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--text3)' }}>⚠ Explain a topic first to use this feature.</p>
          )}
        </motion.div>

        {/* STT Section */}
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} className="card">
          <div className="flex items-center gap-2 mb-4">
            <Mic size={15} style={{ color: 'var(--green)' }} />
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text2)' }}>
              Ask a Question by Voice
            </p>
          </div>

          {/* Mic button */}
          <div className="flex flex-col items-center gap-5 py-6">
            <motion.button
              onClick={toggleListening}
              animate={{ scale: listening ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 1.5, repeat: listening ? Infinity : 0 }}
              className="w-20 h-20 rounded-full flex items-center justify-center border-none cursor-pointer transition-all"
              style={{
                background: listening
                  ? 'linear-gradient(135deg, #ff5c7a, #ff7eb3)'
                  : 'linear-gradient(135deg, var(--accent), var(--accent2))',
                boxShadow: listening ? '0 0 0 12px rgba(255,92,122,0.2)' : 'none'
              }}
            >
              {listening ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}
            </motion.button>

            <p className="text-sm" style={{ color: listening ? 'var(--red)' : 'var(--text2)' }}>
              {listening ? '🔴 Listening... speak now' : 'Click to start speaking'}
            </p>

            {/* Transcript */}
            <div
              className="w-full max-w-md p-4 rounded-xl text-center text-sm"
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border2)',
                color: transcript ? 'var(--text)' : 'var(--text3)',
                minHeight: 60,
                lineHeight: 1.7
              }}
            >
              {transcript || 'Your speech will appear here...'}
            </div>

            {/* AI Answer */}
            <AnimatePresence>
              {(answerLoading || answer) && (
                <motion.div
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  className="w-full max-w-md"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={13} style={{ color: 'var(--accent3)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text3)' }}>AI Answer</span>
                  </div>
                  <div
                    className="p-4 rounded-xl text-sm"
                    style={{
                      background: 'rgba(108,99,255,0.08)',
                      borderLeft: '3px solid var(--accent)',
                      color: 'var(--text)',
                      lineHeight: 1.7
                    }}
                  >
                    {answerLoading
                      ? <span style={{ color: 'var(--text3)' }}>Thinking...</span>
                      : answer
                    }
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
