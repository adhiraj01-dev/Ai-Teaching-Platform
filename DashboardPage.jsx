import React from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts'
import { Award, BookOpen, Brain, Zap, TrendingUp, Clock } from 'lucide-react'
import Topbar from '../components/Topbar'
import { useApp } from '../context/AppContext'

const COLORS = ['#6C63FF', '#10d9a8', '#4da6ff', '#f5a623', '#ff7eb3', '#ff5c7a']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
      <p style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value}{p.unit || ''}</strong></p>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const { dashData, history } = useApp()
  const { topics, quizScores, xp } = dashData

  const avgScore = quizScores.length
    ? Math.round(quizScores.reduce((a, b) => a + b.score, 0) / quizScores.length)
    : 0

  // Quiz chart data
  const quizChartData = quizScores.map((s, i) => ({
    name: `Quiz ${i + 1}`,
    score: s.score,
    topic: s.topic
  }))

  // Difficulty distribution
  const diffCount = topics.reduce((acc, t) => {
    acc[t.difficulty] = (acc[t.difficulty] || 0) + 1
    return acc
  }, {})
  const diffData = Object.entries(diffCount).map(([name, value]) => ({ name, value }))

  // XP over time
  const xpData = topics.map((t, i) => ({
    name: t.topic.slice(0, 10),
    xp: (i + 1) * 10
  }))

  const stats = [
    { icon: BookOpen, label: 'Topics Learned', value: topics.length, color: 'var(--blue)' },
    { icon: Brain,    label: 'Quizzes Taken',  value: quizScores.length, color: 'var(--green)' },
    { icon: Award,    label: 'Avg Quiz Score',  value: quizScores.length ? avgScore + '%' : '—', color: 'var(--amber)' },
    { icon: Zap,      label: 'XP Earned',       value: xp, color: 'var(--accent3)' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar title="Learning Dashboard" subtitle="Track your progress and performance" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={16} style={{ color }} />
                <TrendingUp size={12} style={{ color: 'var(--text3)' }} />
              </div>
              <div className="text-3xl font-bold gradient-text">{value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text2)' }}>{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Quiz Performance Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
            <h4 className="text-sm font-medium mb-4" style={{ color: 'var(--text2)' }}>Quiz Scores Over Time</h4>
            {quizChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={quizChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone" dataKey="score" name="Score"
                    stroke="#6C63FF" strokeWidth={2} dot={{ r: 4, fill: '#6C63FF' }}
                    activeDot={{ r: 6 }} unit="%"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <Brain size={28} style={{ opacity: 0.2 }} />
                <p className="text-xs" style={{ color: 'var(--text3)' }}>Take a quiz to see data</p>
              </div>
            )}
          </motion.div>

          {/* Difficulty Distribution */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
            <h4 className="text-sm font-medium mb-4" style={{ color: 'var(--text2)' }}>Topics by Difficulty</h4>
            {diffData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={diffData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {diffData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ padding: '30px 0' }}>
                <BookOpen size={28} style={{ opacity: 0.2 }} />
                <p className="text-xs" style={{ color: 'var(--text3)' }}>Explain topics to see data</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* XP Chart */}
        {xpData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card mb-4">
            <h4 className="text-sm font-medium mb-4" style={{ color: 'var(--text2)' }}>XP Progression</h4>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={xpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="xp" name="XP" fill="#10d9a8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Recent Topics */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} style={{ color: 'var(--text3)' }} />
            <h4 className="text-sm font-medium" style={{ color: 'var(--text2)' }}>Recent Topics</h4>
          </div>
          {history.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text3)' }}>No topics explored yet.</p>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 8).map((h, i) => (
                <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < Math.min(history.length, 8) - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span className="text-sm" style={{ color: 'var(--text)' }}>{h.topic}</span>
                  <span className="text-xs" style={{ color: 'var(--text3)' }}>
                    {new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
