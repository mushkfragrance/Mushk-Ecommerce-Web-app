const mongoose = require('mongoose');

const shippingCitySchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    fee: { type: Number, required: true, min: 0 },
    eta: { type: String, default: '2–4 days' },
    active: { type: Boolean, default: true },
  },
  { _id: true },
);

const homepageSchema = new mongoose.Schema(
  {
    image: { type: String, default: '' },
    eyebrow: { type: String, default: 'Mushk Fragrance' },
    title: { type: String, default: 'Crafted for lasting presence' },
    subtitle: {
      type: String,
      default:
        'Discover the Mushk Fragrance collection — refined perfume oils and eau de parfum in black and gold.',
    },
    ctaPrimaryLabel: { type: String, default: 'Shop All' },
    ctaPrimaryHref: { type: String, default: '/shop' },
    ctaSecondaryLabel: { type: String, default: 'New Arrivals' },
    ctaSecondaryHref: { type: String, default: '/shop/new-arrivals' },
    shopAllImage: { type: String, default: '' },
    bestSellersImage: { type: String, default: '' },
    showBestSellersSection: { type: Boolean, default: false },
    showNewArrivalsSection: { type: Boolean, default: false },
    showFeaturedSection: { type: Boolean, default: false },
  },
  { _id: false },
);

const storeSettingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    storeName: { type: String, default: 'Mushk Fragrance' },
    tagline: { type: String, default: 'Scented in silence. Remembered forever.' },
    email: { type: String, default: 'hello@mushkfragrance.com' },
    phone: { type: String, default: '+92 300 1234567' },
    whatsapp: { type: String, default: '+923001234567' },
    address: { type: String, default: 'Lahore, Pakistan' },
    currency: { type: String, default: 'PKR' },
    freeShippingThreshold: { type: Number, default: 8000 },
    lowStockThreshold: { type: Number, default: 8 },
    announcement: { type: String, default: '' },
    about: { type: String, default: '' },
    productDeliveryText: {
      type: String,
      default: '2–4 business days in major cities. COD available.',
    },
    productReturnsText: {
      type: String,
      default: 'Unopened bottles eligible within 7 days.',
    },
    paymentMethods: {
      cod: { type: Boolean, default: true },
      online: { type: Boolean, default: false },
    },
    shippingCities: [shippingCitySchema],
    homepage: {
      type: homepageSchema,
      default: () => ({
        showBestSellersSection: false,
        showNewArrivalsSection: false,
        showFeaturedSection: false,
      }),
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('StoreSetting', storeSettingSchema);
