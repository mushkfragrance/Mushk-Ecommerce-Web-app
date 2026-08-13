import { Link } from 'react-router-dom'
import { brand } from '../../lib/brand'

export default function AnnouncementBar() {
  return (
    <div className="border-b border-border bg-charcoal">
      <p className="section-pad line-clamp-2 py-2 text-center text-[10px] uppercase leading-relaxed tracking-[0.14em] text-gold-bright sm:text-[11px] sm:tracking-[0.18em] md:line-clamp-none md:text-xs">
        {brand.announcement}
      </p>
      <span className="sr-only">
        Contact {brand.contact.phone} or {brand.contact.email}
      </span>
      <Link to="/shop/sale" className="sr-only">
        View sale
      </Link>
    </div>
  )
}
