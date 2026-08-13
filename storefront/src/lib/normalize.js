export function normalizeProduct(product) {
  if (!product) return null
  return {
    ...product,
    id: product._id || product.id,
    images: product.images?.length ? product.images : ['/favicon.jpeg'],
    topNotes: product.topNotes || [],
    middleNotes: product.middleNotes || [],
    baseNotes: product.baseNotes || [],
    variants: (product.variants || []).map((v) => ({
      ...v,
      salePrice: v.compareAtPrice && v.compareAtPrice > v.price ? v.price : null,
    })),
    createdAt: product.createdAt || product.updatedAt,
    popularity: product.popularity || 0,
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
  }
}

export function audienceLabel(gender) {
  if (gender === 'men') return 'For Him'
  if (gender === 'women') return 'For Her'
  if (gender === 'unisex') return 'Unisex'
  return gender
}
