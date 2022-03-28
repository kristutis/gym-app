import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Image,
  ListGroup,
  ListGroupItem,
  Row,
  Table,
} from 'react-bootstrap'
import { Form } from 'react-bootstrap/'
import { Link, useHistory } from 'react-router-dom'
import {
  getTrainerCommentsCall,
  postCommentCall,
  TrainerComment,
} from '../../utils/apicalls/comments'
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
    if (trainer) {
      getAllTrainerRatingsCall(trainer.id)
        .then((ratings: any) => setTrainerRatings(ratings))
        .catch((err) => alert(err))
    }
  }, [updateRatings])

  if (!trainer) {
    history.push('/trainers')
    return null
  }

  const ratingAverage = (
    trainerRatings.reduce((partialSum, a) => partialSum + a, 0) /
    trainerRatings.length
  ).toFixed(2)

  return (
    <div className="m-5">
      <Row>
        <Col lg={4} className="pb-3">
          <div className="trainer-comments-section-container">
            <div className="trainer-details-card">
              <Image
                className="img-thumbnail trainer-details-img my-3"
                src={
                  trainer.photoUrl === null || trainer.photoUrl === 'DEFAULT'
                    ? DEFAULT_PROFILE_PIC_SRC
                    : trainer.photoUrl
                }
              />
              <h5 className="text-center">
                {trainer.name + ' ' + trainer.surname}
              </h5>
              <p className="text-center">{trainer.moto}</p>
              <ListGroup className="list-group-flush">
                <ListGroupItem>
                  About:
                  <br />
                  {trainer.description}
                </ListGroupItem>
                <ListGroupItem>{`Hourly price: ${trainer.price}€`}</ListGroupItem>
                <ListGroupItem>
                  {!!trainerRatings.length
                    ? `Rating: ${ratingAverage} / 5`
                    : 'Trainer is not rated yet!'}
                </ListGroupItem>
                <ListGroupItem>
                  Contacts: <br />
                  Email: {trainer.email} <br />
                  {!!trainer.phone ? `Phone: ${trainer.phone}` : null}
                </ListGroupItem>
                <StarRatingModule
                  trainerId={trainer.id}
                  updateRatings={updateRatings}
                  setUpdateRatings={setUpdateRatings}
                />
              </ListGroup>
              <Link to={'/trainers'} className="trainer-details-back-button">
                <Button variant="outline-success" className="my-3 px-4">
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </Col>
        <Col lg={8}>
          <CommentsSection trainerId={trainer.id} />
        </Col>
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
    if (loggedIn) {
      getUserRatingsForTrainerCall(trainerId, authHeader)
        .then((r: any) => (!!r.rating ? setCurrentRating(r.rating) : null))
        .catch((err) => alert(err))
    }
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

function CommentsSection({ trainerId }: { trainerId: string }) {
  const [updatedComments, setUpdatedComments] = useState(false)
  const [comments, setComments] = useState([] as TrainerComment[])

  useEffect(() => {
    getTrainerCommentsCall(trainerId)
      .then((comms) => setComments(comms as TrainerComment[]))
      .catch((err) => alert(err))
  }, [updatedComments])

  return (
    <div className="trainer-comments-section-container">
      <h3 className="my-2" style={{ textAlign: 'center' }}>
        Comments
      </h3>
      <CommentsTable comments={comments} />
      <CommentForm
        trainerId={trainerId}
        updatedComments={updatedComments}
        setUpdatedComments={setUpdatedComments}
      />
    </div>
  )
}

function CommentForm({
  trainerId,
  updatedComments,
  setUpdatedComments,
}: {
  trainerId: string
  updatedComments: boolean
  setUpdatedComments: (value: boolean) => void
}) {
  const loggedIn = useLoggedIn()
  const authHeader = useAuthHeader()

  const [error, setError] = useState(false)
  const [comment, setComment] = useState('')

  const handlePost = () => {
    if (!comment) {
      setError(true)
      return
    }
    setError(false)
    postCommentCall(trainerId, comment, authHeader)
      .then((res) => setUpdatedComments(!updatedComments))
      .catch((err) => alert(err))
  }

  if (!loggedIn) {
    return null
  }

  return (
    <Form className="m-3">
      <Form.Group>
        {error ? (
          <Form.Label className="text-danger">
            Cannot post empty comment!
          </Form.Label>
        ) : (
          <Form.Label>Leave your comment here!</Form.Label>
        )}
        <Form.Control
          as="textarea"
          rows={3}
          onChange={(e: any) => setComment(e.target.value)}
        />
      </Form.Group>
      <Button
        variant="outline-success"
        className="mt-2"
        onClick={() => handlePost()}
      >
        Post!
      </Button>
    </Form>
  )
}

function CommentsTable({ comments }: { comments: TrainerComment[] }) {
  if (!comments?.length) {
    return (
      <h4 className="mx-3">Trainer does not have any comments. Be first!</h4>
    )
  }

  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Published</th>
          <th>Name</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {comments.map((comment, index) => (
          <tr key={index}>
            <td>{new Date(comment.createDate).toLocaleDateString()}</td>
            <td>{comment.creatorName}</td>
            <td>{comment.comment}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
