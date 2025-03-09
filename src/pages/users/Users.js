"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { userService } from "../../services/api"
import Pagination from "../../components/common/Pagination"
import Alert from "../../components/common/Alert"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchUsers()
  }, [currentPage])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await userService.getAll(currentPage, pageSize)
      setUsers(response.data.content || [])
      setTotalPages(response.data.totalPages || 0)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Failed to load users. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.delete(id)
        setUsers(users.filter((user) => user.id !== id))
      } catch (err) {
        console.error("Error deleting user:", err)
        setError("Failed to delete user. Please try again later.")
      }
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Loading users...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card-header">
        <h1 className="card-title">Users Management</h1>
      </div>

      {error && <Alert message={error} type="danger" />}

      <div className="card">
        <div className="table-container">
          {users.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role || "USER"}</td>
                    <td>
                      <div className="btn-group">
                        <Link to={`/users/${user.id}`} className="btn btn-sm btn-primary mr-2">
                          View
                        </Link>
                        <button onClick={() => handleDelete(user.id)} className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center my-3">No users found</p>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default Users

