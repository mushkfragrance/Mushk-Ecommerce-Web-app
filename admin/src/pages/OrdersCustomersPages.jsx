import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Badge,
  Button,
  Card,
  EmptyRow,
  Input,
  PageHeader,
  Select,
  Table,
} from '../components/ui'
import { ORDER_STATUSES, PAYMENT_STATUSES, formatDate, formatPrice } from '../lib/utils'
import { useAdminDataStore } from '../store'

function statusTone(status) {
  if (status === 'Delivered' || status === 'Paid') return 'success'
  if (status === 'Cancelled' || status === 'Failed' || status === 'Refunded') return 'danger'
  if (status === 'Pending') return 'warning'
  return 'info'
}

export function OrdersPage() {
  const orders = useAdminDataStore((s) => s.orders)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const q = query.toLowerCase()
      const matchesQuery =
        order.id.toLowerCase().includes(q) ||
        order.customer.name.toLowerCase().includes(q) ||
        order.city.toLowerCase().includes(q)
      const matchesStatus = status === 'all' || order.status === status
      return matchesQuery && matchesStatus
    })
  }, [orders, query, status])

  return (
    <div>
      <PageHeader title="Orders" description="Manage fulfillment and payment statuses separately." />
      <Card>
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Search order ID, customer, city"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        {filtered.length ? (
          <Table headers={['Order', 'Customer', 'Order status', 'Payment', 'Total', '']}>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-line last:border-0">
                <td className="px-3 py-3">
                  <p className="font-medium">{order.id}</p>
                  <p className="text-xs text-muted">{formatDate(order.date)}</p>
                </td>
                <td className="px-3 py-3">
                  {order.customer.name}
                  <p className="text-xs text-muted">{order.city}</p>
                </td>
                <td className="px-3 py-3">
                  <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                </td>
                <td className="px-3 py-3">
                  <Badge tone={statusTone(order.paymentStatus)}>{order.paymentStatus}</Badge>
                  <p className="mt-1 text-xs text-muted">{order.paymentMethod}</p>
                </td>
                <td className="px-3 py-3">{formatPrice(order.total)}</td>
                <td className="px-3 py-3">
                  <Link to={`/orders/${order.id}`} className="text-sm text-gold hover:underline">
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyRow />
        )}
      </Card>
    </div>
  )
}

export function OrderDetailsPage() {
  const { id } = useParams()
  const orders = useAdminDataStore((s) => s.orders)
  const updateOrderStatus = useAdminDataStore((s) => s.updateOrderStatus)
  const updatePaymentStatus = useAdminDataStore((s) => s.updatePaymentStatus)
  const order = orders.find((o) => o.id === id)

  if (!order) {
    return (
      <Card>
        <EmptyRow message="Order not found in mock data." />
        <div className="mt-4">
          <Link to="/orders" className="text-sm text-gold hover:underline">
            Back to orders
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div>
      <PageHeader
        title={order.id}
        description={`Placed ${formatDate(order.date)}`}
        actions={
          <Link to="/orders" className="text-sm text-gold hover:underline">
            Back to orders
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Items" className="lg:col-span-2">
          <Table headers={['Item', 'Qty', 'Price']}>
            {order.items.map((item) => (
              <tr key={`${item.name}-${item.size}`} className="border-b border-line last:border-0">
                <td className="px-3 py-3">
                  {item.name}
                  <p className="text-xs text-muted">{item.size}</p>
                </td>
                <td className="px-3 py-3">{item.qty}</td>
                <td className="px-3 py-3">{formatPrice(item.price)}</td>
              </tr>
            ))}
          </Table>
          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Discount</dt>
              <dd>-{formatPrice(order.discount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd>{formatPrice(order.shipping)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-6">
          <Card title="Status management">
            <div className="space-y-4">
              <Select
                label="Order status"
                value={order.status}
                onChange={(e) => {
                  updateOrderStatus(order.id, e.target.value)
                  toast.success('Order status updated')
                }}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <Select
                label="Payment status"
                value={order.paymentStatus}
                onChange={(e) => {
                  updatePaymentStatus(order.id, e.target.value)
                  toast.success('Payment status updated')
                }}
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted">
                Order status and payment status are kept separate on purpose.
              </p>
            </div>
          </Card>
          <Card title="Customer & shipping">
            <div className="space-y-2 text-sm text-muted">
              <p>
                <span className="text-ink">{order.customer.name}</span>
              </p>
              <p>{order.customer.email}</p>
              <p>{order.customer.phone}</p>
              <p className="pt-2">
                {order.address}
                <br />
                {order.area}, {order.city}
              </p>
              {order.notes ? <p className="pt-2">Notes: {order.notes}</p> : null}
              <p className="pt-2">Payment: {order.paymentMethod}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function CustomersPage() {
  const customers = useAdminDataStore((s) => s.customers)
  const [query, setQuery] = useState('')
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.city.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div>
      <PageHeader title="Customers" description="Customer list from mock storefront activity." />
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search customers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Table headers={['Customer', 'Contact', 'Orders', 'Spent', 'Status']}>
          {filtered.map((customer) => (
            <tr key={customer.id} className="border-b border-line last:border-0">
              <td className="px-3 py-3">
                <p className="font-medium">{customer.name}</p>
                <p className="text-xs text-muted">Joined {formatDate(customer.joined)}</p>
              </td>
              <td className="px-3 py-3">
                {customer.email}
                <p className="text-xs text-muted">
                  {customer.phone} · {customer.city}
                </p>
              </td>
              <td className="px-3 py-3">{customer.orders}</td>
              <td className="px-3 py-3">{formatPrice(customer.spent)}</td>
              <td className="px-3 py-3">
                <Badge tone={customer.status === 'active' ? 'success' : 'neutral'}>
                  {customer.status}
                </Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
