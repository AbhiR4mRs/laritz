import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { fetchProduct, fetchProducts, formatCurrency, getInstagramDmLink } from '../services/api'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    let ignore = false

    async function loadProduct() {
      setStatus('loading')
      setQuantity(1)

      try {
        const response = await fetchProduct(slug)
        if (!ignore) {
          setProduct(response)
          setStatus('ready')
        }
      } catch {
        if (!ignore) {
          setProduct(null)
          setRelatedProducts([])
          setStatus('error')
        }
      }
    }

    loadProduct()

    return () => {
      ignore = true
    }
  }, [slug])

  useEffect(() => {
    if (!product?.category?.slug) {
      return undefined
    }

    let ignore = false

    fetchProducts({ category: product.category.slug })
      .then((response) => {
        if (!ignore) {
          setRelatedProducts(response.filter((item) => item.id !== product.id).slice(0, 3))
        }
      })
      .catch(() => {
        if (!ignore) {
          setRelatedProducts([])
        }
      })

    return () => {
      ignore = true
    }
  }, [product])

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const handleBuyNow = () => {
    addItem(product, quantity, { openDrawer: false })
    navigate('/checkout')
  }

  const handleRelatedAdd = (relatedProduct) => {
    addItem(relatedProduct)
  }

  const handleRelatedBuy = (relatedProduct) => {
    addItem(relatedProduct, 1, { openDrawer: false })
    navigate('/checkout')
  }

  if (status === 'loading') {
    return (
      <section className="section page-stack">
        <div className="status-box">
          <h1 className="page-title">Loading product</h1>
        </div>
      </section>
    )
  }

  if (status === 'error' || !product) {
    return (
      <section className="section page-stack">
        <div className="empty-state-box">
          <p className="eyebrow">Product details</p>
          <h1 className="page-title">This product is not available right now</h1>
          <p>Try the full collection instead.</p>
          <Link to="/shop" className="primary-button">
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section page-stack product-page">
      <div className="product-layout">
        <div className="product-gallery">
          {product.image ? (
            <img src={product.image} alt={product.image_alt} />
          ) : (
            <div className="image-fallback product-image-fallback">Handcrafted</div>
          )}
        </div>

        <div className="product-details">
          <p className="eyebrow">{product.category?.name || 'La Ritz piece'}</p>
          <h1 className="page-title">{product.name}</h1>
          <p className="price price-large">{formatCurrency(product.price)}</p>
          <p className="product-detail-copy">
            {product.description ||
              'Crafted to feel personal, soft, and elevated, with the kind of detail that suits a boutique storefront.'}
          </p>

          <div className="product-meta-grid">
            <div className="support-card">
              <h3>Small batch</h3>
              <p>Availability is confirmed directly before payment to keep the process personal.</p>
            </div>
            <div className="support-card">
              <h3>Gift-ready support</h3>
              <p>Use checkout notes for packaging requests, delivery timing, or custom questions.</p>
            </div>
          </div>

          <div className="quantity-row">
            <span>Quantity</span>
            <div className="quantity-stepper large">
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1))}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((currentQuantity) => currentQuantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button type="button" className="secondary-button" onClick={handleAddToCart}>
              Add to bag
            </button>
            <button type="button" className="primary-button" onClick={handleBuyNow}>
              Buy now
            </button>
            <a
              href={getInstagramDmLink({ items: [{ ...product, quantity }] })}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              Quick order on Instagram
            </a>
          </div>
        </div>
      </div>

      {relatedProducts.length ? (
        <section className="related-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">You may also like</p>
              <h2>More from this collection</h2>
            </div>
          </div>

          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onAddToCart={handleRelatedAdd}
                onBuyNow={handleRelatedBuy}
              />
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}
