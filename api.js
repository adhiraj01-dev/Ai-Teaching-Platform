import axios from 'axios'

// Base URL — in dev, Vite proxies /api → localhost:8000
const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({ baseURL: BASE, timeout: 60000 })

// Add request interceptor for debugging
api.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.data || err.message)
    return Promise.reject(err)
  }
)

/** POST /explain — returns structured explanation */
export async function fetchExplanation(topic, difficulty) {
  const { data } = await api.post('/explain', { topic, difficulty })
  return data
}

/** POST /quiz — returns array of MCQ questions */
export async function fetchQuiz(topic, difficulty) {
  const { data } = await api.post('/quiz', { topic, difficulty })
  return data
}

/** POST /notes — returns formatted study notes string */
export async function fetchNotes(topic, explanation, difficulty) {
  const { data } = await api.post('/notes', { topic, explanation, difficulty })
  return data
}

/** POST /doubt — returns contextual answer to follow-up */
export async function fetchDoubt(question, topic, difficulty) {
  const { data } = await api.post('/doubt', { question, topic, difficulty })
  return data
}

/** GET /progress — returns dashboard stats */
export async function fetchProgress() {
  const { data } = await api.get('/progress')
  return data
}

/** POST /voice — returns TTS audio URL (mock) */
export async function fetchVoice(text) {
  const { data } = await api.post('/voice', { text })
  return data
}
