# 🪙 Precious Metals E-Commerce Platform

A modern e-commerce platform for selling **gold, silver, platinum, and palladium bullion** with **real-time dynamic pricing** from live market data.  
Built with **Next.js**, **Shadcn/UI**, **PostgreSQL (Docker)**, **Drizzle ORM**, **BetterAuth**, **Tailwind CSS**, and **Stripe** for secure payments.

---

## ✨ Features

- **📈 Live Metal Prices** – Automatically fetch and update product prices from metal market APIs.
- **🔒 Price Lock at Checkout** – Customers pay the price at the time of purchase.
- **💳 Secure Payments** – Integrated with [Stripe Checkout](https://stripe.com/).
- **🛒 Product Catalog** – Filter by metal type and weight, with product details and photos.
- **📦 Delivery or Pickup** – Customers can choose their preferred fulfillment option.
- **⚙️ Admin Back Office**  
  - Manage margins & pricing rules  
  - View order history  
  - Export orders to CSV
- **🔗 Webhooks for Automation** – Integrates with Make/Zapier for workflows.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/), [Shadcn/UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** PostgreSQL (Docker), [Drizzle ORM](https://orm.drizzle.team/), [BetterAuth](https://better-auth.dev/)
- **Payments:** [Stripe](https://stripe.com/)
- **Other:** Axios, Zod, Webhooks (Make/Zapier)