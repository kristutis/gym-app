import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import FrontDoorVideo from '../../components/frontdoorvideo/FrontDoorVideo'
import LoginModal from '../../components/modals/LoginModal'
import './Home.css'

export default function Home() {
  const [modalOpened, setModalOpened] = useState(false)

  return (
    <>
      <FrontDoorVideo />
      <div className="fdiv">
        <button onClick={() => setModalOpened(true)}>Open modal</button>
        <LoginModal
          show={modalOpened}
          closeFunction={() => setModalOpened(false)}
        />
        <Button variant="danger">asdasd</Button>
        Home
      </div>
    </>
  )
}
