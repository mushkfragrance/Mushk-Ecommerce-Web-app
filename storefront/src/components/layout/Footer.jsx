import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Music2 } from 'lucide-react'
import { brand } from '../../lib/brand'
import { storeApi } from '../../lib/services'

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z"
        fill="currentColor"
      />
    </svg>
  )
}

const helpLinks = [
  { to: '/faq', label: 'FAQs' },
  { to: '/shipping', label: 'Shipping & Delivery' },
  { to: '/returns', label: 'Returns & Exchanges' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
]

export default function Footer() {
  const [shopLinks, setShopLinks] = useState([
    { to: '/shop', label: 'Shop All' },
    { to: '/shop/best-sellers', label: 'Best Sellers' },
  ])

  useEffect(() => {
    storeApi
      .categories()
      .then(({ data }) => {
        const cats = (data.data || [])
          .filter((c) => c.status !== 'hidden')
          .map((c) => ({ to: `/shop/${c.slug}`, label: c.name }))
        setShopLinks([
          { to: '/shop', label: 'Shop All' },
          { to: '/shop/best-sellers', label: 'Best Sellers' },
          ...cats,
        ])
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="mt-auto border-t border-border bg-charcoal pb-safe">
      <div className="container-site section-pad grid grid-cols-2 gap-8 py-10 sm:gap-10 sm:py-14 lg:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/" className="inline-flex items-center gap-3">
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="h-11 w-11 rounded-sm object-cover sm:h-12 sm:w-12"
              width={48}
              height={48}
            />
            <div>
              <p className="font-display tracking-[0.22em] text-gold-bright sm:tracking-[0.28em]">
                {brand.shortName}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Fragrance</p>
            </div>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{brand.tagline}</p>
          <div className="mt-5 flex gap-2">
            <a
              href={brand.socials.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="touch-target inline-flex items-center justify-center border border-border text-muted hover:border-gold hover:text-gold"
            >
              <InstagramIcon />
            </a>
            <a
              href={brand.socials.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="touch-target inline-flex items-center justify-center border border-border text-muted hover:border-gold hover:text-gold"
            >
              <FacebookIcon />
            </a>
            <a
              href={brand.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="touch-target inline-flex items-center justify-center border border-border text-muted hover:border-gold hover:text-gold"
            >
              <Music2 size={16} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-gold sm:mb-4">Shop</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {shopLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="inline-block py-0.5 hover:text-gold-bright">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-gold sm:mb-4">Help</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {helpLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="inline-block py-0.5 hover:text-gold-bright">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 sm:col-span-1">
          <h3 className="mb-3 text-xs uppercase tracking-[0.22em] text-gold sm:mb-4">Contact</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <a href={`mailto:${brand.contact.email}`} className="hover:text-gold-bright">
                {brand.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${brand.contact.phone.replace(/\s/g, '')}`} className="hover:text-gold-bright">
                {brand.contact.phone}
              </a>
            </li>
            <li>{brand.contact.address}</li>
            <li>
              <Link to="/about" className="hover:text-gold-bright">
                About the brand
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-site section-pad flex flex-col gap-2 py-5 text-center text-xs text-muted md:flex-row md:items-center md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p>Prices in Pakistani Rupees</p>
        </div>
      </div>
    </footer>
  )
}
