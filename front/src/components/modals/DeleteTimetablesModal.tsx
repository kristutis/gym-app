import React from 'react'
import BaseModal from './BaseModal'

export default function DeleteTimetablesModal({
  startDate,
  endDate,
  showModal,
  closeFunction,
  submitFunction,
}: DeleteTimetablesModalProps) {
  return (
    <BaseModal
      title={'Confirm selection'}
      children={
        <h4>
          Delete reservation windows
          <br />
          {`from ${new Date(startDate).toLocaleDateString()}`}
          <br />
          {`to ${new Date(endDate).toLocaleDateString()}?`}
        </h4>
      }
      buttonText={'Confirm'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => submitFunction(startDate, endDate)}
    />
  )
}

export interface DeleteTimetablesModalProps {
  startDate: Date
  endDate: Date
  showModal: boolean
  closeFunction: () => void
  submitFunction: (startDate: Date, endDate: Date) => void
}
