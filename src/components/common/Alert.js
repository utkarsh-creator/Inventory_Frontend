"use client"

import { useState, useEffect } from "react"

const Alert = ({ message, type = "info", duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-content">{message}</div>
      <button
        className="alert-close"
        onClick={() => {
          setVisible(false)
          if (onClose) onClose()
        }}
      >
        ×
      </button>
    </div>
  )
}

export default Alert

