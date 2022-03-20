import React from 'react'
import BaseModal from './BaseModal'

export default function BookSlotModal({
  showModal,
  closeFunction,
  submitFunction,
}: BookSlotModalProps) {
  return (
    <BaseModal
      title={'Confirm selection'}
      children={
        <BookSlotForm />
        // <LoginForm
        //   validatationError={validatationError}
        //   emailError={emailError}
        //   passwordError={passwordError}
        //   email={email}
        //   setEmail={setEmail}
        //   password={password}
        //   setPassword={setPassword}
        // />
      }
      buttonText={'Book slot'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={submitFunction}
    />
  )
}

function BookSlotForm() {
  return <h1>hello</h1>
}

export interface BookSlotModalProps {
  showModal: boolean
  closeFunction: () => void
  submitFunction: () => void
}
