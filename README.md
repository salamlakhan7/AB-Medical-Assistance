# AB Medical Assistance

AB Medical Assistance is a full-stack medical assistance and pharmacy workflow prototype. It includes product catalog management, customer cart and checkout, order tracking, feedback, owner analytics, and a rule-based medicine recommendation assistant that recommends only products stored in the application database.

This project is intended for academic/FYP demonstration and local development. It is not a medical device and should not be used as a substitute for professional medical advice.

## Features

- Customer registration, login, JWT authentication, and logout
- Role-based access for customers, owners, and admins
- Public product catalog with categories, stock status, and product images
- Owner product management with create, edit, soft delete, image upload, and inventory controls
- Customer cart with stock validation
- Checkout that creates orders and reduces product stock
- Customer order history and order detail page
- Owner order table with status updates
- Product feedback after purchase
- Rule-based AI recommendation assistant
- Emergency symptom detection that blocks product recommendations
- Owner dashboard analytics
- AI recommendation analytics
- SQLite development database
- PostgreSQL-ready production configuration through environment variables

## Tech Stack

Backend:
- Django
- Django REST Framework
- SimpleJWT
- SQLite for development
- PostgreSQL-ready production settings

Frontend:
- React
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Lucide React

## Project Structure

```text
AB-Medical-Assistance/
├─ backend/
│  ├─ apps/
│  │  ├─ accounts/
│  │  ├─ ai_assistant/
│  │  ├─ carts/
│  │  ├─ dashboard/
│  │  ├─ feedback/
│  │  ├─ orders/
│  │  └─ products/
│  ├─ config/
│  ├─ manage.py
│  ├─ requirements.txt
│  └─ .env.example
├─ frontend/
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.js
├─ docs/
│  └─ project_state.md
├─ .gitignore
└─ README.md
```

## Environment Variables

Copy the example file and provide local values:

```powershell
Copy-Item backend\.env.example backend\.env
```

Required backend variables include:

```text
DJANGO_SECRET_KEY=
DJANGO_DEBUG=
DJANGO_ALLOWED_HOSTS=
DB_ENGINE=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_HOST=
POSTGRES_PORT=
CORS_ALLOWED_ORIGINS=
CSRF_TRUSTED_ORIGINS=
```

SQLite is the default development database when `DB_ENGINE=sqlite`.

For production PostgreSQL, use:

```text
DB_ENGINE=postgresql
```

## Backend Setup

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:DJANGO_SECRET_KEY="replace-with-a-long-local-secret"
$env:DJANGO_DEBUG="True"
$env:DJANGO_ALLOWED_HOSTS="127.0.0.1,localhost,testserver"
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend development server:

```text
http://127.0.0.1:8000/
```

Admin:

```text
http://127.0.0.1:8000/admin/
```

## Frontend Setup

Open a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend development server:

```text
http://127.0.0.1:5173/
```

The Vite development server proxies `/api` requests to the Django backend.

## Main Routes

```text
/                  Public landing page
/products          Public product catalog
/login             Login
/register          Registration
/logout            Logout
/cart              Customer-only cart and checkout
/orders            Customer-only order history
/ai-assistant      Customer-only recommendation assistant
/owner-dashboard   Owner/admin dashboard
```

## Main API Groups

```text
/api/auth/
/api/categories/
/api/products/
/api/cart/
/api/orders/
/api/recommendations/
/api/dashboard/
/api/feedback/
```

## Media Handling

Product images are uploaded through the product APIs and stored under:

```text
backend/media/
```

The local media directory is ignored by Git. For production, use persistent media storage such as a cloud object store, platform volume, or dedicated media service. Do not commit uploaded files to the repository.

## Deployment Notes

Before production deployment:

- Set `DJANGO_SECRET_KEY` to a strong secret value.
- Set `DJANGO_DEBUG=False`.
- Configure `DJANGO_ALLOWED_HOSTS`.
- Configure `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.
- Use PostgreSQL with `DB_ENGINE=postgresql`.
- Configure persistent media storage.
- Serve frontend build output through a static host or web server.
- Run migrations on the production database.
- Review security settings for HTTPS, HSTS, cookies, and reverse proxy behavior.

This repository does not include Docker or deployment automation yet.

## Verification

Backend:

```powershell
cd backend
$env:DJANGO_SECRET_KEY="replace-with-a-long-local-secret"
$env:DJANGO_ALLOWED_HOSTS="127.0.0.1,localhost,testserver"
python manage.py check
python manage.py migrate --check
python manage.py test
```

Frontend:

```powershell
cd frontend
npm run build
```

## GitHub Release Notes

The root `.gitignore` excludes local databases, media uploads, environment files, virtual environments, `node_modules`, and frontend build output. Commit `backend/.env.example`, but never commit real `.env` files.

## License

No license file has been added yet. Add a license before public release if reuse permissions should be explicit.
