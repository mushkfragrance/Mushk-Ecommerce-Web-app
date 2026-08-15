import { motion } from 'framer-motion'
import Button from '../ui/Button'

const defaultCopy = {
  title: 'Crafted for lasting presence',
  subtitle:
    'Discover the Mushk Fragrance collection — refined perfume oils and eau de parfum in black and gold.',
  ctaPrimaryLabel: 'Shop All',
  ctaPrimaryHref: '/shop',
  ctaSecondaryLabel: 'New Arrivals',
  ctaSecondaryHref: '/shop/new-arrivals',
}

export default function HeroSection({ homepage }) {
  const image = homepage?.image || ''
  const title = homepage?.title || defaultCopy.title
  const subtitle = homepage?.subtitle || defaultCopy.subtitle
  const ctaPrimaryLabel = homepage?.ctaPrimaryLabel || defaultCopy.ctaPrimaryLabel
  const ctaPrimaryHref = homepage?.ctaPrimaryHref || defaultCopy.ctaPrimaryHref
  const ctaSecondaryLabel = homepage?.ctaSecondaryLabel || defaultCopy.ctaSecondaryLabel
  const ctaSecondaryHref = homepage?.ctaSecondaryHref || defaultCopy.ctaSecondaryHref

  return (
    <section className="relative min-h-[78dvh] overflow-hidden bg-ink md:min-h-[88vh]">
      {image ? (
        <img
          src={image}
          alt="Mushk Fragrance hero"
          className="absolute inset-0 h-full w-full object-cover object-center"
          width={1920}
          height={1080}
          fetchPriority="high"
        />
      ) : (
        <div className="absolute inset-0 bg-charcoal" aria-hidden="true" />
      )}
      <div className="absolute inset-0 bg-ink/60 md:bg-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/55" />

      <div className="container-site section-pad relative flex min-h-[78dvh] items-center justify-center py-16 pb-safe md:min-h-[88vh] md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mx-auto flex w-full max-w-3xl flex-col items-center px-1 text-center"
        >
          <h1 className="font-display text-[1.85rem] leading-tight text-gold text-balance xs:text-3xl sm:text-4xl md:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-base md:text-lg">
            {subtitle}
          </p>
          <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Button to={ctaPrimaryHref} size="lg" className="w-full sm:w-auto">
              {ctaPrimaryLabel}
            </Button>
            <Button
              to={ctaSecondaryHref}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {ctaSecondaryLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
