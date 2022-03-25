import React from 'react'
import BaseModal from './BaseModal'

export default function CancelSlotModal({
  showModal,
  closeFunction,
  submitFunction,
  text,
}: CancelSlotModalProps) {
  return (
    <BaseModal
      title={'Cancel reservation?'}
      children={<CancelSlotModalForm text={text} />}
      buttonText={'Confirm'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={submitFunction}
    />
  )
}

function CancelSlotModalForm({ text }: { text: string }) {
  return <h4>{text}</h4>
}

export interface CancelSlotModalProps {
  showModal: boolean
  closeFunction: () => void
  submitFunction: () => void
  text: string
}
