import React from 'react'
import BaseModal from './BaseModal'

export default function BookSlotModal({
  showModal,
  closeFunction,
  submitFunction,
  id,
  text,
}: BookSlotModalProps) {
  return (
    <BaseModal
      title={'Confirm selection'}
      children={<BookSlotForm text={text} />}
      buttonText={'Book slot'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={submitFunction}
    />
  )
}

function BookSlotForm({ text }: { text: string }) {
  return <h4>{text}</h4>
}

export interface BookSlotModalProps {
  showModal: boolean
  closeFunction: () => void
  submitFunction: () => void
  id: number
  text: string
}
