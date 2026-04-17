# TioraS Fashions Platform

A premium, modern eCommerce and Custom Design Studio built for rapid deployment and visually stunning user experiences.

## 🚀 Architecture

TioraS Fashions operates as a Monorepo comprised of three distinct micro-services:

- **`apps/web`**: The frontend playground natively built with React, Vite, and TailwindCSS prioritizing app-like mobile flow and visually arresting UI.
- **`apps/api`**: An Express.js backend acting dynamically to handle dynamic coupon computations, Razorpay security bridges, and AI Server-Sent-Events formatting.
- **`apps/pocketbase`**: An embedded lightweight Go database acting as the persistent record engine.

## 🌟 Key Features

- **Strict Prepaid Order Pipeline:** All Cash-On-Delivery logic is removed. Fully integrated directly with Razorpay SDK endpoints making order completion seamless and robust.
- **Mobile-First Design Canvas:** Embedded Fabric.js tooling dynamically locks scaling via custom `ResizeObserver` math while overriding native mobile touch-scrolling.
- **Dynamic Logistics Engine:** Connects and maps delivery boundaries returning accurate Tiered costs based on Zip/Pincodes.
- **Dynamic Pricing Engine:** Calculates complex cost values natively factoring in quantities and color multipliers with automatic tiered invoice PDF generation.

## 💻 Tech Stack

- Frontend: React 18, Tailwind CSS, shadcn/ui, Framer Motion
- State Management: React Hooks & Context API
- Backend: Node.js, Express.js
- Database: PocketBase
- Hosting Target: Hostinger / Local

## 📦 Setup & Development

To run this project locally:

1. Validate you are running Node `v18+`.
2. Execute dependency fetch dynamically from the parent root:
   ```bash
   npm install
   ```
3. Initialize the frontend client web server mapping:
   ```bash
   npm run dev --prefix apps/web
   ```

## 🔒 License

Proprietary & Confidential software developed for TioraS Fashions. Do not duplicate or distribute without explicit authorization.
