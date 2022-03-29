import React from 'react'
import { deleteOfferCall, Offer } from '../../utils/apicalls/offers'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'

export default function DeleteOfferModal({
  offer,
  showModal,
  closeFunction,
  reloadOffers,
}: DeleteOfferModalProps) {
  const authHeader = useAuthHeader()

  const deleteOffer = async (id: number) => {
    deleteOfferCall(id, authHeader)
      .then((res) => {
        closeFunction()
        reloadOffers()
      })
      .catch((err) => alert(err))
  }

  return (
    <BaseModal
      title={'Delete offer?'}
      children={
        <>
          <h4>{`${offer.discountPercentage}%`}</h4>
          <h2>{offer.description}</h2>
        </>
      }
      buttonText={'Delete'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => deleteOffer(offer.id!)}
    />
  )
}

export interface DeleteOfferModalProps {
  offer: Offer
  showModal: boolean
  closeFunction: () => void
  reloadOffers: () => void
}
