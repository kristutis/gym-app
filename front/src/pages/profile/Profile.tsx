// import { useState } from 'preact/hooks'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/loading/Loading'
import { getUserDetailsCall } from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'

export default function Profile() {
  const authHeader = useAuthHeader()
  const [userDetails, setUserDetails] = useState({})

  const loadUserDetails = async () => {
    const res = await getUserDetailsCall(authHeader)
    setUserDetails(res)
  }

  useEffect(() => {
    loadUserDetails()
  }, [])

  console.log(userDetails)

  if (!Object.keys(userDetails).length) {
    return <Loading></Loading>
  }

  return <div>Profile</div>
}
