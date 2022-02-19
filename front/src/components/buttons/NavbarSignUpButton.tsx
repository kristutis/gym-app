import React from 'react'
import './NavbarSignUpButton.css'

function NavbarSignUpButton({ children }: NavbarButtonProps) {
  return (
    <p>
      <button className={'btn'}>{children}</button>
    </p>
  )
}

export interface NavbarButtonProps {
  children?: JSX.Element | string
}

export default NavbarSignUpButton
