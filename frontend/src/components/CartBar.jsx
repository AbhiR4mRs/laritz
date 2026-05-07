import { getInstagramDmLink } from '../services/api'

export default function CartBar({ cartItems }) {
  const names = cartItems.map(item => item.name)
  return (
    <div className="cart-bar">
      <div>
        <strong>{cartItems.length}</strong> item(s) selected
      </div>
      <a href={getInstagramDmLink(names)} target="_blank" rel="noopener noreferrer">
        Buy cart on Instagram
      </a>
    </div>
  )
}
