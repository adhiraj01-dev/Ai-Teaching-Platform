import React, { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(true)
  const [lastTopic, setLastTopic] = useState('')
  const [lastExplanation, setLastExplanation] = useState(null)
  const [difficulty, setDifficulty] = useState('beginner')
  const [history, setHistory] = useState([])
  const [dashData, setDashData] = useState({
    topics: [],
    quizScores: [],
    xp: 0
  })

  const addHistory = useCallback((topic) => {
    setHistory(prev => {
      const filtered = prev.filter(h => h.topic !== topic)
      return [{ topic, time: Date.now() }, ...filtered].slice(0, 30)
    })
  }, [])

  const addQuizScore = useCallback((score, topic) => {
    setDashData(prev => ({
      ...prev,
      quizScores: [...prev.quizScores, { score, topic, time: Date.now() }],
      xp: prev.xp + Math.round(score / 5)
    }))
  }, [])

  const addTopic = useCallback((topic, diff) => {
    setDashData(prev => ({
      ...prev,
      topics: [...prev.topics, { topic, difficulty: diff, time: Date.now() }],
      xp: prev.xp + 10
    }))
  }, [])

  const toggleDark = useCallback(() => {
    setDarkMode(d => !d)
    document.documentElement.classList.toggle('light')
  }, [])

  return (
    <AppContext.Provider value={{
      darkMode, toggleDark,
      lastTopic, setLastTopic,
      lastExplanation, setLastExplanation,
      difficulty, setDifficulty,
      history, addHistory,
      dashData, addQuizScore, addTopic
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
