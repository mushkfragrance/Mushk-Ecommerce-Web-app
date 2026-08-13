import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { brand } from '../../lib/brand'

export default function BrandStory() {
  return (
    <section className="container-site section-pad grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="relative aspect-[4/5] overflow-hidden border border-border"
      >
        <img
          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80"
          alt="Mushk Fragrance brand story bottle"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-gold">Our story</p>
        <h2 className="font-display text-3xl text-ivory md:text-5xl">Quiet luxury. Lasting trail.</h2>
        <p className="mt-5 text-muted">{brand.description}</p>
        <p className="mt-4 text-muted">
          From intimate musk silks to smoked oud and amber nights, every bottle is composed for presence —
          not performance. Mushk Fragrance is built for those who prefer ritual over trend.
        </p>
        <Link to="/about" className="mt-8 inline-block text-sm text-gold hover:text-gold-bright">
          About the brand →
        </Link>
      </motion.div>
    </section>
  )
}
