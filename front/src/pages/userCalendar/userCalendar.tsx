import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins, 1
import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import React, { useEffect, useState } from 'react'
import { ToggleButton } from 'react-bootstrap'
import BookSlotModal from '../../components/modals/BookSlotModal'
import CancelSlotModal from '../../components/modals/CancelSlotModal'
import {
  createReservationCall,
  deleteReservationCall,
  getUserReservationIdsCall,
} from '../../utils/apicalls/reservation'
import {
  getTimetablesCall,
  ReservationWindow,
} from '../../utils/apicalls/timetable'
import { getUserDetailsCall, User } from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'

export default function UserCalendar() {
  const authHeader = useAuthHeader()

  const [usersPhone, setUsersPhone] = useState('')
  const [calendarRange, setCalendarRange] = useState({
    startDate: {} as Date,
    endDate: {} as Date,
  })

  const [cancelBookModal, setCancelBookModal] = useState(false)
  const [cancelBookModalText, setCancelBookModalText] = useState('')
  const [showBookModal, setShowBookModal] = useState(false)
  const [bookModalText, setBookModalText] = useState('')
  const [bookModalId, setBookModalId] = useState(0)

  const [showUsersOnly, setShowUsersOnly] = useState(false)
  const [events, setEvents] = useState([] as EventInput[])

  const convertToEvents = (
    data: ReservationWindow[],
    userResIds: number[]
  ): EventInput[] => {
    const getColor = (
      alreadyReserved: boolean,
      available: boolean,
      startDate: Date
    ) => {
      if (alreadyReserved) {
        return 'orange'
      }
      return available ? 'green' : 'red'
    }

    const dataCopy = [...data]
    const now = new Date()
    const converted = dataCopy.map((reservationWindow) => {
      const available =
        !(!!reservationWindow.limitedSpace && !reservationWindow.peopleCount) &&
        new Date(reservationWindow.startTime).getTime() >= now.getTime()
      const alreadyReserved = userResIds.includes(reservationWindow.id)

      if (showUsersOnly && !alreadyReserved) {
        return {}
      }

      return {
        id: reservationWindow.id.toString(),
        title: !!reservationWindow.limitedSpace
          ? `- ${reservationWindow.peopleCount} slots available`
          : ' - Unlimited',
        color: getColor(
          alreadyReserved,
          available,
          reservationWindow.startTime
        ),
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

  useEffect(() => {
    loadReservationWindows()
  }, [calendarRange, showUsersOnly])

  useEffect(() => {
    getUserDetailsCall(authHeader)
      .then((usersDetails) => setUsersPhone((usersDetails as User).phone || ''))
      .catch((err) => alert('Error when getting users details'))
  }, [])

  const loadReservationWindows = async () => {
    if (
      calendarRange.startDate.toString() === {}.toString() &&
      calendarRange.endDate.toString() === {}.toString()
    ) {
      return
    }

    const userResIds = await loadUsersReservationIds()

    const appendedEndDay = new Date(calendarRange.endDate)
    appendedEndDay.setDate(appendedEndDay.getDate() + 1)
    try {
      const data = await getTimetablesCall(
        calendarRange.startDate,
        appendedEndDay
      )
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

    if (!eventDetails.extendedProps.available) {
      return
    }

    if (eventDetails.extendedProps.alreadyReserved) {
      openCancelBookModal(eventDetails.start)
      return
    }

    openBookModal(eventDetails.start)
  }

  const handleCancelReservation = async (id: number) => {
    try {
      await deleteReservationCall(id, authHeader)
      setCancelBookModal(false)
      loadReservationWindows()
    } catch (e) {
      alert(e)
    }
  }

  const handleBooking = async (id: number, sendMessage: boolean) => {
    try {
      await createReservationCall(id, sendMessage, authHeader)
      setShowBookModal(false)
      loadReservationWindows()
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
        text={cancelBookModalText}
      />
      <BookSlotModal
        showModal={showBookModal}
        closeFunction={() => setShowBookModal(false)}
        submitFunction={(sendMessage: boolean) =>
          handleBooking(bookModalId, sendMessage)
        }
        text={bookModalText}
        usersPhone={usersPhone}
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

      <ToggleButton
        className="mb-2"
        id="toggle-check"
        type="checkbox"
        variant="outline-warning"
        checked={showUsersOnly}
        value="null"
        onChange={() => setShowUsersOnly(!showUsersOnly)}
      >
        Show only my bookings
      </ToggleButton>
    </div>
  )
}
