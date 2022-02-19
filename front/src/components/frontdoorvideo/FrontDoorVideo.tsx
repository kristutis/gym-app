import React from 'react'
import './FrontDoorVideo.css'

function FrontDoorVideo() {
  return (
    <div className="video-container">
      <video
        src="/videos/frontpage.mp4"
        className="front-door-video"
        autoPlay
        loop
        muted
      />
      <h1>WELCOME, STRANGER</h1>
      <p>Get up and start pumping!</p>
    </div>
  )
}

export default FrontDoorVideo
