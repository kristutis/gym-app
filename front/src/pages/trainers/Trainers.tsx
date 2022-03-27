import React, { useEffect, useState } from 'react'
import Loading from '../../components/loading/Loading'
import TrainersCards from '../../components/trainersCards/TrainersCards'
import SectionSeparator from '../../sectionSeparator/SectionSeparator'
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
      <div className="mb-4">
        <SectionSeparator text={'Check out our team!'} />
      </div>
      {trainers.length === 0 ? (
        <Loading />
      ) : (
        <TrainersCards trainers={trainers} />
      )}
    </>
  )
}

//contact phone email
