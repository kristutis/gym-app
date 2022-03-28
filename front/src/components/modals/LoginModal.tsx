import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import { loginUserCall } from '../../utils/apicalls/login'
import AuthContext from '../auth/AuthProvider'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function LoginModal({ show, closeFunction }: LoginModalProps) {
  const { setAuth }: any = useContext(AuthContext)

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

    loginUserCall({ email, password })
      .then((userInfo) => {
        setAuth(userInfo)
        closeFunction()
      })
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
          email={email}
          setEmail={setEmail}
          password={password}
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
  email,
  setEmail,
  password,
  setPassword,
}: LoginFormProps) {
  const formGroups = [
    {
      label: 'Email',
      errorMsg: emailError,
      inputType: 'email',
      inputValue: email,
      setInput: setEmail,
    },
    {
      label: 'Password',
      errorMsg: passwordError,
      inputType: 'password',
      inputValue: password,
      setInput: setPassword,
    },
  ] as ModalFormGroupProps[]

  return (
    <Form>
      {validatationError && (
        <Form.Text className="login-signup-modal-error">
          {validatationError}
        </Form.Text>
      )}
      <ModalFormGroupList formGroups={formGroups} />
    </Form>
  )
}

interface LoginFormProps {
  validatationError: string
  emailError: string
  passwordError: string
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
}

export interface LoginModalProps {
  show: boolean
  closeFunction: () => void
}
