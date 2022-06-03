import { Chart, registerables } from 'chart.js'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Doughnut, Line } from 'react-chartjs-2'
import {
  getReservationsCount,
  ReservationsCount,
} from '../../utils/apicalls/reservation'
import {
  getSubscriptionsCountCall,
  SubscriptionsCount,
} from '../../utils/apicalls/subscriptions'
import { useAuthHeader } from '../../utils/auth'
import './AdminChart.css'
Chart.register(...registerables)

const options = {
  scales: {
    y: {
      ticks: {
        stepSize: 1,
      },
    },
  },
}

// const dummyData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     {
//       label: 'morning',
//       data: [33, 53, 85, 41, 44, 65],
//       fill: true,
//       backgroundColor: 'rgba(75,192,192,0.2)',
//       borderColor: 'rgba(75,192,192,1)',
//     },
//     {
//       label: 'unlimited',
//       data: [33, 25, 35, 51, 54, 76],
//       fill: false,
//       backgroundColor: 'rgba(80,192,192,0.2)',
//       borderColor: '#742774',
//     },
//     {
//       label: 'afternoon',
//       data: [40, 25, 45, 50, 23, 76],
//       fill: false,
//       backgroundColor: 'rgba(0, 153, 51,0.2)',
//       borderColor: '#0066cc',
//     },
//   ],
// }

const dailyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sa'],
  datasets: [
    {
      label: 'morning',
      data: [],
      fill: true,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'unlimited',
      data: [],
      fill: false,
      backgroundColor: 'rgba(80,192,192,0.2)',
      borderColor: '#742774',
    },
    {
      label: 'afternoon',
      data: [],
      fill: false,
      backgroundColor: 'rgba(0, 153, 51,0.2)',
      borderColor: '#0066cc',
    },
  ],
}

const hourlyData = {
  labels: ['00:00', '06:00', '12:00', '18:00'],
  datasets: [
    {
      label: 'morning',
      data: [],
      fill: true,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'unlimited',
      data: [],
      fill: false,
      backgroundColor: 'rgba(80,192,192,0.2)',
      borderColor: '#742774',
    },
    {
      label: 'afternoon',
      data: [],
      fill: false,
      backgroundColor: 'rgba(0, 153, 51,0.2)',
      borderColor: '#0066cc',
    },
  ],
}

export default function AdminChart({ startDate, endDate }: AdminChartProps) {
  const authHeader = useAuthHeader()

  const [subscriptionsCount, setSubscriptionsCount] = useState<
    SubscriptionsCount[]
  >([])
  const [reservations, setReservations] = useState<ReservationsCount[]>([])

  const loadReservationCounts = async () => {
    getReservationsCount(
      authHeader,
      startDate.toISOString(),
      endDate.toISOString()
    )
      .then((r) => setReservations(r as ReservationsCount[]))
      .catch((err) => alert(err))
  }

  useEffect(() => {
    if (
      startDate.toString() === {}.toString() ||
      endDate.toString() === {}.toString() ||
      !authHeader
    ) {
      return
    }
    loadReservationCounts()
  }, [startDate, endDate])

  useEffect(() => {
    getSubscriptionsCountCall(authHeader)
      .then((r) => setSubscriptionsCount(r as SubscriptionsCount[]))
      .catch((r) => null)
  }, [])

  return (
    <div className="my-5">
      <Row>
        <Col>
          <h4 className="admin-chart-text">Daily reservations stats</h4>
          <Line data={getChartData(reservations, true)} options={options} />
        </Col>
        <Col>
          <h4 className="admin-chart-text">Hourly reservations stats</h4>
          <Line data={getChartData(reservations, false)} />
        </Col>
        <Col className="donut-chart">
          {!!subscriptionsCount?.length && (
            <>
              <h4 className="admin-chart-text">Active subscriptions</h4>
              <Doughnut data={getPieData(subscriptionsCount)} />
            </>
          )}
        </Col>
      </Row>
      <Row></Row>
    </div>
  )
}

function getPieData(data: SubscriptionsCount[]) {
  return {
    labels: data.map((d) => d.name.toLocaleLowerCase()),
    datasets: [
      {
        data: data.map((d) => d.count),
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  }
}

function getChartData(reservations: ReservationsCount[], daily: boolean) {
  if (!reservations?.length) {
    return daily ? dailyData : hourlyData
  }

  const dates = reservations.map((r) =>
    daily ? r.date.toLocaleDateString() : r.date.toLocaleTimeString()
  )

  const count = dates.reduce((accumulator: any, value) => {
    return { ...accumulator, [value]: (accumulator[value] || 0) + 1 }
  }, {})

  return {
    labels: Object.keys(count).sort(daily ? sortDay : sortHour),
    datasets: [
      getDataSet('MORNING', reservations, 'rgba(75,192,192,1)', daily),
      getDataSet('UNLIMITED', reservations, '#742774', daily),
      getDataSet('AFTERNOON', reservations, '#0066cc', daily),
    ],
  }
}

function getDataSet(
  type: string,
  reservations: ReservationsCount[],
  color: string,
  daily: boolean
) {
  const dates = reservations.map((r) => {
    const date = r.date
    // date.setHours(date.getHours() + 3)
    return {
      subscription: r.subscription,
      date: daily ? date.toLocaleDateString() : date.toLocaleTimeString(),
      count: r.subscription === type.toUpperCase() ? 1 : 0,
    }
  })

  reservations.forEach(
    (r) =>
      r.subscription === 'MORNING' &&
      r.date.toLocaleTimeString().includes('PM') &&
      console.log(r.date.toLocaleTimeString())
  )

  const count = dates.reduce((accumulator: any, value) => {
    return {
      ...accumulator,
      [value.date]: accumulator[value.date] + value.count || 0,
    }
  }, {})

  const countArray = Object.entries(count)
    .map((o) => {
      return {
        time: o[0],
        count: o[1],
      }
    })
    .sort((a, b) =>
      daily ? sortDay(a.time, b.time) : sortHour(a.time, b.time)
    )

  return {
    label: type.toLocaleLowerCase(),
    data: countArray.map((c) => c.count),
    fill: true,
    backgroundColor: 'rgba(75,192,192,0.2)',
    borderColor: color,
  }
}

function sortHour(a: string, b: string): number {
  return (
    (new Date('1970/01/01 ' + a) as any) - (new Date('1970/01/01 ' + b) as any)
  )
}

function sortDay(a: string, b: string): number {
  return (new Date(a) as any) - (new Date(b) as any)
}

export interface AdminChartProps {
  startDate: Date
  endDate: Date
}
