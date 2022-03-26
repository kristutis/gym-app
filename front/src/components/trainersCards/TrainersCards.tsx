import React from 'react'
import { Link } from 'react-router-dom'
import { DEFAULT_PROFILE_PIC_SRC, Trainer } from '../../utils/apicalls/user'
import './TrainersCards.css'

function TrainersCards({ trainers }: { trainers: Trainer[] }) {
  return (
    <div className="container-fluid trainer-container-fluid d-flex justify content-center">
      <div className="row trainer-cards-container">
        {trainers.map((t, index) => (
          <TrainerCard trainer={t} key={index} />
        ))}
      </div>
    </div>
  )
}

function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="trainer-card text-center shadow ">
        <div className="trainer-overflow">
          <img
            className="card-img-top trainer-card-img"
            src={
              trainer.photoUrl === null || trainer.photoUrl === 'DEFAULT'
                ? DEFAULT_PROFILE_PIC_SRC
                : trainer.photoUrl
            }
            alt={DEFAULT_PROFILE_PIC_SRC}
          />
        </div>
        <div className="trainer-card-body text-dark">
          <h4 className="card-title">{trainer.name}</h4>
          <p className="trainer-card-text text-secondary">{trainer.moto}</p>
          <Link
            to={{
              pathname: '/trainers/details',
              state: { trainer },
            }}
          >
            <span className="btn btn-outline-success">More</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TrainersCards
