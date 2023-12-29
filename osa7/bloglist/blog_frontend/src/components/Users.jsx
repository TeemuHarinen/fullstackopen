// add dependencies
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import axios from "axios"
import { Table } from "react-bootstrap"

const Users = () => {
  const [users, setUsers] = useState([])
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.loggedUser)

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get("http://localhost:3003/api/users")
      setUsers(response.data)
    }

    fetchUsers()
  }, [])

  if (!user) return null

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{blogs.filter((blog) => blog.user.id === user.id).length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users
