import React from 'react'
import './SectionSeparator.css'

export default function SectionSeparator({ text }: { text: string }) {
  return (
    <div className="subtitle-container py-4">
      <h2>{text}</h2>
    </div>
  )
}
