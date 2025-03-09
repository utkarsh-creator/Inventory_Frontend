import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="container">
      <div className="text-center my-5">
        <h1 className="display-1">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">Oops! The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound

