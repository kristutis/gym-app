import React, { useEffect, useState } from 'react'
import { FormControl, InputGroup } from 'react-bootstrap'
import { trainerUpdateUsersBalanceCall, User } from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'
import ErrorLabel from '../errorLabel/ErrorLabel'
import BaseModal from './BaseModal'

export default function TrainerEditBalanceModal({
  user,
  closeFunction,
  reloadUsers,
}: TrainerEditBalanceModalProps) {
  const authHeader = useAuthHeader()

  const [error, setError] = useState('')
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    setBalance(user.balance)
  }, [user])

  const updateBalance = async () => {
    if (balance < 0) {
      setError('Incorrect balance!')
      return
    }
    setError('')

    trainerUpdateUsersBalanceCall(user.id, balance, authHeader)
      .then((r) => {
        closeFunction()
        reloadUsers()
      })
      .catch((err) => setError(err))
  }

  return (
    <BaseModal
      title={'Edit balance'}
      children={
        <>
          <ErrorLabel error={error} />
          <InputGroup className="mb-3">
            <FormControl
              type="number"
              defaultValue={user.balance}
              onChange={(e: any) => setBalance(e.target.value)}
            />
          </InputGroup>
        </>
      }
      buttonText={'Update'}
      show={!!Object.keys(user).length}
      closeFunction={closeFunction}
      submitFunction={() => updateBalance()}
    />
  )
}

export interface TrainerEditBalanceModalProps {
  user: User
  closeFunction: () => void
  reloadUsers: () => void
}
