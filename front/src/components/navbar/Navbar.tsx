import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  useAdminRole,
  useLoggedIn,
  useTrainerRole,
  useUserRole,
} from '../../utils/auth'
import AuthContext from '../auth/AuthProvider'
import NavbarSignUpButton from '../buttons/NavbarSignUpButton'
import LogoLink from '../logo/LogoLink'
import LoginModal from '../modals/LoginModal'
import SignupModal from '../modals/SignupModal'
import './Navbar.css'

const commonRoutes = [
  {
    route: '/',
    text: 'Home',
  },
  {
    route: '/trainers',
    text: 'Trainers',
  },
] as NavbarRoutesProps[]

const registeredRoutes = [
  {
    route: '/profile',
    text: 'Profile',
  },
] as NavbarRoutesProps[]

const clientRoutes = [
  {
    route: '/user-calendar',
    text: 'Timetable',
  },
] as NavbarRoutesProps[]

const trainerRoutes = [
  {
    route: '/trainer-actions',
    text: 'Manage Users',
  },
] as NavbarRoutesProps[]

const adminRoutes = [
  {
    route: '/offers',
    text: 'Offers',
  },
  {
    route: '/users',
    text: 'Users',
  },
  {
    route: '/admin-timetable',
    text: 'Timetable',
  },
] as NavbarRoutesProps[]

function Navbar() {
  const loggedIn = useLoggedIn()
  const history = useHistory()
  const { setAuth }: any = useContext(AuthContext)

  const routes = [...commonRoutes, ...useRoleRoutes()]

  const signUpButtonMessage = loggedIn ? 'LOG OUT' : 'SIGN UP'
  const isMobileVersion = () => (window.innerWidth <= 960 ? false : true)

  const [loginModalOpened, setLoginModalOpened] = useState(false)
  const [signupModalOpened, setSignupModalOpened] = useState(false)
  const [buttonClicked, setButtonClicked] = useState(false)
  const [showSignUpButton, setShowSignUpButton] = useState(isMobileVersion())

  const handleClick = () => setButtonClicked(!buttonClicked)
  const closeMobileMenu = () => setButtonClicked(false)

  window.addEventListener('resize', () =>
    setShowSignUpButton(isMobileVersion())
  )

  const logoutClicked = () => {
    if (loggedIn) {
      setAuth({})
      history.push('/')
    } else {
      setSignupModalOpened(true)
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <LogoLink className="navbar-logo" onClick={closeMobileMenu} />
          <div className="menu-icon" onClick={handleClick}>
            <i className={buttonClicked ? 'fas fa-times' : 'fa fa-bars'} />
          </div>
          <ul className={buttonClicked ? 'nav-menu active' : 'nav-menu'}>
            {routes.map((route, index) => (
              <NavbarButton
                key={index}
                route={route.route}
                text={route.text}
                onClick={closeMobileMenu}
              />
            ))}
            {!useLoggedIn() && (
              <li className="nav-item">
                <p
                  className="nav-links"
                  onClick={() => {
                    closeMobileMenu()
                    setLoginModalOpened(true)
                  }}
                >
                  Login
                </p>
              </li>
            )}
            <li className="nav-item">
              <p
                className="nav-links-mobile"
                onClick={() => {
                  closeMobileMenu()
                  logoutClicked()
                }}
              >
                {signUpButtonMessage}
              </p>
            </li>
          </ul>
          {showSignUpButton && (
            <NavbarSignUpButton onClick={() => logoutClicked()}>
              {signUpButtonMessage}
            </NavbarSignUpButton>
          )}
        </div>
      </nav>
      <LoginModal
        show={loginModalOpened}
        closeFunction={() => setLoginModalOpened(false)}
      />
      <SignupModal
        show={signupModalOpened}
        closeFunction={() => setSignupModalOpened(false)}
        openLoginModal={() => setLoginModalOpened(true)}
      />
    </>
  )
}

function NavbarButton({ route, text, onClick }: NavbarButtonProps) {
  return (
    <li className="nav-item">
      <Link className="nav-item-link" to={route} onClick={() => onClick()}>
        <p className="nav-links">{text}</p>
      </Link>
    </li>
  )
}

function useRoleRoutes(): NavbarRoutesProps[] {
  const isLoggedIn = useLoggedIn()
  const isUser = useUserRole()
  const isTrainer = useTrainerRole()
  const isAdmin = useAdminRole()

  if (!isLoggedIn) {
    return []
  }
  if (isUser) {
    return [...clientRoutes, ...registeredRoutes]
  }
  if (isTrainer) {
    return [...trainerRoutes, ...registeredRoutes]
  }
  if (isAdmin) {
    return [...adminRoutes, ...registeredRoutes]
  }
  return []
}

interface NavbarButtonProps {
  route: string
  text: string
  onClick: () => void
}

interface NavbarRoutesProps {
  route: string
  text: string
}

export default Navbar
