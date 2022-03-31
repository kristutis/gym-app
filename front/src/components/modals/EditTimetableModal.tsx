import React, { useEffect, useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { ReservationWindow } from '../../utils/apicalls/timetable'
import BaseModal from './BaseModal'

export default function EditTimetableModal({
  reservationWindow,
  showModal,
  closeFunction,
  submitFunction,
}: EditTimetableModalProps) {
  const [startTime, setStartTime] = useState({} as Date)
  const [endTime, setEndTime] = useState({} as Date)
  const [limitedSpace, setLimitedSpace] = useState(false)
  const [peopleLimit, setPeopleLimit] = useState(0)

  useEffect(() => {
    setStartTime(reservationWindow.startTime)
    setEndTime(reservationWindow.endTime)
    setLimitedSpace(reservationWindow.limitedSpace)
    setPeopleLimit(reservationWindow.peopleCount || 0)
  }, [reservationWindow])

  return (
    <BaseModal
      title={'Edit Reservation Window'}
      children={
        <EditTimetableForm
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          limitedSpace={limitedSpace}
          setLimitedSpace={setLimitedSpace}
          peopleLimit={peopleLimit}
          setPeopleLimit={setPeopleLimit}
        />
      }
      buttonText={'Confirm'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => {
        const updatedResWindow = {
          id: reservationWindow.id,
          startTime: startTime,
          endTime: endTime,
          limitedSpace: limitedSpace,
          peopleCount: !!peopleLimit ? peopleLimit : undefined,
        } as ReservationWindow
        submitFunction(updatedResWindow)
      }}
    />
  )
}

function EditTimetableForm({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  limitedSpace,
  setLimitedSpace,
  peopleLimit,
  setPeopleLimit,
}: EditTimetableFormProps) {
  const [minDate, setMinDate] = useState(Date.now())

  const convertDateTime = (value: Date): string =>
    startTime.toLocaleString().split('T')[0] +
    'T' +
    new Date(startTime).toLocaleTimeString('lt-LT')

  return (
    <>
      <InputGroup className="mb-3">
        <InputGroup.Text>Start time</InputGroup.Text>
        <Form.Control
          type="datetime-local"
          defaultValue={convertDateTime(startTime)}
          min={Date.now()}
          onChange={(e: any) => {
            setStartTime(e.target.value)
            setMinDate(e.target.value)
          }}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>End time</InputGroup.Text>
        <Form.Control
          type="datetime-local"
          defaultValue={convertDateTime(endTime)}
          min={minDate}
          onChange={(e: any) => {
            setEndTime(e.target.value)
          }}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text>Limit visitors' count?</InputGroup.Text>
        <InputGroup.Checkbox
          defaultValue={limitedSpace}
          onChange={(e: any) => {
            setLimitedSpace(e.target.checked)
          }}
        />
        <Form.Control
          type="number"
          placeholder={peopleLimit ? 'Visitors count' : ''}
          disabled={!limitedSpace}
          min={1}
          value={limitedSpace ? peopleLimit : ''}
          onChange={(e: any) => {
            setPeopleLimit(e.target.value)
          }}
        />
      </InputGroup>
    </>
  )
}

interface EditTimetableFormProps {
  startTime: Date
  setStartTime: (value: Date) => void
  endTime: Date
  setEndTime: (value: Date) => void
  limitedSpace: boolean
  setLimitedSpace: (value: boolean) => void
  peopleLimit: number
  setPeopleLimit: (value: number) => void
}

export interface EditTimetableModalProps {
  reservationWindow: ReservationWindow
  showModal: boolean
  closeFunction: () => void
  submitFunction: (value: ReservationWindow) => void
}
