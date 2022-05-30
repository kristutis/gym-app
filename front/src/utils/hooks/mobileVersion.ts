import { useState } from 'react'

export function useMobileVersion(): boolean {
  const isMobileVersion = () => (window.innerWidth <= 960 ? true : false)
  const [isMobile, setIsMobile] = useState(isMobileVersion())
  window.addEventListener('resize', () => setIsMobile(isMobileVersion()))
  return isMobile
}
