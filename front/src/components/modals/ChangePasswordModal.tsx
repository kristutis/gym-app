import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import {
  UpdatePasswordProps,
  updateUserPasswordCall,
} from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function ChangePasswordModal({
  show,
  closeFunction,
}: ChangePasswordModalProps) {
  const authHeader = useAuthHeader()

  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [error, setError] = useState('')

  const submitClicked = async () => {
    if (!oldPassword) {
      setError('Old password must not be empty!')
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

    const payload = {
      oldPassword,
      newPassword: password,
    } as UpdatePasswordProps

    updateUserPasswordCall(payload, authHeader)
      .then((r) => {
        alert('Password changed!')
        closeFunction()
      })
      .catch((err) => setError(err))
  }

  const formGroups = [
    {
      label: 'Old Password',
      errorMsg: '',
      inputType: 'password',
      inputValue: oldPassword,
      setInput: setOldPassword,
    },
    {
      label: 'Password',
      errorMsg: '',
      inputType: 'password',
      inputValue: password,
      setInput: setPassword,
    },
    {
      label: 'Repeat password',
      errorMsg: '',
      inputType: 'password',
      inputValue: repeatPassword,
      setInput: setRepeatPassword,
    },
  ] as ModalFormGroupProps[]

  return (
    <BaseModal
      title={'Change password'}
      children={
        <>
          <Form>
            {!!error && (
              <Form.Text className="login-signup-modal-error">
                {error}
              </Form.Text>
            )}
            <ModalFormGroupList formGroups={formGroups} />
          </Form>
        </>
      }
      buttonText={'Update'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={submitClicked}
    />
  )
}

export interface ChangePasswordModalProps {
  show: boolean
  closeFunction: () => void
}
