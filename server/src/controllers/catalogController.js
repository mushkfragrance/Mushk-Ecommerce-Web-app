const Product = require('../models/Product');
const Category = require('../models/Category');
const FragranceFamily = require('../models/FragranceFamily');
const { asyncHandler } = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/ApiResponse');
const { ApiError } = require('../utils/ApiError');
const { listProducts } = require('../services/productService');
const { getSettings } = require('../services/orderService');
const { logActivity } = require('../utils/activity');

const getProducts = asyncHandler(async (req, res) => {
  const result = await listProducts(req.query, { admin: false });
  sendSuccess(res, { data: result.items, meta: result.meta });
});

const getAdminProducts = asyncHandler(async (req, res) => {
  const result = await listProducts(req.query, { admin: true });
  sendSuccess(res, { data: result.items, meta: result.meta });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, status: 'active' });
  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, { data: product });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  sendSuccess(res, { data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  await logActivity({
    actorType: 'admin',
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'Created product',
    target: product.name,
  });
  sendSuccess(res, { statusCode: 201, message: 'Product created', data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  await logActivity({
    actorType: 'admin',
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'Updated product',
    target: product.name,
  });
  sendSuccess(res, { message: 'Product updated', data: product });
});

const archiveProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  product.status = product.status === 'archived' ? 'active' : 'archived';
  await product.save();
  sendSuccess(res, { message: 'Product archive toggled', data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  await logActivity({
    actorType: 'admin',
    actorId: req.user._id,
    actorName: req.user.name,
    action: 'Deleted product',
    target: product.name,
  });
  sendSuccess(res, { message: 'Product deleted' });
});

const getInventory = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  const products = await Product.find().sort({ name: 1 });
  const rows = products.flatMap((product) =>
    product.variants.map((variant) => ({
      productId: product._id,
      productName: product.name,
      size: variant.size,
      sku: variant.sku,
      stock: variant.stock,
      low: variant.stock > 0 && variant.stock <= settings.lowStockThreshold,
      out: variant.stock <= 0,
    })),
  );
  sendSuccess(res, { data: rows, meta: { lowStockThreshold: settings.lowStockThreshold } });
});

const listCategories = asyncHandler(async (req, res) => {
  const filter = req.userType === 'admin' ? {} : { status: 'active' };
  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
  sendSuccess(res, { data: categories });
});

const upsertCategory = asyncHandler(async (req, res) => {
  let category;
  if (req.params.id) {
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) throw new ApiError(404, 'Category not found');
  } else {
    category = await Category.create(req.body);
  }
  sendSuccess(res, {
    statusCode: req.params.id ? 200 : 201,
    message: 'Category saved',
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found');
  sendSuccess(res, { message: 'Category deleted' });
});

const listFamilies = asyncHandler(async (req, res) => {
  const families = await FragranceFamily.find().sort({ name: 1 });
  sendSuccess(res, { data: families });
});

const upsertFamily = asyncHandler(async (req, res) => {
  let family;
  if (req.params.id) {
    family = await FragranceFamily.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!family) throw new ApiError(404, 'Fragrance family not found');
  } else {
    family = await FragranceFamily.create(req.body);
  }
  sendSuccess(res, {
    statusCode: req.params.id ? 200 : 201,
    message: 'Fragrance family saved',
    data: family,
  });
});

const deleteFamily = asyncHandler(async (req, res) => {
  const family = await FragranceFamily.findByIdAndDelete(req.params.id);
  if (!family) throw new ApiError(404, 'Fragrance family not found');
  sendSuccess(res, { message: 'Fragrance family deleted' });
});

module.exports = {
  getProducts,
  getAdminProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  archiveProduct,
  deleteProduct,
  getInventory,
  listCategories,
  upsertCategory,
  deleteCategory,
  listFamilies,
  upsertFamily,
  deleteFamily,
};
