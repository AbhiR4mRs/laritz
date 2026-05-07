# La Ritz Storefront

Full-stack boutique e-commerce starter for **La Ritz** with:
- React frontend
- Django + Django REST Framework backend
- Single admin user flow
- Product/category/banner management from Django admin
- Cart and Buy Now actions redirecting to Instagram DM for now
- Responsive premium storefront inspired by the provided handcrafted luxury reference

## Stack
- Frontend: React + Vite + React Router
- Backend: Django + Django REST Framework + CORS
- Database: SQLite by default (easy to switch to PostgreSQL)

## Project Structure
- `backend/` Django API and admin
- `frontend/` React storefront

## Key Features
- Home page with hero, categories, featured products, story section
- Shop page with filters
- Product detail page
- Cart drawer/page
- Instagram DM redirect for Buy Now and Cart checkout
- Admin-only product management in Django admin

## Instagram flow
Current Instagram target:
- `https://www.instagram.com/_needle_craft`
- DM link implementation target:
  - `https://ig.me/m/_needle_craft`

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment notes
Create `.env` files later for production values such as API URL, allowed hosts, media storage, and DB credentials.

## Future upgrade path
The Instagram checkout handler is isolated in the frontend service layer so it can later be replaced with Razorpay or Stripe without rebuilding the UI.
