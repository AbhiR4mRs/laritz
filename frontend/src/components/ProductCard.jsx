import { Link } from 'react-router-dom'
import { getInstagramDmLink } from '../services/api'

export default function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart(product)
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-link-area">
        <img src={product.image} alt={product.image_alt} loading="lazy" />
        <div className="product-copy">
          <p className="eyebrow">La Ritz edit</p>
          <h3>{product.name}</h3>
          <p className="price">₹{Number(product.price).toFixed(0)}</p>
        </div>
      </Link>

      <div className="card-actions">
        <button type="button" onClick={handleAddToCart}>
          Add to bag
        </button>

        <a
          href={getInstagramDmLink([product.name])}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Buy via DM
        </a>
      </div>
    </article>
  )
}