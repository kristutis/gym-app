import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import Loading from '../../components/loading/Loading'
import CancelSubscriptionModal from '../../components/modals/CancelSubscriptionModal'
import ProfileEditModal from '../../components/modals/ProfileEditModal'
import PurchaseSubscriptionModal from '../../components/modals/PurchaseSubscriptionModal'
import { getUserDetailsCall, User } from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'
import './Profile.css'

export default function Profile() {
  const authHeader = useAuthHeader()
  const [showEditModal, setShowEditModal] = useState(false)
  const [userDetails, setUserDetails] = useState({} as User)
  const [profileForm, setProfileForm] = useState([] as InfoSectionProps[])

  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showCancelSubscribtionModal, setShowCancelSubscribtionModal] =
    useState(false)

  const loadUserDetails = async () => {
    getUserDetailsCall(authHeader)
      .then((res) => setUserDetails(res as User))
      .catch((err) => alert(err))
  }

  useEffect(() => {
    loadUserDetails()
  }, [])

  useEffect(() => {
    if (userDetails.role == 'trainer') {
      //---
    }
    setProfileForm([
      {
        title: 'Information',
        info: [
          {
            label: 'Email',
            text: userDetails.email,
          },
          {
            label: 'Phone',
            text: userDetails.phone || 'Not provided',
          },
          {
            label: 'Current Balance',
            text: !!userDetails.balance
              ? userDetails.balance.toFixed(2) + '€'
              : '',
          },
          SubscriptionSection(
            userDetails,
            () => setShowPurchaseModal(true),
            () => setShowCancelSubscribtionModal(true)
          ),
        ] as InfoWindowProps[],
      },
      {
        title: 'Activity',
        info: [
          {
            label: 'Created',
            text: formatDate(userDetails.createDate),
          },
          {
            label: 'Last modified',
            text: formatDate(userDetails.modifyDate),
          },
        ] as InfoWindowProps[],
      },
    ] as InfoSectionProps[])
  }, [userDetails])

  if (!Object.keys(userDetails).length) {
    return <Loading></Loading>
  }

  return (
    <div className="">
      <ProfileEditModal
        userDetails={userDetails}
        show={showEditModal}
        submitFunction={loadUserDetails}
        closeFunction={() => setShowEditModal(false)}
      />
      <PurchaseSubscriptionModal
        balance={userDetails?.balance || 0}
        show={showPurchaseModal}
        submitFunction={loadUserDetails}
        closeFunction={() => setShowPurchaseModal(false)}
      />
      <CancelSubscriptionModal
        show={showCancelSubscribtionModal}
        submitFunction={loadUserDetails}
        closeFunction={() => setShowCancelSubscribtionModal(false)}
      />
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-6 mb-4 mb-lg-0 profile-page-card-width">
            <div className="card mb-3 style1">
              <div className="row g-0">
                <div className="col-md-4 profile-page-gradient-custom text-center text-white style2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Shaqi_jrvej.jpg/1200px-Shaqi_jrvej.jpg"
                    alt="Avatar"
                    className="img-fluid my-5 style3"
                  />
                  <h5>
                    {userDetails.name} {userDetails.surname}
                  </h5>
                  <p>{userDetails.role}</p>
                  <i
                    className="far fa-edit mb-5 profile-edit-button"
                    onClick={() => setShowEditModal(true)}
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body p-4">
                    {profileForm.map((section, index) => (
                      <InfoSection
                        key={index}
                        title={section.title}
                        info={section.info}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoSection({ title, info }: InfoSectionProps) {
  return (
    <>
      <h6>{title}</h6>
      <hr className="mt-0 mb-4" />
      <div className="row pt-1">
        {info.map((window, index) => (
          <InfoWindow
            key={index}
            label={window.label}
            text={window.text}
            text2={window.text2}
            children={window.children}
          />
        ))}
      </div>
    </>
  )
}

function InfoWindow({ label, text, text2, children }: InfoWindowProps) {
  return (
    <div className="col-6 mb-3">
      <h6>{label}</h6>
      <p className="text-muted">{text}</p>
      {!!text2 && <p className="text-muted">{text2}</p>}
      {children}
    </div>
  )
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString()
}

function SubscriptionSection(
  userDetails: User,
  setShowPurhcaseModal: () => void,
  setShowCancelSubscribtionModal: () => void
): InfoWindowProps {
  if (!Object.keys(userDetails).length || userDetails.role !== 'user') {
    return {} as InfoWindowProps
  }

  const subscriptionValid = isSubscriptionValid(userDetails)

  const subscriptionValidText = (): { text: string; text2?: string } => {
    if (!userDetails.subscriptionName) {
      return { text: 'Not subscribed' }
    }

    const formatTime = (time: string) => {
      const split = time.split(':')
      return split[0] + ':' + split[1]
    }

    if (subscriptionValid) {
      return {
        text: `${userDetails.subscriptionName}, ${formatTime(
          userDetails.subscriptionStartTime!
        )} to ${formatTime(userDetails.subscriptionEndTime!)}`,
        text2: `Valid until ${new Date(
          userDetails.subscriptionValidUntil!
        ).toLocaleDateString()}`,
      }
    }
    return { text: 'Out of date' }
  }

  return {
    label: 'Subscription Status',
    ...subscriptionValidText(),
    children: (
      <SubscriptionButton
        valid={subscriptionValid}
        setShowPurhcaseModal={setShowPurhcaseModal}
        setShowCancelSubscribtionModal={setShowCancelSubscribtionModal}
      />
    ),
  } as InfoWindowProps
}

function SubscriptionButton({
  valid,
  setShowPurhcaseModal,
  setShowCancelSubscribtionModal,
}: {
  valid: boolean
  setShowPurhcaseModal: () => void
  setShowCancelSubscribtionModal: () => void
}) {
  if (valid) {
    return (
      <Button
        size="sm"
        variant="outline-danger"
        onClick={() => setShowCancelSubscribtionModal()}
      >
        Cancel Subscription
      </Button>
    )
  }
  return (
    <Button
      size="sm"
      variant="outline-success"
      onClick={() => setShowPurhcaseModal()}
    >
      Purchase Subscription
    </Button>
  )
}

interface InfoWindowProps {
  label: string
  text: string
  text2?: string
  children?: JSX.Element
}

interface InfoSectionProps {
  title: string
  info: InfoWindowProps[]
}

export const isSubscriptionValid = (userDetails: User): boolean => {
  return (
    !!userDetails.subscriptionValidUntil &&
    new Date(userDetails.subscriptionValidUntil).getTime() >= Date.now()
  )
}
