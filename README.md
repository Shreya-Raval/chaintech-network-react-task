# 🛒 E-Commerce Dashboard

A modern, full-featured E-Commerce Dashboard built with **React**, **Vite**, and **Tailwind CSS**. This project features session-based authentication, protected routing, cart management, and a polished dark-themed design system.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| [React 19](https://react.dev/) | UI library |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first CSS framework |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |
| [lucide-react](https://lucide.dev/) | Icon library |

---

## 📁 Project Structure

```
src/
├── assets/                  # Static assets (images, fonts, etc.)
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.jsx       # Button with variants & sizes
│   │   ├── Input.jsx        # Form input with label & error states
│   │   ├── Badge.jsx        # Status badges with color variants
│   │   ├── Toast.jsx        # Toast notification helpers
│   │   ├── Spinner.jsx      # Loading spinner
│   │   └── Modal.jsx        # Modal dialog with backdrop
│   └── layout/              # Layout components
│       ├── Navbar.jsx        # Top navigation bar
│       ├── Sidebar.jsx       # Side navigation panel
│       └── ProtectedRoute.jsx # Auth guard for protected pages
├── context/
│   ├── AuthContext.jsx       # Authentication state & methods
│   └── CartContext.jsx       # Shopping cart state & methods
├── hooks/
│   ├── useAuth.js            # Custom hook for AuthContext
│   └── useCart.js            # Custom hook for CartContext
├── pages/
│   ├── Login.jsx             # Login page
│   ├── Register.jsx          # Registration page
│   ├── Dashboard.jsx         # Main dashboard (protected)
│   ├── Products.jsx          # Product listing (protected)
│   ├── Cart.jsx              # Shopping cart (protected)
│   └── Profile.jsx           # User profile (protected)
├── utils/
│   ├── localStorage.js       # LocalStorage helper functions
│   └── session.js            # Session management (5-min TTL)
├── App.jsx                   # Router configuration
├── main.jsx                  # App entry point
└── index.css                 # Global styles & Tailwind directives
```

---

## 🔐 Authentication & Session Management

- **Session-based auth** using `localStorage` (no backend required)
- **5-minute TTL** — sessions automatically expire after 5 minutes of inactivity
- **ProtectedRoute** component guards all authenticated pages
- Expired sessions are auto-cleaned and users are redirected to `/login`

---

## 🗺️ Routing

| Path | Page | Access |
|---|---|---|
| `/` | Redirects to `/login` | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | 🔒 Protected |
| `/products` | Products | 🔒 Protected |
| `/cart` | Cart | 🔒 Protected |
| `/profile` | Profile | 🔒 Protected |

---

## 🎨 Design System

The app uses a custom **dark-themed** design system configured in `tailwind.config.js`:

- **Primary**: `#6366f1` (Indigo) — buttons, links, focus rings
- **Accent**: `#f59e0b` (Amber) — highlights, badges, CTAs
- **Background**: `#0f172a` — main dark background
- **Surface**: `#1e293b` — cards, panels, elevated surfaces
- **Text**: Slate scale (`slate-100` to `slate-500`)
- **Font**: [Sora](https://fonts.google.com/specimen/Sora) from Google Fonts
- **Dark Mode**: Enabled via Tailwind's `class` strategy

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/Shreya-Raval/chaintech-network-react-task.git

# Navigate to the project directory
cd chaintech-network-react-task

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The optimized output will be in the `dist/` directory.

---

## 📦 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## 🧩 Reusable UI Components

| Component | Features |
|---|---|
| `Button` | Variants: primary, secondary, accent, ghost, danger · Sizes: sm, md, lg |
| `Input` | Label, error state, forwarded ref support |
| `Badge` | Variants: default, primary, accent, success, warning, danger |
| `Modal` | Backdrop blur, Escape key close, scroll lock |
| `Spinner` | Sizes: sm, md, lg · Animated loading indicator |
| `Toast` | Success, error, loading helpers via react-hot-toast |

---

## 📄 License

This project is created as part of a task assignment for **Chaintech Network**.
