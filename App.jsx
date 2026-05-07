import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/Sidebar'
import ExplainPage    from './pages/ExplainPage'
import QuizPage       from './pages/QuizPage'
import NotesPage      from './pages/NotesPage'
import WhiteboardPage from './pages/WhiteboardPage'
import VoicePage      from './pages/VoicePage'
import DashboardPage  from './pages/DashboardPage'
import AboutPage      from './pages/AboutPage'

export default function App() {
  return (
    <AppProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
        <Sidebar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Routes>
            <Route path="/"            element={<ExplainPage />} />
            <Route path="/quiz"        element={<QuizPage />} />
            <Route path="/notes"       element={<NotesPage />} />
            <Route path="/whiteboard"  element={<WhiteboardPage />} />
            <Route path="/voice"       element={<VoicePage />} />
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/about"       element={<AboutPage />} />
          </Routes>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg2)',
            color: 'var(--text)',
            border: '1px solid var(--border2)',
            fontFamily: 'Sora, sans-serif',
            fontSize: 13,
          },
          success: { iconTheme: { primary: '#10d9a8', secondary: 'white' } },
          error:   { iconTheme: { primary: '#ff5c7a', secondary: 'white' } },
        }}
      />
    </AppProvider>
  )
}
