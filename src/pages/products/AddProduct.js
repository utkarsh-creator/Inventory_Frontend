"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { productService } from "../../services/api"
import Alert from "../../components/common/Alert"

const AddProduct = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!name || !description || !price) {
      setError("Please fill all required fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const productData = {
        name,
        description,
        price: Number.parseFloat(price),
        stock: stock ? Number.parseInt(stock) : null,
      }

      await productService.create(productData)
      setSuccess("Product created successfully")

      // Clear form
      setName("")
      setDescription("")
      setPrice("")
      setStock("")

      // Redirect after short delay
      setTimeout(() => {
        navigate("/products")
      }, 1500)
    } catch (err) {
      console.error("Error creating product:", err)
      setError("Failed to create product. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Add New Product</h1>
          <Link to="/products" className="btn btn-secondary">
            Back to Products
          </Link>
        </div>

        {error && <Alert message={error} type="danger" />}
        {success && <Alert message={success} type="success" />}

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Product Name*</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($)*</label>
              <input
                type="number"
                id="price"
                className="form-control"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock (Optional)</label>
              <input
                type="number"
                id="stock"
                className="form-control"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="form-group mt-4">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddProduct

