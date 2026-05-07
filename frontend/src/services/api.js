const API_BASE = 'http://127.0.0.1:8000/api'

export async function fetchHomeData() {
  const res = await fetch(`${API_BASE}/home/`)
  return res.json()
}

export async function fetchProducts(query = '') {
  const res = await fetch(`${API_BASE}/products/${query ? `?${query}` : ''}`)
  return res.json()
}

export async function fetchProduct(slug) {
  const res = await fetch(`${API_BASE}/products/${slug}/`)
  return res.json()
}

export function getInstagramDmLink(productNames = []) {
  const base = 'https://ig.me/m/_needle_craft'
  if (!productNames.length) return base
  const text = encodeURIComponent(`Hi La Ritz, I want to buy: ${productNames.join(', ')}`)
  return `${base}?text=${text}`
}
