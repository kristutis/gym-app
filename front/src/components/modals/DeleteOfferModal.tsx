import React from 'react'
import { Offer } from '../../utils/apicalls/offers'
import { useAuthHeader } from '../../utils/auth'

export default function DeleteOfferModal({
  offer,
  showModal,
  closeFunction,
  reloadOffers,
}: DeleteOfferModalProps) {
  const authHeader = useAuthHeader()

  const deleteOffer = async (cid: number) => {
    // deleteCommentCall(cid, authHeader)
    //   .then((res) => {
    //     closeFunction()
    //     reloadComments()
    //   })
    //   .catch((err) => alert(err))
  }

  return <></>

  //   return (
  //     // <BaseModal
  //     //   title={'Delete comment?'}
  //     //   children={<h4>{comment.comment}</h4>}
  //     //   buttonText={'Delete'}
  //     //   show={showModal}
  //     //   closeFunction={closeFunction}
  //     //   submitFunction={() => deleteComment(comment.id)}
  //     // />
  //   )
}

export interface DeleteOfferModalProps {
  offer: Offer
  showModal: boolean
  closeFunction: () => void
  reloadOffers: () => void
}
