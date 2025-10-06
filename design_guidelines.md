# ExploreEase Design Guidelines

## Design Approach

**Reference-Based Approach** drawing inspiration from:
- **Airbnb**: Discovery experience, card-based listings, visual-first browsing
- **Google Maps**: Navigation integration, location-centric design
- **Notion**: Clean trip planning interface, organized content structure
- **Instagram**: Visual storytelling for trending picks and student content

**Core Principles**: Student-centric vibrancy, trust through verification, seamless discovery-to-action flow

---

## Color Palette

### Light Mode
- **Primary Brand**: 220 90% 56% (vibrant blue - energetic, trustworthy)
- **Secondary**: 142 76% 36% (green - for verification badges, success states)
- **Accent**: 24 95% 53% (warm orange - CTAs, trending indicators)
- **Background**: 0 0% 100% (pure white)
- **Surface**: 220 13% 97% (soft gray for cards)
- **Text Primary**: 222 47% 11% (dark slate)
- **Text Secondary**: 215 16% 47% (muted blue-gray)

### Dark Mode
- **Primary Brand**: 220 90% 60%
- **Secondary**: 142 70% 45%
- **Accent**: 24 90% 60%
- **Background**: 222 47% 11%
- **Surface**: 217 33% 17%
- **Text Primary**: 0 0% 98%
- **Text Secondary**: 215 20% 65%

---

## Typography

**Font Families**:
- **Headings**: 'Inter', sans-serif (700, 600 weights) - modern, readable
- **Body**: 'Inter', sans-serif (400, 500 weights)
- **Accent/Numbers**: 'JetBrains Mono', monospace - for pricing, stats

**Scale**:
- Hero: text-5xl to text-6xl (font-bold)
- Section Headers: text-3xl to text-4xl (font-semibold)
- Card Titles: text-xl (font-semibold)
- Body: text-base (font-normal)
- Captions: text-sm (font-medium)

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16, 20** for consistent rhythm
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Card gaps: gap-4, gap-6
- Margins: m-2, m-4, m-8

**Grid Patterns**:
- Desktop: max-w-7xl container with grid-cols-3 or grid-cols-4 for listings
- Tablet: grid-cols-2
- Mobile: grid-cols-1 with full-width cards

---

## Component Library

### Navigation
**Top Bar**: Sticky header with logo, search bar (prominent), category pills, auth buttons
- Height: h-16 on mobile, h-20 on desktop
- Search: Expandable with autocomplete dropdown
- Category Pills: Horizontal scroll on mobile (Museums, Food, Services, Events)

### Hero Section
**Large Visual Hero** with:
- Full-width background image showcasing VIT-AP campus/local attractions
- Gradient overlay: from-primary/80 to-primary/40
- Centered search + "Plan Your Trip" CTA
- Floating stats cards: "500+ Places", "10K+ Student Reviews", "Verified Rentals"
- Height: min-h-[60vh] on desktop, min-h-[50vh] on mobile

### Discovery Cards
**Listing Cards** (Airbnb-inspired):
- Rounded-2xl with shadow-md hover:shadow-xl transition
- Image: aspect-video with rounded-t-2xl
- Badge overlays: "Student Verified" (green), "Trending" (orange), "New" (blue)
- Content: Title (text-lg font-semibold), category, rating stars, distance indicator
- Pricing: Bottom-right with accent color background

### Trip Planning Interface
**Multi-step Form** with visual progress:
- Step indicators: Circular numbered pills with connecting lines
- Day selector: Calendar-style grid with date picking
- Group size: Icon + number stepper (bike/car/van icons auto-update)
- Cost breakdown: Accordion sections showing itemized estimates
- Map preview: Integrated Google Maps with route polylines

### Vehicle Rental Cards
**Owner Listings**:
- Split layout: Image gallery (left 60%) + details (right 40%)
- Verification badge: Green checkmark + "Admin Verified"
- Owner profile: Small circular avatar + name + rating
- Quick specs: Vehicle type icon, capacity, price/day
- "Book Now" CTA (accent color)

### Reviews Section
**Dual-tier Display**:
- Toggle tabs: "All Reviews" vs "Student Reviews Only" (with VIT-AP logo)
- Review cards: User avatar (blue ring for students), name, date, star rating
- Verified badge for students: Small green shield icon
- Photos grid: Masonry layout for user-uploaded images

### Trending Picks
**Weekly Top 5 Section**:
- Large numbered badges (1-5) in accent color
- Horizontal carousel on mobile, grid on desktop
- Each pick: Hero image, place name, visit count, quick description
- "See what's popular" heading with flame emoji

### Offers & Discounts
**Deal Cards**:
- Time-sensitive badges: "Expires in 2 days" with countdown
- Business logo + offer headline (large text)
- Discount percentage in circular badge (accent background)
- "Redeem" button with location indicator

### Map Integration
**Interactive Map View**:
- Full-screen toggle option
- Clustered markers with color coding (food=red, attractions=blue, services=green)
- Info windows: Mini cards with image, name, rating, distance
- Route overlay: Dotted lines for trip planning with distance labels

---

## Authentication UI

**Login Modal**:
- Split design: VIT-AP student (left - university blue) vs Public (right - neutral gray)
- Student: Email input with @vitap.ac.in domain validation
- Public: Google OAuth button with logo
- Smooth transition animations between states

---

## Responsive Behavior

**Mobile-First Priorities**:
- Bottom navigation bar: Home, Discover, Plan, Rentals, Profile (fixed)
- Swipeable carousels for trending and offers
- Collapsible filters with drawer animation
- Sticky search bar that hides on scroll down, shows on scroll up

**Desktop Enhancements**:
- Sidebar filters (persistent, not drawer)
- Multi-column layouts for listings (3-4 columns)
- Hover states: Card lift, image zoom, button color shifts
- Quick actions on hover: Save, share, compare buttons appear

---

## Animations

**Subtle Motion** (sparingly):
- Card hover: Gentle lift (translate-y-1) + shadow expansion (300ms)
- Page transitions: Fade in content (200ms)
- Loading states: Skeleton screens with shimmer effect
- Success states: Checkmark animation for bookings/verifications
- NO parallax, NO complex scroll-driven animations

---

## Images

### Required Images:
1. **Hero Section**: Wide-angle shot of VIT-AP campus or local landmark (1920x800px)
2. **Category Icons**: Food, Attractions, Services, Events (vector illustrations)
3. **Listing Cards**: High-quality photos of restaurants, attractions, services
4. **Vehicle Rentals**: Clear photos of bikes, cars, vans with owners
5. **Student Testimonials**: Student avatars (can use initials with colored backgrounds)
6. **Trending Picks**: Featured destination photos (1200x800px each)
7. **Offer Banners**: Business logos + promotional graphics

**Placeholder Strategy**: Use Unsplash API for demo images with VIT-AP/Amaravati/Vijayawada themed searches

---

## Trust & Verification Signals

- **Green Checkmark Badges**: For verified students, admin-approved vehicles
- **Rating Stars**: Gold/yellow filled stars with half-star support
- **Review Count**: Display prominently (e.g., "4.8 (234 reviews)")
- **Verification Icons**: Small shield/badge icons next to student content
- **Owner Profiles**: Show join date, total rentals, response time

---

## Accessibility

- WCAG AA contrast ratios for all text
- Focus states: 2px accent color ring on interactive elements
- Alt text for all images
- Keyboard navigation: Tab order follows visual flow
- Screen reader labels for icon-only buttons
- Dark mode toggle in header (persistent across sessions)