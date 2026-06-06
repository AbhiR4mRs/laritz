import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import CartLineItem from './CartLineItem'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../services/api'

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    itemCount,
    subtotal,
    incrementItem,
    decrementItem,
    removeItem,
    closeCart,
  } = useCart()

  useEffect(() => {
    if (!isCartOpen) {
      return undefined
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeCart()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isCartOpen, closeCart])

  return (
    <>
      <button
        type="button"
        className={`cart-backdrop ${isCartOpen ? 'open' : ''}`}
        aria-label="Close cart"
        onClick={closeCart}
      />

      <aside
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
      >
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Your bag</p>
            <h2>{itemCount ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : 'Bag is empty'}</h2>
          </div>

          <button type="button" className="drawer-close" onClick={closeCart}>
            Close
          </button>
        </div>

        {items.length ? (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  compact
                  onIncrement={incrementItem}
                  onDecrement={decrementItem}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="drawer-footer">
              <div className="summary-row total">
                <span>Estimated total</span>
                <strong>{formatCurrency(subtotal)}</strong>
              </div>

              <p className="drawer-note">
                Checkout is finalized over Instagram so you can confirm
                availability, custom requests, shipping, and payment with the
                maker.
              </p>

              <div className="drawer-actions">
                <Link to="/cart" className="secondary-button" onClick={closeCart}>
                  View bag
                </Link>
                <Link to="/checkout" className="primary-button" onClick={closeCart}>
                  Checkout
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="drawer-empty">
            <p>
              Start with a few handcrafted pieces and we will keep them ready
              here for checkout.
            </p>
            <Link to="/shop" className="primary-button" onClick={closeCart}>
              Shop collection
            </Link>
          </div>
        )}
      </aside>
    </>
  )
}
