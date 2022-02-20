import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import './BaseModal.css'

export default function BaseModal({ show, closeFunction }: BaseModalProps) {
  return (
    <Modal
      contentClassName="base-modal-content"
      show={show}
      toggle={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={() => closeFunction()}
    >
      <Modal.Header
        className="base-modal-color"
        closeButton
        closeVariant="white"
      >
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

export interface BaseModalProps {
  show: boolean
  closeFunction: () => void
}
