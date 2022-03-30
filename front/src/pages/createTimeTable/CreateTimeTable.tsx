import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ErrorLabel from '../../components/errorLabel/ErrorLabel'
import ReservationWindowForm from '../../components/reservationWindowForm/ReservationWindowForm'
import Unauthorized from '../../components/unauthorized/Unauthorized'
import {
  createTimetableCall,
  CreateTimetableCallProps,
} from '../../utils/apicalls/timetable'
import { useAdminRole } from '../../utils/auth'
import './CreateTimeTable.css'

export default function CreateTimeTable() {
  const [error, setError] = useState('')
  const [formsCount, setFormsCount] = useState(1)
  const [formsPayloads, setFormsPayloads] = useState([
    {},
  ] as CreateTimetableCallProps[])

  const handleSubmit = async () => {
    let err = validateInputs(formsPayloads)
    if (err) {
      setError(err)
      return
    }

    err = await createTimetableCall(formsPayloads)
    if (err) {
      setError(err)
      return
    }
    setError('')
  }

  const handleCreateForm = () => {
    setFormsPayloads([...formsPayloads, {} as CreateTimetableCallProps])
    setFormsCount(formsCount + 1)
  }

  const handleDeleteForm = () => {
    const newFormsPayload = [...formsPayloads]
    newFormsPayload.pop()
    setFormsPayloads(newFormsPayload)
    setFormsCount(formsCount - 1)
  }

  if (!useAdminRole()) {
    return <Unauthorized />
  }

  return (
    <>
      <div className="create-window-form">
        <h1>Please select your specification</h1>
        <ErrorLabel error={error} />
        <div className="mb-3">
          {[...(Array(formsCount).keys() as any)].map((index) => (
            <ReservationWindowForm
              key={index}
              index={index + 1}
              deleteForm={() => handleDeleteForm()}
              setFormPayload={(payload) => {
                const newPayloads = [...formsPayloads]
                newPayloads[index] = payload
                setFormsPayloads(newPayloads)
              }}
            />
          ))}
        </div>
        <Button
          className="mb-3"
          variant="outline-success"
          onClick={() => handleCreateForm()}
        >
          + Add more
        </Button>
        <div className="d-grid gap-2">
          <Button variant="success" size="lg" onClick={() => handleSubmit()}>
            CREATE
          </Button>
        </div>
      </div>
      <Link to={'/admin-timetable'}>
        <Button variant="success" className="m-2">
          Back
        </Button>
      </Link>
    </>
  )
}

function validateInputs(payloads: CreateTimetableCallProps[]): string {
  for (let i = 0; i < payloads.length; i++) {
    const form = payloads[i]
    if (!Object.keys(form).length) {
      return `Form #${i + 1} cannot be empty!`
    }

    if (!form.startDate) {
      return `Form #${i + 1} start date cannot be empty!`
    }

    if (!form.startTime) {
      return `Form #${i + 1} start time cannot be empty!`
    }

    if (!form.endDate) {
      return `Form #${i + 1} end date cannot be empty!`
    }

    if (!form.endTime) {
      return `Form #${i + 1} end time cannot be empty!`
    }

    if (!form.visitingTime) {
      return `Form #${i + 1} visiting time cannot be empty!`
    }

    if (!form.breakTime) {
      return `Form #${i + 1} break time cannot be empty!`
    }

    if (form.visitingTime <= '00:00') {
      return `Form #${i + 1} invalid visiting time!`
    }

    if (form.excludeWeekends && form.onlyWeekends) {
      return `Form #${i + 1} cannot have both weekends and weekdays excluded!`
    }

    if (form.limitVisitors && form.visitorsCount! < 1) {
      return `Form #${i + 1} visitors count should be more than 0!`
    }
  }
  return ''
}
