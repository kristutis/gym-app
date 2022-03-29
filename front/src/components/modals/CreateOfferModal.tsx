import React, { useState } from 'react'
import { Form } from 'react-bootstrap/'
import { Offer, postOfferCall } from '../../utils/apicalls/offers'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'
import { ModalFormGroupProps } from './ModalFormGroup'
import ModalFormGroupList from './ModalFormGroupList'

export default function CreateOfferModal({
  show,
  closeFunction,
  loadOffers,
}: CreateOfferModalProps) {
  const authHeader = useAuthHeader()

  const [error, setError] = useState('')
  const [imgSrc, setImgSrc] = useState('')
  const [discount, setDiscount] = useState(0)
  const [description, setDescription] = useState('')

  const createOffer = async () => {
    if (!imgSrc) {
      setError('Image URL must not be empty!')
      return
    }
    if (!discount || discount <= 0) {
      setError('Incorrect discount!')
      return
    }
    if (!description) {
      setError('Description must not be empty!')
      return
    }
    setError('')

    const offer = {
      imageSrc: imgSrc,
      discountPercentage: discount,
      description,
    } as Offer

    postOfferCall(offer, authHeader)
      .then((res) => {
        loadOffers()
        closeFunction()
      })
      .catch((msg) => setError(msg))
  }

  return (
    <BaseModal
      title={'Please fill out offer details'}
      children={
        <CreateOfferForm
          error={error}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          discount={discount}
          setDiscount={setDiscount}
          description={description}
          setDescription={setDescription}
        />
      }
      buttonText={'Create'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={createOffer}
    />
  )
}

function CreateOfferForm({
  error,
  imgSrc,
  setImgSrc,
  discount,
  setDiscount,
  description,
  setDescription,
}: CreateOfferFormProps) {
  const formGroups = [
    {
      label: 'Image URL',
      inputType: 'text',
      inputValue: imgSrc,
      setInput: setImgSrc,
    },
    {
      label: 'Discount',
      inputType: 'number',
      inputValue: discount,
      setInput: setDiscount,
    },
    {
      label: 'Description',
      inputType: 'Text',
      inputValue: description,
      setInput: setDescription,
    },
  ] as ModalFormGroupProps[]

  return (
    <Form>
      {error && (
        <Form.Text className="login-signup-modal-error">{error}</Form.Text>
      )}
      <ModalFormGroupList formGroups={formGroups} />
    </Form>
  )
}

interface CreateOfferFormProps {
  error: string
  imgSrc: string
  setImgSrc: (value: string) => void
  discount: number
  setDiscount: (value: number) => void
  description: string
  setDescription: (value: string) => void
}

export interface CreateOfferModalProps {
  show: boolean
  closeFunction: () => void
  loadOffers: () => void
}
