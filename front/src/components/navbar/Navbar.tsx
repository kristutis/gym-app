import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { isLoggedIn } from '../../utils/auth'
import NavbarSignUpButton from '../buttons/NavbarSignUpButton'
import LogoLink from '../logo/LogoLink'
import LoginModal from '../modals/LoginModal'
import './Navbar.css'

const routes = [
  {
    route: '/',
    text: 'Home',
  },
  {
    route: '/products',
    text: 'Products',
  },
  {
    route: '/',
    text: 'Home',
  },
  {
    route: '/products',
    text: 'Products',
  },
] as NavbarRoutesProps[]

function Navbar() {
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
            <li className="nav-item">
              <p className="nav-links-mobile" onClick={closeMobileMenu}>
                {signUpButtonMessage}
              </p>
            </li>
          </ul>
          {showSignUpButton && (
            <NavbarSignUpButton>{signUpButtonMessage}</NavbarSignUpButton>
          )}
        </div>
      </nav>
      <LoginModal
        show={loginModalOpened}
        closeFunction={() => setLoginModalOpened(false)}
      />
    </>
  )
}

function NavbarButton({ route, text, onClick }: NavbarButtonProps) {
  return (
    <li className="nav-item">
      <Link to={route} className="nav-links" onClick={() => onClick()}>
        {text}
      </Link>
    </li>
  )
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
