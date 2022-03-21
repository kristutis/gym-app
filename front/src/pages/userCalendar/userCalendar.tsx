import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins, 1

import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import BookSlotModal from '../../components/modals/BookSlotModal'
import CancelSlotModal from '../../components/modals/CancelSlotModal'
import {
  createReservationCall,
  CreateReservationCallProps,
  deleteReservationCall,
  DeleteReservationCallProps,
  getUserReservationIdsCall,
} from '../../utils/apicalls/reservation'
import {
  getTimetablesCall,
  ReservationWindow,
} from '../../utils/apicalls/timetable'
import { useAuthHeader } from '../../utils/auth'

export default function UserCalendar() {
  const authHeader = useAuthHeader()

  const [cancelBookModal, setCancelBookModal] = useState(false)
  const [cancelBookModalText, setCancelBookModalText] = useState('')

  const [showBookModal, setShowBookModal] = useState(false)
  const [bookModalText, setBookModalText] = useState('')
  const [bookModalId, setBookModalId] = useState(0)

  const [showAvailable, setShowAvailable] = useState(true)
  const [events, setEvents] = useState([] as EventInput[])

  const convertToEvents = (
    data: ReservationWindow[],
    userResIds: number[]
  ): EventInput[] => {
    const getColor = (alreadyReserved: boolean, available: boolean) => {
      if (alreadyReserved) {
        return 'orange'
      }
      return available ? 'green' : 'red'
    }

    const dataCopy = [...data]
    const converted = dataCopy.map((reservationWindow) => {
      const available = !(
        !!reservationWindow.limitedSpace && !reservationWindow.peopleCount
      )
      const alreadyReserved = userResIds.includes(reservationWindow.id)
      return {
        id: reservationWindow.id.toString(),
        title: !!reservationWindow.limitedSpace
          ? `- ${reservationWindow.peopleCount} slots available`
          : ' - Unlimited',
        color: getColor(alreadyReserved, available),
        start: reservationWindow.startTime,
        end: reservationWindow.endTime,
        extendedProps: { available, alreadyReserved },
      } as EventInput
    })
    return converted
  }

  const loadUsersReservationIds = async (): Promise<number[]> => {
    try {
      const userResIds = (await getUserReservationIdsCall(
        authHeader
      )) as number[]
      return Promise.resolve(userResIds)
    } catch (e) {
      alert('Error when getting user events')
    }
    return Promise.resolve([])
  }

  const loadReservationWindows = async (startDate: Date, endDate: Date) => {
    const userResIds = await loadUsersReservationIds()

    // if (!showAvailable) {
    //   return
    // }
    const appendedEndDay = new Date(endDate)
    appendedEndDay.setDate(appendedEndDay.getDate() + 1)
    try {
      const data = await getTimetablesCall(startDate, appendedEndDay)
      setEvents(convertToEvents(data as ReservationWindow[], userResIds))
    } catch (e) {
      alert('Error when getting all events')
    }
  }

  const openBookModal = (startDate: Date) => {
    function formatBookingMsg(startDate: Date) {
      const dayOfWeek = startDate.toLocaleString('en-us', { weekday: 'long' })
      const isoDateParts = startDate.toISOString().split('T')
      const date = isoDateParts[0]
      const timeParts = isoDateParts[1].split(':')
      const time = `${timeParts[0]}:${timeParts[1]}`
      return `Book slot on ${dayOfWeek}, ${date} ${time}?`
    }
    setBookModalText(formatBookingMsg(startDate))
    setShowBookModal(true)
  }

  const openCancelBookModal = (startDate: Date) => {
    function formatBookingMsg(startDate: Date) {
        const dayOfWeek = startDate.toLocaleString('en-us', { weekday: 'long' })
        const isoDateParts = startDate.toISOString().split('T')
        const date = isoDateParts[0]
        const timeParts = isoDateParts[1].split(':')
        const time = `${timeParts[0]}:${timeParts[1]}`
        return `${dayOfWeek}, ${date} ${time}?`
      }
    setCancelBookModal(true)
    setCancelBookModalText(formatBookingMsg(startDate))
  }

  const handleEventClick = (e: any) => {
    const eventDetails = e.event
    setBookModalId(eventDetails.id)

    if (eventDetails.extendedProps.alreadyReserved) {
      openCancelBookModal(eventDetails.start)
      return
    }

    if (!eventDetails.extendedProps.available) {
      return
    }

    openBookModal(eventDetails.start)
  }

  const handleCancelReservation = async (id: number) => {
    try {
      const payload = { reservationId: id } as DeleteReservationCallProps
      await deleteReservationCall(payload, authHeader)
      alert('Success!')
      window.location.reload()
    } catch (e) {
      alert(e)
    }
  }

  const handleBooking = async (id: number) => {
    try {
      const payload = { reservationId: id } as CreateReservationCallProps
      await createReservationCall(payload, authHeader)
      alert('Success!')
      window.location.reload()
    } catch (e) {
      alert(e)
    }
  }

  return (
    <div>
      <CancelSlotModal
        showModal={cancelBookModal}
        closeFunction={() => setCancelBookModal(false)}
        submitFunction={() => handleCancelReservation(bookModalId)}
        id={bookModalId}
        text={cancelBookModalText}
      />
      <BookSlotModal
        showModal={showBookModal}
        closeFunction={() => setShowBookModal(false)}
        submitFunction={() => handleBooking(bookModalId)}
        id={bookModalId}
        text={bookModalText}
      />
      <FullCalendar
        plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin]}
        initialView="dayGridMonth"
        themeSystem="bootstrap5"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={events}
        eventClick={(e) => handleEventClick(e)}
        navLinks={true}
        dayMaxEvents={true}
        datesSet={(dateInfo) =>
          loadReservationWindows(dateInfo.start, dateInfo.end)
        }
        eventTimeFormat={{
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        }}
      />
      <Button
        variant="success"
        onClick={() => {
          setEvents([])
          setShowAvailable(false)
        }}
      >
        show only my bookings
      </Button>
    </div>
  )
}
