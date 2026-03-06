# 🛍️ ShopVault — E-Commerce Dashboard

A modern, fully-featured e-commerce dashboard built with **React**, **Vite**, and **Tailwind CSS**. Features a complete authentication system, product browsing with live API integration, cart management, user profiles, and a polished dark/light mode UI.

---

## ✨ Features

### 🔐 Authentication
- **Login & Register** pages with split-layout, glassmorphism design
- **Session management** with 5-minute TTL and auto-logout with toast
- **Demo account** seeded on first load: `demo@shopvault.com` / `demo1234`
- **Protected routes** redirect unauthenticated users to login

### 🏠 Dashboard
- Welcome banner with user name and date
- Gradient stat cards: Total Products, Cart Items, Cart Total, Profile Completeness
- Recently added to cart section with empty state
- Quick actions grid (Browse Products, View Cart, Edit Profile)
- Live session countdown timer

### 🛒 Products
- **Live API** integration with [DummyJSON](https://dummyjson.com/products)
- **Debounced search** (300ms) with category filters and sort options
- **Infinite scroll** via IntersectionObserver
- Skeleton loading (8 animated placeholders), error retry, empty state
- Product cards with image, category badge, star rating, discount badge, add-to-cart

### 🛍️ Cart
- Per-user cart storage (`shopvault_cart_{email}`)
- Quantity stepper (+/−), item subtotal, smooth remove animation
- Sticky order summary sidebar with checkout button
- Empty cart state with "Start Shopping" CTA

### 👤 Profile
- Two-tab layout: **My Profile** (avatar, stats) and **Edit Profile**
- Password change with current password verification
- Real-time password match indicator

### 🎨 Design System
- **Dark/Light mode** toggle with localStorage persistence
- Indigo + Amber color palette with custom Tailwind config
- Google Font **Sora** typography
- Entrance animations, hover effects, glassmorphism
- Fully responsive: mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |
| DummyJSON API | Product data source |

---

## 📁 Folder Structure

```
src/
├── assets/
├── components/
│   ├── ui/              # ProductCard
│   └── layout/          # Navbar, Sidebar, DashboardLayout, ProtectedRoute
├── context/
│   ├── AuthContext.jsx   # Login/register/logout/updateProfile
│   ├── CartContext.jsx    # Per-user cart with localStorage
│   └── ThemeContext.jsx   # Dark/light mode toggle
├── hooks/
│   ├── useAuth.js
│   ├── useCart.js
│   └── useProducts.js    # DummyJSON API hook
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Cart.jsx
│   ├── Profile.jsx
│   └── NotFound.jsx       # Custom 404
├── utils/
│   └── localStorage.js   # Users, sessions, per-user cart helpers
├── App.jsx
└── main.jsx
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Shreya-Raval/chaintech-network-react-task.git

# Navigate to the project
cd chaintech-network-react-task

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 Demo Credentials

| Field | Value |
|---|---|
| Email | `demo@shopvault.com` |
| Password | `demo1234` |

> The demo user is automatically created on first visit if no users exist.

---

## 📋 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🌐 Live Demo

🔗 [Live Demo](#) *(deployment link placeholder)*

---

## 📄 License

This project was built as a task for **Chaintech Network**.
