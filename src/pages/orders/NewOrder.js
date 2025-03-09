"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { productService, orderService } from "../../services/api"
import Alert from "../../components/common/Alert"
import { useAuth } from "../../contexts/AuthContext"

const NewOrder = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [products, setProducts] = useState([])
  const [orderItems, setOrderItems] = useState([{ productId: "", quantity: 1 }])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await productService.getAll(0, 100)
        setProducts(response.data.content || [])
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderItems]
    updatedItems[index][field] = value
    setOrderItems(updatedItems)
  }

  const addItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: 1 }])
  }

  const removeItem = (index) => {
    if (orderItems.length === 1) {
      return
    }

    const updatedItems = [...orderItems]
    updatedItems.splice(index, 1)
    setOrderItems(updatedItems)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const invalidItems = orderItems.filter((item) => !item.productId || item.quantity < 1)
    if (invalidItems.length > 0) {
      setError("Please select a product and quantity for all items")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      // Format items for API
      const formattedItems = orderItems.map((item) => ({
        productId: Number.parseInt(item.productId),
        quantity: Number.parseInt(item.quantity),
      }))

      const orderData = {
        userId: user.id,
        items: formattedItems,
      }

      await orderService.create(orderData)
      setSuccess("Order created successfully")

      // Redirect after short delay
      setTimeout(() => {
        navigate("/orders")
      }, 1500)
    } catch (err) {
      console.error("Error creating order:", err)
      setError("Failed to create order. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Loading products...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Create New Order</h1>
          <Link to="/orders" className="btn btn-secondary">
            Back to Orders
          </Link>
        </div>

        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <h3>Order Items</h3>

            {orderItems.map((item, index) => (
              <div key={index} className="card mb-3 p-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor={`product-${index}`}>Product*</label>
                      <select
                        id={`product-${index}`}
                        className="form-control"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ${product.price?.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor={`quantity-${index}`}>Quantity*</label>
                      <input
                        type="number"
                        id={`quantity-${index}`}
                        className="form-control"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-2 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-danger mb-3"
                      onClick={() => removeItem(index)}
                      disabled={orderItems.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mb-4">
              <button type="button" className="btn btn-secondary" onClick={addItem}>
                Add Another Item
              </button>
            </div>

            <div className="form-group mt-4">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Creating Order..." : "Create Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NewOrder

