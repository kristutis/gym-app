import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import {
  trainerUpdateAttendencyCall,
  UserReservation,
} from '../../utils/apicalls/reservation'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'

export default function UserAttendencyModal({
  reservation,
  closeFunction,
  reloadFunction,
}: UserAttendencyModalProps) {
  const authToken = useAuthHeader()
  const [attended, setAttended] = useState(false)

  useEffect(() => {
    setAttended(reservation.attended || false)
  }, [reservation])

  const submit = async () => {
    trainerUpdateAttendencyCall(
      reservation.id,
      reservation.uid,
      attended,
      authToken
    )
      .then((r) => {
        closeFunction()
        reloadFunction()
      })
      .catch((err) => null)
  }

  return (
    <BaseModal
      title={'Confirm selection'}
      children={
        <>
          <Form>
            <Form.Check
              type="checkbox"
              label={'User attended'}
              checked={attended}
              onChange={(e) => setAttended(e.target.checked)}
            />
          </Form>
        </>
      }
      buttonText={'Update'}
      show={!!Object.keys(reservation).length}
      closeFunction={closeFunction}
      submitFunction={() => submit()}
    />
  )
}

export interface UserAttendencyModalProps {
  reservation: UserReservation
  closeFunction: () => void
  reloadFunction: () => void
}
