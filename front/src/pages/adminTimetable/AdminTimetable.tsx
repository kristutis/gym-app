
import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins, 1
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClicka
import timeGridPlugin from '@fullcalendar/timegrid'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import DeleteTimetablesModal from '../../components/modals/DeleteTimetablesModal'
import EditTimetableModal from '../../components/modals/EditTimetableModal'
import {
  deleteTimetableByIdCall,
  deleteTimetableCall,
  getTimetablesCall,
  ReservationWindow,
  updateTimetableCall,
} from '../../utils/apicalls/timetable'
import { useAuthHeader } from '../../utils/auth'
import './AdminTimetable.css'

export default function AdminTimetable() {
  const authHeader = useAuthHeader()

  const [calendarRange, setCalendarRange] = useState({
    startDate: {} as Date,
    endDate: {} as Date,
  })
  const [events, setEvents] = useState([] as EventInput[])

  const [deleteModalOpened, setDeleteModalOpened] = useState(false)
  const [deleteDates, setDeleteDates] = useState({
    startDate: {} as Date,
    endDate: {} as Date,
  })

  const [editModalError, setEditModalError] = useState('')
  const [editTimeTable, setEditTimeTable] = useState({} as ReservationWindow)
  const [editModalOpened, setEditModalOpened] = useState(false)

  const convertToEvents = (data: ReservationWindow[]): EventInput[] => {
    const dataCopy = [...data]
    const now = new Date()
    const converted = dataCopy.map((reservationWindow) => {
      return {
        id: reservationWindow.id.toString(),
        title: !!reservationWindow.limitedSpace
          ? `- ${reservationWindow.peopleCount} slots available`
          : ' - Unlimited',
        color:
          new Date(reservationWindow.startTime).getTime() <= now.getTime()
            ? 'black'
            : 'green',
        start: reservationWindow.startTime,
        end: reservationWindow.endTime,
        extendedProps: reservationWindow,
      } as EventInput
    })
    return converted
  }

  useEffect(() => {
    loadReservationWindows()
  }, [calendarRange])

  const loadReservationWindows = async () => {
    if (
      calendarRange.startDate.toString() === {}.toString() &&
      calendarRange.endDate.toString() === {}.toString()
    ) {
      return
    }

    const appendedEndDay = new Date(calendarRange.endDate)
    appendedEndDay.setDate(appendedEndDay.getDate() + 1)
    try {
      const data = await getTimetablesCall(
        calendarRange.startDate,
        appendedEndDay
      )
      setEvents(convertToEvents(data as ReservationWindow[]))
    } catch (e) {
      alert('Error when getting all events')
    }
  }

  const handleEventClick = (e: any) => {
    const eventDetails = e.event as EventInput

    if ((eventDetails.start as any) < new Date(Date.now())) {
      return
    }

    const resWindowInfo = eventDetails.extendedProps as ReservationWindow
    setEditTimeTable(resWindowInfo)
    setEditModalOpened(true)
  }

  const deleteReservationWindows = (startDate: Date, endDate: Date) => {
    deleteTimetableCall(startDate, endDate, authHeader)
      .then((res) => {
        loadReservationWindows()
        setDeleteModalOpened(false)
      })
      .catch((err) => alert(err))
  }

  const updateReservationWindow = (updated: ReservationWindow) => {
    updateTimetableCall(updated, authHeader)
      .then((res) => {
        setEditModalError('')
        loadReservationWindows()
        setEditModalOpened(false)
      })
      .catch((err) => setEditModalError(err))
  }

  const deleteReservationWindow = (id: number) => {
    deleteTimetableByIdCall(id, authHeader)
      .then((res) => {
        loadReservationWindows()
        setEditModalOpened(false)
      })
      .catch((err) => alert(err))
  }

  return (
    <>
      <DeleteTimetablesModal
        startDate={deleteDates.startDate}
        endDate={deleteDates.endDate}
        showModal={deleteModalOpened}
        closeFunction={() => setDeleteModalOpened(false)}
        submitFunction={deleteReservationWindows}
      />
      <EditTimetableModal
        reservationWindow={editTimeTable}
        showModal={editModalOpened}
        closeFunction={() => setEditModalOpened(false)}
        submitFunction={updateReservationWindow}
        deleteFunction={(value: number) => deleteReservationWindow(value)}
        errorMsg={editModalError}
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
        eventClick={(e) => handleEventClick(e)}
        select={(e: any) => {
          setDeleteDates({ startDate: e.start as Date, endDate: e.end as Date })
          setDeleteModalOpened(
            events.some((event) =>
              dateRangeOverlaps(
                new Date(event.start as Date),
                new Date(event.end as Date),
                e.start,
                e.end
              )
            )
          )
        }}
        selectable={true}
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
      <Link
        to={'/admin-timetable/create'}
        className="admin-table-generate-button d-grid gap-2 my-2"
      >
        <Button variant="success" size="lg">
          Generate Timetable
        </Button>
      </Link>
    </>
  )
}

function dateRangeOverlaps(
  a_start: Date,
  a_end: Date,
  b_start: Date,
  b_end: Date
) {
  if (a_start <= b_start && b_start <= a_end) return true // b starts in a
  if (a_start <= b_end && b_end <= a_end) return true // b ends in a
  if (b_start < a_start && a_end < b_end) return true // a in b
  if (b_start > a_start && a_end > b_end) return true // b in a
  return false
}
