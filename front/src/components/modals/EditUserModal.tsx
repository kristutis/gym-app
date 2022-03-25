import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { Trainer } from '../../utils/apicalls/user'
import { useAuthHeader, UserRole } from '../../utils/auth'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function EditUserModal({
  trainer,
  showModal,
  closeFunction,
  reloadUserFunction,
}: EditUserModalProps) {
  const authHeader = useAuthHeader()

  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [role, setRole] = useState('')
  const [phone, setPhone] = useState('')

  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [moto, setMoto] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  useEffect(() => {
    setName(trainer.name || '')
    setSurname(trainer.surname || '')
    setRole(trainer.role || '')
    setPhone(trainer.phone || '')
    setPrice(trainer.price || 0)
    setDescription(trainer.description || '')
    setMoto(trainer.moto || '')
    setPhotoUrl(trainer.photoUrl || '')
  }, [trainer])

  useEffect(() => {
    console.log(role)
  }, [role])

  if (Object.keys(trainer).length === 0) {
    return null
  }

  const updateTrainer = async (t: Trainer) => {
    // adminDeleteUserCall(uid, authHeader)
    //   .then((res) => {
    //     closeFunction()
    //     reloadUserFunction()
    //     alert(`User ${trainer.name} ${trainer.surname} deleted`)
    //   })
    //   .catch((err) => alert(err))
  }

  const userFormGroups = [
    {
      label: 'Name',
      inputType: 'text',
      inputValue: name,
      setInput: (value: string) => setName(value),
    },
    {
      label: 'Surname',
      inputType: 'text',
      inputValue: surname,
      setInput: (value: string) => setSurname(value),
    },
    {
      label: 'Phone number',
      inputType: 'text',
      inputValue: phone,
      setInput: (value: string) => setPhone(value),
    },
  ] as ModalFormGroupProps[]

  const trainerFormGroups = [
    {
      label: 'Price',
      inputType: 'number',
      inputValue: price,
      setInput: (value: number) => setPrice(value),
    },
    {
      label: 'Description',
      inputType: 'text',
      inputValue: description,
      setInput: (value: string) => setDescription(value),
    },
    {
      label: 'Moto',
      inputType: 'text',
      inputValue: moto,
      setInput: (value: string) => setMoto(value),
    },
    {
      label: 'Photo url',
      inputType: 'text',
      inputValue: photoUrl,
      setInput: (value: string) => setPhotoUrl(value),
    },
  ] as ModalFormGroupProps[]

  return (
    <BaseModal
      title={'Edit trainer'}
      children={
        <Form>
          {error && (
            <Form.Text className="login-signup-modal-error">{error}</Form.Text>
          )}
          <ModalFormGroupList formGroups={userFormGroups} />
          <Form.Label>{'Role'}</Form.Label>
          <Form.Select onChange={(e) => setRole(e.target.value)} value={role}>
            <RoleOptions />
          </Form.Select>
          {role === UserRole.trainer ? (
            <ModalFormGroupList formGroups={trainerFormGroups} />
          ) : null}
        </Form>
      }
      buttonText={'Update'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => updateTrainer({} as Trainer)}
    />
  )
}

function RoleOptions() {
  return (
    <>
      {Object.keys(UserRole).map((e: string, index: number) => (
        <option key={index} value={e}>
          {e.toUpperCase()}
        </option>
      ))}
    </>
  )
}

export interface EditUserModalProps {
  trainer: Trainer
  showModal: boolean
  closeFunction: () => void
  reloadUserFunction: () => void
}
