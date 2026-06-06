import { Link } from 'react-router-dom'
import { formatCurrency } from '../services/api'

export default function ProductCard({ product, onAddToCart, onBuyNow }) {
  const handleAddToCart = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onAddToCart(product)
  }

  const handleBuyNow = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onBuyNow(product)
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-link-area">
        <div className="product-media">
          {product.image ? (
            <img src={product.image} alt={product.image_alt} loading="lazy" />
          ) : (
            <div className="image-fallback">Handcrafted</div>
          )}

          <span className="product-chip">
            {product.is_new_arrival
              ? 'New arrival'
              : product.is_featured
                ? 'Featured'
                : product.category?.name || 'Handmade'}
          </span>
        </div>

        <div className="product-copy">
          <p className="eyebrow">La Ritz edit</p>
          <h3>{product.name}</h3>
          <p className="product-description">
            {product.description ||
              'Soft textures, handcrafted detail, and boutique finishing in every piece.'}
          </p>

          <div className="product-meta">
            <p className="price">{formatCurrency(product.price)}</p>
            <span>{product.category?.name || 'Handcrafted piece'}</span>
          </div>
        </div>
      </Link>

      <div className="card-actions">
        <button type="button" className="secondary-button" onClick={handleAddToCart}>
          Add to bag
        </button>

        <button type="button" className="primary-button" onClick={handleBuyNow}>
          Buy now
        </button>
      </div>
    </article>
  )
}
