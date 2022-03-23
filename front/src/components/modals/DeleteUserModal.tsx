import React from 'react'
import { adminDeleteUserCall, Trainer } from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'

export default function DeleteUserModal({
  trainer,
  showModal,
  closeFunction,
  reloadUserFunction,
}: DeleteUserModalProps) {
  const authHeader = useAuthHeader()

  const deleteTrainer = async (uid: string) => {
    adminDeleteUserCall(uid, authHeader)
      .then((res) => {
        closeFunction()
        reloadUserFunction()
        alert(`User ${trainer.name} ${trainer.surname} deleted`)
      })
      .catch((err) => alert(err))
  }

  return (
    <BaseModal
      title={'Confirm selection'}
      children={
        <DeleteUserForm
          text={`Delete user ${trainer.name} ${trainer.surname}?`}
        />
      }
      buttonText={'Delete'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => deleteTrainer(trainer.id)}
    />
  )
}

function DeleteUserForm({ text }: { text: string }) {
  return <h4>{text}</h4>
}

export interface DeleteUserModalProps {
  trainer: Trainer
  showModal: boolean
  closeFunction: () => void
  reloadUserFunction: () => void
}
