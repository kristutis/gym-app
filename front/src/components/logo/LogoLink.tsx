import React from 'react'
import { Link } from 'react-router-dom'

export default function LogoLink({ className, onClick }: LogoLinkProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link to="/" className={className} onClick={() => handleClick()}>
      GYM &nbsp;
      <i className="fas fa-dumbbell"></i>
    </Link>
  )
}

export interface LogoLinkProps {
  className: string
  onClick?: () => void
}
