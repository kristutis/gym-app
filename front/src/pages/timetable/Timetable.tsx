import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Form,
  InputGroup,
  ProgressBar,
  Row,
} from 'react-bootstrap'
import './Timetable.css'

export default function Timetable() {
  return (
    <>
      <div className="create-window-form">
        <h1>Please select your specification</h1>
        <ReservationWindowForm />
        <Button variant="success">+ Add more</Button>
        <br></br>
        <br></br>
        <Button variant="warning">Submit</Button>
      </div>
    </>
  )
}

function ReservationWindowForm() {
  const currentDate = getMinDateFormat(new Date())

  const [progressBar, setProgressBar] = useState(0)

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [visitingTime, setVisitingTime] = useState(null)
  const [breakTime, setBreakTime] = useState(null)

  const [excludeWeekends, setExcludeWeekends] = useState(false)
  const [limitVisitors, setLimitVisitors] = useState(false)
  const [visitorsCount, setVisitorsCount] = useState(0)
  const [minEndDate, setMinEndDate] = useState(currentDate)

  const handleProgressBar = () => {
    let progress = 0
    if (startDate) {
      progress += 20
    }
    if (endDate) {
      progress += 20
    }
    if (startTime) {
      progress += 20
    }
    if (endTime) {
      progress += 20
    }
    if (visitingTime) {
      progress += 10
    }
    if (breakTime) {
      progress += 10
    }
    setProgressBar(progress)
  }

  useEffect(
    () => handleProgressBar(),
    [startDate, endDate, startTime, endTime, visitingTime, breakTime]
  )

  return (
    <>
      <div className="reservation-window-form">
        <h4>Form #1</h4>
        <Form>
          <ProgressBar
            className="mb-4"
            striped
            animated
            variant="success"
            label={`${progressBar}% done`}
            now={progressBar}
          />
          <Row className="mb-4">
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Start date</InputGroup.Text>
                <Form.Control
                  type="date"
                  min={currentDate}
                  onChange={(e: any) => {
                    setStartDate(e.target.value)
                    setMinEndDate(e.target.value)
                  }}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>Start time</InputGroup.Text>
                <Form.Control
                  type="time"
                  onChange={(e: any) => {
                    setStartTime(e.target.value)
                  }}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>End date</InputGroup.Text>
                <Form.Control
                  type="date"
                  min={minEndDate}
                  onChange={(e: any) => {
                    setEndDate(e.target.value)
                  }}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <InputGroup.Text>End time</InputGroup.Text>
                <Form.Control
                  type="time"
                  onChange={(e: any) => {
                    setEndTime(e.target.value)
                  }}
                />
              </InputGroup>
            </Col>
          </Row>

          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Visiting time</InputGroup.Text>
                <Form.Control
                  type="time"
                  onChange={(e: any) => {
                    setVisitingTime(e.target.value)
                  }}
                />
              </InputGroup>
            </Col>
            <Col />
          </Row>
          <Row className="mb-4">
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Break time</InputGroup.Text>
                <Form.Control
                  type="time"
                  onChange={(e: any) => {
                    setBreakTime(e.target.value)
                  }}
                />
              </InputGroup>
            </Col>
            <Col />
          </Row>

          <Row>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Exclude weekends?</InputGroup.Text>
                <InputGroup.Checkbox
                  onChange={(e: any) => setExcludeWeekends(e.target.checked)}
                />
                <Form.Control disabled />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text>Limit visitors' count?</InputGroup.Text>
                <InputGroup.Checkbox
                  onChange={(e: any) => setLimitVisitors(e.target.checked)}
                />
                <Form.Control
                  type="number"
                  placeholder={limitVisitors ? 'Visitors count' : ''}
                  disabled={!limitVisitors}
                  min={1}
                  value={limitVisitors ? visitorsCount : ''}
                  onChange={(e: any) => setVisitorsCount(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Form>
        <Button variant="danger">-</Button>
      </div>
    </>
  )
}

function getMinDateFormat(date: Date): string {
  return date.toISOString().split('T')[0]
}
