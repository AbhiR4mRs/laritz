import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchProduct, getInstagramDmLink } from '../services/api'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    fetchProduct(slug).then(setProduct).catch(() => {})
  }, [slug])

  if (!product) return <section className="section"><p>Loading product...</p></section>

  return (
    <section className="section product-page">
      <div className="product-layout">
        <div className="product-image-wrap">
          <img src={product.image} alt={product.image_alt} />
        </div>
        <div className="product-details">
          <p className="eyebrow">La Ritz piece</p>
          <h1 className="page-title">{product.name}</h1>
          <p className="price big">₹{Number(product.price).toFixed(0)}</p>
          <p>{product.description}</p>
          <div className="detail-actions">
            <a href={getInstagramDmLink([product.name])} target="_blank" rel="noopener noreferrer" className="hero-btn">Buy via Instagram DM</a>
          </div>
        </div>
      </div>
    </section>
  )
}
