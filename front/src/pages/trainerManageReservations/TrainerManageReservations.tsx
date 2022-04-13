import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClicka
import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins, 1
import timeGridPlugin from '@fullcalendar/timegrid'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import UserAttendencyModal from '../../components/modals/UserAttendencyModal'
import Unauthorized from '../../components/unauthorized/Unauthorized'
import {
  trainerGetUserReservationsCall,
  UserReservation,
} from '../../utils/apicalls/reservation'
import { User } from '../../utils/apicalls/user'
import { useAuthHeader, useTrainerRole } from '../../utils/auth'

export default function TrainerManageReservations(props: any) {
  const auth = useAuthHeader()
  const history = useHistory()
  const user = props.location?.state?.user as User

  const [events, setEvents] = useState([] as EventInput[])
  const [calendarRange, setCalendarRange] = useState({
    startDate: {} as Date,
    endDate: {} as Date,
  })

  const [editableReservation, setEditableReservation] = useState(
    {} as UserReservation
  )

  const convertToEvents = async (
    data: UserReservation[]
  ): Promise<EventInput[]> => {
    const dataCopy = [...data]
    const converted = dataCopy.map((reservationWindow) => {
      return {
        id: reservationWindow.id.toString(),
        color: reservationWindow.attended ? 'green' : 'red',
        start: reservationWindow.startTime,
        end: reservationWindow.endTime,
        extendedProps: reservationWindow,
      } as EventInput
    })
    return Promise.resolve(converted)
  }

  const loadReservations = () => {
    if (
      calendarRange.startDate.toString() === {}.toString() &&
      calendarRange.endDate.toString() === {}.toString()
    ) {
      return
    }

    trainerGetUserReservationsCall(
      calendarRange.startDate,
      calendarRange.endDate,
      user.id,
      auth
    )
      .then((res) => convertToEvents(res as UserReservation[]))
      .then((evs) => setEvents(evs))
  }

  const handleEventClick = ({ event }: { event: EventInput }) => {
    setEditableReservation(event.extendedProps as UserReservation)
  }

  useEffect(() => {
    loadReservations()
  }, [calendarRange])

  if (!useTrainerRole()) {
    return <Unauthorized />
  }

  if (!user) {
    history.push('/trainer-actions')
    return null
  }

  return (
    <>
      <UserAttendencyModal
        reservation={editableReservation}
        closeFunction={() => setEditableReservation({} as UserReservation)}
        reloadFunction={loadReservations}
      />
      <FullCalendar
        plugins={[
          dayGridPlugin,
          bootstrap5Plugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        themeSystem="bootstrap5"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={(e: any) => handleEventClick(e)}
        navLinks={true}
        dayMaxEvents={true}
        datesSet={(dateInfo) =>
          setCalendarRange({
            startDate: dateInfo.start,
            endDate: dateInfo.end,
          })
        }
        eventTimeFormat={{
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }}
      />
      <Link to="/trainer-actions">
        <Button variant={'success'} className="m-2">
          Back
        </Button>
      </Link>
    </>
  )
}
