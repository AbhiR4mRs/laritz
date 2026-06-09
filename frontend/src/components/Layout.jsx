import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import CartDrawer from './CartDrawer'
import { useCart } from '../context/CartContext'

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { itemCount, openCart } = useCart()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="site-shell">
      <div className="top-strip">
        <span>Small drops, made slowly</span>
        <span>Gift notes and custom details</span>
        <span>DM checkout with a human touch</span>
      </div>

      <header className="header">
        <Link to="/" className="brand">
          <span className="brand-mark">La Ritz</span>
          <span className="brand-sub">soft craft studio</span>
        </Link>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setMenuOpen((currentValue) => !currentValue)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Home
          </NavLink>
          <NavLink
            to="/shop"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Shop
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Bag
          </NavLink>
          <NavLink
            to="/checkout"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Checkout
          </NavLink>
          <a
            className="nav-link"
            href="https://www.instagram.com/_needle_craft"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact
          </a>
        </nav>

        <div className="header-actions">
          <Link to="/checkout" className="header-secondary-btn">
            Checkout
          </Link>
          <button
            type="button"
            className="cart-trigger"
            onClick={openCart}
            aria-label={`Open shopping bag with ${itemCount} item${itemCount === 1 ? '' : 's'}`}
          >
            Bag
            <span className="cart-count">{itemCount}</span>
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="footer-block">
          <div className="brand-mark brand-foot">La Ritz</div>
          <p>
            A warm, editorial storefront for handmade pieces, thoughtful gifts,
            and small-batch everyday craft.
          </p>
        </div>

        <div className="footer-block">
          <h4>Shop flow</h4>
          <p>Pick your pieces, collect the details, then confirm everything over Instagram DM.</p>
        </div>

        <div className="footer-block">
          <h4>Customer care</h4>
          <p>Leave notes for gift wrap, personalization, sizing, and delivery questions.</p>
        </div>

        <div className="footer-block">
          <h4>Instagram</h4>
          <a
            href="https://ig.me/m/_needle_craft"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open order DM
          </a>
        </div>
      </footer>

      <CartDrawer />
    </div>
  )
}
