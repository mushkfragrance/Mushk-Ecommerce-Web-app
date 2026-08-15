import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { brand } from '../../lib/brand'
import { storeApi } from '../../lib/services'
import { useStoreSettings } from '../../hooks/useStoreSettings'
import SocialLinks from './SocialLinks'

const helpLinks = [
  { to: '/faq', label: 'FAQs' },
  { to: '/shipping', label: 'Shipping & Delivery' },
  { to: '/returns', label: 'Returns & Exchanges' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
]

export default function Footer() {
  const { settings } = useStoreSettings()
  const email = settings?.email || brand.contact.email
  const phone = settings?.phone || brand.contact.phone
  const address = settings?.address || brand.contact.address
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
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Mushk Fragrance — official perfume store in Pakistan. {brand.tagline}
          </p>
          <SocialLinks tone="footer" className="mt-5 justify-start" />
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
              <a href={`mailto:${email}`} className="hover:text-gold-bright">
                {email}
              </a>
            </li>
            <li>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-gold-bright">
                {phone}
              </a>
            </li>
            <li>{address}</li>
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
