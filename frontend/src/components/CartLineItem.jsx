import { formatCurrency } from '../services/api'

export default function CartLineItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  compact = false,
}) {
  const lineTotal = Number(item.price) * item.quantity

  return (
    <article className={`cart-line ${compact ? 'compact' : ''}`}>
      <div className="cart-line-media">
        {item.image ? (
          <img src={item.image} alt={item.image_alt || item.name} loading="lazy" />
        ) : (
          <div className="image-fallback">Handcrafted</div>
        )}
      </div>

      <div className="cart-line-copy">
        <div className="cart-line-head">
          <div>
            <h3>{item.name}</h3>
            <p>{item.category?.name || 'Handcrafted piece'}</p>
          </div>
          <strong>{formatCurrency(lineTotal)}</strong>
        </div>

        <div className="cart-line-meta">
          <span>{formatCurrency(item.price)} each</span>
          <span>Small batch</span>
        </div>

        <div className="cart-line-actions">
          <div className="quantity-stepper" aria-label={`Quantity for ${item.name}`}>
            <button type="button" onClick={() => onDecrement(item.id)}>
              -
            </button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => onIncrement(item.id)}>
              +
            </button>
          </div>

          <button
            type="button"
            className="text-button"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}
