import { Link } from 'react-router-dom'
import CartLineItem from '../components/CartLineItem'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../services/api'

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  } = useCart()

  if (!items.length) {
    return (
      <section className="section page-stack">
        <div className="empty-state-box">
          <p className="eyebrow">Your bag</p>
          <h1 className="page-title">Your bag is waiting for its first piece</h1>
          <p>
            Add a few handcrafted products and we will keep your order ready
            for checkout.
          </p>
          <Link to="/shop" className="primary-button">
            Continue shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section page-stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Shopping bag</p>
          <h1 className="page-title">Review your curated selection</h1>
        </div>

        <button type="button" className="text-button" onClick={clearCart}>
          Clear bag
        </button>
      </div>

      <div className="bag-layout">
        <div className="bag-items">
          {items.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onIncrement={incrementItem}
              onDecrement={decrementItem}
              onRemove={removeItem}
            />
          ))}
        </div>

        <aside className="summary-card">
          <p className="eyebrow">Order summary</p>
          <h2>Everything looks ready</h2>

          <div className="summary-row">
            <span>Items</span>
            <strong>{itemCount}</strong>
          </div>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Finalized at checkout</span>
          </div>
          <div className="summary-row total">
            <span>Estimated total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <p className="summary-note">
            Handmade orders are confirmed directly with La Ritz so you can
            finalise custom requests, delivery timelines, and payment details
            before the order is placed.
          </p>

          <div className="summary-actions">
            <Link to="/checkout" className="primary-button full-width">
              Proceed to checkout
            </Link>
            <Link to="/shop" className="secondary-button full-width">
              Continue shopping
            </Link>
          </div>

          <div className="summary-points">
            <div className="support-card">
              <h3>Gift-ready presentation</h3>
              <p>Use the checkout notes to ask for packaging or personalised details.</p>
            </div>
            <div className="support-card">
              <h3>Direct maker support</h3>
              <p>Every order is confirmed over Instagram with the team before payment.</p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
