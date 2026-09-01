# System / Generation Prompt: Premium Saxophonist Events Portfolio Website

You are a world-class UI/UX designer and frontend engineer. Your task is to build a premium, highly aesthetic portfolio and booking website for a professional saxophonist who performs at weddings, corporate galas, private events, and high-end lounges.

---

## 🛠 Tech Stack & Delivery Rules
- **Core:** Single-page application using modern HTML5 and vanilla JavaScript (for animations, interactions, and media).
- **Styling:** Premium vanilla CSS (or Tailwind CSS if requested, but defaulting to modern CSS with custom variables for full styling control). No generic UI libraries (like Bootstrap).
- **Icons:** Inline SVG icons only (from Lucide or Heroicons). Do **NOT** use emojis for icons.
- **Images/Media:** Use high-quality placeholder image links or mock music player interfaces.
- **SEO & Socials:** Include comprehensive meta tags, open-graph cards, a single `<h1>`, semantic elements, and unique IDs for interactive elements.

---

## 🎨 Design System (Classic Elegant - UI/UX Pro Max)
Implement a design that immediately communicates prestige, elegance, and soul.

### 1. Typography (Classic Elegant)
- **Heading Font:** *Playfair Display* (Imported from Google Fonts) - elegant, editorial, luxury feel.
- **Body Font:** *Inter* or *Poppins* (Imported from Google Fonts) - highly readable, modern, clean.
- **Google Fonts Import:**
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
  ```
- **CSS Hierarchy:**
  - Base body: `font-family: 'Inter', sans-serif; line-height: 1.6; color: var(--text-color);`
  - Headings: `font-family: 'Playfair Display', serif; font-weight: 700; color: var(--primary-color);`

### 2. Color Palette (Luxury Premium)
Use a refined color scheme reflecting a premium performance ambiance (dim-lit lounges, gold saxophones, stage spotlights).
- **Primary (Dominant Dark):** `#1C1917` (Stone-900 / Deep Charcoal)
- **Secondary (Soft Contrast):** `#44403C` (Stone-700 / Warm Slate)
- **Accent/CTA (Luxurious Gold):** `#CA8A04` or `#D4AF37` (Classic Gold)
- **Background (Soft Warm White):** `#FAFAF9` (Stone-50)
- **Text (Readable Dark):** `#0C0A09` (Stone-950)
- **Borders:** `#E7E5E4` (Stone-200)

### 3. Key Effects & Micro-interactions
- **Glassmorphism:** Use translucent backdrops for navigation overlays (`background: rgba(28, 25, 23, 0.85); backdrop-filter: blur(10px);`).
- **Smooth Hover Transitions:** All clickable elements must transition smoothly over `200ms` using `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Button Micro-animation:** On hover, primary CTA button scale should increase slightly (`scale: 1.02`), with a subtle gold glow box shadow. No sudden layout shifts.
- **Scroll Fade-in:** Use Intersection Observer API in JavaScript to fade/slide sections into view as the user scrolls.

---

## 📑 Website Sections & Architecture
The single-page website must contain the following structural sections:

1. **Header / Navigation:**
   - Floating glassmorphism header with a subtle logo (e.g., stylized monogram or minimalist sax icon SVG).
   - Navigation links: `About`, `Services`, `Gallery`, `Testimonials`, `Contact`.
   - Action Button: CTA booking link (`Book Saxophonist`).

2. **Hero Section (First Impression):**
   - High-impact header: "Elevating Your Events with the Soulful Sound of the Saxophone".
   - Subtitle: "A bespoke live music experience for weddings, corporate galas, and private gatherings."
   - Dual CTAs: Primary ("Book for Your Event") and Secondary ("Listen to Performance").
   - A stunning backdrop representing a live stage spotlight or saxophone closeup.

3. **Artist Bio / About Section:**
   - Clean columns splitting a professional portrait card and biographical text.
   - List of genres: Jazz, Soul, Pop, Deep House, Ambient Lounge, Classical.

4. **Services / Event Types:**
   - 3-card grid (Weddings, Corporate Gatherings, Private Events).
   - Each card has custom hover states (slight shadow depth lift, gold accent border reveal).
   - Include what is provided: Sound system, wireless mic, customizable setlist.

5. **Live Performance Showcase (Gallery / Media):**
   - A mock audio player allowing clients to sample tracks (Play/Pause states, custom styling, timeline scrubber, track selection).
   - A video gallery grid with customized thumbnail overlays and play overlay icon buttons.
   - Lightbox overlay for viewing performance images.

6. **Social Proof (Testimonials):**
   - Interactive review slider/carousel featuring client names, dates, event locations, and stars.
   - Clean, italicized text to show the emotional resonance of the music.

7. **Bespoke Booking Form (Contact):**
   - Highly accessible fields: Name, Email, Event Type, Date, Venue/Location, Special Requests.
   - Inputs highlight with a gold ring focus state.
   - "Submit Booking Inquiry" button with loading/disabled state transition upon submission.

---

## ⚡ Accessibility (A11y) & UX Integrity (UI/UX Pro Max Checklist)
Ensure the developer checks off every item on the UI/UX checklist:
- [ ] **Touch Targets:** Interactive elements must be at least `44x44px` on mobile screens.
- [ ] **Contrast:** Ensure all text passes WCAG AA contrast (minimum 4.5:1 ratio).
- [ ] **No Emojis:** Do not use emoji icons (e.g., 🎷, 📅, ✉️). Use SVG paths.
- [ ] **No Layout Shifts:** Hover animations must not alter width/height or shift adjacent text.
- [ ] **Responsive Design:** Completely fluid layout scaling from 375px (mobile-first) to 1440px+ screens.
- [ ] **Keyboard Nav:** Focus indicators (`outline` or gold box-shadow ring) visible during tab navigation.

---

## 📂 Client Details Integration (`details.html`)
The website needs to load personalized information from a client configuration file, `details.html`, which will be located in the project's root folder.

### Expected structure of `details.html`:
```html
<div id="saxophonist-details">
    <span id="cfg-artist-name">Dominic Vance</span>
    <span id="cfg-tagline">Soulful Saxophone Performances for Exclusive Occasions</span>
    <span id="cfg-email">bookings@dominicvancesax.com</span>
    <span id="cfg-phone">+1 (555) 987-6543</span>
    <span id="cfg-location">Los Angeles, CA</span>
    <div id="cfg-services">
        <p data-type="Wedding">Ceremony, cocktail hour, reception sets with backing tracks.</p>
        <p data-type="Corporate">Upscale ambient lounge, networking mixers, and gala openers.</p>
        <p data-type="Private">Intimate birthday soirées, anniversary dinners, and garden parties.</p>
    </div>
</div>
```

### Action for JavaScript:
Write a JS function that executes on window load:
1. Fetches `details.html`.
2. Parses the elements inside `#saxophonist-details`.
3. Dynamically injects the artist's name, email, phone, location, and service descriptions into their corresponding sections in the main portfolio webpage.
4. If fetching `details.html` fails, gracefully fallback to default mock details, log an error to console, and display no broken elements to the user.
