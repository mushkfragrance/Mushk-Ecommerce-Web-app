import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  products as seedProducts,
  categories as seedCategories,
  fragranceFamilies as seedFamilies,
} from '../data/catalog'
import {
  orders as seedOrders,
  customers as seedCustomers,
  reviews as seedReviews,
  coupons as seedCoupons,
  campaigns as seedCampaigns,
  banners as seedBanners,
  newsletterSubscribers as seedSubscribers,
  contactMessages as seedMessages,
  shippingCities as seedCities,
  storeSettings as seedSettings,
  activityLogs as seedLogs,
} from '../data/mock'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,
      login: ({ email, name, role = 'owner', id = 'admin-1' }) =>
        set({
          admin: {
            id,
            name: name || 'Owner Admin',
            email,
            role,
          },
        }),
      logout: () => set({ admin: null }),
      updateProfile: (patch) => set({ admin: { ...get().admin, ...patch } }),
      isAuthenticated: () => Boolean(get().admin),
    }),
    { name: 'mushk-admin-auth' },
  ),
)

export const useAdminDataStore = create(
  persist(
    (set, get) => ({
      products: seedProducts,
      categories: seedCategories,
      families: seedFamilies,
      orders: seedOrders,
      customers: seedCustomers,
      reviews: seedReviews,
      coupons: seedCoupons,
      campaigns: seedCampaigns,
      banners: seedBanners,
      subscribers: seedSubscribers,
      messages: seedMessages,
      shippingCities: seedCities,
      settings: seedSettings,
      activityLogs: seedLogs,

      log: (action, target) => {
        const entry = {
          id: `a-${Date.now()}`,
          actor: useAuthStore.getState().admin?.name || 'Admin',
          action,
          target,
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        }
        set({ activityLogs: [entry, ...get().activityLogs].slice(0, 50) })
      },

      upsertProduct: (product) => {
        const exists = get().products.some((p) => p.id === product.id)
        set({
          products: exists
            ? get().products.map((p) => (p.id === product.id ? product : p))
            : [product, ...get().products],
        })
        get().log(exists ? 'Updated product' : 'Created product', product.name)
      },

      archiveProduct: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, status: p.status === 'archived' ? 'active' : 'archived' } : p,
          ),
        })
        const product = get().products.find((p) => p.id === id)
        get().log('Toggled product archive', product?.name || id)
      },

      deleteProduct: (id) => {
        const product = get().products.find((p) => p.id === id)
        set({ products: get().products.filter((p) => p.id !== id) })
        get().log('Deleted product', product?.name || id)
      },

      upsertCategory: (category) => {
        const exists = get().categories.some((c) => c.id === category.id)
        set({
          categories: exists
            ? get().categories.map((c) => (c.id === category.id ? category : c))
            : [...get().categories, category],
        })
        get().log(exists ? 'Updated category' : 'Created category', category.name)
      },

      deleteCategory: (id) => {
        const item = get().categories.find((c) => c.id === id)
        set({ categories: get().categories.filter((c) => c.id !== id) })
        get().log('Deleted category', item?.name || id)
      },

      upsertFamily: (family) => {
        const exists = get().families.some((f) => f.id === family.id)
        set({
          families: exists
            ? get().families.map((f) => (f.id === family.id ? family : f))
            : [...get().families, family],
        })
        get().log(exists ? 'Updated fragrance family' : 'Created fragrance family', family.name)
      },

      deleteFamily: (id) => {
        const item = get().families.find((f) => f.id === id)
        set({ families: get().families.filter((f) => f.id !== id) })
        get().log('Deleted fragrance family', item?.name || id)
      },

      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })
        get().log('Updated order status', `${id} → ${status}`)
      },

      updatePaymentStatus: (id, paymentStatus) => {
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, paymentStatus } : o)),
        })
        get().log('Updated payment status', `${id} → ${paymentStatus}`)
      },

      updateReviewStatus: (id, status) => {
        set({
          reviews: get().reviews.map((r) => (r.id === id ? { ...r, status } : r)),
        })
        get().log('Updated review status', `${id} → ${status}`)
      },

      upsertCoupon: (coupon) => {
        const exists = get().coupons.some((c) => c.id === coupon.id)
        set({
          coupons: exists
            ? get().coupons.map((c) => (c.id === coupon.id ? coupon : c))
            : [coupon, ...get().coupons],
        })
        get().log(exists ? 'Updated coupon' : 'Created coupon', coupon.code)
      },

      deleteCoupon: (id) => {
        const item = get().coupons.find((c) => c.id === id)
        set({ coupons: get().coupons.filter((c) => c.id !== id) })
        get().log('Deleted coupon', item?.code || id)
      },

      upsertCampaign: (campaign) => {
        const exists = get().campaigns.some((c) => c.id === campaign.id)
        set({
          campaigns: exists
            ? get().campaigns.map((c) => (c.id === campaign.id ? campaign : c))
            : [campaign, ...get().campaigns],
        })
        get().log(exists ? 'Updated campaign' : 'Created campaign', campaign.name)
      },

      upsertBanner: (banner) => {
        const exists = get().banners.some((b) => b.id === banner.id)
        set({
          banners: exists
            ? get().banners.map((b) => (b.id === banner.id ? banner : b))
            : [banner, ...get().banners],
        })
        get().log(exists ? 'Updated banner' : 'Created banner', banner.title)
      },

      deleteBanner: (id) => {
        const item = get().banners.find((b) => b.id === id)
        set({ banners: get().banners.filter((b) => b.id !== id) })
        get().log('Deleted banner', item?.title || id)
      },

      updateMessageStatus: (id, status) => {
        set({
          messages: get().messages.map((m) => (m.id === id ? { ...m, status } : m)),
        })
        get().log('Updated inquiry status', `${id} → ${status}`)
      },

      upsertCity: (city) => {
        const exists = get().shippingCities.some((c) => c.id === city.id)
        set({
          shippingCities: exists
            ? get().shippingCities.map((c) => (c.id === city.id ? city : c))
            : [...get().shippingCities, city],
        })
        get().log(exists ? 'Updated shipping city' : 'Added shipping city', city.city)
      },

      updateSettings: (patch) => {
        set({ settings: { ...get().settings, ...patch } })
        get().log('Updated store settings', 'Store settings')
      },

      resetDemoData: () => {
        set({
          products: seedProducts,
          categories: seedCategories,
          families: seedFamilies,
          orders: seedOrders,
          customers: seedCustomers,
          reviews: seedReviews,
          coupons: seedCoupons,
          campaigns: seedCampaigns,
          banners: seedBanners,
          subscribers: seedSubscribers,
          messages: seedMessages,
          shippingCities: seedCities,
          settings: seedSettings,
          activityLogs: seedLogs,
        })
      },
    }),
    { name: 'mushk-admin-data' },
  ),
)
