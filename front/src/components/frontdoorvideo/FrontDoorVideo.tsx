import React from 'react'
import './FrontDoorVideo.css'

function FrontDoorVideo({ title = '', subtitle = '' }: FrontDoorVideoProps) {
  return (
    <div className="video-container">
      <video
        src="/videos/frontpage.mp4"
        className="front-door-video"
        autoPlay
        loop
        muted
      />
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  )
}

export interface FrontDoorVideoProps {
  title: string
  subtitle?: string
}

export default FrontDoorVideo
