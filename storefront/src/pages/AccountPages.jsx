import { useEffect } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHero from '../components/ui/PageHero'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { sampleOrders } from '../data/content'
import { formatPrice } from '../lib/format'
import { useAuthStore } from '../store'
import { Package } from 'lucide-react'

function RequireAuth({ children }) {
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) toast.error('Please sign in to view your account')
  }, [user])

  if (!user) return <Navigate to="/login" replace />
  return children
}

export function AccountPage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <RequireAuth>
      <PageHero
        eyebrow="Account"
        title={`Hello, ${user?.name}`}
        description="Manage your profile and review recent orders. Auth is simulated in Phase 1."
        crumbs={<Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Account' }]} />}
      />
      <div className="container-site section-pad grid gap-6 py-10 md:grid-cols-3 md:py-14">
        <aside className="border border-border bg-charcoal p-5">
          <h2 className="font-display text-xl text-ivory">Dashboard</h2>
          <nav className="mt-4 space-y-2 text-sm">
            <Link to="/account" className="block text-gold-bright">
              Overview
            </Link>
            <Link to="/account/orders" className="block text-muted hover:text-gold-bright">
              Order history
            </Link>
            <Link to="/wishlist" className="block text-muted hover:text-gold-bright">
              Wishlist
            </Link>
            <button
              type="button"
              className="block text-muted hover:text-gold-bright"
              onClick={() => {
                logout()
                toast.success('Signed out')
                navigate('/')
              }}
            >
              Logout
            </button>
          </nav>
        </aside>
        <div className="space-y-5 md:col-span-2">
          <section className="border border-border p-5">
            <h3 className="font-display text-xl text-ivory">Profile</h3>
            <dl className="mt-4 space-y-2 text-sm text-muted">
              <div className="flex justify-between gap-4">
                <dt>Name</dt>
                <dd className="text-ivory">{user.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Email</dt>
                <dd className="text-ivory">{user.email}</dd>
              </div>
            </dl>
          </section>
          <section className="border border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-xl text-ivory">Recent orders</h3>
              <Link to="/account/orders" className="text-sm text-gold hover:text-gold-bright">
                View all
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {sampleOrders.slice(0, 2).map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between gap-3 border border-border p-3 text-sm"
                >
                  <div>
                    <p className="text-ivory">{order.id}</p>
                    <p className="text-muted">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge>{order.status}</Badge>
                    <p className="mt-2 text-gold-bright">{formatPrice(order.total)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </RequireAuth>
  )
}

export function OrdersPage() {
  return (
    <RequireAuth>
      <PageHero
        eyebrow="Orders"
        title="Order history"
        description="Sample orders for the account dashboard prototype."
        crumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Account', to: '/account' },
              { label: 'Orders' },
            ]}
          />
        }
      />
      <div className="container-site section-pad py-10 md:py-14">
        {sampleOrders.length ? (
          <div className="space-y-4">
            {sampleOrders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="flex flex-wrap items-center justify-between gap-4 border border-border p-4 hover:border-gold/50"
              >
                <div>
                  <p className="font-display text-xl text-ivory">{order.id}</p>
                  <p className="mt-1 text-sm text-muted">
                    {order.date} · {order.items.length} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <Badge>{order.status}</Badge>
                  <p className="mt-2 text-gold-bright">{formatPrice(order.total)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will appear here."
            actionLabel="Shop now"
            actionTo="/shop"
          />
        )}
      </div>
    </RequireAuth>
  )
}

export function OrderDetailsPage() {
  const { id } = useParams()
  const order = sampleOrders.find((o) => o.id === id)

  if (!order) {
    return (
      <RequireAuth>
        <div className="container-site section-pad py-16">
          <EmptyState
            icon={Package}
            title="Order not found"
            description="We could not find that order in the prototype sample data."
            actionLabel="Back to orders"
            actionTo="/account/orders"
          />
        </div>
      </RequireAuth>
    )
  }

  return (
    <RequireAuth>
      <PageHero
        eyebrow="Order"
        title={order.id}
        description={`Placed on ${order.date}`}
        crumbs={
          <Breadcrumbs
            items={[
              { label: 'Home', to: '/' },
              { label: 'Account', to: '/account' },
              { label: 'Orders', to: '/account/orders' },
              { label: order.id },
            ]}
          />
        }
      />
      <div className="container-site section-pad grid gap-6 py-10 md:grid-cols-2 md:py-14">
        <section className="border border-border p-5">
          <h2 className="font-display text-xl text-ivory">Items</h2>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li key={`${item.name}-${item.size}`} className="flex justify-between gap-3 text-sm">
                <span className="text-muted">
                  {item.name} · {item.size} × {item.qty}
                </span>
                <span className="text-ivory">{formatPrice(item.price)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-base">
            <span className="text-ivory">Total</span>
            <span className="text-gold-bright">{formatPrice(order.total)}</span>
          </div>
        </section>
        <section className="space-y-4 border border-border p-5 text-sm text-muted">
          <div>
            <h2 className="font-display text-xl text-ivory">Status</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{order.status}</Badge>
              <Badge tone="ivory">Payment: {order.paymentStatus}</Badge>
            </div>
            <p className="mt-3">{order.paymentMethod}</p>
          </div>
          <div>
            <h3 className="text-ivory">Shipping address</h3>
            <p className="mt-2">
              {order.shippingAddress.name}
              <br />
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.area}, {order.shippingAddress.city}
              <br />
              {order.shippingAddress.phone}
            </p>
          </div>
          <Button to="/account/orders" variant="secondary">
            Back to orders
          </Button>
        </section>
      </div>
    </RequireAuth>
  )
}
