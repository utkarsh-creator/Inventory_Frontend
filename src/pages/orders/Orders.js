"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { orderService } from "../../services/api"
import Pagination from "../../components/common/Pagination"
import Alert from "../../components/common/Alert"
import { useAuth } from "../../contexts/AuthContext"

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10

  useEffect(() => {
    fetchOrders()
  }, [currentPage])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.getAll(currentPage, pageSize)
      setOrders(response.data.content || [])
      setTotalPages(response.data.totalPages || 0)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError("Failed to load orders. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await orderService.delete(id)
        setOrders(orders.filter((order) => order.id !== id))
      } catch (err) {
        console.error("Error deleting order:", err)
        setError("Failed to delete order. Please try again later.")
      }
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Loading orders...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card-header">
        <h1 className="card-title">Orders</h1>
        <Link to="/orders/new" className="btn btn-primary">
          Create New Order
        </Link>
      </div>

      {error && <Alert message={error} type="danger" />}

      <div className="card">
        <div className="table-container">
          {orders.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>User</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.userId}</td>
                    <td>{order.items?.length || 0}</td>
                    <td>
                      <div className="btn-group">
                        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-primary mr-2">
                          View
                        </Link>
                        {(user?.role === "ADMIN" || user?.id === order.userId) && (
                          <button onClick={() => handleDelete(order.id)} className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center my-3">No orders found</p>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default Orders

