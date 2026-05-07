import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles, Brain, BookOpen, PenTool,
  Mic, BarChart2, Clock, Zap, User, Star
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { to: '/',           icon: Sparkles,  label: 'Explain',    section: 'learn' },
  { to: '/quiz',       icon: Brain,     label: 'Quiz',       section: 'learn' },
  { to: '/notes',      icon: BookOpen,  label: 'Notes',      section: 'learn' },
  { to: '/whiteboard', icon: PenTool,   label: 'Whiteboard', section: 'tools' },
  { to: '/voice',      icon: Mic,       label: 'Voice',      section: 'tools' },
  { to: '/dashboard',  icon: BarChart2, label: 'Dashboard',  section: 'tools' },
  { to: '/about',      icon: User,      label: 'About',      section: 'meta'  },
]

export default function Sidebar() {
  const { history, dashData, setLastTopic } = useApp()
  const navigate = useNavigate()

  const learnItems = navItems.filter(n => n.section === 'learn')
  const toolItems  = navItems.filter(n => n.section === 'tools')
  const metaItems  = navItems.filter(n => n.section === 'meta')

  const handleHistoryClick = (topic) => {
    setLastTopic(topic)
    navigate('/')
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 min-w-[256px] flex flex-col overflow-hidden"
      style={{ background: 'var(--bg2)', borderRight: '1px solid var(--border)' }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--green))' }}
          >
            ✦
          </div>
          <div>
            <div className="font-bold text-base gradient-text">EduAI</div>
            <div className="text-xs" style={{ color: 'var(--text3)' }}>by Adhiraj</div>
          </div>
        </div>
      </div>

      {/* Creator badge — links to About */}
      <NavLink to="/about" style={{ textDecoration: 'none' }}>
        <div
          className="mx-3 mt-3 p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.12), rgba(16,217,168,0.08))',
            border: '1px solid rgba(108,99,255,0.2)',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.5)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(108,99,255,0.2)'}
        >
          {/* Avatar initial */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6C63FF, #10d9a8)' }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Adhiraj</span>
              <Star size={10} style={{ color: 'var(--amber)' }} fill="var(--amber)" />
            </div>
            <div style={{ fontSize: 10, color: 'var(--text3)' }}>Creator · Full-Stack Dev</div>
          </div>
        </div>
      </NavLink>

      {/* XP Badge */}
      <div
        className="mx-3 mt-2 p-2.5 rounded-xl flex items-center gap-2"
        style={{ background: 'rgba(108,99,255,0.08)', border: '1px solid rgba(108,99,255,0.15)' }}
      >
        <Zap size={13} style={{ color: 'var(--accent3)' }} />
        <span style={{ fontSize: 12, color: 'var(--accent3)', fontWeight: 500 }}>
          {dashData.xp} XP · {dashData.topics.length} Topics
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 mt-1">
        <NavSection label="Learn" items={learnItems} />
        <NavSection label="Tools" items={toolItems} />
        <NavSection label="Info"  items={metaItems} />

        {/* History */}
        <div className="mt-2">
          <div className="flex items-center gap-2 px-2 mb-2">
            <Clock size={11} style={{ color: 'var(--text3)' }} />
            <span style={{
              fontSize: 10, fontWeight: 600, color: 'var(--text3)',
              textTransform: 'uppercase', letterSpacing: '1.2px'
            }}>
              History
            </span>
          </div>
          {history.length === 0 ? (
            <p className="px-3 text-xs" style={{ color: 'var(--text3)' }}>No topics yet</p>
          ) : (
            history.slice(0, 15).map((h, i) => (
              <button
                key={i}
                onClick={() => handleHistoryClick(h.topic)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-all duration-150"
                style={{ color: 'var(--text2)', borderLeft: '2px solid transparent' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--bg3)'
                  e.currentTarget.style.borderLeftColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--text)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderLeftColor = 'transparent'
                  e.currentTarget.style.color = 'var(--text2)'
                }}
              >
                {h.topic}
              </button>
            ))
          )}
        </div>
      </nav>

      {/* Bottom credit */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <p style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.6 }}>
          EduAI v1.0 · Made by{' '}
          <span style={{ color: 'var(--accent3)', fontWeight: 600 }}>Adhiraj</span>
          <br />Powered by Claude AI
        </p>
      </div>
    </motion.aside>
  )
}

function NavSection({ label, items }) {
  return (
    <div className="mb-3">
      <p
        className="px-2 mb-1"
        style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text3)',
          textTransform: 'uppercase', letterSpacing: '1.2px'
        }}
      >
        {label}
      </p>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}>
          {({ isActive }) => (
            <div
              className="flex items-center gap-3 px-3 py-2 rounded-xl mb-0.5 cursor-pointer transition-all duration-150"
              style={{
                background: isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                color: isActive ? 'var(--accent3)' : 'var(--text2)',
                fontSize: 13,
              }}
              onMouseEnter={e => !isActive && (e.currentTarget.style.background = 'var(--bg3)')}
              onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
            >
              <Icon size={15} style={{ opacity: isActive ? 1 : 0.7 }} />
              {label}
            </div>
          )}
        </NavLink>
      ))}
    </div>
  )
}
