import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import { signupUserCall } from '../../utils/apicalls/signup'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function SignupModal({
  show,
  closeFunction,
  openLoginModal,
}: SignupModalProps) {
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
      .then((msg) => {
        alert('Account created!')
        closeFunction()
        openLoginModal()
      })
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
          name={name}
          setName={setName}
          surname={surname}
          setSurname={setSurname}
          email={email}
          setEmail={setEmail}
          repeatEmail={repeatEmail}
          setRepeatEmail={setRepeatEmail}
          password={password}
          setPassword={setPassword}
          repeatPassword={repeatPassword}
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
  name,
  setName,
  surname,
  setSurname,
  email,
  setEmail,
  repeatEmail,
  setRepeatEmail,
  password,
  setPassword,
  repeatPassword,
  setRepeatPassword,
}: SignupFormProps) {
  const formGroups = [
    {
      label: 'Name',
      errorMsg: nameError,
      inputType: 'text',
      inputValue: name,
      setInput: setName,
    },
    {
      label: 'Surname',
      errorMsg: surnameError,
      inputType: 'text',
      inputValue: surname,
      setInput: setSurname,
    },
    {
      label: 'Email',
      errorMsg: emailError,
      inputType: 'email',
      inputValue: email,
      setInput: setEmail,
    },
    {
      label: 'Repeat email',
      errorMsg: '',
      inputType: 'email',
      inputValue: repeatEmail,
      setInput: setRepeatEmail,
    },
    {
      label: 'Password',
      errorMsg: passwordError,
      inputType: 'password',
      inputValue: password,
      setInput: setPassword,
    },
    {
      label: 'Repeat Password',
      errorMsg: '',
      inputType: 'password',
      inputValue: repeatPassword,
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
  name: string
  setName: (msg: string) => void
  surname: string
  setSurname: (msg: string) => void
  email: string
  setEmail: (msg: string) => void
  repeatEmail: string
  setRepeatEmail: (msg: string) => void
  password: string
  setPassword: (msg: string) => void
  repeatPassword: string
  setRepeatPassword: (msg: string) => void
}

export interface SignupModalProps {
  show: boolean
  closeFunction: () => void
  openLoginModal: () => void
}
