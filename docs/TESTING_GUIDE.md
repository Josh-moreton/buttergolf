# Testing Guide for EasyPost Integration

## Prerequisites

Before testing, ensure you have:

1. **EasyPost Account**
   - Sign up at https://www.easypost.com/
   - Get your test API key (starts with `EZTEST`)
   - Configure webhook URL

2. **Stripe Account**
   - Sign up at https://stripe.com/
   - Get your test API keys
   - Configure webhook URL

3. **Database Setup**
   - Run `pnpm db:migrate:dev --name add_shipping_models` to apply schema changes
   - This creates Order, Address models and adds shipping dimensions to Product

4. **Environment Variables**
   ```bash
   # Copy from .env.example
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   EASYPOST_API_KEY=EZTEST...
   EASYPOST_WEBHOOK_SECRET=...
   DATABASE_URL=postgresql://...
   ```

## Database Migration

### Create and Apply Migration

```bash
# From the root directory
cd /home/runner/work/buttergolf/buttergolf

# Create migration
pnpm --filter @buttergolf/db prisma migrate dev --name add_shipping_models

# Or if migration already exists
pnpm db:migrate:dev

# Verify migration
pnpm --filter @buttergolf/db prisma migrate status
```

### Migration Details

The migration adds:
- `addresses` table with user shipping addresses
- `orders` table with payment and shipping info
- `ShipmentStatus` enum (PENDING, PRE_TRANSIT, IN_TRANSIT, etc.)
- `OrderStatus` enum (PAYMENT_CONFIRMED, LABEL_GENERATED, etc.)
- New fields to `products`: length, width, height, weight
- Relations between User, Order, Product, and Address

## Testing Workflow

### 1. Local Development Setup

```bash
# Start the dev server
pnpm dev:web

# In another terminal, start ngrok for webhooks
ngrok http 3000
# Note the HTTPS URL: https://xxxx.ngrok.io
```

### 2. Configure Webhooks

**Stripe Dashboard** (https://dashboard.stripe.com/test/webhooks):
1. Create webhook endpoint: `https://xxxx.ngrok.io/api/stripe/webhook`
2. Select events: `checkout.session.completed`
3. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

**EasyPost Dashboard** (https://www.easypost.com/account/webhooks):
1. Create webhook endpoint: `https://xxxx.ngrok.io/api/easypost/webhook`
2. Select events: `tracker.created`, `tracker.updated`
3. Copy webhook secret to `EASYPOST_WEBHOOK_SECRET` (optional)

### 3. Test Order Flow

#### Step 1: Add Product with Shipping Dimensions

First, add a product with shipping dimensions:

```bash
# Using Prisma Studio
pnpm db:studio

# Or manually via API
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Titleist Pro V1 Golf Balls",
    "description": "Dozen new golf balls",
    "price": 49.99,
    "condition": "NEW",
    "categoryId": "...",
    "length": 20,
    "width": 15,
    "height": 10,
    "weight": 680
  }'
```

#### Step 2: Create Addresses

Create test addresses for buyer and seller:

```typescript
// Seller address (can be set in user profile or created on-the-fly)
const sellerAddress = {
  name: "John Seller",
  street1: "123 Main St",
  city: "San Francisco",
  state: "CA",
  zip: "94102",
  country: "US",
  phone: "415-555-0100"
}

// Buyer address (collected during checkout)
const buyerAddress = {
  name: "Jane Buyer",
  street1: "456 Oak Ave",
  city: "Los Angeles",
  state: "CA",
  zip: "90001",
  country: "US",
  phone: "310-555-0200"
}
```

**Test Addresses** (EasyPost sandbox accepts these):
```typescript
// Valid test address
{
  street1: "388 Townsend St",
  street2: "Apt 20",
  city: "San Francisco",
  state: "CA",
  zip: "94107",
  country: "US"
}

// Another valid test address
{
  street1: "1 E 161 St",
  city: "The Bronx",
  state: "NY",
  zip: "10451",
  country: "US"
}
```

#### Step 3: Create Stripe Checkout

You'll need to implement a checkout button in your product page. For testing:

```typescript
// In your product page, add a checkout button that calls:
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'your-product-id',
    // Shipping address will be collected by Stripe Checkout
  })
})

const { url } = await response.json()
window.location.href = url // Redirect to Stripe Checkout
```

#### Step 4: Complete Payment

1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Fill in shipping address
5. Complete payment

#### Step 5: Verify Order Creation

After payment, check:

1. **Stripe Webhook Log** (in your terminal):
   ```
   Stripe webhook event received: checkout.session.completed
   Creating EasyPost shipment
   Shipment created: shp_...
   Label purchased: {...}
   Order created successfully: ord_...
   ```

2. **Database** (Prisma Studio):
   ```bash
   pnpm db:studio
   ```
   - Check `orders` table for new order
   - Verify `labelUrl`, `trackingCode`, `carrier` are populated
   - Check `addresses` table for buyer/seller addresses

3. **Order Page** (http://localhost:3000/orders):
   - Should show the new order
   - Status should be "LABEL_GENERATED"
   - Tracking code should be visible
   - Download label button should work (for seller)

### 4. Test Tracking Updates

EasyPost webhooks are triggered when carrier updates tracking:

1. **In EasyPost Dashboard**, manually update tracker status
2. Check webhook log in terminal:
   ```
   EasyPost webhook event received: tracker.updated
   Order updated: {...}
   ```
3. Refresh order page - status should update

### 5. Test UI Components

#### Orders List Page

```bash
# Navigate to http://localhost:3000/orders
```

Verify:
- [ ] Orders display correctly
- [ ] Filter tabs work (All/Purchases/Sales)
- [ ] Status badges show correct colors
- [ ] Product images display
- [ ] Tracking links work
- [ ] Download label button appears for sellers

#### Order Detail Page

```bash
# Navigate to http://localhost:3000/orders/[orderId]
```

Verify:
- [ ] Full order details display
- [ ] Product information correct
- [ ] Shipping timeline shows timestamps
- [ ] Addresses display for both parties
- [ ] Download label button works (seller)
- [ ] Track package button works (buyer)
- [ ] Back navigation works

## Testing Error Scenarios

### 1. Failed Label Generation

Simulate by using invalid addresses:

```typescript
// Invalid address (missing required fields)
const badAddress = {
  street1: "",
  city: "",
  state: "XX",
  zip: "00000"
}
```

Expected behavior:
- Order still created with status "PAYMENT_CONFIRMED"
- Label fields are null
- Error logged in console
- Warning returned in webhook response

### 2. Webhook Signature Verification

Test with invalid signature:

```bash
curl -X POST http://localhost:3000/api/stripe/webhook \
  -H "stripe-signature: invalid_signature" \
  -d '{}'
```

Expected: `400 Invalid signature`

### 3. Missing Metadata

Test checkout without product metadata:

Expected:
- Webhook should return `400 Missing metadata`
- Order not created

### 4. Unauthorized Access

Test accessing another user's order:

```bash
# Try to access order you don't own
curl http://localhost:3000/api/orders/[other-users-order-id]
```

Expected: `403 Forbidden` or redirect

## Manual Testing Checklist

### Seller Flow
- [ ] Create product with shipping dimensions
- [ ] Product appears on marketplace
- [ ] Buyer completes purchase
- [ ] Order appears in "Sales" tab
- [ ] Label URL is accessible
- [ ] Can download and print label
- [ ] Label contains correct addresses
- [ ] Tracking code is visible
- [ ] Can view full order details

### Buyer Flow
- [ ] Browse products
- [ ] Complete Stripe checkout with shipping address
- [ ] Redirected to success page
- [ ] Order appears in "Purchases" tab
- [ ] Can view tracking information
- [ ] Tracking link works
- [ ] Can view shipping timeline
- [ ] Receives updates when package ships/delivers

### Admin/Platform
- [ ] All orders tracked in database
- [ ] Failed label generation logged
- [ ] Webhook events processed correctly
- [ ] No duplicate orders created
- [ ] Products marked as sold

## Performance Testing

### Load Testing

Test webhook handlers under load:

```bash
# Install artillery
npm install -g artillery

# Create test script
cat > webhook-test.yml <<EOF
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "EasyPost Webhook"
    flow:
      - post:
          url: "/api/easypost/webhook"
          json:
            id: "evt_test"
            description: "tracker.updated"
            result:
              tracking_code: "EZ1000000001"
              status: "in_transit"
EOF

# Run test
artillery run webhook-test.yml
```

Expected:
- All requests return 200 or appropriate error codes
- No 500 errors
- Response time < 1s

## Debugging Tips

### Enable Verbose Logging

Add to your webhook handlers:

```typescript
console.log('Full webhook payload:', JSON.stringify(payload, null, 2))
```

### Check EasyPost Logs

1. Go to EasyPost Dashboard > API Logs
2. View all API requests/responses
3. Check for errors in shipment creation

### Check Stripe Logs

1. Go to Stripe Dashboard > Developers > Logs
2. View webhook deliveries
3. Check for failed deliveries or errors

### Database Queries

Useful queries for debugging:

```sql
-- Check recent orders
SELECT * FROM orders ORDER BY created_at DESC LIMIT 10;

-- Check orders with failed labels
SELECT * FROM orders WHERE label_url IS NULL;

-- Check all addresses
SELECT * FROM addresses ORDER BY created_at DESC;

-- Check products with shipping dimensions
SELECT id, title, length, width, height, weight FROM products WHERE length IS NOT NULL;
```

## Common Issues

### Issue: "Missing EasyPost API key"
- **Fix**: Set `EASYPOST_API_KEY` in environment

### Issue: "No shipping rates available"
- **Fix**: Check product dimensions are set and reasonable
- **Fix**: Verify addresses are valid

### Issue: "Webhook signature verification failed"
- **Fix**: Ensure webhook secret is correct
- **Fix**: Check ngrok URL matches configured webhook URL

### Issue: "Order not appearing in UI"
- **Fix**: Check authentication is working
- **Fix**: Verify order was actually created in database
- **Fix**: Check user IDs match

### Issue: "Label URL expired or not working"
- **Fix**: EasyPost labels expire after 30 days
- **Fix**: Use EasyPost dashboard to regenerate label

## Next Steps

After successful testing:

1. **Production Setup**
   - Switch to production API keys (remove `test_` and `EZTEST` prefixes)
   - Configure production webhook URLs
   - Test with real money (small amounts)

2. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor webhook failures
   - Track successful vs failed label generation rate

3. **User Communication**
   - Implement email notifications
   - Add in-app notifications
   - Create help documentation for users

4. **Optimization**
   - Cache EasyPost rates
   - Batch label generation if needed
   - Optimize database queries
