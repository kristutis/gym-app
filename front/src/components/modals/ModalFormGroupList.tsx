import React from 'react'
import ModalFormGroup, { ModalFormGroupProps } from './ModalFormGroup'

export default function ModalFormGroupList({
  formGroups,
}: ModalFormGroupListProps) {
  return (
    <>
      {formGroups.map((formGroup, index) => (
        <ModalFormGroup
          key={index}
          label={formGroup.label}
          errorMsg={formGroup.errorMsg}
          inputType={formGroup.inputType}
          setInput={formGroup.setInput}
        />
      ))}
    </>
  )
}

export interface ModalFormGroupListProps {
  formGroups: ModalFormGroupProps[]
}
