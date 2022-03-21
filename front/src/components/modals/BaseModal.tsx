import React from 'react'
import { Modal } from 'react-bootstrap'
import NavbarSignUpButton from '../buttons/NavbarSignUpButton'
import './BaseModal.css'

export default function BaseModal({
  title,
  children,
  buttonText,
  show,
  closeFunction,
  submitFunction,
}: BaseModalProps) {
  return (
    <Modal
      contentClassName="base-modal-content"
      show={show}
      toggle={!!show ? 1 : 0}
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
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <NavbarSignUpButton onClick={() => submitFunction()}>
          {buttonText}
        </NavbarSignUpButton>
      </Modal.Footer>
    </Modal>
  )
}

export interface BaseModalProps {
  title: string
  children: JSX.Element
  buttonText: string
  show: boolean
  closeFunction: () => void
  submitFunction: () => void
}
