"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { productService } from "../../services/api"
import Alert from "../../components/common/Alert"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await productService.getById(id)
        setProduct(response.data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.delete(id)
        navigate("/products")
      } catch (err) {
        console.error("Error deleting product:", err)
        setError("Failed to delete product. Please try again later.")
      }
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

  if (!product && !loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <h2>Product not found</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Product Details</h1>
          <div>
            <Link to="/products" className="btn btn-secondary mr-2">
              Back to Products
            </Link>
            <Link to={`/products/edit/${id}`} className="btn btn-success mr-2">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>

        {error && <Alert message={error} type="danger" />}

        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h2>{product.name}</h2>
              <p className="price">${product.price?.toFixed(2)}</p>
              <div className="description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            </div>
            <div className="col-md-6">
              {/* Additional product details can go here */}
              <div className="product-meta">
                <p>
                  <strong>Product ID:</strong> {product.id}
                </p>
                {product.stock !== undefined && (
                  <p>
                    <strong>In Stock:</strong> {product.stock}
                  </p>
                )}
                {product.createdAt && (
                  <p>
                    <strong>Added:</strong> {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                )}
                {product.updatedAt && (
                  <p>
                    <strong>Last Updated:</strong> {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail

