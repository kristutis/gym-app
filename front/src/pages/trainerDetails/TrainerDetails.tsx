import React, { useEffect, useState } from 'react'
import { Card, Col, ListGroup, ListGroupItem, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import {
  getAllTrainerRatingsCall,
  getUserRatingsForTrainerCall,
  postRatingCall,
} from '../../utils/apicalls/ratings'
import { DEFAULT_PROFILE_PIC_SRC, Trainer } from '../../utils/apicalls/user'
import { useAuthHeader, useLoggedIn } from '../../utils/auth'
import './TrainerDetails.css'

const MAX_STARS_COUNT = 5

export default function TrainerDetails(props: any) {
  const history = useHistory()
  const trainer = props.location.state?.trainer as Trainer

  const [trainerRatings, setTrainerRatings] = useState([] as number[])
  const [updateRatings, setUpdateRatings] = useState(false)

  useEffect(() => {
    getAllTrainerRatingsCall(trainer.id)
      .then((ratings: any) => setTrainerRatings(ratings))
      .catch((err) => alert(err))
  }, [updateRatings])

  if (!trainer) {
    history.push('/trainers')
    return null
  }

  const ratingAverage =
    trainerRatings.reduce((partialSum, a) => partialSum + a, 0) /
    trainerRatings.length

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
              <ListGroupItem>
                {!!trainerRatings.length
                  ? `Rating: ${ratingAverage}`
                  : 'Trainer is not rated yet!'}
              </ListGroupItem>
              <StarRatingModule
                trainerId={trainer.id}
                updateRatings={updateRatings}
                setUpdateRatings={setUpdateRatings}
              />
            </ListGroup>
            <Card.Body>
              <Link to={'/trainers'}>
                <span className="btn btn-outline-success">Back</span>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </div>
  )
}

function StarRatingModule({
  trainerId,
  updateRatings,
  setUpdateRatings,
}: {
  trainerId: string
  updateRatings: boolean
  setUpdateRatings: (value: boolean) => void
}) {
  const loggedIn = useLoggedIn()
  const authHeader = useAuthHeader()
  const [currentRating, setCurrentRating] = useState(0)

  useEffect(() => {
    getUserRatingsForTrainerCall(trainerId, authHeader)
      .then((r: any) => (!!r.rating ? setCurrentRating(r.rating) : null))
      .catch((err) => alert(err))
  }, [])

  if (!loggedIn) {
    return null
  }

  const handleSelect = (value: number) => {
    postRatingCall(trainerId, value, authHeader)
      .then((r) => {
        setCurrentRating(value)
        setUpdateRatings(!updateRatings)
      })
      .catch((err) => alert(err))
  }

  return (
    <ListGroupItem>
      <fieldset className="star-rating">
        {Array.from(Array(MAX_STARS_COUNT).keys())
          .reverse()
          .map((x) => x + 1)
          .map((e, index) => (
            <StarRating
              value={e}
              key={index}
              currentRating={currentRating}
              handleSelect={handleSelect}
            />
          ))}
      </fieldset>
    </ListGroupItem>
  )
}

function StarRating({
  value,
  currentRating,
  handleSelect,
}: {
  value: number
  currentRating?: number
  handleSelect: (value: number) => void
}) {
  return (
    <>
      <input
        type="radio"
        name="rating"
        value={value}
        checked={!!currentRating && currentRating === value}
        onChange={() => null}
      />
      <label onClick={() => handleSelect(value)}>star</label>
    </>
  )
}
