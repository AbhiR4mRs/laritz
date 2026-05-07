import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import CartBar from '../components/CartBar'

export default function ShopPage() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [searchParams] = useSearchParams()

  const selectedCategory = searchParams.get('category')

  useEffect(() => {
    const query = selectedCategory ? `category=${selectedCategory}` : ''
    fetchProducts(query).then(setProducts).catch(() => {})
  }, [selectedCategory])

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
      prev.map((item) =>
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

  return (
    <>
      <section className="section shop-page">
        <div className="section-head">
          <div>
            <p className="eyebrow">La Ritz collection</p>
            <h1 className="page-title">
              {selectedCategory
                ? selectedCategory.replace(/-/g, ' ')
                : 'Shop all pieces'}
            </h1>
          </div>

          {selectedCategory && (
            <Link to="/shop" className="hero-link-btn">
              Clear filter
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="empty-state-box">
            <h3>No products found</h3>
            <p>This category does not have active products yet.</p>
            <Link to="/shop" className="hero-btn">View all products</Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
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