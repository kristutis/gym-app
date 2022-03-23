import React, { useEffect, useState } from 'react'
import Loading from '../../components/loading/Loading'
import { getUserDetailsCall, User } from '../../utils/apicalls/user'
import { useAuthHeader } from '../../utils/auth'
import './Profile.css'

const sections = [
  {
    title: 'Information',
    info: [
      {
        label: 'Recent',
        text: 'Lorem ipsum',
      },
      {
        label: 'Most Viewed',
        text: 'Lorem ipsum',
      },
      {
        label: 'Recent',
        text: 'Lorem ipsum',
      },
      {
        label: 'Most Viewed',
        text: 'Lorem ipsum',
      },
    ] as InfoWindowProps[],
  },
  {
    title: 'Dates',
    info: [
      {
        label: 'Recent',
        text: 'Lorem ipsum',
      },
      {
        label: 'Most Viewed',
        text: 'Lorem ipsum',
      },
    ] as InfoWindowProps[],
  },
] as InfoSectionProps[]

export default function Profile() {
  const authHeader = useAuthHeader()
  const [userDetails, setUserDetails] = useState({} as User)

  const loadUserDetails = async () => {
    getUserDetailsCall(authHeader)
      .then((res) => setUserDetails(res as User))
      .catch((err) => alert(err))
  }

  useEffect(() => {
    loadUserDetails()
  }, [])

  if (userDetails.role == 'trainer') {
  }

  console.log(userDetails)

  if (!Object.keys(userDetails).length) {
    return <Loading></Loading>
  }

  return (
    <div className="">
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
                  <h5>Marie Horwitz</h5>
                  <p>Web Designer</p>
                  <i className="far fa-edit mb-5"></i>
                </div>
                <div className="col-md-8">
                  <div className="card-body p-4">
                    {sections.map((section) => (
                      <InfoSection title={section.title} info={section.info} />
                    ))}
                    <div className="d-flex justify-content-start">
                      <a href="#!">
                        <i className="fab fa-facebook-f fa-lg me-3"></i>
                      </a>
                      <a href="#!">
                        <i className="fab fa-twitter fa-lg me-3"></i>
                      </a>
                      <a href="#!">
                        <i className="fab fa-instagram fa-lg"></i>
                      </a>
                    </div>
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
        {info.map((window) => (
          <InfoWindow label={window.label} text={window.text} />
        ))}
      </div>
    </>
  )
}

function InfoWindow({ label, text }: InfoWindowProps) {
  return (
    <div className="col-6 mb-3">
      <h6>{label}</h6>
      <p className="text-muted">{text}</p>
    </div>
  )
}

interface InfoWindowProps {
  label: string
  text: string
}

interface InfoSectionProps {
  title: string
  info: InfoWindowProps[]
}
