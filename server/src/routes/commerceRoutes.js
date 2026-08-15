const express = require('express');
const commerceController = require('../controllers/commerceController');
const { validate } = require('../middleware/validate');
const {
  orderCreateSchema,
  orderStatusSchema,
  paymentStatusSchema,
  couponSchema,
  reviewSchema,
} = require('../validators/resourceValidators');
const { protect, requireAdmin, requireCustomer, optionalAuth } = require('../middleware/auth');
const { z } = require('zod');

const router = express.Router();

router.post(
  '/orders',
  optionalAuth,
  validate(orderCreateSchema),
  commerceController.placeOrder,
);
router.post(
  '/coupons/validate',
  validate(
    z.object({
      code: z.string().min(1),
      subtotal: z.coerce.number().min(0),
    }),
  ),
  commerceController.validateCouponCode,
);
router.get('/reviews', optionalAuth, commerceController.listReviews);
router.post('/reviews', optionalAuth, validate(reviewSchema), commerceController.createReview);

router.get('/account/orders', protect, requireCustomer, commerceController.myOrders);

router.use('/admin', protect, requireAdmin());
router.get('/admin/orders/summary', commerceController.orderSummary);
router.get('/admin/orders', commerceController.listOrders);
router.get('/admin/orders/:id', commerceController.getOrder);
router.patch(
  '/admin/orders/:id/status',
  validate(orderStatusSchema),
  commerceController.changeOrderStatus,
);
router.patch(
  '/admin/orders/:id/payment-status',
  validate(paymentStatusSchema),
  commerceController.changePaymentStatus,
);
router.get('/admin/customers', commerceController.listCustomers);
router.get('/admin/coupons', commerceController.listCoupons);
router.post('/admin/coupons', validate(couponSchema), commerceController.upsertCoupon);
router.put('/admin/coupons/:id', validate(couponSchema), commerceController.upsertCoupon);
router.delete('/admin/coupons/:id', commerceController.deleteCoupon);
router.get('/admin/reviews', commerceController.listReviews);
router.patch(
  '/admin/reviews/:id',
  validate(z.object({ status: z.enum(['pending', 'approved', 'rejected']) })),
  commerceController.moderateReview,
);

module.exports = router;
