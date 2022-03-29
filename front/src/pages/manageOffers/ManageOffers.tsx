import React, { useEffect, useState } from 'react'
import { Button, Image, Table } from 'react-bootstrap'
import Loading from '../../components/loading/Loading'
import CreateOfferModal from '../../components/modals/CreateOfferModal'
import { adminGetOffersCall, Offer } from '../../utils/apicalls/offers'
import { useAuthHeader } from '../../utils/auth'
import './ManageOffers.css'

export default function ManageOffers() {
  const authHeader = useAuthHeader()
  const [offers, setOffers] = useState([{}] as Offer[])

  const [createOfferOpen, setCreateOfferOpen] = useState(false)

  // const [showDeleteModal, setShowDeleteModal] = useState(false)
  // const [showEditModal, setShowEditModal] = useState(false)
  // const [editableUser, setEditableUser] = useState({} as Trainer)

  const loadOffers = () => {
    adminGetOffersCall(authHeader)
      .then((res) => setOffers(res as Offer[]))
      .catch((err) => null)
  }

  useEffect(() => {
    loadOffers()
  }, [])

  if (!offers.length) {
    return <Loading />
  }

  return (
    <>
      {/* <EditUserModal
        trainer={editableUser}
        showModal={showEditModal}
        closeFunction={() => setShowEditModal(false)}
        reloadUserFunction={() => loadUsers()}
      />
      <DeleteUserModal
        trainer={editableUser}
        showModal={showDeleteModal}
        closeFunction={() => setShowDeleteModal(false)}
        reloadUserFunction={() => loadUsers()}
      /> */}
      <>
        <div className="m-2 table-responsive">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Discount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer, index) => {
                //   const actionProps = {
                //     trainer: user,
                //     setEditable: (t: Trainer) => setEditableUser(t),
                //     openEdit: () => setShowEditModal(true),
                //     openDelete: () => setShowDeleteModal(true),
                //   } as ActionsProps
                return (
                  <OfferDetailsRow
                    key={index}
                    offer={offer}
                    //   actionProps={actionProps}
                  />
                )
              })}
            </tbody>
          </Table>
          <div className="d-grid my-2">
            <Button
              variant="success"
              size="lg"
              onClick={() => setCreateOfferOpen(true)}
            >
              Create Offer
            </Button>
          </div>
        </div>
      </>
      <CreateOfferModal
        show={createOfferOpen}
        closeFunction={() => setCreateOfferOpen(false)}
        loadOffers={loadOffers}
      />
    </>
  )
}

function OfferDetailsRow({
  offer,
}: // actionProps,
{
  offer: Offer
  // actionProps: ActionsProps
}) {
  return (
    <tr>
      <td>{offer.id}</td>
      <td className="td-width">
        <Image
          className="img-thumbnail offer-details-img"
          src={offer.imageSrc}
        ></Image>
      </td>
      <td>{`${offer.discountPercentage}%`}</td>
      <td>{offer.description}</td>
      {/* <Actions actionProps={actionProps} /> */}
    </tr>
  )
}

interface ActionsProps {
  offer: Offer
  setEditable: (offer: Offer) => void
  openEdit: () => void
  openDelete: () => void
}
