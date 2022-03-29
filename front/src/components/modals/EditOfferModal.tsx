import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { Offer, updateOfferCall } from '../../utils/apicalls/offers'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function EditOfferModal({
  offer,
  showModal,
  closeFunction,
  reloadOffers,
}: EditOfferModalProps) {
  const authHeader = useAuthHeader()

  const [error, setError] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [discount, setDiscount] = useState(0)
  const [description, setDescription] = useState('')

  useEffect(() => {
    setImgSrc(offer.imageSrc || '')
    setDiscount(offer.discountPercentage || 0)
    setDescription(offer.description || '')
  }, [offer])

  if (Object.keys(offer).length === 0) {
    return null
  }

  const updateOffer = async () => {
    if (!imgSrc) {
      setError('Image URL cannot be empty!')
      return
    }
    if (!discount || discount <= 0 || discount > 100) {
      setError('Incorrect discount!')
      return
    }
    if (!description) {
      setError('Description cannot be empty!')
      return
    }
    setError('')

    const updatedOffer = {
      id: offer.id,
      imageSrc: imgSrc,
      discountPercentage: discount,
      description,
    } as Offer

    updateOfferCall(updatedOffer, authHeader)
      .then((r) => {
        closeFunction()
        reloadOffers()
      })
      .catch((err) => alert(err))
  }

  const userFormGroups = [
    {
      label: 'Image URL',
      inputType: 'text',
      inputValue: imgSrc,
      setInput: (value: string) => setImgSrc(value),
    },
    {
      label: 'Discount',
      inputType: 'number',
      inputValue: discount,
      setInput: (value: number) => setDiscount(value),
    },
    {
      label: 'Description',
      inputType: 'text',
      inputValue: description,
      setInput: (value: string) => setDescription(value),
    },
  ] as ModalFormGroupProps[]

  return (
    <BaseModal
      title={'Edit trainer'}
      children={
        <Form>
          {error && (
            <Form.Text className="login-signup-modal-error">{error}</Form.Text>
          )}
          <ModalFormGroupList formGroups={userFormGroups} />
        </Form>
      }
      buttonText={'Update'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => updateOffer()}
    />
  )
}

export interface EditOfferModalProps {
  offer: Offer
  showModal: boolean
  closeFunction: () => void
  reloadOffers: () => void
}
