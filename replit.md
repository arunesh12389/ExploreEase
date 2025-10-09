make a mern stack based
Web platform for the 'VIT college' community featuring local guides to attractions, businesses, and services. Offers categorized listings, cost estimates, navigation, event alerts, and peer-verified student reviews for trusted, responsive access.
ExploreEase– Your Local Guide
A smart, web-based trip planning and local discovery platform designed for VIT-AP University students and the local community.
It helps users discover attractions, services, restaurants, and events, while offering verified reviews, trip cost estimation, vehicle rentals, and trending picks.

🚀 Features
✅ Login & Authentication

Separate login for VIT-AP students (via university email) and public users (via Google).
Verified student reviews to avoid fake ratings.
✅ Attractions & Services Guide

Categorized listings of businesses, restaurants, services, and tourist spots.
Reviews and ratings (general + student-only).
✅ Trip Planning & Estimation

Plan trips by selecting days and group size.
Suggests places, calculates distance, cost, and navigation routes.
Auto-suggests vehicle type (bike, car, van).
✅ Vehicle Rentals

Vehicle owners can register their vehicles for rent.
Admin verification for authenticity.
Direct booking with owners.
✅ Offers & Discounts

Live updates on discounts from restaurants, malls, shops, and services.
✅ Trending Picks

Weekly Top 5 places visited by VIT-AP students.
✅ Map Integration

Integrated with Google Maps API for routes and navigation.
🛠 Tech Stack
Frontend: React.js, Tailwind CSS
Backend: Node.js / Express.js
Database:MongoDB
Authentication: Google OAuth + University Email Domain Check
APIs: Google Maps API, Social Media APIs
Deployment: Docker + Cloud (AWS / Vercel / Netlify)
use jsx for files






# ExploreEase - Local Guide Platform for VIT-AP University

## Overview

ExploreEase is a location-based discovery platform designed for VIT-AP University students and visitors. The application helps users explore local attractions, restaurants, cafes, services, events, and rental vehicles. It features student-verified reviews, trip planning capabilities, and special offers from local businesses.

The platform emphasizes trust through verification (student email domains), discovery through visual browsing, and seamless navigation. It draws design inspiration from Airbnb's discovery experience, Google Maps' location-centric approach, Notion's clean planning interface, and Instagram's visual storytelling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React 18+ with TypeScript
- Vite as build tool and development server
- Wouter for client-side routing (lightweight React Router alternative)
- TanStack Query (React Query) for server state management and caching

**UI Component System:**
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design system
- CSS variables for theming (light/dark mode support)
- Custom color palette with HSL values for brand identity (primary blue, secondary green, accent orange)
- Typography: Inter font family for general use, JetBrains Mono for numbers/pricing

**State Management:**
- Context API for authentication state (AuthContext)
- Context API for theme management (ThemeProvider)
- TanStack Query for all server data with aggressive caching (staleTime: Infinity)
- Local storage for user session persistence

**Key Design Patterns:**
- Component composition with Radix UI primitives
- Custom hooks for reusable logic (use-mobile, use-toast)
- Query key-based data fetching
- Optimistic UI updates with mutation callbacks

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- HTTP server for both API and static file serving
- Development middleware: Vite HMR integration, error overlay, Replit-specific plugins

**API Structure:**
- RESTful endpoints under `/api` prefix
- Route handlers in `server/routes.ts`
- In-memory storage implementation (IStorage interface)
- Session-based authentication (no session middleware currently visible, but bcrypt password hashing implemented)

**Key API Endpoints:**
- `/api/auth/signup` - User registration with student email detection
- `/api/auth/login` - User authentication
- `/api/places/*` - Place CRUD and discovery (trending, featured)
- `/api/reviews/*` - Review submission and retrieval
- `/api/vehicles/*` - Vehicle listings and rental management
- `/api/admin/*` - Admin verification workflows
- `/api/offers/*` - Special offers and promotions
- `/api/trips/*` - Trip planning functionality

### Data Storage

**Current Implementation:**
- In-memory storage implementation (server/storage.ts)
- IStorage interface defines data access patterns
- Data seeding on server startup (seedMemoryStorage)

**Database Schema Design (Drizzle ORM):**
The application is configured for PostgreSQL via Drizzle ORM with the following key entities:

- **Users**: Authentication, student verification (email domain), admin roles
- **Places**: Locations with categories, ratings (separate tracking for student vs. general ratings), visit counts, geolocation
- **Reviews**: User-submitted reviews with student verification flag
- **Vehicles**: Rental listings with verification status, pricing, capacity
- **Offers**: Time-limited promotions linked to places
- **Trips**: User trip planning with itineraries
- **Bookings**: Vehicle reservation tracking

**Data Relationships:**
- Users create Reviews, Vehicles, Trips
- Reviews belong to Places and Users
- Offers reference Places
- Bookings link Users to Vehicles
- Dual rating system: general ratings and student-specific ratings for trust indicators

### Authentication & Authorization

**Authentication Mechanism:**
- Email/password based authentication
- Bcrypt password hashing (10 salt rounds)
- Student verification via email domain check (@vitap.ac.in)
- User object stored in localStorage for session persistence
- No JWT/token system visible; relying on cookie-based sessions (connect-pg-simple in dependencies)

**Authorization Levels:**
- Public users: Browse content, limited interaction
- Authenticated users: Create reviews, book vehicles, plan trips
- Student-verified users: Student-verified badge, contribute to student ratings
- Admin users: Vehicle verification, content moderation

### External Dependencies

**Third-Party Services:**
- **Mappls (MapmyIndia)**: Map integration and geolocation services
  - Used in MapplsMap component for place visualization
  - API key configured via environment variable (VITE_MAPPLS_API_KEY)

**Database Provider:**
- **Neon Database**: PostgreSQL hosting via @neondatabase/serverless
  - Serverless Postgres driver optimized for edge/serverless environments
  - Connection via DATABASE_URL environment variable
  - Connection pooling handled by driver

**Development Tools:**
- **Replit-specific plugins**: Cartographer, dev banner, runtime error modal
  - Only loaded in development mode
  - Enhance development experience in Replit environment

**Key NPM Packages:**
- Drizzle ORM: Database ORM and migrations
- Zod: Schema validation (via drizzle-zod)
- date-fns: Date manipulation
- clsx & tailwind-merge: Dynamic className handling
- cmdk: Command palette component
- vaul: Drawer/bottom sheet component
- react-day-picker: Calendar component
- embla-carousel-react: Carousel functionality
- recharts: Chart rendering

**Build & Deployment:**
- esbuild for server bundling (ESM format)
- Vite for client bundling with React plugin
- Separate build outputs: dist/public (client), dist (server)
- Production mode serves pre-built static files