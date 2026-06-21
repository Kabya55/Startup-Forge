# StartupForge 🚀
> Connect founders, build teams, and launch the next generation of startups.

**Live Application:** [https://startup-forge-beige.vercel.app](https://startup-forge-beige.vercel.app)

**Picture**
<img width="1744" height="1211" alt="Screenshot_7" src="https://github.com/user-attachments/assets/aeac12e2-c7ff-491e-ae56-607a2ed49678" />


StartupForge is a co-founder matching and startup launchpad platform designed to connect **Founders** looking for talent and **Collaborators** (developers, designers, marketers) looking for startup opportunities. It features a complete role-based access control system (RBAC), subscription package upgrades via Stripe, social authentication via Google, and a dedicated admin command center.

---

## 🛠️ Technology Stack

### Frontend (`startup-forge`)
* **Framework:** Next.js (App Router, React 19)
* **Styling:** TailwindCSS & [Hero UI](https://heroui.com/)
* **Animations:** Framer Motion (`motion`)
* **Auth Client:** Better Auth React Client
* **Icons:** Lucide React & Gravity UI Icons

### Backend Server (`startupforge-server`)
* **Runtime:** Node.js (Express)
* **Database:** MongoDB Atlas (native MongoDB driver)
* **Payments:** Stripe API (Stripe Checkout)
* **Deployment:** Vercel Serverless

---

## ✨ Features by Role

### 💼 1. Collaborators (Talent)
* **Profile Builder:** Customize profile biography, email, avatar, and tags for professional skills.
* **Opportunity Exploration:** Search, sort, and filter startup opportunity openings by keywords, work types (e.g. remote, hybrid), commitment levels, and industries.
* **Applications Tracker:** Apply to opportunities with portfolios and cover messages. View acceptance/rejection status. Monthly limits apply to free plans.

### 🚀 2. Founders
* **Startup Register:** Formulate and register a startup profile (requires Admin approval to activate).
* **Manage Opportunities:** Post, edit, and delete opportunities for the startup.
* **Applications Management:** Review incoming collaborator applications, view profiles, and directly **Accept** or **Reject** candidates.
* **Premium Upgrades:** View subscription pricing plans and purchase growth/enterprise tiers via Stripe Checkout to lift posting limits.

### 🛡️ 3. Administrator Control Center
* **Metrics Dashboard:** Monitor live stats (Total Users, Total Startups, Total Opportunities, and Total Platform Revenue).
* **Startup Review:** Moderate newly submitted startups (Approve/Reject).
* **User Management:** View all user registrations, search by email/role, and restrict accounts (Block/Unblock).
* **Transaction Ledger:** Track all paid licenses and customer transaction IDs generated from Stripe Checkout.

---

## 📁 Project Directory Structure

```text
StartupForge/
├── startup-forge/                  # NEXT.JS FRONTEND
│   ├── public/                     # Static assets
│   └── src/
│       ├── app/                    # Routing pages (App Router)
│       │   ├── api/auth/           # Better Auth route endpoints
│       │   ├── dashboard/          # Role-based dashboard layouts
│       │   │   ├── admin/          # Admin views (Users, Startups, Payments)
│       │   │   ├── collaborator/   # Collaborator profile & views
│       │   │   └── founder/        # Founder listings & applications
│       │   ├── opportunities/      # Job board page & details
│       │   └── packages/           # Pricing plans page
│       ├── components/             # Reusable UI widgets
│       │   ├── dashboard/          # Stats tables & sidebars
│       │   └── opportunities/      # Search filter & listing cards
│       └── lib/
│           ├── auth.js             # Better Auth configuration
│           ├── auth-client.js      # Frontend Auth hook imports
│           └── core/               # Next.js API client & session helpers
│
└── startupforge-server/            # EXPRESS BACKEND API
    ├── index.js                    # Core API endpoints & middleware
    ├── vercel.json                 # Vercel deployment settings
    └── package.json                # Dependencies
```

---

## ⚙️ Configuration & Environment Setup

Create a `.env` file in both directories to configure the platform.

### Frontend Env (`startup-forge/.env`)
```env
BETTER_AUTH_SECRET=your_better_auth_secret_key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth Keys
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Databases & APIs
MONGO_DB_URI=your_mongodb_atlas_connection_string
AUTH_DB_URI=StartupForge
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_IMAGE_UPLOAD_API=your_imgbb_api_key

# Stripe publishable keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Backend Env (`startupforge-server/.env`)
```env
MONGO_DB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Getting Started (Local Run)

### 1. Start the Backend API Server
```bash
cd startupforge-server
npm install
npm start
```
The backend server will launch on `http://localhost:5000`.

### 2. Start the Next.js Frontend App
```bash
cd ../startup-forge
npm install --legacy-peer-deps
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view and test the application.
