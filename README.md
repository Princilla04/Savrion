# Savrion — Enterprise Software Solutions

A modern, full-stack corporate website and headless CMS-powered admin panel for **Savrion**, a software solutions company. Built with React, Vite, Node.js, Express, and MongoDB.

---

## ✨ Live Ports (Development)

| Service | URL | Purpose |
|---|---|---|
| 🌐 Public Website | http://localhost:5173 | Client-facing marketing site |
| 🔐 Admin Panel | http://localhost:5174 | Content management & admin tools |
| ⚙️ Backend API | http://localhost:5050 | REST API + JWT auth |

---

## 📁 Project Structure

```
Savrion/
├── savrion-website/          # Main public website (React + Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── routes/           # React Router config
│   │   ├── services/         # API communication layer
│   │   └── styles/           # Global CSS + design tokens
│   └── .env                  # VITE_API_URL=http://localhost:5050/api
│
├── admin-panel/
│   ├── frontend/             # Admin SPA (React + Vite)
│   │   ├── src/
│   │   │   ├── context/      # AuthContext (JWT state)
│   │   │   ├── layouts/      # AdminLayout with sidebar
│   │   │   ├── pages/        # Dashboard, Manage* pages
│   │   │   ├── routes/       # ProtectedRoute + AppRoutes
│   │   │   ├── services/     # API service modules
│   │   │   └── styles/       # Admin-specific CSS
│   │   └── .env              # VITE_API_URL=http://localhost:5050/api
│   │
│   └── backend/              # Express REST API
│       ├── config/           # DB, JWT, Multer config
│       ├── controllers/      # Route handler logic
│       ├── middleware/        # Auth, error middleware
│       ├── models/           # Mongoose schemas
│       ├── routes/           # Express router setup
│       ├── services/         # Seeder + JSON datastore fallback
│       ├── scripts/          # Seed script
│       └── .env              # PORT, MONGO_URI, JWT_SECRET
│
└── package.json              # Root orchestration scripts
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (with npm)
- **MongoDB** (optional — automatic JSON fallback if MongoDB is not running)

---

### 1. Install All Dependencies

```bash
# Install root workspace dependencies
npm install

# Install all sub-project dependencies
npm run install:all
```

Or manually:

```bash
cd savrion-website && npm install
cd ../admin-panel/frontend && npm install
cd ../admin-panel/backend && npm install
```

---

### 2. Seed the Database

```bash
npm run seed
```

This creates:
- ✅ Default admin account (`admin@savrion.com` / `SavrionAdmin2026!`)
- ✅ 6 service offerings
- ✅ 4 showcase projects
- ✅ 16 technology stack entries
- ✅ 4 client testimonials
- ✅ Hero, About, Stats, and Company website content
- ✅ 3 sample contact inquiries

---

### 3. Start Development Servers

#### Option A: Start all at once (from root)

```bash
# Terminal 1 — Backend API
npm run dev:backend

# Terminal 2 — Public Website
npm run dev:website

# Terminal 3 — Admin Panel
npm run dev:admin-frontend
```

#### Option B: Start individually

```bash
# Backend
cd admin-panel/backend && node server.js

# Public Website
cd savrion-website && npm run dev

# Admin Panel
cd admin-panel/frontend && npm run dev
```

---

## 🔐 Default Admin Credentials

```
Email:    admin@savrion.com
Password: SavrionAdmin2026!
```

> ⚠️ Change these credentials in `admin-panel/backend/.env` before deploying to production.

---

## 🌐 Public Website Pages

| Route | Description |
|---|---|
| `/` | Hero, Stats, Services preview, Testimonials |
| `/about` | Company story, Mission, Vision |
| `/services` | Full service catalogue grid |
| `/services/:slug` | Individual service detail |
| `/technologies` | Interactive tech stack by category |
| `/projects` | Portfolio / case studies grid |
| `/projects/:slug` | Project case study detail |
| `/contact` | Enquiry form (submits to backend) |

---

## 🔧 Admin Panel Modules

| Route | Description |
|---|---|
| `/` | Dashboard — KPI summary, quick actions |
| `/services` | Full CRUD for all service offerings |
| `/projects` | Full CRUD for portfolio case studies |
| `/technologies` | Manage the tech stack matrix |
| `/contacts` | Inbox for contact form submissions |
| `/testimonials` | Manage client review quotes |
| `/content` | Edit Hero, About, Company Info, Stats |

---

## ⚙️ Backend API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Admin login → returns JWT |
| `GET` | `/api/auth/me` | ✅ | Get current admin profile |

### CRUD Resources (all require Bearer JWT in `Authorization` header)
| Method | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/services` | List or create services |
| `GET/PUT/DELETE` | `/api/services/:id` | Read, update, delete service |
| `GET/POST` | `/api/projects` | List or create projects |
| `GET/PUT/DELETE` | `/api/projects/:id` | Read, update, delete project |
| `GET/POST` | `/api/technologies` | List or create technology entries |
| `GET/PUT/DELETE` | `/api/technologies/:id` | Technology operations |
| `GET/POST` | `/api/testimonials` | List or create testimonials |
| `GET/PUT/DELETE` | `/api/testimonials/:id` | Testimonial operations |
| `GET` | `/api/contact` | List inquiries (admin) |
| `POST` | `/api/contact` | Submit new inquiry (public) |
| `PATCH` | `/api/contact/:id/status` | Update inquiry status |
| `DELETE` | `/api/contact/:id` | Delete inquiry |
| `GET/PUT` | `/api/website-content` | Get or update website content |
| `GET` | `/api/dashboard/stats` | Dashboard summary stats |
| `POST` | `/api/upload` | Upload images (multipart/form-data) |

### Public Endpoints (no auth)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/services?status=active` | Public services list |
| `GET` | `/api/projects?status=active` | Public portfolio |
| `GET` | `/api/technologies?status=active` | Public tech stack |
| `GET` | `/api/testimonials?status=active` | Public testimonials |
| `GET` | `/api/website-content/public` | Public website content |
| `POST` | `/api/contact` | Submit contact form |
| `GET` | `/api/health` | Health check |

---

## 🛡️ MongoDB Fallback

If MongoDB is **not running**, the backend automatically falls back to a **local JSON file datastore** in `admin-panel/backend/data/`. All API endpoints continue to function normally. The system logs which mode it is running in on startup.

```
[DB] MongoDB connected successfully
     — or —
[DB] MongoDB unavailable. Using JSON file datastore fallback.
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Cyan | `#00AEA9` |
| Dark Background | `#010101` |
| Card Background | `#0D0D0D` |
| Border | `rgba(255,255,255,0.08)` |
| Font (Headings) | Outfit |
| Font (Body) | Inter |

All tokens are defined in:
- `savrion-website/src/styles/variables.css`
- `admin-panel/frontend/src/styles/variables.css`

---

## 🏗️ Building for Production

```bash
# Build public website
cd savrion-website && npm run build

# Build admin panel
cd admin-panel/frontend && npm run build
```

Outputs go to their respective `dist/` folders. Serve the backend with a process manager like `pm2`:

```bash
cd admin-panel/backend && pm2 start server.js --name savrion-api
```

---

## 🔒 Environment Variables

### Backend (`admin-panel/backend/.env`)

```env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/savrion
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
ADMIN_NAME=Savrion Administrator
ADMIN_EMAIL=admin@savrion.com
ADMIN_PASSWORD=SavrionAdmin2026!
NODE_ENV=development
```

### Website (`savrion-website/.env`)

```env
VITE_API_URL=http://localhost:5050/api
VITE_SERVER_URL=http://localhost:5050
```

### Admin Frontend (`admin-panel/frontend/.env`)

```env
VITE_API_URL=http://localhost:5050/api
VITE_SERVER_URL=http://localhost:5050
VITE_WEBSITE_URL=http://localhost:5173
```

---

## 📄 License

© 2026 Savrion. All rights reserved.
