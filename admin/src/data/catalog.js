export const categories = [
  { id: 'cat-men', name: "Men's", slug: 'men', productCount: 6, status: 'active' },
  { id: 'cat-women', name: "Women's", slug: 'women', productCount: 5, status: 'active' },
  { id: 'cat-unisex', name: 'Unisex', slug: 'unisex', productCount: 7, status: 'active' },
]

export const fragranceFamilies = [
  { id: 'ff-woody', name: 'Woody', slug: 'woody', productCount: 4 },
  { id: 'ff-oriental', name: 'Oriental', slug: 'oriental', productCount: 5 },
  { id: 'ff-floral', name: 'Floral', slug: 'floral', productCount: 4 },
  { id: 'ff-fresh', name: 'Fresh', slug: 'fresh', productCount: 3 },
  { id: 'ff-citrus', name: 'Citrus', slug: 'citrus', productCount: 1 },
  { id: 'ff-aromatic', name: 'Aromatic', slug: 'aromatic', productCount: 1 },
  { id: 'ff-gourmand', name: 'Gourmand', slug: 'gourmand', productCount: 1 },
]

export const products = [
  {
    id: 'p1',
    name: 'Amber Night',
    slug: 'amber-night',
    sku: 'MF-AN',
    category: 'men',
    gender: 'men',
    fragranceFamily: 'oriental',
    status: 'active',
    featured: true,
    bestSeller: true,
    newArrival: false,
    onSale: true,
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Warm amber and smoked woods for evening presence.',
    variants: [
      { size: '30ml', sku: 'MF-AN-30', price: 6500, compareAtPrice: 7800, stock: 24 },
      { size: '50ml', sku: 'MF-AN-50', price: 8250, compareAtPrice: 9800, stock: 12 },
      { size: '100ml', sku: 'MF-AN-100', price: 14500, compareAtPrice: null, stock: 6 },
    ],
    sold: 186,
    updatedAt: '2026-02-20',
  },
  {
    id: 'p2',
    name: 'Velvet Rose',
    slug: 'velvet-rose',
    sku: 'MF-VR',
    category: 'women',
    gender: 'women',
    fragranceFamily: 'floral',
    status: 'active',
    featured: true,
    bestSeller: true,
    newArrival: false,
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Damask rose wrapped in soft musk.',
    variants: [
      { size: '30ml', sku: 'MF-VR-30', price: 7200, compareAtPrice: null, stock: 30 },
      { size: '50ml', sku: 'MF-VR-50', price: 9800, compareAtPrice: null, stock: 18 },
      { size: '100ml', sku: 'MF-VR-100', price: 16800, compareAtPrice: null, stock: 9 },
    ],
    sold: 214,
    updatedAt: '2026-02-18',
  },
  {
    id: 'p3',
    name: 'Oud Noir',
    slug: 'oud-noir',
    sku: 'MF-ON',
    category: 'unisex',
    gender: 'unisex',
    fragranceFamily: 'woody',
    status: 'active',
    featured: true,
    bestSeller: true,
    newArrival: true,
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Smoked oud and incense for a commanding aura.',
    variants: [
      { size: '30ml', sku: 'MF-ON-30', price: 8900, compareAtPrice: null, stock: 15 },
      { size: '50ml', sku: 'MF-ON-50', price: 12800, compareAtPrice: null, stock: 4 },
      { size: '100ml', sku: 'MF-ON-100', price: 21000, compareAtPrice: null, stock: 2 },
    ],
    sold: 142,
    updatedAt: '2026-02-22',
  },
  {
    id: 'p4',
    name: 'Citrus Dawn',
    slug: 'citrus-dawn',
    sku: 'MF-CD',
    category: 'unisex',
    gender: 'unisex',
    fragranceFamily: 'citrus',
    status: 'active',
    featured: false,
    bestSeller: false,
    newArrival: true,
    onSale: true,
    image:
      'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Bright citrus lifted by clean musk.',
    variants: [
      { size: '30ml', sku: 'MF-CD-30', price: 3900, compareAtPrice: 4800, stock: 40 },
      { size: '50ml', sku: 'MF-CD-50', price: 5600, compareAtPrice: 6800, stock: 22 },
    ],
    sold: 97,
    updatedAt: '2026-02-15',
  },
  {
    id: 'p5',
    name: 'Leather Room',
    slug: 'leather-room',
    sku: 'MF-LR',
    category: 'men',
    gender: 'men',
    fragranceFamily: 'woody',
    status: 'active',
    featured: true,
    bestSeller: false,
    newArrival: false,
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1615634260167-c8cdedeefadb?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Soft leather and tobacco leaf.',
    variants: [
      { size: '30ml', sku: 'MF-LR-30', price: 8200, compareAtPrice: null, stock: 7 },
      { size: '50ml', sku: 'MF-LR-50', price: 11400, compareAtPrice: null, stock: 3 },
    ],
    sold: 76,
    updatedAt: '2026-02-10',
  },
  {
    id: 'p6',
    name: 'White Tea Mist',
    slug: 'white-tea-mist',
    sku: 'MF-WT',
    category: 'unisex',
    gender: 'unisex',
    fragranceFamily: 'fresh',
    status: 'archived',
    featured: false,
    bestSeller: false,
    newArrival: false,
    onSale: false,
    image:
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=400&q=80',
    shortDescription: 'Airy white tea and soft florals.',
    variants: [
      { size: '30ml', sku: 'MF-WT-30', price: 4500, compareAtPrice: null, stock: 0 },
      { size: '50ml', sku: 'MF-WT-50', price: 6200, compareAtPrice: null, stock: 0 },
    ],
    sold: 54,
    updatedAt: '2026-01-28',
  },
]

export function totalStock(product) {
  return product.variants.reduce((sum, v) => sum + v.stock, 0)
}

export function isLowStock(product, threshold = 8) {
  return product.variants.some((v) => v.stock > 0 && v.stock <= threshold)
}
