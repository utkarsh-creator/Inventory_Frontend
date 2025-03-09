"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { productService } from "../../services/api"
import Pagination from "../../components/common/Pagination"
import SearchBar from "../../components/common/SearchBar"
import Alert from "../../components/common/Alert"

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const pageSize = 10

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchQuery])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      let response
      if (searchQuery) {
        response = await productService.search(searchQuery)
      } else {
        response = await productService.getAll(currentPage, pageSize)
      }

      setProducts(response.data.content || [])
      setTotalPages(response.data.totalPages || 0)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(0)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.delete(id)
        setProducts(products.filter((product) => product.id !== id))
      } catch (err) {
        console.error("Error deleting product:", err)
        setError("Failed to delete product. Please try again later.")
      }
    }
  }

  if (loading && products.length === 0) {
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
      <div className="card-header">
        <h1 className="card-title">Products</h1>
        <Link to="/products/add" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      {error && <Alert message={error} type="danger" />}

      <SearchBar onSearch={handleSearch} />

      <div className="card">
        <div className="table-container">
          {products.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description?.substring(0, 50)}...</td>
                    <td>${product.price?.toFixed(2)}</td>
                    <td>
                      <div className="btn-group">
                        <Link to={`/products/${product.id}`} className="btn btn-sm btn-primary mr-2">
                          View
                        </Link>
                        <Link to={`/products/edit/${product.id}`} className="btn btn-sm btn-success mr-2">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center my-3">No products found</p>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  )
}

export default Products

