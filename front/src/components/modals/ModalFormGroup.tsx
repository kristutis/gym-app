import React from 'react'
import { Form } from 'react-bootstrap'

export default function ModalFormGroup({
  label,
  errorMsg,
  inputType,
  setInput,
}: ModalFormGroupProps) {
  return (
    <Form.Group className="mb-3" controlId="formBasicPassword">
      <Form.Label>{label}</Form.Label>
      <br />
      {errorMsg && (
        <Form.Text className="login-signup-modal-error">{errorMsg}</Form.Text>
      )}
      <Form.Control
        type={inputType}
        placeholder={label}
        onChange={(e) => setInput(e.target.value)}
      />
    </Form.Group>
  )
}

export interface ModalFormGroupProps {
  label: string
  errorMsg: string
  inputType: string
  setInput: (msg: string) => void
}
