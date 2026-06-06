import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatCurrency, getInstagramDmLink } from '../services/api'

const initialForm = {
  fullName: '',
  instagramHandle: '',
  phone: '',
  city: '',
  deliveryWindow: 'Standard delivery',
  giftWrap: 'No gift wrap',
  note: '',
}

export default function CheckoutPage() {
  const { items, itemCount, subtotal, clearCart } = useCart()
  const [form, setForm] = useState(initialForm)
  const [formError, setFormError] = useState('')
  const [checkoutStarted, setCheckoutStarted] = useState(false)

  if (!items.length) {
    return (
      <section className="section page-stack">
        <div className="empty-state-box">
          <p className="eyebrow">Checkout</p>
          <h1 className="page-title">Add something beautiful before checkout</h1>
          <p>
            Your checkout flow is ready. Add products to your bag and we will
            prefill the Instagram order request for you.
          </p>
          <Link to="/shop" className="primary-button">
            Browse products
          </Link>
        </div>
      </section>
    )
  }

  const checkoutLink = getInstagramDmLink({
    items,
    customer: form,
    note: form.note,
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.fullName.trim() || !form.city.trim()) {
      setFormError('Add your name and city so the order request has enough context.')
      return
    }

    if (!form.instagramHandle.trim() && !form.phone.trim()) {
      setFormError('Add a phone number or Instagram handle so La Ritz can reach you.')
      return
    }

    setFormError('')
    setCheckoutStarted(true)
    window.open(checkoutLink, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="section page-stack">
      <div className="section-head">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 className="page-title">Finish with a boutique-style handoff</h1>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-card checkout-form" onSubmit={handleSubmit}>
          <div className="checkout-steps">
            <div className="step-card">
              <strong>1</strong>
              <span>Review your order</span>
            </div>
            <div className="step-card">
              <strong>2</strong>
              <span>Add delivery notes</span>
            </div>
            <div className="step-card">
              <strong>3</strong>
              <span>Send to Instagram checkout</span>
            </div>
          </div>

          <div className="form-grid">
            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your name"
              />
            </label>

            <label className="field">
              <span>Instagram handle</span>
              <input
                type="text"
                name="instagramHandle"
                value={form.instagramHandle}
                onChange={handleChange}
                placeholder="@yourhandle"
              />
            </label>

            <label className="field">
              <span>Phone number</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Mobile number"
              />
            </label>

            <label className="field">
              <span>City</span>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City or delivery area"
              />
            </label>

            <label className="field">
              <span>Delivery preference</span>
              <select
                name="deliveryWindow"
                value={form.deliveryWindow}
                onChange={handleChange}
              >
                <option>Standard delivery</option>
                <option>Need it soon</option>
                <option>Flexible timeline</option>
              </select>
            </label>

            <label className="field">
              <span>Packaging</span>
              <select name="giftWrap" value={form.giftWrap} onChange={handleChange}>
                <option>No gift wrap</option>
                <option>Gift wrap requested</option>
                <option>Add a handwritten note</option>
              </select>
            </label>

            <label className="field field-full">
              <span>Order note</span>
              <textarea
                name="note"
                rows="5"
                value={form.note}
                onChange={handleChange}
                placeholder="Sizing questions, custom requests, delivery notes, or gift message."
              />
            </label>
          </div>

          {formError ? <p className="form-error">{formError}</p> : null}

          <div className="inline-actions">
            <button type="submit" className="primary-button">
              Send order to Instagram
            </button>
            <Link to="/cart" className="secondary-button">
              Back to bag
            </Link>
          </div>

          <p className="checkout-note">
            After the Instagram DM opens, send the prefilled message and La
            Ritz can confirm availability, shipping, and payment details with
            you directly.
          </p>

          {checkoutStarted ? (
            <div className="confirmation-panel">
              <p>
                Your order request has been prepared. Once you send it on
                Instagram, you can clear the bag here.
              </p>
              <button type="button" className="text-button" onClick={clearCart}>
                Clear bag after sending
              </button>
            </div>
          ) : null}
        </form>

        <aside className="checkout-card summary-card">
          <p className="eyebrow">Order summary</p>
          <h2>{itemCount} handcrafted piece{itemCount > 1 ? 's' : ''}</h2>

          <div className="summary-list">
            {items.map((item) => (
              <div className="summary-list-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.quantity} x {formatCurrency(item.price)}</span>
                </div>
                <strong>{formatCurrency(Number(item.price) * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="summary-row">
            <span>Shipping and payment</span>
            <span>Confirmed in DM</span>
          </div>
          <div className="summary-row total">
            <span>Estimated total</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>

          <div className="support-card">
            <h3>What happens next</h3>
            <p>
              Instagram checkout keeps the experience personal while still
              giving customers a familiar bag-and-checkout flow on the site.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
