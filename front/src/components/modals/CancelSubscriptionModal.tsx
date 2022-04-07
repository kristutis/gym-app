import React, { useState } from 'react'
import { deleteSubscriptionCall } from '../../utils/apicalls/subscriptions'
import { useAuthHeader } from '../../utils/auth'
import ErrorLabel from '../errorLabel/ErrorLabel'
import BaseModal from './BaseModal'

export default function CancelSubscriptionModal({
  show,
  submitFunction,
  closeFunction,
}: CancelSubscriptionModalProps) {
  const authHeader = useAuthHeader()

  const [error, setError] = useState('')

  const submitClicked = () => {
    setError('')

    deleteSubscriptionCall(authHeader)
      .then((r) => {
        submitFunction()
        closeFunction()
      })
      .catch((err) => setError(err))
  }

  return (
    <BaseModal
      title={'Confirm'}
      children={
        <>
          <ErrorLabel error={error} />
          <h4>Cancel subscription?</h4>
          <ErrorLabel error={'Action cannot be undone!'} />
        </>
      }
      buttonText={'Cancel'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={submitClicked}
    />
  )
}

export interface CancelSubscriptionModalProps {
  show: boolean
  submitFunction: () => void
  closeFunction: () => void
}
