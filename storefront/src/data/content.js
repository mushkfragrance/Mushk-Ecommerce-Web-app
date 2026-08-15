export const banners = [
  {
    id: 'hero-1',
    title: 'Crafted for lasting presence',
    subtitle: 'Discover the Mushk Fragrance collection — refined perfume oils and eau de parfum in black and gold.',
    ctaPrimary: { label: 'Shop All', href: '/shop' },
    ctaSecondary: { label: 'New Arrivals', href: '/shop/new-arrivals' },
    image: '',
  },
]

export const promoBanner = {
  title: 'Evening edit — up to 20% off selected bottles',
  subtitle: 'Limited seasonal reductions on Amber Night, Tobacco Gold, and Jasmine Veil.',
  cta: { label: 'Shop Sale', href: '/shop/sale' },
  image: '',
}

export const galleryImages = []

export const reviews = [
  {
    id: 'r1',
    productSlug: 'amber-night',
    productName: 'Amber Night',
    name: 'Ayesha K.',
    city: 'Lahore',
    rating: 5,
    title: 'Lasts through the night',
    body: 'Ordered the 50ml and the amber trail is still there the next morning. Packaging felt premium and delivery was quick.',
    date: '2026-01-18',
  },
  {
    id: 'r2',
    productSlug: 'velvet-rose',
    productName: 'Velvet Rose',
    name: 'Hira M.',
    city: 'Karachi',
    rating: 5,
    title: 'Soft but noticeable',
    body: 'Not overly sweet. The rose feels expensive and the musk dry-down is beautiful for office and evenings.',
    date: '2026-02-02',
  },
  {
    id: 'r3',
    productSlug: 'oud-noir',
    productName: 'Oud Noir',
    name: 'Bilal R.',
    city: 'Islamabad',
    rating: 5,
    title: 'Proper oud without being harsh',
    body: 'Smoky and polished. Got compliments the same day I wore it. Will buy the larger bottle next.',
    date: '2026-02-14',
  },
  {
    id: 'r4',
    productSlug: 'vanilla-resin',
    productName: 'Vanilla Resin',
    name: 'Sana F.',
    city: 'Multan',
    rating: 4,
    title: 'Warm comfort scent',
    body: 'Creamy vanilla without smelling like dessert. Perfect for cooler evenings.',
    date: '2025-12-28',
  },
  {
    id: 'r5',
    productSlug: 'musk-silk',
    productName: 'Musk Silk',
    name: 'Noor A.',
    city: 'Faisalabad',
    rating: 5,
    title: 'My everyday signature',
    body: 'Clean skin musk that never overwhelms. I keep a travel size in my bag now.',
    date: '2026-01-30',
  },
  {
    id: 'r6',
    productSlug: 'tobacco-gold',
    productName: 'Tobacco Gold',
    name: 'Usman T.',
    city: 'Rawalpindi',
    rating: 5,
    title: 'Rich and classy',
    body: 'Honeyed tobacco done right. Projection is strong for the first few hours, then settles beautifully.',
    date: '2026-02-08',
  },
]

export const faqs = [
  {
    id: 'f1',
    question: 'Do you offer Cash on Delivery?',
    answer:
      'Yes. Cash on Delivery is available across major cities in Pakistan. Online payment options will be added soon.',
  },
  {
    id: 'f2',
    question: 'How long do Mushk Fragrance perfumes last?',
    answer:
      'Longevity depends on the composition, skin type, and climate. Most of our eau de parfum formulas are designed for 6–12 hours of wear.',
  },
  {
    id: 'f3',
    question: 'Can I buy smaller bottle sizes first?',
    answer:
      'Yes. Many fragrances are available in smaller sizes so you can explore a scent before committing to a larger bottle.',
  },
  {
    id: 'f4',
    question: 'What is your return policy?',
    answer:
      'Unopened products in original packaging may be eligible for return or exchange within 7 days of delivery. Please review our Return and Exchange Policy for full details.',
  },
  {
    id: 'f5',
    question: 'How should I store my perfume?',
    answer:
      'Keep bottles away from direct sunlight and extreme heat. Store upright in a cool, dry place to protect the composition.',
  },
  {
    id: 'f6',
    question: 'Are your fragrances authentic Mushk Fragrance products?',
    answer:
      'Yes. All products sold on this storefront are original Mushk Fragrance creations. We do not sell grey-market or third-party fillers.',
  },
]

export const shippingZones = [
  { city: 'Karachi', fee: 250 },
  { city: 'Lahore', fee: 200 },
  { city: 'Islamabad', fee: 220 },
  { city: 'Rawalpindi', fee: 220 },
  { city: 'Faisalabad', fee: 250 },
  { city: 'Multan', fee: 280 },
  { city: 'Peshawar', fee: 300 },
  { city: 'Quetta', fee: 350 },
  { city: 'Other', fee: 350 },
]

export const settings = {
  freeShippingThreshold: 8000,
  defaultShippingFee: 250,
  lowStockThreshold: 8,
  promoCodes: {
    WELCOME10: { type: 'percent', value: 10, label: '10% off your order' },
    MUSHK20: { type: 'percent', value: 20, label: '20% off your order' },
    FREESHIP: { type: 'shipping', value: 0, label: 'Free shipping' },
  },
}

export const sampleOrders = [
  {
    id: 'MF-10482',
    date: '2026-02-20',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash on Delivery',
    total: 12450,
    items: [
      { name: 'Amber Night', size: '50ml', qty: 1, price: 8250 },
      { name: 'Citrus Dawn', size: '30ml', qty: 1, price: 3200 },
    ],
    shippingAddress: {
      name: 'Demo Customer',
      phone: '+92 300 1234567',
      address: 'House 12, Street 4, DHA Phase 5',
      city: 'Lahore',
      area: 'DHA',
    },
  },
  {
    id: 'MF-10391',
    date: '2026-01-12',
    status: 'Shipped',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery',
    total: 8900,
    items: [{ name: 'Oud Noir', size: '30ml', qty: 1, price: 8900 }],
    shippingAddress: {
      name: 'Demo Customer',
      phone: '+92 300 1234567',
      address: 'House 12, Street 4, DHA Phase 5',
      city: 'Lahore',
      area: 'DHA',
    },
  },
]
