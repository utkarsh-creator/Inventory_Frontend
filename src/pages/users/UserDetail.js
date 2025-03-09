"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { userService } from "../../services/api"
import Alert from "../../components/common/Alert"

const UserDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await userService.getById(id)
      setUser(response.data)
      setUsername(response.data.username || "")
      setEmail(response.data.email || "")
    } catch (err) {
      console.error("Error fetching user:", err)
      setError("Failed to load user details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setUsername(user.username || "")
      setEmail(user.email || "")
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()

    try {
      const userData = {
        username,
        email,
      }

      await userService.update(id, userData)
      setSuccess("User updated successfully")

      // Update the user object with new values
      setUser({
        ...user,
        username,
        email,
      })

      setIsEditing(false)
    } catch (err) {
      console.error("Error updating user:", err)
      setError("Failed to update user. Please try again.")
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.delete(id)
        navigate("/users")
      } catch (err) {
        console.error("Error deleting user:", err)
        setError("Failed to delete user. Please try again later.")
      }
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Loading user details...</h2>
        </div>
      </div>
    )
  }

  if (!user && !loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>User not found</h2>
          <p>The user you're looking for doesn't exist or has been removed.</p>
          <Link to="/users" className="btn btn-primary mt-3">
            Back to Users
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">User Details</h1>
          <div>
            <Link to="/users" className="btn btn-secondary mr-2">
              Back to Users
            </Link>
            {!isEditing && (
              <>
                <button onClick={toggleEdit} className="btn btn-success mr-2">
                  Edit
                </button>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        <div className="card-body">
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mt-4">
                <button type="submit" className="btn btn-primary mr-2">
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={toggleEdit}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="user-info mb-4">
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role || "USER"}
                </p>
                {user.createdAt && (
                  <p>
                    <strong>Registered:</strong> {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetail

