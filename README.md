# Minaret Engineering Website

Premium real estate development and engineering website built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and a lightweight Sanity-ready content structure.

## Project Structure

```text
minaret-website/
  app/
    about/page.tsx
    admin/page.tsx
    gallery/page.tsx
    blog/page.tsx
    contact/page.tsx
    projects/page.tsx
    services/page.tsx
    globals.css
    layout.tsx
    page.tsx
  components/
    sections/
      about-preview.tsx
      contact-cta.tsx
      featured-projects.tsx
      hero.tsx
      sister-companies.tsx
      stats-band.tsx
      testimonials.tsx
    ui/
      animated-section.tsx
      navigation.tsx
      site-footer.tsx
  data/
    content.json
    site.ts
  lib/
    utils.ts
  public/
    assets/
      copied images and logos from the existing real-estate project
  sanity/
    client.ts
    schemaTypes.ts
  types/
    index.ts
```

## Run Locally

```bash
npm install
npm run dev
```

Open the site at:

```text
http://127.0.0.1:3000
```

## Admin Panel

For the admin panel on this Windows setup, use the production server. It avoids stale dev chunks such as `missing required error components`.

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
```

Then open:

```text
http://127.0.0.1:3000/admin
```

The admin area is intentionally not shown in the public navigation. Open it by typing `/admin` in the browser address bar.

Generate local administrator credentials using:

```bash
node scripts/hash-admin-password.mjs "your-strong-password"
```

Copy the generated `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` into `.env.local`, then restart the server. The admin session uses a signed HTTP-only cookie and the password is stored as a salted `scrypt` hash, not plain text.

In local development, you can also update the admin username, password, and secure-cookie setting from the admin dashboard under the **Profile** tab. For production environments, updates are managed securely via host-level configurations (e.g., `/etc/minaret/minaret.env`).

For local `http://127.0.0.1:3000` keep this in `.env.local`:

```text
ADMIN_COOKIE_SECURE=false
```

For a real HTTPS deployment, set:

```text
ADMIN_COOKIE_SECURE=true
```

If you previously had `npm run dev` open and see a chunk error, stop the old terminal with `Ctrl + C`, run the two commands above, then hard refresh the browser with `Ctrl + F5`.

From the admin panel you can edit:

- Website text, phone numbers, email, and logo path
- Projects, project status, specs, main images, and project gallery images
- Public gallery page title, description, categories, and images
- Sister company placeholder names and descriptions
- Homepage stats, testimonials, services, and blog preview items

Uploaded images are saved to:

```text
public/uploads
```

Content edits are saved to:

```text
data/content.json
```

## Content Notes

- Logo files were copied unchanged into `public/assets`.
- Existing project names and apartment specs from the previous site are preserved in `data/content.json`.
- Sister companies are editable placeholders in `data/content.json`.
- Sanity API/schema stubs are included and can be activated by adding the environment variables in `.env.local`. A full Sanity Studio can be added later if needed.
