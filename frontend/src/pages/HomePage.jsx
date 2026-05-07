import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchHomeData } from '../services/api'
import ProductCard from '../components/ProductCard'
import CartBar from '../components/CartBar'

export default function HomePage() {
  const [data, setData] = useState({
    categories: [],
    featured_products: [],
    new_arrivals: [],
    banners: [],
    settings: null,
  })
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchHomeData().then(setData).catch(() => {})
  }, [])

  const addToCart = (product) => {
    const cartItem = {
      ...product,
      cartId: `${product.id}-${Date.now()}`,
      quantity: 1,
    }
    setCart((prev) => [...prev, cartItem])
    setCartOpen(true)
  }

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId))
  }

  const updateQuantity = (cartId, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
            : item
        )
    )
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  )

  const hero = data.banners?.[0]

  return (
    <>
      <section className="hero">
        <div className="hero-media">
          {hero?.image ? (
            <img src={hero.image} alt={hero.title || 'La Ritz hero'} />
          ) : (
            <div className="category-fallback" />
          )}

          <div className="hero-badge-stack">
            <span>Handcrafted</span>
            <span>Limited pieces</span>
            <span>DM ordering</span>
          </div>
        </div>

        <div className="hero-copy">
          <p className="eyebrow">La Ritz atelier</p>
          <h1>Soft craft, rich detail, timeless charm</h1>
          <p>
            A premium handcrafted storefront with warm editorial styling,
            boutique collections, and direct ordering through Instagram DM.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="hero-btn">Shop collection</Link>
            <a href="#categories" className="hero-link-btn">Explore categories</a>
          </div>
        </div>
      </section>

      <section className="quick-strip">
        <button className="quick-pill" onClick={() => navigate('/shop')}>New arrivals</button>
        <button className="quick-pill" onClick={() => navigate('/shop?category=pouches')}>Pouches</button>
        <button className="quick-pill" onClick={() => navigate('/shop?category=baby-frocks')}>Baby frocks</button>
        <button className="quick-pill" onClick={() => navigate('/shop?category=crop-tops')}>Crop tops</button>
      </section>

      <section className="section" id="categories">
        <div className="section-head">
          <h2>Browse by category</h2>
          <Link to="/shop">View all collections</Link>
        </div>

        <div className="category-grid">
          {data.categories.map((category) => (
            <Link
              to={`/shop?category=${category.slug}`}
              className="category-card"
              key={category.id}
            >
              <div className="category-image-wrap">
                {category.image ? (
                  <img src={category.image} alt={category.name} loading="lazy" />
                ) : (
                  <div className="category-fallback" />
                )}
              </div>

              <div className="category-card-copy">
                <div>
                  <p className="eyebrow">Collection</p>
                  <h3>{category.name}</h3>
                </div>
                <span>Enter →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Featured pieces</h2>
          <Link to="/shop">Shop all</Link>
        </div>

        <div className="product-grid">
          {data.featured_products.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>New arrivals</h2>
          <Link to="/shop">Discover more</Link>
        </div>

        <div className="product-grid">
          {data.new_arrivals.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      <section className="story section" id="story">
        <div className="story-panel media-panel"></div>

        <div className="story-panel text-panel">
          <p className="eyebrow">Our story</p>
          <h2>Handmade with intention, styled with warmth</h2>
          <p>
            {data.settings?.story_text ||
              'La Ritz brings together handcrafted softness, elevated detail, and boutique storytelling for pieces that feel personal and premium.'}
          </p>

          <div className="story-actions">
            <Link to="/shop" className="hero-btn">Shop now</Link>
            <a
              href="https://ig.me/m/_needle_craft"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-link-btn"
            >
              Open Instagram DM
            </a>
          </div>
        </div>
      </section>

      <CartBar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        total={total.toFixed(0)}
      />
    </>
  )
}