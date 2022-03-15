import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { isAdmin, isLoggedIn } from '../../utils/auth'
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

const clientRoutes = []

const trainerRoutes = []

const adminRoutes = [
  {
    route: '/users',
    text: 'Users',
  },
  {
    route: '/timetable',
    text: 'Timetable',
  },
] as NavbarRoutesProps[]

function Navbar() {
  const routes = [...commonRoutes, ...getRoleRoutes()]

  const signUpButtonMessage = isLoggedIn() ? 'LOG OUT' : 'SIGN UP'
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
            {!isLoggedIn() && (
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
                  setSignupModalOpened(true)
                }}
              >
                {signUpButtonMessage}
              </p>
            </li>
          </ul>
          {showSignUpButton && (
            <NavbarSignUpButton onClick={() => setSignupModalOpened(true)}>
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

function getRoleRoutes(): NavbarRoutesProps[] {
  if (isLoggedIn() && isAdmin()) {
    return adminRoutes
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
