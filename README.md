# 🚀 Invoice SaaS Dashboard

A full-stack SaaS-style invoice management dashboard built with modern web technologies.
Designed to simulate a real-world product with authentication, analytics, and responsive UI.

---

## ✨ Features

* 🔐 Authentication (JWT-based login & register)
* 📊 Revenue analytics dashboard
* 🧾 Create, update, delete invoices
* 🔍 Search & filter invoices (paid / unpaid)
* 📱 Fully responsive (mobile, tablet, desktop)
* 💡 Clean SaaS UI with modern UX
* ⚡ Real-time UI updates after actions

---

## 🧠 Business Logic

* Paid invoices cannot be deleted (real-world constraint)
* Revenue is calculated dynamically from all invoices
* Invoice status can be toggled (paid ↔ unpaid)

---

## 🛠️ Tech Stack

* **Frontend**: Next.js (App Router), React, Tailwind CSS
* **Backend**: Next.js API Routes
* **Database**: PostgreSQL + Prisma ORM
* **Auth**: JWT (cookie-based)

---

## ⚙️ Setup & Installation

```bash
git clone https://github.com/your-username/invoice-saas-dashboard.git
cd invoice-saas-dashboard
npm install
```

---

## 🔑 Environment Variables

Create `.env` or `.env.local`:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
```

---

## 🧪 Run Locally

```bash
npx prisma generate
npm run dev
```

---

## 🌐 Deployment

Deployed using **Vercel**

Make sure to:

* Add environment variables in Vercel dashboard
* Use a cloud PostgreSQL database (Neon / Supabase / Railway)

---

## 🎯 Purpose

This project was built to demonstrate:

* Full-stack development skills
* Real-world product thinking
* Clean UI/UX design
* Scalable app structure

---

## 👨‍💻 Author

Developed by Zulfikar Satya Nugraha

---

## 📌 Notes

This is not just a CRUD app —
it simulates a real SaaS product with business rules and user experience in mind.
