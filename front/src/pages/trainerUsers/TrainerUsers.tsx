import React, { useEffect, useState } from 'react'
import {
  Button,
  Dropdown,
  FormControl,
  InputGroup,
  Table,
} from 'react-bootstrap'
import Loading from '../../components/loading/Loading'
import TrainerEditBalanceModal from '../../components/modals/TrainerEditBalanceModal'
import Unauthorized from '../../components/unauthorized/Unauthorized'
import { trainerGetUsersCall, User } from '../../utils/apicalls/user'
import { useAuthHeader, useTrainerRole } from '../../utils/auth'

export default function TrainerUsers() {
  const authHeader = useAuthHeader()
  const [users, setUsers] = useState([] as User[])

  const [editable, setEditable] = useState({} as User)

  const [search, setSearch] = useState('')
  const includesSearch = (...args: string[]) => {
    return args.some(
      (a) => !!a && a.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    )
  }

  const loadUsers = () => {
    trainerGetUsersCall(authHeader)
      .then((res) => setUsers(res as User[]))
      .catch((err) => null)
  }

  useEffect(() => {
    loadUsers()
  }, [])

  if (!useTrainerRole()) {
    return <Unauthorized />
  }

  if (!users.length) {
    return <Loading />
  }

  return (
    <>
      <TrainerEditBalanceModal
        user={editable}
        closeFunction={() => setEditable({} as User)}
        reloadUsers={loadUsers}
      />
      <div className="mx-3">
        <InputGroup className="my-3">
          <FormControl
            placeholder="Search by user's name, surname or email"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => setSearch('')}>
            Clear
          </Button>
        </InputGroup>
      </div>
      <div className="m-2 table-responsive">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Contacts</th>
              <th>Activity</th>
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
                return (
                  <UserDetailsRow
                    key={index}
                    user={user}
                    setEditable={setEditable}
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
  user,
  setEditable,
}: {
  user: User
  setEditable: (u: User) => void
}) {
  const MAX_UID_LENGHT = 5
  function formatUid(uid: string): string {
    return uid.substring(0, MAX_UID_LENGHT) + '...'
  }

  return (
    <tr>
      <td>{formatUid(user.id)}</td>
      <td>{user.name}</td>
      <td>{user.surname}</td>
      <UserContacts email={user.email} phone={user.phone} />
      <UserActivity
        createDate={new Date(user.createDate)}
        modifyDate={new Date(user.modifyDate)}
      />
      <td>
        {user.balance}{' '}
        <i
          className="fas fa-pen text-danger mx-2"
          onClick={() => {
            setEditable(user)
          }}
        />
      </td>
      <td>
        <Button variant="secondary">Manage Reservations</Button>
      </td>
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
