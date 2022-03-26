import React, { useState } from 'react'
import { Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { DEFAULT_PROFILE_PIC_SRC, Trainer } from '../../utils/apicalls/user'
import './TrainerDetails.css'

const MAX_STARS_COUNT = 5

export default function TrainerDetails(props: any) {
  const history = useHistory()
  const trainer = props.location.state?.trainer as Trainer

  if (!trainer) {
    history.push('/trainers')
    return null
  }

  return (
    <div className="m-3">
      <Row>
        <Col>
          <Card>
            <Card.Img
              variant="top"
              src={
                trainer.photoUrl === null || trainer.photoUrl === 'DEFAULT'
                  ? DEFAULT_PROFILE_PIC_SRC
                  : trainer.photoUrl
              }
            />
            <Card.Body>
              <Card.Title>{trainer.name + ' ' + trainer.surname}</Card.Title>
              <Card.Text>{trainer.moto}</Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>{trainer.description}</ListGroupItem>
              <ListGroupItem>{`Hourly price: ${trainer.price}€`}</ListGroupItem>
              {/* <ListGroupItem>{`Rating:`}</ListGroupItem> */}
              <ListGroupItem>
                <StarRatingModule />
              </ListGroupItem>
            </ListGroup>
            <Card.Body>
              <Card.Link href="#">Card Link</Card.Link>
              <Card.Link href="#">Another Link</Card.Link>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </div>
  )
}

function StarRatingModule() {
  const [currentRating, setCurrentRating] = useState(4)

  return (
    <fieldset className="star-rating">
      {Array.from(Array(MAX_STARS_COUNT).keys())
        .reverse()
        .map((x) => x + 1)
        .map((e, index) => (
          <StarRating value={e} key={index} currentRating={currentRating} />
        ))}
    </fieldset>
  )
}

function StarRating({
  value,
  currentRating,
}: {
  value: number
  currentRating?: number
}) {
  return (
    <>
      <input
        type="radio"
        name="rating"
        value={value}
        checked={!!currentRating && currentRating === value}
      />
      <label>star</label>
    </>
  )
}
