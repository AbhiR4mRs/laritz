import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchHomeData } from '../services/api'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import heroFallbackImg from '../assets/hero_boutique.png'

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
    'La Ritz brings together handcrafted softness, playful color, and boutique storytelling for pieces that feel personal from the first scroll.'
  const announcement =
    data.settings?.announcement ||
    'Soft handmade pieces, ready for gifting and everyday rituals.'
  const instagramDmUrl = data.settings?.instagram_dm_url || 'https://ig.me/m/_needle_craft'
  const categoryPills = data.categories.slice(0, 5)
  const heroTitle =
    hero?.title || 'Soft handmade pieces with a bright studio soul'
  const heroSubtitle =
    hero?.subtitle ||
    'Browse small-batch drops, collect favorites in your bag, and confirm the human details directly with La Ritz.'

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
    <div className="home-page">
      <section className="home-hero section">
        <div className="home-hero-copy">
          <p className="eyebrow">{brandName} studio</p>
          <span className="home-badge">Tiny batches · big handmade energy</span>
          <h1>{heroTitle}</h1>
          <p className="home-hero-lede">{heroSubtitle}</p>

          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              Explore collection
            </Link>
            <a
              href={instagramDmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-button"
            >
              Message the studio
            </a>
          </div>

          {/* <div className="home-metrics" aria-label="Store highlights">
            <div>
              <strong>{data.categories.length || 4}</strong>
              <span>Collections</span>
            </div>
            <div>
              <strong>{data.featured_products.length || 6}</strong>
              <span>Featured edits</span>
            </div>
            <div>
              <strong>DM</strong>
              <span>Concierge checkout</span>
            </div>
          </div> */}
        </div>

        <div className="home-showcase" aria-label="La Ritz collection preview">
          <div className="showcase-main">
            <img src={hero?.image || heroFallbackImg} alt={hero?.title || 'La Ritz handmade collection'} />
          </div>

          <div className="showcase-note">
            <span>New season</span>
            <strong>{data.new_arrivals.length || 6} fresh pieces</strong>
          </div>

          <div className="showcase-card">
            <p className="eyebrow">Order flow</p>
            <h3>Browse, build a bag, confirm in DM.</h3>
          </div>
        </div>
      </section>

      <section className="home-category-rail section" aria-label="Popular categories">
        <div>
          <p className="eyebrow">Shop by mood</p>
          <h2>Choose a collection</h2>
        </div>

        <div className="home-category-pills">
          <button type="button" className="quick-pill" onClick={() => navigate('/shop')}>
            All products
          </button>
          {categoryPills.map((category) => (
            <button
              type="button"
              className="quick-pill"
              key={category.id}
              onClick={() => navigate(`/shop?category=${category.slug}`)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <section className="home-promise section">
        <div className="home-section-intro">
          <p className="eyebrow">Why customers stay</p>
          <h2>A precise shopping flow, wrapped in handmade warmth.</h2>
        </div>

        <div className="home-promise-grid">
          <article className="home-promise-card">
            <span>01</span>
            <h3>Studio-style presentation</h3>
            <p>Products sit in colorful, tactile cards with clear categories and a warm browsing rhythm.</p>
          </article>
          <article className="home-promise-card">
            <span>02</span>
            <h3>Ready-to-review bag</h3>
            <p>Customers can collect pieces across pages and review every handmade detail before ordering.</p>
          </article>
          <article className="home-promise-card">
            <span>03</span>
            <h3>Personal checkout</h3>
            <p>Instagram handoff keeps custom requests, gifting notes, availability, and delivery details human.</p>
          </article>
        </div>
      </section>

      <section className="section home-featured">
        <div className="home-section-head">
          <div>
            <p className="eyebrow">Featured edit</p>
            <h2>Freshly picked pieces with texture and color.</h2>
          </div>
          <Link to="/shop">View all products</Link>
        </div>

        <div className="product-grid home-product-grid">
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

      <section className="section home-collections" id="categories">
        <div className="home-section-head">
          <div>
            <p className="eyebrow">Collections</p>
            <h2>Organized by mood, texture, and tiny joys.</h2>
          </div>
          <Link to="/shop">Browse shop</Link>
        </div>

        <div className="collection-grid home-collection-grid">
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
                <span>Shop now</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section home-story" id="story">
        <div className="home-story-copy">
          <p className="eyebrow">Brand story</p>
          <h2>{storyTitle}</h2>
          <p>{storyText}</p>
          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              Shop the edit
            </Link>
            <Link to="/cart" className="secondary-button">
              Review your bag
            </Link>
          </div>
        </div>

        <div className="home-process-list">
          <article>
            <span>Step 1</span>
            <h3>Select pieces</h3>
            <p>Browse categories, add favorites, and keep the cart ready across pages.</p>
          </article>
          <article>
            <span>Step 2</span>
            <h3>Add details</h3>
            <p>Use checkout notes for gifting, custom requests, delivery timing, and sizing.</p>
          </article>
          <article>
            <span>Step 3</span>
            <h3>Confirm personally</h3>
            <p>Send the prepared Instagram message and finalize availability directly.</p>
          </article>
        </div>
      </section>

      <section className="section home-arrivals">
        <div className="home-section-head">
          <div>
            <p className="eyebrow">Latest drop</p>
            <h2>Fresh additions for gifting and everyday use.</h2>
          </div>
          <Link to="/shop">Discover more</Link>
        </div>

        <div className="product-grid home-product-grid">
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

      <section className="section">
        <div className="home-cta">
          <p className="eyebrow">Ready to order</p>
          <h2>Build a beautiful bag first. Confirm the handmade details later.</h2>
          <div className="hero-actions">
            <Link to="/shop" className="primary-button">
              Start shopping
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
    </div>
  )
}
