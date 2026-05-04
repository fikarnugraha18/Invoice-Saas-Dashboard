# 🚀 Finvo

**Simple invoicing. Clear insights.**

Finvo is a full-stack SaaS-style invoice and revenue tracking dashboard built with modern web technologies.
It simulates a real-world product with authentication, analytics, and responsive UI.

---

## 🌐 Live Demo

https://invoice-saas-dashboard.vercel.app

---

## ✨ Features

* 🔐 Authentication (JWT login & register)
* 📊 Revenue analytics dashboard
* 🧾 Create, update, delete invoices
* 🔍 Search & filter invoices (paid / unpaid)
* 📱 Fully responsive (mobile, tablet, desktop)
* ⚡ Real-time UI updates
* 💡 Clean SaaS UI (production-style)

---

## 🧠 Business Logic

* Paid invoices cannot be deleted
* Revenue calculated dynamically
* Status toggle (paid ↔ unpaid)

---

## 🛠️ Tech Stack

* **Frontend**: Next.js (App Router), React, Tailwind CSS
* **Backend**: Next.js API Routes
* **Database**: PostgreSQL + Prisma
* **Auth**: JWT

---

## ⚙️ Setup

```bash
git clone https://github.com/fikarnugraha18/Invoice-Saas-Dashboard.git
cd Invoice-Saas-Dashboard
npm install
```

---

## 🔑 Environment Variables

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

## 🚀 Deployment

Deployed on Vercel

---

## 👨‍💻 Author

Zulfikar Satya Nugraha

---

## 📌 Notes

This project demonstrates full-stack development, product thinking, and modern UI/UX practices.
