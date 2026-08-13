import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { banners } from '../../data/content'
import { storeApi } from '../../lib/services'

const fallbackHero = {
  image: banners[0].image,
  title: banners[0].title,
  subtitle: banners[0].subtitle,
  ctaPrimaryLabel: banners[0].ctaPrimary.label,
  ctaPrimaryHref: banners[0].ctaPrimary.href,
  ctaSecondaryLabel: banners[0].ctaSecondary.label,
  ctaSecondaryHref: banners[0].ctaSecondary.href,
}

export default function HeroSection() {
  const [hero, setHero] = useState(fallbackHero)

  useEffect(() => {
    let active = true
    storeApi
      .homepage()
      .then(({ data }) => {
        if (!active) return
        const hp = data.data?.homepage
        if (!hp) return
        setHero({
          image: hp.image || fallbackHero.image,
          title: hp.title || fallbackHero.title,
          subtitle: hp.subtitle || fallbackHero.subtitle,
          ctaPrimaryLabel: hp.ctaPrimaryLabel || fallbackHero.ctaPrimaryLabel,
          ctaPrimaryHref: hp.ctaPrimaryHref || fallbackHero.ctaPrimaryHref,
          ctaSecondaryLabel: hp.ctaSecondaryLabel || fallbackHero.ctaSecondaryLabel,
          ctaSecondaryHref: hp.ctaSecondaryHref || fallbackHero.ctaSecondaryHref,
        })
      })
      .catch(() => {
        /* keep fallback */
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="relative min-h-[78dvh] overflow-hidden md:min-h-[88vh]">
      <img
        src={hero.image}
        alt="Mushk Fragrance hero"
        className="absolute inset-0 h-full w-full object-cover object-center"
        width={1920}
        height={1080}
        fetchPriority="high"
      />
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
            {hero.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-base md:text-lg">
            {hero.subtitle}
          </p>
          <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
            <Button to={hero.ctaPrimaryHref} size="lg" className="w-full sm:w-auto">
              {hero.ctaPrimaryLabel}
            </Button>
            <Button
              to={hero.ctaSecondaryHref}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {hero.ctaSecondaryLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
