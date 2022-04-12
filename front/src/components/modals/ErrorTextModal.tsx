import React from 'react'
import BaseModal from './BaseModal'

export default function ErrorTextModal({ text, setText }: ErrorTextModalProps) {
  return (
    <BaseModal
      title={'Info'}
      children={<h4>{text}</h4>}
      buttonText={'OK'}
      show={!!text}
      closeFunction={() => setText('')}
      submitFunction={() => setText('')}
    />
  )
}

export interface ErrorTextModalProps {
  text: string
  setText: (value: string) => void
}
