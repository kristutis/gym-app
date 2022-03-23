import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import {
  updateUserCall,
  UpdateUserProps,
  User,
} from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function ProfileEditModal({
  userDetails,
  show,
  closeFunction,
  submitFunction,
}: ProfileEditModalProps) {
  const authHeader = useAuthHeader()

  const [name, setName] = useState(userDetails.name)
  const [surname, setSurname] = useState(userDetails.surname)
  const [phone, setPhone] = useState(
    userDetails.phone == null ? '' : userDetails.phone
  )
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [error, setError] = useState('')

  const submitClicked = async () => {
    if (!name) {
      setError('Name must not be empty!')
      return
    }
    if (!surname) {
      setError('Surname must not be empty!')
      return
    }
    if (phone && !phone.match(/^\+\d+$/)) {
      setError('Incorrect phone number!')
      return
    }
    if (password && password.length < 6) {
      setError('Password lenghth must be 6 symbols or more!')
      return
    }
    if (password != repeatPassword) {
      setError('Passwords does not match!')
      return
    }
    setError('')

    const updatedUser = {
      id: userDetails.id,
      name: name,
      surname: surname,
      phone: !!phone ? phone : undefined,
      password: !!password ? password : undefined,
    } as UpdateUserProps

    try {
      await updateUserCall(updatedUser, authHeader)
    } catch (e) {
      alert(e)
      return
    }
    submitFunction()
    closeFunction()
  }

  return (
    <BaseModal
      title={'Edit user details'}
      children={
        <ProfileEditForm
          error={error}
          name={name}
          setName={setName}
          surname={surname}
          setSurname={setSurname}
          phone={phone}
          setPhone={setPhone}
          password={password}
          setPassword={setPassword}
          repeatPassword={repeatPassword}
          setRepeatPassword={setRepeatPassword}
        />
      }
      buttonText={'Update'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={submitClicked}
    />
  )
}

function ProfileEditForm({
  error,
  name,
  setName,
  surname,
  setSurname,
  phone,
  setPhone,
  password,
  setPassword,
  repeatPassword,
  setRepeatPassword,
}: ProfileEditFormProps) {
  const formGroups = [
    {
      label: 'Name',
      errorMsg: '',
      inputType: 'text',
      inputValue: name,
      setInput: setName,
    },
    {
      label: 'Surname',
      errorMsg: '',
      inputType: 'text',
      inputValue: surname,
      setInput: setSurname,
    },
    {
      label: 'Phone',
      errorMsg: '',
      inputType: 'text',
      inputValue: phone,
      setInput: setPhone,
    },
    {
      label: 'Password',
      errorMsg: '',
      inputType: 'text',
      inputValue: password,
      setInput: setPassword,
    },
    {
      label: 'Repeat password',
      errorMsg: '',
      inputType: 'text',
      inputValue: repeatPassword,
      setInput: setRepeatPassword,
    },
  ] as ModalFormGroupProps[]

  return (
    <Form>
      {!!error && (
        <Form.Text className="login-signup-modal-error">{error}</Form.Text>
      )}
      <ModalFormGroupList formGroups={formGroups} />
    </Form>
  )
}

interface ProfileEditFormProps {
  error: string
  name: string
  setName: (name: string) => void
  surname: string
  setSurname: (surname: string) => void
  phone: string
  setPhone: (phone: string) => void
  password: string
  setPassword: (password: string) => void
  repeatPassword: string
  setRepeatPassword: (repeatPassword: string) => void
}

export interface ProfileEditModalProps {
  userDetails: User
  show: boolean
  submitFunction: () => void
  closeFunction: () => void
}
