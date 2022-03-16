import React from 'react'
import './ErrorLabel.css'

export default function ErrorLabel({ error }: ErrorLabelProps) {
  if (!error) {
    return null
  }
  return <label className="error-label-text">* {error}</label>
}

export interface ErrorLabelProps {
  error: string
}
