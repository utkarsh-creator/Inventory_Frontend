"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { productService } from "../../services/api"
import Alert from "../../components/common/Alert"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productService.getById(id)
        const product = response.data

        setName(product.name || "")
        setDescription(product.description || "")
        setPrice(product.price?.toString() || "")
        setStock(product.stock?.toString() || "")
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!name || !description || !price) {
      setError("Please fill all required fields")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const productData = {
        name,
        description,
        price: Number.parseFloat(price),
        stock: stock ? Number.parseInt(stock) : null,
      }

      await productService.update(id, productData)
      setSuccess("Product updated successfully")

      // Redirect after short delay
      setTimeout(() => {
        navigate(`/products/${id}`)
      }, 1500)
    } catch (err) {
      console.error("Error updating product:", err)
      setError("Failed to update product. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Loading product details...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Edit Product</h1>
          <div>
            <Link to={`/products/${id}`} className="btn btn-secondary mr-2">
              Cancel
            </Link>
            <Link to="/products" className="btn btn-secondary">
              Back to Products
            </Link>
          </div>
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
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProduct

