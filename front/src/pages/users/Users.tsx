import React, { useEffect, useState } from 'react'
import {
  Button,
  Dropdown,
  FormControl,
  InputGroup,
  Table,
} from 'react-bootstrap'
import Loading from '../../components/loading/Loading'
import DeleteUserModal from '../../components/modals/DeleteUserModal'
import EditUserModal from '../../components/modals/EditUserModal'
import {
  adminGetUsersCall,
  DEFAULT_PROFILE_PIC_SRC,
  Trainer,
} from '../../utils/apicalls/user'
import { useAuthHeader, UserRole } from '../../utils/auth'
import './Users.css'

function Users() {
  const authHeader = useAuthHeader()
  const [users, setUsers] = useState([] as Trainer[])

  const [search, setSearch] = useState('')
  const includesSearch = (...args: string[]) => {
    return args.some(
      (a) => !!a && a.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editableUser, setEditableUser] = useState({} as Trainer)

  const loadUsers = () => {
    adminGetUsersCall(authHeader)
      .then((res) => setUsers(res as Trainer[]))
      .catch((err) => alert(err))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  if (!users.length) {
    return <Loading />
  }

  return (
    <>
      <EditUserModal
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
      />
      <div className="m-2 table-responsive users-table-responsive">
        <div className="mx-3">
          <InputGroup className="my-3">
            <FormControl
              placeholder="Search by user's id, name, surname, email or phone"
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearch('')}>
              Clear
            </Button>
          </InputGroup>
        </div>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Contacts</th>
              <th>Role</th>
              <th>Activity</th>
              <th>Trainer Info</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(
                (u) =>
                  search === '' ||
                  includesSearch(u.id, u.name, u.surname, u.email, u.phone!)
              )
              .map((user, index) => {
                const actionProps = {
                  trainer: user,
                  setEditable: (t: Trainer) => setEditableUser(t),
                  openEdit: () => setShowEditModal(true),
                  openDelete: () => setShowDeleteModal(true),
                } as ActionsProps
                return (
                  <UserDetailsRow
                    key={index}
                    trainer={user}
                    actionProps={actionProps}
                  />
                )
              })}
          </tbody>
        </Table>
      </div>
    </>
  )
}

function UserDetailsRow({
  trainer,
  actionProps,
}: {
  trainer: Trainer
  actionProps: ActionsProps
}) {
  const MAX_UID_LENGHT = 5
  function formatUid(uid: string): string {
    return uid.substring(0, MAX_UID_LENGHT) + '...'
  }

  return (
    <tr>
      <td>{formatUid(trainer.id)}</td>
      <td>{trainer.name}</td>
      <td>{trainer.surname}</td>
      <UserContacts email={trainer.email} phone={trainer.phone} />
      <td>{trainer.role.toUpperCase()}</td>
      <UserActivity
        createDate={new Date(trainer.createDate)}
        modifyDate={new Date(trainer.modifyDate)}
      />
      <TrainerInfoCell trainer={trainer} />
      <td>{trainer.balance}</td>
      <Actions actionProps={actionProps} />
    </tr>
  )
}

function UserContacts({ email, phone }: { email: string; phone?: string }) {
  return (
    <td>
      Email: {email}
      <br />
      Phone: {phone ? phone : '---'}
    </td>
  )
}

function UserActivity({
  createDate,
  modifyDate,
}: {
  createDate: Date
  modifyDate: Date
}) {
  return (
    <td>
      <Dropdown drop="start">
        <Dropdown.Toggle
          id="dropdown-button-dark-example1"
          variant="secondary"
          size="sm"
        >
          View
        </Dropdown.Toggle>
        <Dropdown.Menu variant="dark">
          <Dropdown.Item disabled>
            Created on: {createDate.toLocaleString()}
          </Dropdown.Item>
          <Dropdown.Item disabled>
            Last modified: {modifyDate.toLocaleString()}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </td>
  )
}

function TrainerInfoCell({ trainer }: { trainer: Trainer }) {
  if (trainer.role != UserRole.trainer) {
    return <td>---</td>
  }

  const photoUrl =
    !!trainer.photoUrl && trainer.photoUrl != 'DEFAULT'
      ? trainer.photoUrl
      : DEFAULT_PROFILE_PIC_SRC

  return (
    <td>
      <Dropdown drop="start">
        <Dropdown.Toggle variant="secondary" size="sm">
          View
        </Dropdown.Toggle>
        <Dropdown.Menu
          variant="dark"
          className="trainer-details-dropdown trainer-details-z-index"
        >
          <Dropdown.Item disabled>
            <img className="img-thumbnail trainer-img-size" src={photoUrl} />
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item disabled>Price: {trainer.price}€</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item disabled className="trainer-details-dropdown-wrap">
            Moto: {trainer.moto}
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item disabled className="trainer-details-dropdown-wrap">
            Description: {trainer.description}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </td>
  )
}

function Actions({ actionProps }: { actionProps: ActionsProps }) {
  const { trainer, setEditable, openEdit, openDelete } = actionProps
  return (
    <td>
      <i
        className="fas fa-pen text-success mx-2"
        onClick={() => {
          setEditable(trainer)
          openEdit()
        }}
      />
      <i
        className="fas fa-trash text-danger"
        onClick={() => {
          setEditable(trainer)
          openDelete()
        }}
      />
    </td>
  )
}

interface ActionsProps {
  trainer: Trainer
  setEditable: (trainer: Trainer) => void
  openEdit: () => void
  openDelete: () => void
}

export default Users
