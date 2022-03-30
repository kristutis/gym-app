import React from 'react'
import './ErrorLabel.css'

export default function ErrorLabel({ error }: ErrorLabelProps) {
  if (!error) {
    return null
  }
  const errorSymbol =
    !!error && typeof error == 'string' && error.includes('*') ? '' : '* '
  return (
    <label
      className="error-label-text"
      dangerouslySetInnerHTML={{ __html: `${errorSymbol}${error}` }}
    ></label>
  )
}

export interface ErrorLabelProps {
  error: string
}
