import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Download, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Topbar from '../components/Topbar'
import Loader from '../components/Loader'
import { useApp } from '../context/AppContext'
import { fetchNotes } from '../utils/api'
import { downloadAsPDF } from '../utils/pdfExport'

export default function NotesPage() {
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const { lastTopic, lastExplanation, difficulty } = useApp()

  const generate = async () => {
    if (!lastExplanation || !lastTopic) {
      toast.error('Please explain a topic first!')
      return
    }
    setLoading(true)
    setNotes('')
    try {
      const data = await fetchNotes(lastTopic, lastExplanation, difficulty)
      setNotes(data.notes)
      toast.success('Notes generated!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Backend error.')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!notes) return
    setDownloading(true)
    try {
      await downloadAsPDF(lastTopic, notes, difficulty)
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('PDF export failed: ' + err.message)
    } finally {
      setDownloading(false)
    }
  }

  const downloadTxt = () => {
    const content = `EduAI Study Notes\nTopic: ${lastTopic}\nDifficulty: ${difficulty}\nGenerated: ${new Date().toLocaleString()}\n\n${notes}`
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `notes-${lastTopic.replace(/\s+/g, '-')}.txt`
    a.click()
  }

  // Format notes with section headers highlighted
  const renderNotes = (text) => {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('##') || trimmed.startsWith('**')) {
        const heading = trimmed.replace(/^#+\s*|^\*\*|\*\*$/g, '')
        return (
          <div key={i} className="mt-5 mb-2">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent3)' }}>
              {heading}
            </p>
            <div className="h-px mt-1" style={{ background: 'var(--border)' }} />
          </div>
        )
      }
      if (!trimmed) return <div key={i} style={{ height: 8 }} />
      return (
        <p key={i} style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8 }}>
          {trimmed}
        </p>
      )
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Smart Notes" subtitle="Condensed, structured study notes" />

      <div className="flex-1 overflow-y-auto p-6">
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="card mb-5">
          <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
            Smart <span className="gradient-text">Notes Generator</span>
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--text2)' }}>
            Converts your last explanation into concise study notes. Download as PDF or TXT.
          </p>

          <div className="flex gap-2 flex-wrap">
            <button className="btn-primary" onClick={generate} disabled={loading || !lastExplanation}>
              {loading
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><BookOpen size={14} /> Generate Notes</>
              }
            </button>
            {!lastExplanation && (
              <span className="text-xs self-center" style={{ color: 'var(--amber)' }}>
                ⚠ Explain a topic first
              </span>
            )}
          </div>
        </motion.div>

        {loading && <Loader text="Generating study notes..." />}

        <AnimatePresence>
          {!loading && notes && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="card">
              {/* Header */}
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={16} style={{ color: 'var(--accent3)' }} />
                    <h3 className="font-semibold" style={{ fontSize: 16 }}>Notes: {lastTopic}</h3>
                    <span className="tag tag-green">{difficulty}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>
                    Generated {new Date().toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn-secondary"
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    style={{ fontSize: 12, padding: '8px 14px' }}
                  >
                    {downloading
                      ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      : <Download size={13} />
                    }
                    PDF
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={downloadTxt}
                    style={{ fontSize: 12, padding: '8px 14px' }}
                  >
                    <Download size={13} /> TXT
                  </button>
                </div>
              </div>

              {/* Notes content */}
              <div className="space-y-1">
                {renderNotes(notes)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && !notes && (
          <div className="empty-state">
            <div style={{ fontSize: 48, opacity: 0.2 }}>◉</div>
            <p style={{ color: 'var(--text2)', fontSize: 15 }}>Explain a topic first</p>
            <p style={{ color: 'var(--text3)', fontSize: 13 }}>Notes are auto-generated from your last explanation</p>
          </div>
        )}
      </div>
    </div>
  )
}
