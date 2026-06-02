# Finvo

Simple invoicing. Clear insights.

Finvo is a full-stack SaaS-style invoice and revenue tracking dashboard built with modern web technologies.

Designed to simulate a real-world business product, Finvo combines authentication, invoice management, analytics, and responsive user experience in a production-style application.

---

## Live Demo

https://invoice-saas-dashboard.vercel.app

---

## Key Features

🔐 Authentication (JWT Login & Register)

📊 Revenue Analytics Dashboard

🧾 Invoice Management (Create, Update, Delete)

🔍 Search & Filter (Paid / Unpaid)

📱 Responsive Across Desktop, Tablet, and Mobile

⚡ Dynamic UI Updates

💡 Modern SaaS-style Interface

---

## Business Rules

* Paid invoices cannot be deleted
* Revenue metrics are calculated dynamically
* Invoice status can be updated (Paid ↔ Unpaid)
* Dashboard reflects current invoice state

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* Tailwind CSS

### Backend

* Next.js API Routes

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* JWT

---

## Application Flow

User Authentication
↓
Dashboard Overview
↓
Invoice Management
↓
Revenue Calculation
↓
Database Persistence

---

## Core Functionality

* Secure login and registration
* Invoice CRUD operations
* Revenue analytics
* Filtering and search
* Responsive dashboard experience
* Database-driven state management

---

## Quick Start

Clone repository

```bash
git clone https://github.com/fikarnugraha18/Invoice-Saas-Dashboard.git
```

Install dependencies

```bash
npm install
```

Setup environment variables

```env
DATABASE_URL=
JWT_SECRET=
```

Generate Prisma Client

```bash
npx prisma generate
```

Run locally

```bash
npm run dev
```

---

## Deployment

Deployed on Vercel

---

## What This Project Demonstrates

* Full Stack Development
* Product Thinking
* Authentication & Authorization
* Relational Database Design
* Dashboard Architecture
* Responsive UI Development
* Modern SaaS Application Patterns
