import React, { useEffect, useState } from 'react'
import { Image } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel'
import FrontDoorVideo from '../../components/frontdoorvideo/FrontDoorVideo'
import SectionSeparator from '../../sectionSeparator/SectionSeparator'
import { getOffersCall, Offer } from '../../utils/apicalls/offers'
import './Home.css'

export default function Home() {
  return (
    <>
      <FrontDoorVideo
        title="WELCOME, STRANGER"
        subtitle="Get up and start pumping!"
      />
      <SectionSeparator text={'Check out our offers!'} />
      <OffersCarousel />
      {/* <div className="fdiv"></div> */}
    </>
  )
}

function OffersCarousel() {
  const [offers, setOffers] = useState([] as Offer[])

  useEffect(() => {
    getOffersCall()
      .then((res) => setOffers(res as Offer[]))
      .catch((err) => null)
  }, [])

  if (!offers.length) {
    return null
  }

  return (
    <Carousel>
      {offers.map((offer, index) => (
        <Carousel.Item key={index}>
          <div className="home-carousel">
            <Image
              className="d-block w-100 mh-100 "
              src={offer.imageSrc}
              alt=""
            />
          </div>
          <Carousel.Caption>
            <h3>{`${offer.discountPercentage}% OFF`}</h3>
            <p>{offer.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
