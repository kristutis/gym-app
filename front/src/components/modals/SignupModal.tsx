import React from 'react'
import { Form } from 'react-bootstrap'
import BaseModal from './BaseModal'

export default function SignupModal({ show, closeFunction }: SignupModalProps) {
  return (
    <BaseModal
      title={'helo'}
      children={<SignupForm />}
      buttonText={'asdf'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={() => null}
    />
  )
}

function SignupForm() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
    </Form>
  )
}

function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return (
    <Form.Text className="login-signup-modal-error">{errorMessage}</Form.Text>
  )
}

interface ErrorMessageProps {
  errorMessage: string
}

export interface SignupModalProps {
  show: boolean
  closeFunction: () => void
}
