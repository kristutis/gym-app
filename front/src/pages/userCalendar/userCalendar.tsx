import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins, 1
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css'
// import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import React from 'react'
import { Button } from 'react-bootstrap'

export default function userCalendar() {
  const loadReservationWindows = (startDate: Date, endDate: Date) => {
      console.log(startDate)
      console.log(endDate)
  }

  const handleEventClick = (e: any) => {
    console.log(e.event.start)
  }

  //red booked
  //green available
  //orange: mine
  const events: EventInput[] = [
    {
      title: '2 visitors',
      color: 'orange',
      start: '2022-03-17T12:30:00.000Z',
      end: '2022-03-17T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-18T12:30:00.000Z',
      end: '2022-03-18T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
    {
      title: '2 visitors',
      start: '2022-03-10T12:30:00.000Z',
      end: '2022-03-2T13:30:00.000Z',
    },
  ]

  return (
    <div>
      <FullCalendar
        // plugins={[dayGridPlugin, interactionPlugin]}
        plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        themeSystem="bootstrap5"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay listWeek',
        }}
        buttonText={{
          list: 'weekly plan',
        }}
        events={events}
        eventClick={(e) => handleEventClick(e)}
        navLinks={true}
        dayMaxEvents={true}
        datesSet={(dateInfo) =>
          loadReservationWindows(dateInfo.start, dateInfo.end)
        }
      />
      <Button variant="success">show only my bookings</Button>
    </div>
  )
}
