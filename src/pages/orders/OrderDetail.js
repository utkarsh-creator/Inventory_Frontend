"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { orderService, productService } from "../../services/api"
import Alert from "../../components/common/Alert"
import { useAuth } from "../../contexts/AuthContext"

const OrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true)

        // Fetch order details
        const orderResponse = await orderService.getById(id)
        setOrder(orderResponse.data)

        // Fetch product details for each item in the order
        if (orderResponse.data?.items && orderResponse.data.items.length > 0) {
          const productIds = orderResponse.data.items.map((item) => item.productId)

          // Create a map of product IDs to product details
          const productDetails = {}

          for (const productId of productIds) {
            try {
              const productResponse = await productService.getById(productId)
              productDetails[productId] = productResponse.data
            } catch (err) {
              console.error(`Error fetching product ${productId}:`, err)
              productDetails[productId] = { name: "Product not found", price: 0 }
            }
          }

          setProducts(productDetails)
        }
      } catch (err) {
        console.error("Error fetching order details:", err)
        setError("Failed to load order details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await orderService.delete(id)
        navigate("/orders")
      } catch (err) {
        console.error("Error deleting order:", err)
        setError("Failed to delete order. Please try again later.")
      }
    }
  }

  const calculateTotal = () => {
    if (!order?.items) return 0

    return order.items.reduce((total, item) => {
      const product = products[item.productId] || { price: 0 }
      return total + product.price * item.quantity
    }, 0)
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Loading order details...</h2>
        </div>
      </div>
    )
  }

  if (!order && !loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Order not found</h2>
          <p>The order you're looking for doesn't exist or has been removed.</p>
          <Link to="/orders" className="btn btn-primary mt-3">
            Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Order Details</h1>
          <div>
            <Link to="/orders" className="btn btn-secondary mr-2">
              Back to Orders
            </Link>
            {(user?.role === "ADMIN" || user?.id === order.userId) && (
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Order
              </button>
            )}
          </div>
        </div>

        {error && <Alert message={error} type="danger" />}

        <div className="card-body">
          <div className="order-meta mb-4">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>User ID:</strong> {order.userId}
            </p>
          </div>

          <h3>Order Items</h3>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item) => {
                  const product = products[item.productId] || { name: "Product not found", price: 0 }
                  return (
                    <tr key={item.productId}>
                      <td>
                        <Link to={`/products/${item.productId}`}>{product.name}</Link>
                      </td>
                      <td>${product.price?.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(product.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-right">
                    <strong>Total:</strong>
                  </td>
                  <td>
                    <strong>${calculateTotal().toFixed(2)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail

