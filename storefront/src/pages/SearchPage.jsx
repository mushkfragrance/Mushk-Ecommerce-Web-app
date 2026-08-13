import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageHero from '../components/ui/PageHero'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import ProductGrid from '../components/product/ProductGrid'
import QuickViewModal from '../components/product/QuickViewModal'
import Pagination from '../components/ui/Pagination'
import { products } from '../data/products'
import { filterProducts, paginate } from '../data/catalog'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [quickView, setQuickView] = useState(null)
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => filterProducts(products, { query: q, sort: 'popularity' }), [q])
  const pageData = paginate(filtered, page, 9)

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={q ? `Results for “${q}”` : 'Search'}
        description={
          q
            ? `We found ${filtered.length} fragrance${filtered.length === 1 ? '' : 's'} matching your search.`
            : 'Enter a fragrance name, note, or family in the header search.'
        }
        crumbs={
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Search' }]} />
        }
      />
      <div className="container-site section-pad py-10 md:py-14">
        <ProductGrid products={pageData.items} onQuickView={setQuickView} />
        <Pagination page={pageData.page} totalPages={pageData.totalPages} onChange={setPage} />
      </div>
      <QuickViewModal
        product={quickView}
        open={Boolean(quickView)}
        onClose={() => setQuickView(null)}
      />
    </>
  )
}
