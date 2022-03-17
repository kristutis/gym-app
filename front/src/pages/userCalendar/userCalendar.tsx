
import FullCalendar, { EventInput } from '@fullcalendar/react' // must go before plugins, 1
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css'
// import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import {
  getTimetablesCall,
  ReservationWindow,
} from '../../utils/apicalls/timetable'

export default function UserCalendar() {
  const [events, setEvents] = useState([] as EventInput[])

  const convertToEvents = (data: ReservationWindow[]): EventInput[] => {
    const dataCopy = [...data]
    const converted = dataCopy.map((reservationWindow) => {
      return {
          id: reservationWindow.id,
        title: !!reservationWindow.limitedSpace
          ? `${reservationWindow.peopleCount} slots available`
          : 'Unlimited',
        color:
          !!reservationWindow.limitedSpace && !reservationWindow.peopleCount
            ? 'red'
            : 'green',
        start: reservationWindow.startTime,
        end: reservationWindow.endTime,
      } as any
    })
    return converted
  }

  const loadReservationWindows = async (startDate: Date, endDate: Date) => {
      const appendedEndDay = new Date(endDate)
      appendedEndDay.setDate(appendedEndDay.getDate() + 1)
      try {
        const data = await getTimetablesCall(startDate, appendedEndDay)
        console.log(data)
    
        setEvents(convertToEvents(data as ReservationWindow[]))
      } catch (e) {

      }
  }

  const handleEventClick = (e: any) => {
    console.log({id: e.event.id, s: e.event.start})
  }

  //red booked
  //green available
  //orange: mine

  return (
    <div>
      <FullCalendar
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
