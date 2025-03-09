import "./Footer.css"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <p>© {year} Inventory Management System. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

