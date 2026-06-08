const demoCategories = [
  {
    id: 'demo-crochet-comforts',
    name: 'Crochet Comforts',
    slug: 'crochet-comforts',
    image: null,
    is_featured: true,
  },
  {
    id: 'demo-gift-edits',
    name: 'Gift Edits',
    slug: 'gift-edits',
    image: null,
    is_featured: true,
  },
  {
    id: 'demo-everyday-charms',
    name: 'Everyday Charms',
    slug: 'everyday-charms',
    image: null,
    is_featured: true,
  },
  {
    id: 'demo-home-softness',
    name: 'Home Softness',
    slug: 'home-softness',
    image: null,
    is_featured: true,
  },
]

const [crochetComforts, giftEdits, everydayCharms, homeSoftness] = demoCategories

const demoProducts = [
  {
    id: 'demo-cloud-crochet-bag',
    name: 'Cloud Crochet Tote',
    slug: 'cloud-crochet-tote',
    price: 1299,
    description:
      'A soft everyday tote with handmade texture, roomy shape, and a warm boutique finish.',
    image: null,
    image_alt: 'Cloud Crochet Tote',
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    instagram_message: '',
    category: crochetComforts,
    created_at: '2026-06-01T09:00:00.000Z',
    updated_at: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'demo-rose-gift-pouch',
    name: 'Rose Gift Pouch',
    slug: 'rose-gift-pouch',
    price: 549,
    description:
      'A sweet little keepsake pouch for jewellery, notes, and thoughtful handmade gifting.',
    image: null,
    image_alt: 'Rose Gift Pouch',
    is_featured: true,
    is_new_arrival: false,
    is_active: true,
    instagram_message: '',
    category: giftEdits,
    created_at: '2026-05-28T09:00:00.000Z',
    updated_at: '2026-05-28T09:00:00.000Z',
  },
  {
    id: 'demo-sage-key-charm',
    name: 'Sage Bloom Charm',
    slug: 'sage-bloom-charm',
    price: 349,
    description:
      'A lightweight handmade charm that adds a soft pop of color to keys, bags, or gifts.',
    image: null,
    image_alt: 'Sage Bloom Charm',
    is_featured: false,
    is_new_arrival: true,
    is_active: true,
    instagram_message: '',
    category: everydayCharms,
    created_at: '2026-06-03T09:00:00.000Z',
    updated_at: '2026-06-03T09:00:00.000Z',
  },
  {
    id: 'demo-cozy-table-mat',
    name: 'Cozy Table Mat Set',
    slug: 'cozy-table-mat-set',
    price: 899,
    description:
      'A calm handmade table accent for slow mornings, tea corners, and cozy home styling.',
    image: null,
    image_alt: 'Cozy Table Mat Set',
    is_featured: true,
    is_new_arrival: false,
    is_active: true,
    instagram_message: '',
    category: homeSoftness,
    created_at: '2026-05-22T09:00:00.000Z',
    updated_at: '2026-05-22T09:00:00.000Z',
  },
  {
    id: 'demo-pearl-hair-bow',
    name: 'Pearl Knit Hair Bow',
    slug: 'pearl-knit-hair-bow',
    price: 399,
    description:
      'A gentle statement bow with pearl-like detail, made for everyday styling and gifting.',
    image: null,
    image_alt: 'Pearl Knit Hair Bow',
    is_featured: false,
    is_new_arrival: true,
    is_active: true,
    instagram_message: '',
    category: everydayCharms,
    created_at: '2026-06-05T09:00:00.000Z',
    updated_at: '2026-06-05T09:00:00.000Z',
  },
  {
    id: 'demo-blush-coaster-duo',
    name: 'Blush Coaster Duo',
    slug: 'blush-coaster-duo',
    price: 499,
    description:
      'Two handcrafted coasters with soft color, tidy edges, and gift-ready charm.',
    image: null,
    image_alt: 'Blush Coaster Duo',
    is_featured: true,
    is_new_arrival: true,
    is_active: true,
    instagram_message: '',
    category: homeSoftness,
    created_at: '2026-06-02T09:00:00.000Z',
    updated_at: '2026-06-02T09:00:00.000Z',
  },
]

export const fallbackCategories = demoCategories

export function fallbackHomeData() {
  return {
    settings: {
      brand_name: 'La Ritz',
      instagram_url: 'https://www.instagram.com/_needle_craft',
      instagram_dm_url: 'https://ig.me/m/_needle_craft',
      announcement:
        'A refreshed demo storefront is ready to browse while the live catalogue connects.',
      story_title: 'Small-batch pieces with a soft, modern mood',
      story_text:
        'La Ritz brings together handcrafted comfort, warm gifting, and a simple order flow that lets customers browse first and confirm details directly with the maker.',
    },
    banners: [
      {
        id: 'demo-hero-banner',
        title: 'Handmade pieces with a fresh little glow-up',
        subtitle:
          'Browse the demo collection, build a bag, and send a ready-to-confirm order through Instagram.',
        button_text: 'Shop Now',
        image: null,
        is_active: true,
      },
    ],
    categories: demoCategories,
    featured_products: demoProducts.filter((product) => product.is_featured),
    new_arrivals: demoProducts.filter((product) => product.is_new_arrival),
  }
}

export function fallbackProductList(params = {}) {
  const normalizedParams =
    typeof params === 'string'
      ? Object.fromEntries(new URLSearchParams(params))
      : params

  return demoProducts.filter((product) => {
    const categoryMatches =
      !normalizedParams.category || product.category.slug === normalizedParams.category
    const searchMatches =
      !normalizedParams.search ||
      product.name.toLowerCase().includes(normalizedParams.search.toLowerCase())

    return categoryMatches && searchMatches
  })
}

export function findFallbackProduct(slug) {
  return demoProducts.find((product) => product.slug === slug) || null
}
