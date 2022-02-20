import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { signupUserCall } from '../../utils/apicalls/signup'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function SignupModal({ show, closeFunction }: SignupModalProps) {
  const [validatationError, setValidatationError] = useState('')

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [surname, setSurname] = useState('')
  const [surnameError, setSurnameError] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [email, setEmail] = useState('')
  const [repeatEmail, setRepeatEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const signupClicked = async () => {
    setValidatationError('')
    if (!name) {
      setNameError('Name field must not be empty!')
      return
    }
    setNameError('')
    if (!surname) {
      setSurnameError('Surname field must not be empty!')
      return
    }
    setSurnameError('')
    if (!email && !repeatEmail) {
      setEmailError('Email fields must not be empty!')
      return
    }
    if (email !== repeatEmail) {
      setEmailError('Emails do not match!')
      return
    }
    setEmailError('')
    if (!password && !repeatPassword) {
      setPasswordError('Password fields must not be empty!')
      return
    }
    if (password.length < 6) {
      setPasswordError('Password lenghth must be 6 symbols or more!')
      return
    }
    if (password !== repeatPassword) {
      setPasswordError('Passwords do not match!')
      return
    }
    setPasswordError('')

    await signupUserCall({ name, surname, email, password })
      .then((msg) => window.location.reload())
      .catch((msg) => setValidatationError(msg))
  }

  return (
    <BaseModal
      title={'Please fill out sign up form'}
      children={
        <SignupForm
          validatationError={validatationError}
          nameError={nameError}
          surnameError={surnameError}
          emailError={emailError}
          passwordError={passwordError}
          setName={setName}
          setSurname={setSurname}
          setEmail={setEmail}
          setRepeatEmail={setRepeatEmail}
          setPassword={setPassword}
          setRepeatPassword={setRepeatPassword}
        />
      }
      buttonText={'Sign Up'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={signupClicked}
    />
  )
}

function SignupForm({
  validatationError,
  nameError,
  surnameError,
  emailError,
  passwordError,
  setName,
  setSurname,
  setEmail,
  setRepeatEmail,
  setPassword,
  setRepeatPassword,
}: SignupFormProps) {
  const formGroups = [
    {
      label: 'Name',
      errorMsg: nameError,
      inputType: 'text',
      setInput: setName,
    },
    {
      label: 'Surname',
      errorMsg: surnameError,
      inputType: 'text',
      setInput: setSurname,
    },
    {
      label: 'Email',
      errorMsg: emailError,
      inputType: 'email',
      setInput: setEmail,
    },
    {
      label: 'Repeat email',
      errorMsg: '',
      inputType: 'email',
      setInput: setRepeatEmail,
    },
    {
      label: 'Password',
      errorMsg: passwordError,
      inputType: 'password',
      setInput: setPassword,
    },
    {
      label: 'Repeat Password',
      errorMsg: '',
      inputType: 'password',
      setInput: setRepeatPassword,
    },
  ] as ModalFormGroupProps[]

  return (
    <Form>
      <Form.Text className="login-signup-modal-error">
        {validatationError}
      </Form.Text>
      <ModalFormGroupList formGroups={formGroups} />
    </Form>
  )
}

interface SignupFormProps {
  validatationError: string
  nameError: string
  surnameError: string
  emailError: string
  passwordError: string
  setName: (email: string) => void
  setSurname: (email: string) => void
  setEmail: (email: string) => void
  setRepeatEmail: (email: string) => void
  setPassword: (password: string) => void
  setRepeatPassword: (password: string) => void
}

export interface SignupModalProps {
  show: boolean
  closeFunction: () => void
}
