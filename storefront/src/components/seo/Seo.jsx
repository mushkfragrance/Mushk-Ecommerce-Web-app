import { useEffect } from 'react'
import { brand } from '../../lib/brand'

const SITE_URL = import.meta.env.VITE_STOREFRONT_URL || 'https://www.mushkfragrance.com'

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Sets document title, description, Open Graph / Twitter tags, canonical, and optional JSON-LD.
 */
export default function Seo({
  title,
  description = brand.description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  jsonLd,
  jsonLdId = 'page-jsonld',
}) {
  const fullTitle = title ? `${title} | ${brand.name}` : `${brand.name} | Premium Perfumes`
  const url = `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
  const ogImage = image || `${SITE_URL.replace(/\/$/, '')}/og-default.jpg`

  useEffect(() => {
    document.title = fullTitle
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:site_name', brand.name)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', ogImage)

    upsertLink('canonical', url)
    upsertJsonLd(jsonLdId, jsonLd)

    return () => {
      if (jsonLd) upsertJsonLd(jsonLdId, null)
    }
  }, [fullTitle, description, url, ogImage, type, noindex, jsonLd, jsonLdId])

  return null
}

export function buildProductJsonLd(product, variantPrice) {
  if (!product) return null
  const url = `${SITE_URL.replace(/\/$/, '')}/product/${product.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description || brand.description,
    image: product.images?.length ? product.images : undefined,
    brand: {
      '@type': 'Brand',
      name: product.brand || brand.name,
    },
    sku: product.slug,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: brand.currency,
      price: String(variantPrice ?? 0),
      availability:
        product.variants?.some((v) => v.stock > 0)
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: brand.name,
      },
    },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: SITE_URL,
    logo: `${SITE_URL.replace(/\/$/, '')}/favicon.jpeg`,
    description: brand.description,
    email: brand.contact.email,
    telephone: brand.contact.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: brand.contact.address,
      addressCountry: 'PK',
    },
    sameAs: Object.values(brand.socials).filter(Boolean),
  }
}
