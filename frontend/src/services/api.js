const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
).replace(/\/$/, '')
const INSTAGRAM_DM_URL = 'https://ig.me/m/_needle_craft'

async function requestJson(path) {
  const response = await fetch(`${API_BASE}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

export async function fetchHomeData() {
  return requestJson('/home/')
}

export async function fetchProducts(params = {}) {
  if (typeof params === 'string') {
    return requestJson(`/products/${params ? `?${params}` : ''}`)
  }

  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return requestJson(`/products/${query ? `?${query}` : ''}`)
}

export async function fetchProduct(slug) {
  return requestJson(`/products/${slug}/`)
}

export async function fetchCategories() {
  return requestJson('/categories/')
}

export function formatCurrency(amount) {
  return `Rs. ${new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0)}`
}

function buildInstagramOrderMessage({ items = [], customer = {}, note = '' }) {
  const lines = ['Hi La Ritz, I would like to place an order from the website.', '']

  if (items.length) {
    lines.push('Items:')
    items.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.name} x ${item.quantity || 1} - ${formatCurrency(
          Number(item.price) * (item.quantity || 1)
        )}`
      )
    })
    lines.push('')
  }

  lines.push('Customer details:')
  lines.push(`Name: ${customer.fullName?.trim() || 'Not provided'}`)

  if (customer.instagramHandle?.trim()) {
    lines.push(`Instagram: ${customer.instagramHandle.trim()}`)
  }

  if (customer.phone?.trim()) {
    lines.push(`Phone: ${customer.phone.trim()}`)
  }

  if (customer.city?.trim()) {
    lines.push(`City: ${customer.city.trim()}`)
  }

  if (customer.deliveryWindow?.trim()) {
    lines.push(`Delivery preference: ${customer.deliveryWindow.trim()}`)
  }

  if (customer.giftWrap?.trim()) {
    lines.push(`Packaging: ${customer.giftWrap.trim()}`)
  }

  if (note?.trim()) {
    lines.push(`Notes: ${note.trim()}`)
  }

  lines.push('')
  lines.push('Please confirm availability, shipping, and payment details.')

  return lines.join('\n')
}

export function getInstagramDmLink(order = {}) {
  if (!order.items?.length && !order.customer && !order.note) {
    return INSTAGRAM_DM_URL
  }

  const text = encodeURIComponent(buildInstagramOrderMessage(order))
  return `${INSTAGRAM_DM_URL}?text=${text}`
}
