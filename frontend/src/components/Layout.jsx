import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <div className="top-strip">Free shipping on select handcrafted pieces · Limited pieces · Made with love</div>
      <header className="header">
        <Link to="/" className="brand">La Ritz</Link>
        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">☰</button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <a href="#story">About Us</a>
          <a href="https://www.instagram.com/_needle_craft?igsh=MW5vamZha2d3eGVlMQ==" target="_blank" rel="noopener noreferrer">Contact</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div>
          <div className="brand brand-foot">La Ritz</div>
          <p>Small batches. Premium handcrafted charm.</p>
        </div>
        <div>
          <h4>Customer care</h4>
          <p>DM us on Instagram for orders and updates.</p>
        </div>
        <div>
          <h4>Instagram</h4>
          <a href="https://ig.me/m/_needle_craft" target="_blank" rel="noopener noreferrer">Open DM</a>
        </div>
      </footer>
    </div>
  )
}
