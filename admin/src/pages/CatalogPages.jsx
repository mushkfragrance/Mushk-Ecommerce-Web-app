import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { Badge, Button, Card, EmptyRow, Input, Modal, PageHeader, Select, Table } from '../components/ui'
import { isLowStock, totalStock } from '../data/catalog'
import { useAdminDataStore } from '../store'

export function CategoriesPage() {
  const categories = useAdminDataStore((s) => s.categories)
  const upsertCategory = useAdminDataStore((s) => s.upsertCategory)
  const deleteCategory = useAdminDataStore((s) => s.deleteCategory)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const openModal = (item) => {
    setEditing(item || { id: `cat-${Date.now()}`, name: '', slug: '', productCount: 0, status: 'active' })
    reset(item || { name: '', slug: '', status: 'active' })
    setOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Gender and collection categories used on the storefront."
        actions={
          <Button onClick={() => openModal(null)}>
            <Plus size={16} /> Add category
          </Button>
        }
      />
      <Card>
        <Table headers={['Name', 'Slug', 'Products', 'Status', 'Actions']}>
          {categories.map((item) => (
            <tr key={item.id} className="border-b border-line last:border-0">
              <td className="px-3 py-3 font-medium">{item.name}</td>
              <td className="px-3 py-3 text-muted">{item.slug}</td>
              <td className="px-3 py-3">{item.productCount}</td>
              <td className="px-3 py-3">
                <Badge tone="success">{item.status}</Badge>
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openModal(item)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      deleteCategory(item.id)
                      toast.success('Category deleted')
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
      <Modal open={open} onClose={() => setOpen(false)} title="Category">
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            upsertCategory({ ...editing, ...data })
            toast.success('Category saved')
            setOpen(false)
          })}
        >
          <Input label="Name" {...register('name', { required: true })} />
          <Input label="Slug" {...register('slug', { required: true })} />
          <Select label="Status" {...register('status')}>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
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

export function FamiliesPage() {
  const families = useAdminDataStore((s) => s.families)
  const upsertFamily = useAdminDataStore((s) => s.upsertFamily)
  const deleteFamily = useAdminDataStore((s) => s.deleteFamily)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  const openModal = (item) => {
    setEditing(item || { id: `ff-${Date.now()}`, name: '', slug: '', productCount: 0 })
    reset(item || { name: '', slug: '' })
    setOpen(true)
  }

  return (
    <div>
      <PageHeader
        title="Fragrance families"
        description="Woody, floral, oriental, and other scent families."
        actions={
          <Button onClick={() => openModal(null)}>
            <Plus size={16} /> Add family
          </Button>
        }
      />
      <Card>
        {families.length ? (
          <Table headers={['Name', 'Slug', 'Products', 'Actions']}>
            {families.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-3 py-3 font-medium">{item.name}</td>
                <td className="px-3 py-3 text-muted">{item.slug}</td>
                <td className="px-3 py-3">{item.productCount}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openModal(item)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        deleteFamily(item.id)
                        toast.success('Family deleted')
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyRow />
        )}
      </Card>
      <Modal open={open} onClose={() => setOpen(false)} title="Fragrance family">
        <form
          className="space-y-4"
          onSubmit={handleSubmit((data) => {
            upsertFamily({ ...editing, ...data, productCount: editing.productCount || 0 })
            toast.success('Family saved')
            setOpen(false)
          })}
        >
          <Input label="Name" {...register('name', { required: true })} />
          <Input label="Slug" {...register('slug', { required: true })} />
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

export function InventoryPage() {
  const products = useAdminDataStore((s) => s.products)
  const settings = useAdminDataStore((s) => s.settings)
  const upsertProduct = useAdminDataStore((s) => s.upsertProduct)
  const [filter, setFilter] = useState('all')

  const rows = products.flatMap((product) =>
    product.variants.map((variant) => ({
      product,
      variant,
      low: variant.stock > 0 && variant.stock <= settings.lowStockThreshold,
      out: variant.stock <= 0,
    })),
  )

  const filtered = rows.filter((row) => {
    if (filter === 'low') return row.low
    if (filter === 'out') return row.out
    return true
  })

  return (
    <div>
      <PageHeader
        title="Inventory"
        description={`Stock tracked per bottle size. Low-stock threshold: ${settings.lowStockThreshold}.`}
        actions={
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="min-w-40">
            <option value="all">All variants</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </Select>
        }
      />
      <Card>
        <Table headers={['Product', 'Size / SKU', 'Stock', 'Status', 'Quick adjust']}>
          {filtered.map(({ product, variant, low, out }) => (
            <tr key={`${product.id}-${variant.sku}`} className="border-b border-line last:border-0">
              <td className="px-3 py-3 font-medium">
                {product.name}
                <p className="text-xs text-muted">Total {totalStock(product)}</p>
              </td>
              <td className="px-3 py-3">
                {variant.size}
                <p className="text-xs text-muted">{variant.sku}</p>
              </td>
              <td className="px-3 py-3">{variant.stock}</td>
              <td className="px-3 py-3">
                {out ? (
                  <Badge tone="danger">Out</Badge>
                ) : low || isLowStock(product, settings.lowStockThreshold) ? (
                  <Badge tone="warning">Low</Badge>
                ) : (
                  <Badge tone="success">OK</Badge>
                )}
              </td>
              <td className="px-3 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      upsertProduct({
                        ...product,
                        variants: product.variants.map((v) =>
                          v.sku === variant.sku ? { ...v, stock: v.stock + 5 } : v,
                        ),
                      })
                      toast.success('+5 stock')
                    }}
                  >
                    +5
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      upsertProduct({
                        ...product,
                        variants: product.variants.map((v) =>
                          v.sku === variant.sku ? { ...v, stock: Math.max(0, v.stock - 1) } : v,
                        ),
                      })
                      toast.success('-1 stock')
                    }}
                  >
                    -1
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
