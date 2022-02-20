import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import FrontDoorVideo from '../../components/frontdoorvideo/FrontDoorVideo'
import BaseModal from '../../components/modals/BaseModal'
import './Home.css'

export default function Home() {
  const [modalOpened, setModalOpened] = useState(false)

  return (
    <>
      <FrontDoorVideo />
      <div className="fdiv">
        <button onClick={() => setModalOpened(true)}>Open modal</button>
        <BaseModal
          show={modalOpened}
          closeFunction={() => setModalOpened(false)}
        />
        <Button variant="danger">asdasd</Button>
        Home
      </div>
    </>
  )
}
