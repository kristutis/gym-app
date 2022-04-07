import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import {
  getSubscriptionTypesCall,
  purchaseSubscriptionCall,
  SubscriptionType,
} from '../../utils/apicalls/subscriptions'
import { useAuthHeader } from '../../utils/auth'
import ErrorLabel from '../errorLabel/ErrorLabel'
import BaseModal from './BaseModal'

export default function PurchaseSubscriptionModal({
  balance,
  show,
  submitFunction,
  closeFunction,
}: PurchaseSubscriptionModalProps) {
  const authHeader = useAuthHeader()

  const [subscriptionTypes, setSubscriptionTypes] = useState(
    [] as SubscriptionType[]
  )

  const [selectedType, setSelectedType] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    getSubscriptionTypesCall()
      .then((res) => {
        const subTypes = res as SubscriptionType[]
        setSubscriptionTypes(subTypes)
        setSelectedType(subTypes[0].name)
      })
      .catch((err: string) => setError(err))
  }, [])

  const submitClicked = async () => {
    const selected = subscriptionTypes.find((r) => r.name === selectedType)
    if (!selected) {
      setError(`Cannot find ${selectedType} subscription type`)
      return
    }
    if (balance < selected.price) {
      setError('Balance if not enough!')
      return
    }
    setError('')

    purchaseSubscriptionCall(authHeader, selected.name)
      .then((r) => {
        submitFunction()
        closeFunction()
      })
      .catch((err) => setError(err))
  }

  if (!subscriptionTypes.length) {
    return null
  }

  return (
    <BaseModal
      title={'Select Your prefered subscription type'}
      children={
        <>
          <ErrorLabel error={`Current balance: ${balance}€`} />
          {error && (
            <>
              <br /> <ErrorLabel error={error} />
            </>
          )}
          <Form.Select
            onChange={(e: any) => setSelectedType(e.target.value)}
            className="my-2"
          >
            {subscriptionTypes.map((type) => {
              const formatTime = (time: string) => {
                const split = time.split(':')
                return split[0] + ':' + split[1]
              }
              const validTimeText =
                type.startTime === type.endTime
                  ? 'unlimited time'
                  : `${formatTime(type.startTime)} to ${formatTime(
                      type.endTime
                    )}`
              return (
                <option
                  key={type.name}
                  value={type.name}
                >{`${type.name} ${type.price}€, ${type.validDays} days, ${validTimeText}`}</option>
              )
            })}
          </Form.Select>
        </>
      }
      buttonText={'Purchase!'}
      show={show}
      closeFunction={closeFunction}
      submitFunction={submitClicked}
    />
  )
}

export interface PurchaseSubscriptionModalProps {
  balance: number
  show: boolean
  submitFunction: () => void
  closeFunction: () => void
}
