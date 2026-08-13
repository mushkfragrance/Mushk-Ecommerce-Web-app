import { motion } from 'framer-motion'
import { SectionHeader } from '../ui/PageHero'
import StarRating from '../ui/StarRating'
import { reviews } from '../../data/content'

export default function ReviewsSection() {
  return (
    <section className="border-y border-border bg-charcoal/40">
      <div className="container-site section-pad py-12 sm:py-16 md:py-20">
        <SectionHeader
          title="Customer reviews"
          description="Real impressions from customers across Pakistan."
          align="center"
        />
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.blockquote
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="border border-border bg-ink/50 p-5 sm:p-6"
            >
              <StarRating rating={review.rating} />
              <p className="mt-4 font-display text-lg text-ivory sm:text-xl">{review.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">“{review.body}”</p>
              <footer className="mt-5 text-xs uppercase tracking-[0.16em] text-gold">
                {review.name} · {review.city}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
