import React from 'react'
import {
  deleteCommentCall,
  TrainerComment,
} from '../../utils/apicalls/comments'
import { useAuthHeader } from '../../utils/auth'
import BaseModal from './BaseModal'

export default function DeleteCommentModal({
  comment,
  showModal,
  closeFunction,
  reloadComments,
}: DeleteCommentModalProps) {
  const authHeader = useAuthHeader()

  const deleteComment = async (cid: number) => {
    deleteCommentCall(cid, authHeader)
      .then((res) => {
        closeFunction()
        reloadComments()
      })
      .catch((err) => alert(err))
  }

  return (
    <BaseModal
      title={'Delete comment?'}
      children={<h4>{comment.comment}</h4>}
      buttonText={'Delete'}
      show={showModal}
      closeFunction={closeFunction}
      submitFunction={() => deleteComment(comment.id)}
    />
  )
}

export interface DeleteCommentModalProps {
  comment: TrainerComment
  showModal: boolean
  closeFunction: () => void
  reloadComments: () => void
}
