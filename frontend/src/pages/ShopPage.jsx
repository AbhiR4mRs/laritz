import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchCategories, fetchProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

export default function ShopPage() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [sortBy, setSortBy] = useState('featured')
  const [searchInput, setSearchInput] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem } = useCart()
  const navigate = useNavigate()

  const selectedCategory = searchParams.get('category') || ''
  const selectedSearch = searchParams.get('search') || ''

  useEffect(() => {
    setSearchInput(selectedSearch)
  }, [selectedSearch])

  useEffect(() => {
    let ignore = false

    fetchCategories()
      .then((response) => {
        if (!ignore) {
          setCategories(response)
        }
      })
      .catch(() => {
        if (!ignore) {
          setCategories([])
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      setStatus('loading')

      try {
        const response = await fetchProducts({
          category: selectedCategory,
          search: selectedSearch,
        })

        if (!ignore) {
          setProducts(response)
          setStatus('ready')
        }
      } catch {
        if (!ignore) {
          setProducts([])
          setStatus('error')
        }
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [selectedCategory, selectedSearch])

  const handleAddToCart = (product) => {
    addItem(product)
  }

  const handleBuyNow = (product) => {
    addItem(product, 1, { openDrawer: false })
    navigate('/checkout')
  }

  const handleCategoryChange = (slug) => {
    const nextParams = new URLSearchParams(searchParams)

    if (slug) {
      nextParams.set('category', slug)
    } else {
      nextParams.delete('category')
    }

    setSearchParams(nextParams)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const nextParams = new URLSearchParams(searchParams)
    const normalizedSearch = searchInput.trim()

    if (normalizedSearch) {
      nextParams.set('search', normalizedSearch)
    } else {
      nextParams.delete('search')
    }

    setSearchParams(nextParams)
  }

  const handleClearFilters = () => {
    setSearchParams({})
    setSearchInput('')
  }

  const categoryLabel =
    categories.find((category) => category.slug === selectedCategory)?.name ||
    (selectedCategory ? selectedCategory.replace(/-/g, ' ') : 'All pieces')

  const visibleProducts = [...products]

  if (sortBy === 'price-low') {
    visibleProducts.sort((leftProduct, rightProduct) => Number(leftProduct.price) - Number(rightProduct.price))
  } else if (sortBy === 'price-high') {
    visibleProducts.sort((leftProduct, rightProduct) => Number(rightProduct.price) - Number(leftProduct.price))
  } else if (sortBy === 'newest') {
    visibleProducts.sort((leftProduct, rightProduct) => new Date(rightProduct.created_at) - new Date(leftProduct.created_at))
  } else {
    visibleProducts.sort((leftProduct, rightProduct) => Number(rightProduct.is_featured) - Number(leftProduct.is_featured))
  }

  return (
    <section className="section page-stack shop-page">
      <div className="section-head">
        <div>
          <p className="eyebrow">La Ritz collection</p>
          <h1 className="page-title">A colorful handmade shelf, neatly sorted</h1>
          <p className="section-copy">
            Search, filter, sort, add to bag, and keep the whole handmade
            discovery flow feeling light, tactile, and quick.
          </p>
        </div>
      </div>

      <div className="shop-toolbar">
        <form className="search-form" onSubmit={handleSearchSubmit}>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by product name"
          />
          <button type="submit" className="primary-button">
            Search
          </button>
        </form>

        <div className="sort-wrap">
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="featured">Featured first</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>
      </div>

      <div className="filter-chips">
        <button
          type="button"
          className={`filter-chip ${selectedCategory ? '' : 'active'}`}
          onClick={() => handleCategoryChange('')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category.id}
            className={`filter-chip ${selectedCategory === category.slug ? 'active' : ''}`}
            onClick={() => handleCategoryChange(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="results-meta">
        <p>
          Showing <strong>{visibleProducts.length}</strong> result
          {visibleProducts.length === 1 ? '' : 's'} for <strong>{categoryLabel}</strong>
          {selectedSearch ? ` matching "${selectedSearch}"` : ''}.
        </p>

        {(selectedCategory || selectedSearch) ? (
          <button type="button" className="text-button" onClick={handleClearFilters}>
            Clear filters
          </button>
        ) : null}
      </div>

      {status === 'loading' ? (
        <div className="status-box">
          <h2>Loading products</h2>
        </div>
      ) : status === 'error' ? (
        <div className="status-box">
          <h2>The product feed could not be loaded</h2>
          <p>Make sure the Django API is running and try again.</p>
        </div>
      ) : (
        <>
          {visibleProducts.length === 0 ? (
            <div className="empty-state-box">
              <h3>No products found</h3>
              <p>Try a different category or search term.</p>
              <button type="button" className="secondary-button" onClick={handleClearFilters}>
                Reset filters
              </button>
            </div>
          ) : (
            <div className="product-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}
        </>
      )}

      <div className="shop-support-grid">
        <article className="support-card">
          <h3>Checkout notes built in</h3>
          <p>Customers can mention gift wrap, custom requests, or delivery timing before they DM.</p>
        </article>
        <article className="support-card">
          <h3>One tidy bag</h3>
          <p>The shared cart follows customers across home, shop, product pages, and checkout.</p>
        </article>
      </div>
    </section>
  )
}
