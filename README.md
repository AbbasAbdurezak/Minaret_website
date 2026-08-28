# Minaret Engineering Website - 3D Scroll Experience

Premium real estate development and engineering website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, featuring an immersive 3D scroll-based navigation experience.

## ✨ Features

### 3D Scroll Effects
- **Parallax Layers**: Multi-depth background elements that move at different speeds during scroll
- **3D Card Transformations**: Project cards with hover effects that lift and rotate in 3D space
- **Depth-Based Animations**: Elements positioned at different Z-axis depths for immersive scrolling
- **Smooth Opacity Transitions**: Sections fade naturally as users scroll through the page
- **Reduced Motion Support**: Respects user accessibility preferences automatically

### Core Components
- Responsive hero section with layered parallax backgrounds
- Animated stats band with staggered reveal
- 3D project showcase cards with hover transformations
- Sister companies display
- About preview section
- Testimonials carousel
- Contact call-to-action

## 🏗️ Project Structure

```text
minaret-website/
├── app/
│   ├── about/page.tsx
│   ├── admin/page.tsx
│   ├── gallery/page.tsx
│   ├── blog/page.tsx
│   ├── contact/page.tsx
│   ├── projects/page.tsx
│   ├── services/page.tsx
│   ├── globals.css          # 3D scroll styles & utilities
│   ├── layout.tsx
│   └── page.tsx             # Main 3D scroll container
├── components/
│   ├── sections/
│   │   ├── about-preview.tsx
│   │   ├── contact-cta.tsx
│   │   ├── featured-projects.tsx  # 3D card effects
│   │   ├── hero.tsx               # Parallax layers
│   │   ├── sister-companies.tsx
│   │   ├── stats-band.tsx
│   │   └── testimonials.tsx
│   └── ui/
│       ├── animated-section.tsx
│       ├── navigation.tsx
│       └── site-footer.tsx
├── data/
│   ├── content.json
│   └── site.ts
├── lib/
│   └── utils.ts
├── public/
│   └── assets/
├── sanity/
│   ├── client.ts
│   └── schemaTypes.ts
└── types/
    └── index.ts
```

## 🚀 Quick Start

### Run Locally

```bash
npm install
npm run dev
```

Open the site at:
```
http://127.0.0.1:3000
```

### Production Build

For the admin panel and optimal performance:

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Then open:
```
http://127.0.0.1:3000/admin
```

## 🎨 3D Scroll Architecture

### CSS Classes

The following utility classes enable 3D effects throughout the site:

| Class | Purpose |
|-------|---------|
| `.scene-container` | Sets perspective context (1200px) for 3D transforms |
| `.scroll-wrapper` | Maintains 3D transform context for child elements |
| `.depth-bg` | Background layer pushed back (-100px) for parallax |
| `.depth-mid` | Middle depth layer (default Z position) |
| `.depth-fg` | Foreground layer pushed forward (+50px) |
| `.card-3d` | Enables 3D transform on cards with hover lift effect |
| `.parallax-layer` | Absolute positioned layer optimized for transforms |

### Customization

#### Adjust Perspective Depth
Edit `app/globals.css`:
```css
.scene-container {
  perspective: 1200px; /* Increase for subtler effect, decrease for more dramatic */
}
```

#### Modify 3D Card Hover
Edit `app/globals.css`:
```css
.card-3d:hover {
  transform: translateZ(20px) rotateX(2deg) rotateY(-2deg);
}
```

#### Change Parallax Speed
Edit component files (e.g., `components/sections/hero.tsx`):
```typescript
const imageY = useTransform(scrollY, [0, 800], [0, 120]); // Adjust range for speed
```

## 🔐 Admin Panel

The admin area is hidden from public navigation. Access it by typing `/admin` in the browser address bar.

### Setup Admin Credentials

Generate secure administrator credentials:

```bash
node scripts/hash-admin-password.mjs "your-strong-password"
```

Copy the generated `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` into `.env.local`, then restart the server.

### Environment Configuration

For local development (`http://127.0.0.1:3000`):
```env
ADMIN_COOKIE_SECURE=false
```

For production (HTTPS):
```env
ADMIN_COOKIE_SECURE=true
```

### Admin Capabilities

From the admin panel you can edit:
- Website text, phone numbers, email, and logo path
- Projects, project status, specs, main images, and gallery images
- Public gallery page title, description, categories, and images
- Sister company placeholder names and descriptions
- Homepage stats, testimonials, services, and blog preview items

### File Locations

**Uploaded images:**
```
public/uploads
```

**Content edits saved to:**
```
data/content.json
```

## 📝 Content Notes

- Logo files are stored unchanged in `public/assets`
- Existing project names and apartment specs are preserved in `data/content.json`
- Sister companies are editable placeholders in `data/content.json`
- Sanity API/schema stubs are included and can be activated by adding environment variables in `.env.local`
- A full Sanity Studio can be added later if needed

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Image Optimization**: Next.js Image + Sharp
- **Form Validation**: Zod
- **Content**: JSON-based (Sanity-ready)

## 📱 Responsive Design

The 3D scroll experience adapts to different screen sizes:

- **Desktop (>760px)**: Full 3D perspective (1200px), enhanced parallax
- **Mobile (≤760px)**: Reduced perspective (800px), optimized animations
- **Reduced Motion**: Automatically disabled when user prefers reduced motion

## 🧩 Component Documentation

### Hero Section (`components/sections/hero.tsx`)
Multi-layer parallax entrance with:
- Background image layer (moves slower)
- Gradient overlays (fixed)
- Foreground content (moves faster)
- Staggered text animations

### Featured Projects (`components/sections/featured-projects.tsx`)
3D card grid with:
- Individual card hover transformations
- Image zoom on hover
- Staggered entrance animations
- Responsive grid layout

### Stats Band (`components/sections/stats-band.tsx`)
Horizontal metrics display with:
- Staggered fade-in animations
- Responsive grid (2x2 mobile, 4-across desktop)

## 🔧 Troubleshooting

### Chunk Loading Errors
If you see stale dev chunks or "missing required error components":

1. Stop the dev server (`Ctrl + C`)
2. Clear Next.js cache: `rm -rf .next`
3. Restart: `npm run dev`
4. Hard refresh browser: `Ctrl + F5`

### 3D Effects Not Working
Ensure:
- Browser supports CSS 3D transforms (all modern browsers do)
- JavaScript is enabled
- No browser extensions blocking animations

### Admin Panel Issues
For Windows setups, always use the production server for admin:
```bash
npm run build
npm run start
```

This avoids stale dev chunks that can cause admin panel errors.

## 📄 License

Proprietary - Minaret Engineering

---

**Built with ❤️ by Minaret Engineering**
