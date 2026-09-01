# Harold Trinidad | Professional Saxophonist Portfolio & Booking System

> **Making Your Special Day Even More Memorable with Live Saxophone Music**

A state-of-the-art, high-performance web portfolio and booking application for **Harold Trinidad**, renowned professional saxophonist based in Pampanga, Philippines. Built with a zero-framework, high-velocity web architecture, responsive glassmorphism UI, client recommendations showcase, dynamic deposit calculator, and an integrated visual CMS Admin Panel.

---

## ✨ Features

- 🎷 **15 YouTube Performance Video Repertoire**: Responsive 16:9 embedded video showcase featuring top covers like *"Through The Years"*, *"Binibini"*, *"Make It With You"*, and *"A Perfect Christmas"*.
- 💬 **Client Recommendations Showcase**: Interactive Facebook review screenshots grid with swipe-enabled mobile carousel and full-screen lightbox image zoom.
- 📱 **Mobile-First Responsive Elevation**: Touch-optimized layout down to 375px mobile viewports, persistent mobile sticky bottom CTA bar, and glassmorphic slide-out drawer navigation.
- 💰 **2026 Rate Sheets & Deposit Calculator**: Built-in pricing calculator enforcing Harold Trinidad's official **Package A (₱8,500)** and **Package B (₱5,500)** 30% reservation downpayment policy.
- ⚙️ **Visual CMS Admin Panel (`admin.html`)**: Integrated visual content management dashboard for editing rates, contact details, video lists, and client reviews with live `localStorage` persistence and one-click `config.js` export.
- 🚀 **Automated GitHub Actions Deployment**: Continuous Deployment pipeline (`.github/workflows/deploy.yml`) that publishes updates to **GitHub Pages**.

---

## 🛠️ Technology Stack

- **Markup & Layout**: HTML5, Semantic Elements, WAI-ARIA Accessibility
- **Design System & Styling**: CSS3 Custom Tokens, Modern `clamp()` Fluid Typography, Glassmorphism, CSS Grid & Flexbox
- **Scripting & Interactivity**: Vanilla JavaScript (ES6+), DOM Parser API, Intersection Observer API
- **Configuration**: Centralized `config.js` Data Store with `localStorage` fallback
- **Hosting & CI/CD**: GitHub Pages & GitHub Actions Workflow

---

## 🚀 Local Development

Simply serve the repository folder using any HTTP server:

```bash
# Python built-in HTTP server
python -m http.server 8080
```

Open `http://localhost:8080` in your web browser.

- **Main Website**: `http://localhost:8080/index.html`
- **Visual Admin Panel**: `http://localhost:8080/admin.html`

---

## ⚙️ Maintenance & Content Updates

You can update performance videos, package rates, contact details, profile photo, and client review screenshots using either:

1. **Visual Admin Panel**: Open `admin.html`, edit any section, and click **"Save Changes Live"** (or **"Download Updated config.js"** to update your project files).
2. **Centralized Config File**: Open `config.js` directly in any code/text editor to update the `window.SITE_CONFIG` object.

---

## 📜 License

Copyright © 2026 Harold Trinidad. All rights reserved.
