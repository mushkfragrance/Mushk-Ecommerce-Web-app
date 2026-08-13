import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  EmptyRow,
  Input,
  Modal,
  PageHeader,
  Select,
  Table,
  TextArea,
} from '../components/ui'
import { formatDate, formatPrice } from '../lib/utils'
import { useAdminDataStore } from '../store'

export function CouponsPage() {
  const coupons = useAdminDataStore((s) => s.coupons)
  const upsertCoupon = useAdminDataStore((s) => s.upsertCoupon)
  const deleteCoupon = useAdminDataStore((s) => s.deleteCoupon)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const openModal = (item) => {
    const next = item || {
      id: `cp-${Date.now()}`,
      code: '',
      type: 'percent',
      value: 10,
      usageLimit: 100,
      used: 0,
      status: 'active',
      expires: '2026-12-31',
    }
    setEditing(next)
    reset(next)
    setOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Discount and free-shipping codes for the storefront."
        actions={
          <Button onClick={() => openModal(null)}>
            <Plus size={16} /> Add coupon
          </Button>
        }
      />
      <Card>
        <Table headers={['Code', 'Type', 'Value', 'Usage', 'Expires', 'Status', 'Actions']}>
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="border-b border-line last:border-0">
              <td className="px-3 py-3 font-medium">{coupon.code}</td>
              <td className="px-3 py-3 capitalize">{coupon.type}</td>
              <td className="px-3 py-3">
                {coupon.type === 'percent'
                  ? `${coupon.value}%`
                  : coupon.type === 'shipping'
                    ? 'Free ship'
                    : formatPrice(coupon.value)}
              </td>
              <td className="px-3 py-3">
                {coupon.used}/{coupon.usageLimit}
              </td>
              <td className="px-3 py-3">{formatDate(coupon.expires)}</td>
              <td className="px-3 py-3">
                <Badge tone={coupon.status === 'active' ? 'success' : 'neutral'}>{coupon.status}</Badge>
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openModal(coupon)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      deleteCoupon(coupon.id)
                      toast.success('Coupon deleted')
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Coupon">
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            upsertCoupon({
              ...editing,
              ...data,
              value: Number(data.value),
              usageLimit: Number(data.usageLimit),
              used: Number(data.used || editing.used || 0),
            })
            toast.success('Coupon saved')
            setOpen(false)
          })}
        >
          <Input label="Code" {...register('code', { required: true })} />
          <Select label="Type" {...register('type')}>
            <option value="percent">Percent</option>
            <option value="fixed">Fixed amount</option>
            <option value="shipping">Free shipping</option>
          </Select>
          <Input label="Value" type="number" {...register('value', { required: true })} />
          <Input label="Usage limit" type="number" {...register('usageLimit', { required: true })} />
          <Input label="Expires" type="date" {...register('expires', { required: true })} />
          <Select label="Status" {...register('status')}>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="disabled">Disabled</option>
          </Select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export function CampaignsPage() {
  const campaigns = useAdminDataStore((s) => s.campaigns)
  const products = useAdminDataStore((s) => s.products)
  const upsertCampaign = useAdminDataStore((s) => s.upsertCampaign)
  const upsertProduct = useAdminDataStore((s) => s.upsertProduct)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const merch = {
    featured: products.filter((p) => p.featured),
    bestSeller: products.filter((p) => p.bestSeller),
    newArrival: products.filter((p) => p.newArrival),
  }

  return (
    <div>
      <PageHeader
        title="Promotional campaigns"
        description="Campaign schedules and homepage merchandising flags."
        actions={
          <Button
            onClick={() => {
              const next = {
                id: `camp-${Date.now()}`,
                name: '',
                channel: 'Homepage banner',
                status: 'scheduled',
                start: '',
                end: '',
                discountLabel: '',
              }
              setEditing(next)
              reset(next)
              setOpen(true)
            }}
          >
            <Plus size={16} /> Add campaign
          </Button>
        }
      />

      <div className="grid gap-6">
        <Card title="Campaigns">
          <Table headers={['Name', 'Channel', 'Window', 'Status', 'Actions']}>
            {campaigns.map((camp) => (
              <tr key={camp.id} className="border-b border-line last:border-0">
                <td className="px-3 py-3">
                  <p className="font-medium">{camp.name}</p>
                  <p className="text-xs text-muted">{camp.discountLabel}</p>
                </td>
                <td className="px-3 py-3">{camp.channel}</td>
                <td className="px-3 py-3 text-muted">
                  {camp.start} → {camp.end}
                </td>
                <td className="px-3 py-3">
                  <Badge tone={camp.status === 'active' ? 'success' : 'info'}>{camp.status}</Badge>
                </td>
                <td className="px-3 py-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditing(camp)
                      reset(camp)
                      setOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card title="Featured / Best sellers / New arrivals">
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              ['featured', 'Featured'],
              ['bestSeller', 'Best sellers'],
              ['newArrival', 'New arrivals'],
            ].map(([key, label]) => (
              <div key={key} className="rounded-lg border border-line p-3">
                <h3 className="mb-3 font-medium">{label}</h3>
                <div className="space-y-2">
                  {products.map((product) => (
                    <label key={product.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(product[key])}
                        onChange={(e) => {
                          upsertProduct({ ...product, [key]: e.target.checked })
                          toast.success(`${product.name} updated`)
                        }}
                      />
                      {product.name}
                    </label>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted">{merch[key].length} selected</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Campaign">
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            upsertCampaign({ ...editing, ...data })
            toast.success('Campaign saved')
            setOpen(false)
          })}
        >
          <Input label="Name" {...register('name', { required: true })} />
          <Input label="Channel" {...register('channel', { required: true })} />
          <Input label="Discount label" {...register('discountLabel')} />
          <Input label="Start" type="date" {...register('start', { required: true })} />
          <Input label="End" type="date" {...register('end', { required: true })} />
          <Select label="Status" {...register('status')}>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="ended">Ended</option>
          </Select>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export function BannersPage() {
  const banners = useAdminDataStore((s) => s.banners)
  const upsertBanner = useAdminDataStore((s) => s.upsertBanner)
  const deleteBanner = useAdminDataStore((s) => s.deleteBanner)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const openModal = (item) => {
    const next =
      item ||
      {
        id: `b-${Date.now()}`,
        title: '',
        subtitle: '',
        ctaLabel: 'Shop',
        ctaHref: '/shop',
        status: 'draft',
        position: 'Hero',
        image: '',
      }
    setEditing(next)
    reset(next)
    setOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Homepage banners"
        description="Hero and promo banners shown on the storefront."
        actions={
          <Button onClick={() => openModal(null)}>
            <Plus size={16} /> Add banner
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {banners.map((banner) => (
          <Card key={banner.id}>
            <img src={banner.image} alt="" className="mb-3 h-36 w-full rounded-lg object-cover" />
            <div className="mb-2 flex items-center justify-between gap-2">
              <Badge tone={banner.status === 'active' ? 'success' : 'neutral'}>{banner.status}</Badge>
              <span className="text-xs text-muted">{banner.position}</span>
            </div>
            <h3 className="font-medium">{banner.title}</h3>
            <p className="mt-1 text-sm text-muted">{banner.subtitle}</p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => openModal(banner)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  deleteBanner(banner.id)
                  toast.success('Banner deleted')
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Banner" wide>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            upsertBanner({ ...editing, ...data })
            toast.success('Banner saved')
            setOpen(false)
          })}
        >
          <Input label="Title" {...register('title', { required: true })} />
          <Input label="Subtitle" {...register('subtitle')} />
          <Input label="Image URL" {...register('image', { required: true })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="CTA label" {...register('ctaLabel')} />
            <Input label="CTA href" {...register('ctaHref')} />
            <Input label="Position" {...register('position')} />
            <Select label="Status" {...register('status')}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export function ReviewsPage() {
  const reviews = useAdminDataStore((s) => s.reviews)
  const updateReviewStatus = useAdminDataStore((s) => s.updateReviewStatus)

  return (
    <div>
      <PageHeader title="Reviews" description="Moderate customer reviews before they appear publicly." />
      <Card>
        <Table headers={['Product', 'Customer', 'Rating', 'Review', 'Status', 'Actions']}>
          {reviews.map((review) => (
            <tr key={review.id} className="border-b border-line last:border-0 align-top">
              <td className="px-3 py-3 font-medium">{review.productName}</td>
              <td className="px-3 py-3">
                {review.customer}
                <p className="text-xs text-muted">{formatDate(review.date)}</p>
              </td>
              <td className="px-3 py-3">{review.rating}/5</td>
              <td className="px-3 py-3">
                <p className="font-medium">{review.title}</p>
                <p className="text-muted">{review.body}</p>
              </td>
              <td className="px-3 py-3">
                <Badge
                  tone={
                    review.status === 'approved'
                      ? 'success'
                      : review.status === 'rejected'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {review.status}
                </Badge>
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      updateReviewStatus(review.id, 'approved')
                      toast.success('Review approved')
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      updateReviewStatus(review.id, 'rejected')
                      toast.success('Review rejected')
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export function NewsletterPage() {
  const subscribers = useAdminDataStore((s) => s.subscribers)
  return (
    <div>
      <PageHeader title="Newsletter subscribers" description="Emails captured from the storefront form." />
      <Card>
        <Table headers={['Email', 'Joined', 'Status']}>
          {subscribers.map((sub) => (
            <tr key={sub.id} className="border-b border-line last:border-0">
              <td className="px-3 py-3 font-medium">{sub.email}</td>
              <td className="px-3 py-3">{formatDate(sub.date)}</td>
              <td className="px-3 py-3">
                <Badge tone={sub.status === 'active' ? 'success' : 'neutral'}>{sub.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}

export function InquiriesPage() {
  const messages = useAdminDataStore((s) => s.messages)
  const updateMessageStatus = useAdminDataStore((s) => s.updateMessageStatus)

  return (
    <div>
      <PageHeader title="Contact inquiries" description="Messages submitted through Contact Us." />
      <div className="grid gap-4">
        {messages.map((msg) => (
          <Card key={msg.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-medium">{msg.subject}</h3>
                <p className="mt-1 text-sm text-muted">
                  {msg.name} · {msg.email} {msg.phone ? `· ${msg.phone}` : ''} · {formatDate(msg.date)}
                </p>
                <p className="mt-3 text-sm">{msg.message}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge tone={msg.status === 'open' ? 'warning' : 'success'}>{msg.status}</Badge>
                {msg.status === 'open' ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      updateMessageStatus(msg.id, 'replied')
                      toast.success('Marked as replied')
                    }}
                  >
                    Mark replied
                  </Button>
                ) : null}
              </div>
            </div>
          </Card>
        ))}
        {!messages.length ? <EmptyRow /> : null}
      </div>
    </div>
  )
}

export function ContentPage() {
  const settings = useAdminDataStore((s) => s.settings)
  const updateSettings = useAdminDataStore((s) => s.updateSettings)
  const { register, handleSubmit } = useForm({
    values: {
      about: settings.about,
      announcement: settings.announcement,
      tagline: settings.tagline,
    },
  })

  return (
    <div>
      <PageHeader
        title="Website content"
        description="Basic content fields that will later sync to the storefront."
      />
      <Card>
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            updateSettings(data)
            toast.success('Content saved (prototype)')
          })}
        >
          <Input label="Tagline" {...register('tagline')} />
          <TextArea label="Announcement bar" rows={2} {...register('announcement')} />
          <TextArea label="About the brand" rows={5} {...register('about')} />
          <Button type="submit">Save content</Button>
        </form>
      </Card>
    </div>
  )
}
