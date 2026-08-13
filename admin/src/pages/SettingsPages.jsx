import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  PageHeader,
  Select,
  Table,
  TextArea,
} from '../components/ui'
import { formatPrice } from '../lib/utils'
import { useAdminDataStore, useAuthStore } from '../store'
import { contentApi, getErrorMessage } from '../lib/services'

export function ShippingPage() {
  const cities = useAdminDataStore((s) => s.shippingCities)
  const settings = useAdminDataStore((s) => s.settings)
  const upsertCity = useAdminDataStore((s) => s.upsertCity)
  const updateSettings = useAdminDataStore((s) => s.updateSettings)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()
  const thresholdForm = useForm({
    values: { freeShippingThreshold: settings.freeShippingThreshold },
  })

  return (
    <div>
      <PageHeader
        title="Shipping"
        description="Delivery cities, fees, and free-shipping threshold."
        actions={
          <Button
            onClick={() => {
              const next = {
                id: `sc-${Date.now()}`,
                city: '',
                fee: 250,
                eta: '2–4 days',
                active: true,
              }
              setEditing(next)
              reset(next)
              setOpen(true)
            }}
          >
            <Plus size={16} /> Add city
          </Button>
        }
      />

      <div className="grid gap-6">
        <Card title="Free shipping threshold">
          <form
            className="flex flex-wrap items-end gap-3"
            onSubmit={thresholdForm.handleSubmit((data) => {
              updateSettings({ freeShippingThreshold: Number(data.freeShippingThreshold) })
              toast.success('Threshold updated')
            })}
          >
            <Input
              label="Amount (Rs.)"
              type="number"
              {...thresholdForm.register('freeShippingThreshold', { required: true })}
            />
            <Button type="submit">Save</Button>
          </form>
        </Card>

        <Card title="Delivery cities">
          <Table headers={['City', 'Fee', 'ETA', 'Status', 'Actions']}>
            {cities.map((city) => (
              <tr key={city.id} className="border-b border-line last:border-0">
                <td className="px-3 py-3 font-medium">{city.city}</td>
                <td className="px-3 py-3">{formatPrice(city.fee)}</td>
                <td className="px-3 py-3 text-muted">{city.eta}</td>
                <td className="px-3 py-3">
                  <Badge tone={city.active ? 'success' : 'neutral'}>
                    {city.active ? 'Active' : 'Disabled'}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditing(city)
                      reset({ ...city, active: String(city.active) })
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
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Shipping city">
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            upsertCity({
              ...editing,
              ...data,
              fee: Number(data.fee),
              active: data.active === true || data.active === 'true',
            })
            toast.success('City saved')
            setOpen(false)
          })}
        >
          <Input label="City" {...register('city', { required: true })} />
          <Input label="Fee" type="number" {...register('fee', { required: true })} />
          <Input label="ETA" {...register('eta', { required: true })} />
          <Select label="Status" {...register('active')}>
            <option value="true">Active</option>
            <option value="false">Disabled</option>
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

export function PaymentsPage() {
  const settings = useAdminDataStore((s) => s.settings)
  const updateSettings = useAdminDataStore((s) => s.updateSettings)

  return (
    <div>
      <PageHeader
        title="Payment methods"
        description="Enable or disable checkout payment options."
      />
      <Card>
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-line p-4">
            <div>
              <p className="font-medium">Cash on Delivery</p>
              <p className="text-sm text-muted">Primary method for Pakistan checkout</p>
            </div>
            <input
              type="checkbox"
              checked={settings.paymentMethods.cod}
              onChange={(e) => {
                updateSettings({
                  paymentMethods: { ...settings.paymentMethods, cod: e.target.checked },
                })
                toast.success('COD setting updated')
              }}
            />
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-line p-4">
            <div>
              <p className="font-medium">Online payment</p>
              <p className="text-sm text-muted">Placeholder for JazzCash / card gateway later</p>
            </div>
            <input
              type="checkbox"
              checked={settings.paymentMethods.online}
              onChange={(e) => {
                updateSettings({
                  paymentMethods: { ...settings.paymentMethods, online: e.target.checked },
                })
                toast.success('Online payment setting updated')
              }}
            />
          </label>
        </div>
      </Card>
    </div>
  )
}

export function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      storeName: '',
      currency: 'PKR',
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      freeShippingThreshold: 8000,
      lowStockThreshold: 8,
      tagline: '',
      productDeliveryText: '2–4 business days in major cities. COD available.',
      productReturnsText: 'Unopened bottles eligible within 7 days.',
    },
  })

  useEffect(() => {
    let active = true
    contentApi
      .settings()
      .then(({ data }) => {
        if (!active) return
        const s = data.data || {}
        reset({
          storeName: s.storeName || '',
          currency: s.currency || 'PKR',
          email: s.email || '',
          phone: s.phone || '',
          whatsapp: s.whatsapp || '',
          address: s.address || '',
          freeShippingThreshold: s.freeShippingThreshold ?? 8000,
          lowStockThreshold: s.lowStockThreshold ?? 8,
          tagline: s.tagline || '',
          productDeliveryText:
            s.productDeliveryText || '2–4 business days in major cities. COD available.',
          productReturnsText:
            s.productReturnsText || 'Unopened bottles eligible within 7 days.',
        })
      })
      .catch((error) => {
        toast.error(getErrorMessage(error, 'Failed to load settings'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reset])

  const onSave = async (data) => {
    setSaving(true)
    try {
      const { data: res } = await contentApi.updateSettings({
        storeName: data.storeName,
        currency: data.currency,
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        address: data.address,
        tagline: data.tagline,
        freeShippingThreshold: Number(data.freeShippingThreshold),
        lowStockThreshold: Number(data.lowStockThreshold),
        productDeliveryText: data.productDeliveryText,
        productReturnsText: data.productReturnsText,
      })
      const s = res.data || {}
      reset({
        storeName: s.storeName || data.storeName,
        currency: s.currency || data.currency,
        email: s.email || data.email,
        phone: s.phone || data.phone,
        whatsapp: s.whatsapp || data.whatsapp,
        address: s.address || data.address,
        freeShippingThreshold: s.freeShippingThreshold ?? data.freeShippingThreshold,
        lowStockThreshold: s.lowStockThreshold ?? data.lowStockThreshold,
        tagline: s.tagline || data.tagline,
        productDeliveryText: s.productDeliveryText || data.productDeliveryText,
        productReturnsText: s.productReturnsText || data.productReturnsText,
      })
      toast.success('Settings saved')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not save settings'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading store settings…</p>
  }

  return (
    <div>
      <PageHeader title="Store settings" description="Brand contact details and operational defaults." />
      <Card>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSave)}>
          <Input label="Store name" {...register('storeName', { required: true })} />
          <Input label="Currency" {...register('currency')} />
          <Input label="Email" {...register('email')} />
          <Input label="Phone" {...register('phone')} />
          <Input label="WhatsApp" {...register('whatsapp')} />
          <Input label="Address" {...register('address')} />
          <Input
            label="Free shipping threshold"
            type="number"
            {...register('freeShippingThreshold')}
          />
          <Input label="Low stock threshold" type="number" {...register('lowStockThreshold')} />
          <div className="sm:col-span-2">
            <TextArea label="Tagline" rows={2} {...register('tagline')} />
          </div>
          <div className="sm:col-span-2">
            <TextArea
              label="Product page — Delivery text"
              rows={2}
              {...register('productDeliveryText')}
            />
          </div>
          <div className="sm:col-span-2">
            <TextArea
              label="Product page — Returns text"
              rows={2}
              {...register('productReturnsText')}
            />
            <p className="mt-1 text-xs text-muted">
              A “return policy” link is always shown after this text on the product page.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:col-span-2">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save settings'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export function ProfilePage() {
  const admin = useAuthStore((s) => s.admin)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const profileForm = useForm({
    values: { name: admin?.name || '', email: admin?.email || '' },
  })
  const passwordForm = useForm({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  return (
    <div>
      <PageHeader title="Admin profile" description="Update profile details and password (simulated)." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <form
            className="space-y-4"
            onSubmit={profileForm.handleSubmit((data) => {
              updateProfile(data)
              toast.success('Profile updated')
            })}
          >
            <Input label="Name" {...profileForm.register('name', { required: true })} />
            <Input label="Email" type="email" {...profileForm.register('email', { required: true })} />
            <p className="text-sm text-muted">Role: {admin?.role}</p>
            <Button type="submit">Save profile</Button>
          </form>
        </Card>
        <Card title="Change password">
          <form
            className="space-y-4"
            onSubmit={passwordForm.handleSubmit((data) => {
              if (data.newPassword.length < 6) {
                toast.error('New password must be at least 6 characters')
                return
              }
              if (data.newPassword !== data.confirmPassword) {
                toast.error('Passwords do not match')
                return
              }
              toast.success('Password changed (prototype only)')
              passwordForm.reset()
            })}
          >
            <Input
              label="Current password"
              type="password"
              {...passwordForm.register('currentPassword', { required: true })}
            />
            <Input
              label="New password"
              type="password"
              {...passwordForm.register('newPassword', { required: true })}
            />
            <Input
              label="Confirm password"
              type="password"
              {...passwordForm.register('confirmPassword', { required: true })}
            />
            <Button type="submit">Update password</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export function ActivityPage() {
  const logs = useAdminDataStore((s) => s.activityLogs)

  return (
    <div>
      <PageHeader title="Activity logs" description="Recent admin actions in this prototype session." />
      <Card>
        <Table headers={['When', 'Actor', 'Action', 'Target']}>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-line last:border-0">
              <td className="px-3 py-3 text-muted">{log.date}</td>
              <td className="px-3 py-3">{log.actor}</td>
              <td className="px-3 py-3 font-medium">{log.action}</td>
              <td className="px-3 py-3 text-muted">{log.target}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  )
}
