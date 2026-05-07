import React from 'react'
import { motion } from 'framer-motion'

export default function Loader({ text = 'Loading...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      <div className="loader-spinner" />
      <p style={{ color: 'var(--text2)', fontSize: 14 }}>{text}</p>
    </motion.div>
  )
}
