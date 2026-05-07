import React from 'react'
import { motion } from 'framer-motion'
import {
  Github, Linkedin, Globe, Mail,
  Code2, Brain, Sparkles, Award,
  BookOpen, Zap, Star, Coffee
} from 'lucide-react'
import Topbar from '../components/Topbar'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4 }
})

const SKILLS = [
  { label: 'React.js',     color: '#61dafb' },
  { label: 'FastAPI',      color: '#10d9a8' },
  { label: 'Claude AI',    color: '#6C63FF' },
  { label: 'Tailwind CSS', color: '#38bdf8' },
  { label: 'Python',       color: '#f5a623' },
  { label: 'Framer Motion',color: '#ff7eb3' },
  { label: 'Recharts',     color: '#4da6ff' },
  { label: 'Vite',         color: '#a78bfa' },
]

const FEATURES = [
  { icon: Brain,    label: 'AI Explanations',  desc: 'Structured teaching with Claude' },
  { icon: BookOpen, label: 'Smart Notes',       desc: 'PDF export + study guides' },
  { icon: Sparkles, label: 'Auto Quiz',         desc: 'MCQ generator with scoring' },
  { icon: Zap,      label: 'Voice Mode',        desc: 'TTS + Speech-to-text' },
  { icon: Code2,    label: 'Whiteboard',        desc: 'Interactive canvas drawing' },
  { icon: Award,    label: 'Dashboard',         desc: 'Progress tracking & XP' },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="About" subtitle="Meet the creator of EduAI" />

      <div className="flex-1 overflow-y-auto p-6">

        {/* Hero Card */}
        <motion.div {...fadeUp(0)} className="card mb-5 relative overflow-hidden">
          {/* Background glow */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-bold relative"
                style={{
                  background: 'linear-gradient(135deg, #6C63FF, #10d9a8)',
                  boxShadow: '0 0 40px rgba(108,99,255,0.4)'
                }}
              >
                A
                {/* Badge */}
                <div
                  className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg2)', border: '2px solid var(--accent)' }}
                >
                  <Star size={13} style={{ color: 'var(--amber)' }} fill="var(--amber)" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start mb-1">
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Adhiraj</h1>
                <span className="tag tag-green" style={{ fontSize: 11 }}>Creator</span>
                <span className="tag tag-purple" style={{ fontSize: 11 }}>Full-Stack Dev</span>
              </div>

              <p className="text-sm mb-3" style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
                Built <strong style={{ color: 'var(--accent3)' }}>EduAI</strong> — an AI-powered interactive
                teaching platform that makes learning any topic simple, structured, and fun.
                Powered by Claude AI with a modern React + FastAPI stack.
              </p>

              <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '7px 14px', textDecoration: 'none' }}
                >
                  <Github size={13} /> GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '7px 14px', textDecoration: 'none', color: '#4da6ff' }}
                >
                  <Linkedin size={13} /> LinkedIn
                </a>
                <a
                  href="mailto:adhiraj@example.com"
                  className="btn-secondary"
                  style={{ fontSize: 12, padding: '7px 14px', textDecoration: 'none' }}
                >
                  <Mail size={13} /> Contact
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Info */}
        <motion.div {...fadeUp(0.1)} className="card mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={15} style={{ color: 'var(--accent3)' }} />
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>About This Project</h3>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--text2)', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--text)' }}>EduAI</strong> was designed and built entirely by{' '}
            <strong style={{ color: 'var(--accent3)' }}>Adhiraj</strong> as a full-stack AI learning platform.
            The goal was to go beyond a basic chatbot and create a real teaching experience —
            with structured explanations, interactive quizzes, a drawing whiteboard, voice interaction,
            and progress tracking all in one place.
          </p>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(108,99,255,0.08)', borderLeft: '3px solid var(--accent)' }}>
            <p className="text-sm" style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
              💡 <em>"I built EduAI because I wanted a smarter way to learn — one that doesn't just answer questions,
              but actually teaches like a great teacher would."</em>
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--text3)' }}>— Adhiraj, Creator of EduAI</p>
          </div>
        </motion.div>

        {/* Features built */}
        <motion.div {...fadeUp(0.15)} className="card mb-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>
            Features Built by Adhiraj
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(108,99,255,0.15)' }}
                >
                  <Icon size={15} style={{ color: 'var(--accent3)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div {...fadeUp(0.2)} className="card mb-5">
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>
            Tech Stack Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(({ label, color }, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.04 }}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: `${color}18`,
                  color,
                  border: `1px solid ${color}40`
                }}
              >
                {label}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Footer credit */}
        <motion.div {...fadeUp(0.3)}>
          <div
            className="p-5 rounded-2xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(16,217,168,0.1))',
              border: '1px solid rgba(108,99,255,0.2)'
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coffee size={16} style={{ color: 'var(--amber)' }} />
              <span className="text-sm font-semibold gradient-text">Made with passion by Adhiraj</span>
              <Coffee size={16} style={{ color: 'var(--amber)' }} />
            </div>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>
              EduAI v1.0 · Built with React, FastAPI & Claude AI · © 2025 Adhiraj
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
