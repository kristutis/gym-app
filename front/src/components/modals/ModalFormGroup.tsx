import React from 'react'
import { Form } from 'react-bootstrap'

export default function ModalFormGroup({
  label,
  errorMsg,
  inputType,
  inputValue,
  setInput,
}: ModalFormGroupProps) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <br />
      {errorMsg && (
        <Form.Text className="login-signup-modal-error">{errorMsg}</Form.Text>
      )}
      <Form.Control
        type={inputType}
        placeholder={label}
        onChange={(e) => setInput(e.target.value)}
        value={inputValue}
      />
    </Form.Group>
  )
}

export interface ModalFormGroupProps {
  label: string
  errorMsg: string
  inputType: string
  inputValue: string
  setInput: (msg: string) => void
}
