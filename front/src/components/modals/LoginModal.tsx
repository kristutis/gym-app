import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export default function LoginModal({ show, closeFunction }: LoginModalProps) {
  return (
    <Modal
      show={show}
      toggle={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => closeFunction()}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => closeFunction()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export interface LoginModalProps {
  show: boolean
  closeFunction: () => void
}
