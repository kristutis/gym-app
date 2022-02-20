import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { loginUserCall } from '../../utils/apicalls/login'
import BaseModal from './BaseModal'

export default function LoginModal({ show, closeFunction }: LoginModalProps) {
  const [validatationError, setValidatationError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginClicked = async () => {
    setValidatationError('')
    if (!email) {
      setEmailError('Email field must not be empty!')
      return
    }
    setEmailError('')
    if (!password) {
      setPasswordError('Password field must not be empty!')
      return
    }
    if (password.length < 6) {
      setPasswordError('Password lenghth must be 6 symbols or more!')
      return
    }
    setPasswordError('')

    await loginUserCall({ email, password })
      .then((msg) => window.location.reload())
      .catch((msg) => setValidatationError(msg))
  }

  return (
    <BaseModal
      title={'Please fill out login form'}
      children={
        <LoginForm
          validatationError={validatationError}
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
  validatationError,
  emailError,
  passwordError,
  setEmail,
  setPassword,
}: LoginFormProps) {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        {validatationError && <ErrorMessage errorMessage={validatationError} />}
        <br />
        <Form.Label>Email address</Form.Label>
        <br /> {emailError && <ErrorMessage errorMessage={emailError} />}
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <br /> {passwordError && <ErrorMessage errorMessage={passwordError} />}
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>
    </Form>
  )
}

function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return (
    <>
      <Form.Text className="login-signup-modal-error">{errorMessage}</Form.Text>
    </>
  )
}

interface LoginFormProps {
  validatationError: string
  emailError: string
  passwordError: string
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

interface ErrorMessageProps {
  errorMessage: string
}

export interface LoginModalProps {
  show: boolean
  closeFunction: () => void
}
