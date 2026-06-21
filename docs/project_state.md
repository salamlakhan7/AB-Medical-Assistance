# Project State

Last reviewed: Phase 12A GitHub readiness audit.

## Summary

AB Medical Assistance is a full-stack Django and React application for a pharmacy-style medical assistance workflow. It supports customers, owners, and admins with role-based access, product catalog management, carts, checkout, orders, feedback, inventory, product images, and a rule-based recommendation assistant.

## Current Routes

| Route | Purpose | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/products` | Product catalog | Public |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/logout` | Logout | Authenticated users |
| `/cart` | Cart and checkout | Customer |
| `/orders` | Order history and detail | Customer |
| `/ai-assistant` | Recommendation assistant | Customer |
| `/owner-dashboard` | Owner dashboard | Owner/Admin |

## Backend Apps

```text
accounts      Custom users, roles, auth APIs
products      Categories, products, stock, images
carts         Active carts and cart items
orders        Checkout, orders, order items, status updates
feedback      Product feedback after purchase
ai_assistant  Symptom sessions and recommendation logs/items
dashboard     Owner/admin analytics APIs
```

## Database Models

- `accounts.User`
- `products.Category`
- `products.Product`
- `carts.Cart`
- `carts.CartItem`
- `orders.Order`
- `orders.OrderItem`
- `feedback.Feedback`
- `ai_assistant.SymptomSession`
- `ai_assistant.RecommendationLog`
- `ai_assistant.RecommendationItem`

## API Surface

Authentication:

```text
POST /api/auth/register/
POST /api/auth/login/
POST /api/auth/logout/
POST /api/auth/token/refresh/
GET  /api/auth/me/
```

Products:

```text
GET    /api/categories/
GET    /api/products/
POST   /api/products/
GET    /api/products/{id}/
PATCH  /api/products/{id}/
DELETE /api/products/{id}/
```

Cart:

```text
GET    /api/cart/
POST   /api/cart/items/
PATCH  /api/cart/items/{id}/
DELETE /api/cart/items/{id}/
DELETE /api/cart/clear/
```

Orders:

```text
POST  /api/orders/
GET   /api/orders/
GET   /api/orders/{id}/
PATCH /api/orders/{id}/status/
```

Recommendations:

```text
POST /api/recommendations/
GET  /api/recommendations/
GET  /api/recommendations/{id}/
```

Dashboard:

```text
GET /api/dashboard/analytics/
GET /api/dashboard/recommendations/
```

Feedback:

```text
POST /api/feedback/
GET  /api/feedback/
GET  /api/feedback/product/{product_id}/
```

## Implemented Workflows

Customer:

- Register and login
- Browse products
- View product details and feedback
- Request recommendations
- Emergency symptom blocking
- No-match recommendation handling
- Add products to cart
- Update cart quantities
- Checkout
- View order history/detail
- Submit feedback for purchased products

Owner/Admin:

- Login
- View dashboard analytics
- Create, edit, soft-delete products
- Upload product images
- Update inventory and low-stock thresholds
- View orders
- Update order status
- View feedback
- View AI analytics

Security:

- JWT authentication
- Role-based backend permissions
- Protected frontend routes
- Scoped throttling for login and recommendations
- CORS configuration
- Environment-based settings
- Production-safe `DEBUG=False` default

## AI Recommendation System

The assistant is rule-based. It does not call an external LLM.

Emergency keywords block recommendations and return an emergency warning. Normal recommendations map symptom keywords to active product categories and recommend only active products stored in the database.

Current category mappings:

- Analgesic: headache, fever, pain, migraine
- Respiratory: cough, cold, sore throat, congestion
- Rehydration: dehydration, diarrhea, vomiting, electrolyte

## Inventory And Media

Product inventory fields:

- `stock_quantity`
- `low_stock_threshold`

Checkout validates stock and reduces quantity.

Product image uploads use Django media storage:

```text
backend/media/
```

Media files are ignored by Git and should be stored in persistent production storage.

## Environment Configuration

The backend uses environment variables for:

- secret key
- debug mode
- allowed hosts
- database engine
- PostgreSQL settings
- CORS
- CSRF trusted origins
- JWT lifetimes
- throttle rates
- security settings

See:

```text
backend/.env.example
```

## GitHub Readiness Notes

Ready:

- `.env.example` exists
- backend requirements are present
- frontend package manifest is present
- root README now documents setup and deployment notes
- root `.gitignore` excludes local secrets, databases, media, dependencies, and build output

Needs attention before public release:

- Remove local generated files from any future Git index if already tracked
- Add a license file
- Add screenshots if desired
- Add API docs or OpenAPI schema
- Add CI workflow for tests/build
- Add browser E2E tests

## Known Local Artifacts

These exist locally and should not be committed:

```text
backend/db.sqlite3
backend/media/
frontend/node_modules/
frontend/dist/
```

## Current Readiness Estimate

- Portfolio readiness: high
- Public GitHub readability: good after Phase 12A docs
- Production deployment readiness: moderate
- Remaining production work: deployment scripts, media storage, CI, monitoring, and full browser test coverage
