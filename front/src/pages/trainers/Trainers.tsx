import React, { useEffect, useState } from 'react'
import Loading from '../../components/loading/Loading'
import TrainersCards from '../../components/trainersCards/TrainersCards'
import { getTrainersCall } from '../../utils/apicalls/trainer'
import { Trainer } from '../../utils/apicalls/user'
import './Trainers.css'

export default function Trainers() {
  const [trainers, setTrainers] = useState([] as Trainer[])

  useEffect(() => {
    getTrainersCall()
      .then((res) => setTrainers(res as Trainer[]))
      .catch((err) => null)
  }, [])

  return (
    <>
      <h1 className="default-page-front trainers-page-background-image">
        TRAINERS
      </h1>
      <h2>Check out our best trainers!</h2>
      {trainers.length === 0 ? (
        <Loading />
      ) : (
        <TrainersCards trainers={trainers} />
      )}
    </>
  )
}

//contact phone email
