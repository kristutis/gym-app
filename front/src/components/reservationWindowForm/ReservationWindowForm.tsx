import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Form,
  InputGroup,
  ProgressBar,
  Row,
} from 'react-bootstrap'
import { CreateTimetableCallProps } from '../../utils/apicalls/timetable'
import './ReservationWindowForm.css'

export default function ReservationWindowForm({
  index,
  deleteForm,
  setFormPayload,
}: ReservationWindowFormProps) {
  const isMobileVersion = () => (window.innerWidth <= 960 ? false : true)

  const currentDate = new Date().toISOString().split('T')[0]

  const [progressBar, setProgressBar] = useState(0)
  const [minEndDate, setMinEndDate] = useState(currentDate)
  const [mobileVersion, setMobileVersion] = useState(isMobileVersion())

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const [visitingTime, setVisitingTime] = useState(null)
  const [breakTime, setBreakTime] = useState(null)
  const [excludeWeekends, setExcludeWeekends] = useState(false)
  const [onlyWeekends, setOnlyWeekends] = useState(false)
  const [limitVisitors, setLimitVisitors] = useState(false)
  const [visitorsCount, setVisitorsCount] = useState(0)

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

  const handlePayload = () => {
    const payload = {
      startDate: !!startDate ? Date.parse(startDate) : null,
      startTime: startTime,
      endDate: !!endDate ? Date.parse(endDate) : null,
      endTime: endTime,
      visitingTime: visitingTime,
      breakTime: breakTime,
      excludeWeekends: excludeWeekends,
      onlyWeekends: onlyWeekends,
      limitVisitors: limitVisitors,
      visitorsCount: visitorsCount,
    } as CreateTimetableCallProps

    setFormPayload(payload)
  }

  useEffect(() => {
    handleProgressBar()
    handlePayload()
  }, [
    startDate,
    endDate,
    startTime,
    endTime,
    visitingTime,
    breakTime,
    excludeWeekends,
    limitVisitors,
    visitorsCount,
    onlyWeekends,
  ])

  window.addEventListener('resize', () => setMobileVersion(isMobileVersion()))

  return (
    <>
      <div className="reservation-window-form">
        <h4>Form #{index}</h4>
        <Form>
          <ProgressBar
            className="mb-4"
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
            {mobileVersion && <Col />}
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
            {mobileVersion && <Col />}
          </Row>

          <Row>
            <DecorateCheckboxLayout
              isMobile={mobileVersion}
              element={
                <ExcludeWeekends setExcludeWeekends={setExcludeWeekends} />
              }
            />
            <DecorateCheckboxLayout
              isMobile={mobileVersion}
              element={<OnlyWeekends setOnlyWeekends={setOnlyWeekends} />}
            />
            <DecorateCheckboxLayout
              isMobile={mobileVersion}
              element={
                <LimitVisitorsCount
                  limitVisitors={limitVisitors}
                  setLimitVisitors={setLimitVisitors}
                  visitorsCount={visitorsCount}
                  setVisitorsCount={setVisitorsCount}
                />
              }
            />
          </Row>
        </Form>
        {index >= 2 && (
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              deleteForm()
            }}
          >
            - Delete
          </Button>
        )}
      </div>
    </>
  )
}

function ExcludeWeekends({
  setExcludeWeekends,
}: {
  setExcludeWeekends: (val: boolean) => void
}) {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>Exclude weekends?</InputGroup.Text>
      <InputGroup.Checkbox
        onChange={(e: any) => {
          setExcludeWeekends(e.target.checked)
        }}
      />
      <Form.Control disabled />
    </InputGroup>
  )
}

function OnlyWeekends({
  setOnlyWeekends,
}: {
  setOnlyWeekends: (val: boolean) => void
}) {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>Only weekends?</InputGroup.Text>
      <InputGroup.Checkbox
        onChange={(e: any) => {
          setOnlyWeekends(e.target.checked)
        }}
      />
      <Form.Control disabled />
    </InputGroup>
  )
}

function LimitVisitorsCount({
  limitVisitors,
  setLimitVisitors,
  visitorsCount,
  setVisitorsCount,
}: {
  limitVisitors: boolean
  setLimitVisitors: (val: boolean) => void
  visitorsCount: number
  setVisitorsCount: (val: number) => void
}) {
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>Limit visitors' count?</InputGroup.Text>
      <InputGroup.Checkbox
        onChange={(e: any) => {
          setLimitVisitors(e.target.checked)
        }}
      />
      <Form.Control
        type="number"
        placeholder={limitVisitors ? 'Visitors count' : ''}
        disabled={!limitVisitors}
        min={1}
        value={limitVisitors ? visitorsCount : ''}
        onChange={(e: any) => {
          setVisitorsCount(e.target.value)
        }}
      />
    </InputGroup>
  )
}

function DecorateCheckboxLayout({
  isMobile,
  element,
}: {
  isMobile: boolean
  element: JSX.Element
}) {
  if (isMobile) {
    return <Col>{element}</Col>
  }
  return element
}

export interface ReservationWindowFormProps {
  index: number
  deleteForm: () => void
  setFormPayload: (payload: CreateTimetableCallProps) => void
}
