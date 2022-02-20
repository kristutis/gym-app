import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import BaseModal from './BaseModal'

export default function LoginModal({ show, closeFunction }: LoginModalProps) {
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginClicked = () => {
    if (!email) {
      setEmailError('Email field must not be empty!')
      return
    }
    setEmailError('')
    if (!password) {
      setPasswordError('Password field must not be empty!')
      return
    }
    setPasswordError('')
  }

  return (
    <BaseModal
      title={'Please fill out login form'}
      children={
        <LoginForm
          emailError={emailError}
          passwordError={passwordError}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      }
      buttonText={'Login'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={loginClicked}
    />
  )
}

function LoginForm({
  emailError,
  passwordError,
  setEmail,
  setPassword,
}: LoginFormProps) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        {emailError && <ErrorMessage errorMessage={emailError} />}
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        {passwordError && <ErrorMessage errorMessage={passwordError} />}
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
    </Form>
  )
}

interface LoginFormProps {
  emailError: string
  passwordError: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return (
    <>
      <br />
      <Form.Text className="login-signup-modal-error">{errorMessage}</Form.Text>
    </>
  )
}

interface ErrorMessageProps {
  errorMessage: string
}

export interface LoginModalProps {
  show: boolean
  closeFunction: () => void
}
