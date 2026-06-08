import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchHomeData } from '../services/api'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

const initialState = {
  categories: [],
  featured_products: [],
  new_arrivals: [],
  banners: [],
  settings: null,
}

export default function HomePage() {
  const [data, setData] = useState(initialState)
  const [status, setStatus] = useState('loading')
  const navigate = useNavigate()
  const { addItem } = useCart()

  useEffect(() => {
    let ignore = false

    async function loadHomeData() {
      setStatus('loading')

      try {
        const response = await fetchHomeData()
        if (!ignore) {
          setData({ ...initialState, ...response })
          setStatus('ready')
        }
      } catch {
        if (!ignore) {
          setStatus('error')
        }
      }
    }

    loadHomeData()

    return () => {
      ignore = true
    }
  }, [])

  const handleAddToCart = (product) => {
    addItem(product)
  }

  const handleBuyNow = (product) => {
    addItem(product, 1, { openDrawer: false })
    navigate('/checkout')
  }

  const hero = data.banners?.[0]
  const brandName = data.settings?.brand_name || 'La Ritz'
  const storyTitle = data.settings?.story_title || 'A handcrafted story'
  const storyText =
    data.settings?.story_text ||
    'La Ritz brings together handcrafted softness, elevated detail, and boutique storytelling for pieces that feel personal and premium.'
  const announcement =
    data.settings?.announcement ||
    'Soft handmade pieces, ready for gifting and everyday rituals.'
  const instagramDmUrl = data.settings?.instagram_dm_url || 'https://ig.me/m/_needle_craft'
  const categoryPills = data.categories.slice(0, 4)

  if (status === 'loading') {
    return (
      <section className="section page-stack">
        <div className="status-box">
          <p className="eyebrow">Storefront</p>
          <h1 className="page-title">Loading the latest handmade collection</h1>
        </div>
      </section>
    )
  }

  if (status === 'error') {
    return (
      <section className="section page-stack">
        <div className="status-box">
          <p className="eyebrow">Storefront</p>
          <h1 className="page-title">The collection could not be loaded</h1>
          <p>Start the Django API and the storefront will be ready to browse.</p>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="hero section">
        <div className="hero-media">
          {hero?.image ? (
            <img src={hero.image} alt={hero.title || 'La Ritz hero'} />
          ) : (
            <div className="hero-fallback">
              <p className="eyebrow">Handcrafted highlight</p>
              <h2>{hero?.title || 'Made in small batches, styled for warm gifting and everyday softness.'}</h2>
              <p>{hero?.subtitle || announcement}</p>
            </div>
          )}

          {/* <div className="hero-overlay-card">
            <p className="eyebrow">This week&apos;s focus</p>
            <h3>{hero?.title || 'Boutique handmade edits'}</h3>
            <p>{hero?.subtitle || announcement}</p>
          </div> */}
        </div>

        <div className="hero-copy">
          <p className="eyebrow">{brandName} atelier</p>
          <h1>{hero?.title || 'A proper handmade shop experience, start to finish'}</h1>
          <p>{hero?.subtitle || announcement}</p>

          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              Shop collection
            </Link>
            <Link to="/checkout" className="secondary-button">
              See checkout flow
            </Link>
          </div>

          <div className="hero-highlights">
            <div className="highlight-card">
              <strong>Curated bag</strong>
              <span>Persistent cart across pages</span>
            </div>
            <div className="highlight-card">
              <strong>Boutique checkout</strong>
              <span>Customer details and order summary before DM handoff</span>
            </div>
            <div className="highlight-card">
              <strong>Made for gifting</strong>
              <span>Notes for packaging, delivery timing, and custom requests</span>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-strip">
        <button className="quick-pill" onClick={() => navigate('/shop')}>
          Shop all
        </button>
        {categoryPills.map((category) => (
          <button
            className="quick-pill"
            key={category.id}
            onClick={() => navigate(`/shop?category=${category.slug}`)}
          >
            {category.name}
          </button>
        ))}
      </section>

      <section className="section">
        <div className="trust-band">
          <article className="trust-card">
            <p className="eyebrow">01</p>
            <h3>Handcrafted, not mass-produced</h3>
            <p>Each piece is presented like a boutique find, with warmth and detail in the storytelling.</p>
          </article>
          <article className="trust-card">
            <p className="eyebrow">02</p>
            <h3>Bag and checkout flow</h3>
            <p>Customers can add, review, and prepare their full order before moving into the DM handoff.</p>
          </article>
          <article className="trust-card">
            <p className="eyebrow">03</p>
            <h3>Direct maker conversation</h3>
            <p>Instagram checkout keeps the buying journey personal for sizing, gifts, and custom requests.</p>
          </article>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="section-head">
          <h2>Browse by category</h2>
          <Link to="/shop">View all collections</Link>
        </div>

        <div className="collection-grid">
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
                  <div className="image-fallback">Collection</div>
                )}
              </div>

              <div className="category-card-copy">
                <div>
                  <p className="eyebrow">Collection</p>
                  <h3>{category.name}</h3>
                </div>
                <span>Shop collection</span>
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
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
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
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      </section>

      <section className="section" id="story">
        <div className="editorial-panel">
          <div className="editorial-copy">
            <p className="eyebrow">Our story</p>
            <h2>{storyTitle}</h2>
            <p>{storyText}</p>

            <div className="hero-actions">
              <Link to="/shop" className="primary-button">
                Shop now
              </Link>
              <Link to="/cart" className="secondary-button">
                Review your bag
              </Link>
            </div>
          </div>

          <div className="editorial-aside">
            <div className="support-card">
              <h3>Bag to checkout</h3>
              <p>Customers can now move from browsing to a structured order review without losing their selections.</p>
            </div>
            <div className="support-card">
              <h3>Made for handmade orders</h3>
              <p>The checkout flow still respects the brand&apos;s direct-message fulfilment model.</p>
            </div>
            <div className="support-card">
              <h3>Need help deciding?</h3>
              <a href={instagramDmUrl} target="_blank" rel="noopener noreferrer">
                Open Instagram DM
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="closing-banner">
          <div>
            <p className="eyebrow">Ready to order</p>
            <h2>Build the bag first, then check out with confidence</h2>
          </div>

          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              Browse the shop
            </Link>
            <a
              href={instagramDmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button"
            >
              Open Instagram DM
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
