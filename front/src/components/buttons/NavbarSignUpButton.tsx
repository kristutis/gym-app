import React from 'react'
import './NavbarSignUpButton.css'

function NavbarSignUpButton({ children, onClick }: NavbarButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <p>
      <button className={'navabr-signup-btn'} onClick={handleClick}>
        {children}
      </button>
    </p>
  )
}

export interface NavbarButtonProps {
  children?: JSX.Element | string
  onClick?: () => void
}

export default NavbarSignUpButton
