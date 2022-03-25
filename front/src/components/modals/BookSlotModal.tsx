import React, { useState } from 'react'
import { Form } from 'react-bootstrap'
import BaseModal from './BaseModal'

export default function BookSlotModal({
  showModal,
  closeFunction,
  submitFunction,
  text,
  usersPhone,
}: BookSlotModalProps) {
  const [sendMessage, setSendMessage] = useState(false)

  return (
    <BaseModal
      title={'Confirm selection'}
      children={
        <BookSlotForm
          text={text}
          setSendMessage={setSendMessage}
          usersPhone={usersPhone}
        />
      }
      buttonText={'Book slot'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => {
        setSendMessage(false)
        submitFunction(sendMessage)
      }}
    />
  )
}

function BookSlotForm({
  text,
  setSendMessage,
  usersPhone,
}: {
  text: string
  setSendMessage: (sendMessage: boolean) => void
  usersPhone: string
}) {
  return (
    <>
      <h4 className="mb-3">{text}</h4>
      <Form>
        <Form.Check
          type="checkbox"
          disabled={!usersPhone}
          label={
            !!usersPhone
              ? `Notify me by SMS message (${usersPhone})`
              : 'Please fill up your phone number to recieve SMS messages'
          }
          onChange={(e) => setSendMessage(e.target.checked)}
        />
      </Form>
    </>
  )
}

export interface BookSlotModalProps {
  showModal: boolean
  closeFunction: () => void
  submitFunction: (sendMessage: boolean) => void
  text: string
  usersPhone: string
}
