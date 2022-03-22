import React from 'react'
import { Row, Spinner } from 'react-bootstrap'
import './Loading.css'

export default function Loading() {
  return (
    <div className="loading-page-min-height">
      <Row className="mt-4 mb-4 justify-content-center">
        <Spinner
          animation="border"
          role="complementary"
          className="bt-spinner-size"
        >
          <span className="visually-hidden"></span>
        </Spinner>
      </Row>
    </div>
  )
}
