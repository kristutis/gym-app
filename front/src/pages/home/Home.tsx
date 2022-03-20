import React from 'react'
import { Button } from 'react-bootstrap'
import FrontDoorVideo from '../../components/frontdoorvideo/FrontDoorVideo'
import './Home.css'

export default function Home() {
  return (
    <>
      <FrontDoorVideo
        title="WELCOME, STRANGER"
        subtitle="Get up and start pumping!"
      />
      <div className="fdiv">
        <Button variant="danger">asdasd</Button>
        Home
      </div>
    </>
  )
}
