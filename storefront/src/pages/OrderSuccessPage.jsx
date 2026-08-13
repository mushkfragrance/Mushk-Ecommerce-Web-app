import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import { formatPrice } from '../lib/format'

export default function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderId = params.get('order')
  const stored = sessionStorage.getItem('mushk-last-order')
  const order = stored ? JSON.parse(stored) : null

  return (
    <div className="container-site section-pad py-16 md:py-24">
      <div className="mx-auto max-w-xl border border-border bg-charcoal p-8 text-center">
        <CheckCircle2 className="mx-auto text-gold" size={42} strokeWidth={1.4} />
        <h1 className="mt-4 font-display text-3xl text-ivory">Order placed</h1>
        <p className="mt-3 text-sm text-muted">
          Thank you for shopping with Mushk Fragrance. This is a prototype confirmation — no payment
          was charged.
        </p>
        <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">
          Order {order?.id || orderId || 'MF-XXXXX'}
        </p>
        {order ? (
          <div className="mt-6 space-y-2 border-t border-border pt-5 text-left text-sm text-muted">
            <p>
              <span className="text-ivory">Total:</span> {formatPrice(order.total)}
            </p>
            <p>
              <span className="text-ivory">Payment:</span> {order.paymentMethod}
            </p>
            <p>
              <span className="text-ivory">Ship to:</span> {order.shippingAddress.area},{' '}
              {order.shippingAddress.city}
            </p>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/shop">Continue shopping</Button>
          <Button to="/account/orders" variant="secondary">
            View order history
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted">
          Need help? <Link to="/contact" className="text-gold hover:text-gold-bright">Contact us</Link>
        </p>
      </div>
    </div>
  )
}
