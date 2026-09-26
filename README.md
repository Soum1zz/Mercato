# 🛒 Mercato — Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x%2F4.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon%20DB-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?logo=razorpay&logoColor=3395FF)](https://razorpay.com/)

**Mercato** is a modern, full-stack multi-vendor e-commerce platform built with a **Spring Boot** REST backend, a **React 19** single-page frontend powered by **Vite**, and **PostgreSQL**. It supports role-based access control for Customers, Sellers, and Admins, integrated **Razorpay** checkout, and email-based OTP/password recovery flows.

---

## 📑 Table of Contents

- [Features](#-features)
  - [Customer Portal](#customer-portal)
  - [Seller Hub](#seller-hub)
  - [Admin Dashboard](#admin-dashboard)
  - [Authentication & Security](#authentication--security)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup-spring-boot)
  - [Frontend Setup](#2-frontend-setup-react--vite)
- [Environment Variables](#-environment-variables)
- [Key API Endpoints](#-key-api-endpoints)
- [Scripts](#-scripts)

---

## ✨ Features

### Customer Portal
- **Product Discovery**: Browse products with search, category filtering, detailed views, and customer reviews/ratings.
- **Cart & Wishlist**: Interactive cart management with quantity controls and wishlist bookmarking.
- **Seamless Checkout**: Embedded Razorpay payment gateway integration with server-side signature verification.
- **Order Tracking**: Detailed order history, individual order tracking, and receipt breakdowns.

### Seller Hub
- **Seller Onboarding**: Dedicated application workflow for customers to apply as verified merchants.
- **Product Management**: Create, edit, and update product catalog listings and inventory details.
- **Seller Analytics**: Overview of seller-specific orders, status updates, and review dashboards.

### Admin Dashboard
- **Seller Verification**: Review and approve or reject seller onboarding applications.
- **Catalog Moderation**: Manage product visibility and inventory across the marketplace.
- **Platform Oversight**: Centralized administration for platform users, orders, and system health.

### Authentication & Security
- **JWT Authentication**: Stateless token-based security filter chain with role-based authorization (RBAC).
- **Email OTP Verification**: Registration confirmation via automated OTP emails using JavaMailSender.
- **Password Reset Flow**: Secure token-based password reset links sent via email.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) with [React Compiler](https://react.dev/learn/react-compiler)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) (configured with auth interceptors)
- **UI & Feedback**: [React Hot Toast](https://react-hot-toast.com/), [React Icons](https://react-icons.github.io/react-icons/)

### Backend
- **Framework**: [Spring Boot](https://spring.io/projects/spring-boot) (Java 21)
- **Security**: Spring Security + JJWT (JSON Web Token)
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: PostgreSQL ([Neon Serverless](https://neon.tech/))
- **Payments**: Razorpay Java SDK
- **Mailing**: Spring Boot Starter Mail (SMTP)
- **Build Tool**: Maven (`mvnw`)

---

## 📂 Project Architecture

```
E-Com/
├── backend/
│   └── eCom/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/sou/eCom/
│       │   │   │   ├── config/          # Security, JWT filters, Scheduling, DB runners
│       │   │   │   ├── controller/      # REST API endpoints (Auth, Products, Orders, etc.)
│       │   │   │   ├── exception/       # Global exception handlers
│       │   │   │   ├── model/           # JPA entities (User, Product, Order, Cart, etc.)
│       │   │   │   ├── repository/      # Spring Data JPA repositories
│       │   │   │   └── service/         # Business logic & 3rd-party services (Payment, Mail)
│       │   │   └── resources/
│       │   │       ├── application.properties
│       │   │       └── application-local.properties.example
│       │   └── test/                    # Unit and integration tests
│       ├── pom.xml                      # Maven configuration
│       └── mvnw                         # Maven wrapper
│
├── frontend/
│   ├── src/
│   │   ├── api/                         # Axios client and API integrations
│   │   ├── auth/                        # Protected routes and role guards
│   │   ├── components/                  # Reusable UI components (Navbar, Hero, Modals, Cards)
│   │   ├── pages/                       # Route pages (Home, Products, Cart, Dashboards)
│   │   ├── App.jsx                      # App root router
│   │   └── main.jsx                     # Application entry point
│   ├── .env.example                     # Frontend environment template
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 21+ installed and configured in your `PATH`
- **Node.js**: v18+ and `npm`
- **PostgreSQL**: Local instance or cloud database (e.g., [Neon](https://neon.tech/))
- **Razorpay Account**: Test API keys for checkout testing

---

### 1. Backend Setup (Spring Boot)

1. **Navigate to the backend directory**:
   ```bash
   cd backend/eCom
   ```

2. **Configure environment variables**:
   Create a local configuration file `src/main/resources/application-local.properties` (or set system environment variables):
   ```properties
   spring.datasource.url=jdbc:postgresql://<HOST>:<PORT>/<DATABASE>?sslmode=require
   spring.datasource.username=<DB_USERNAME>
   spring.datasource.password=<DB_PASSWORD>

   jwt.secret=<YOUR_SECURE_RANDOM_256_BIT_SECRET>

   spring.mail.username=<YOUR_GMAIL_ADDRESS>
   spring.mail.password=<YOUR_GMAIL_APP_PASSWORD>

   razorpay.api.key=<RAZORPAY_KEY_ID>
   razorpay.api.secret=<RAZORPAY_KEY_SECRET>
   ```

3. **Build and run the backend**:
   ```bash
   # Windows
   ./mvnw.cmd spring-boot:run

   # Linux/macOS
   ./mvnw spring-boot:run
   ```
   The backend server starts on `http://localhost:8080`.

---

### 2. Frontend Setup (React + Vite)

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Configure the following variables in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🔐 Environment Variables

### Backend Configuration
| Variable | Description |
| :--- | :--- |
| `DB_URL` | PostgreSQL JDBC connection string |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | Secret key used for signing authentication tokens |
| `MAIL_USERNAME` | SMTP email address used for OTPs and notifications |
| `MAIL_PASSWORD` | SMTP app password |
| `RAZORPAY_API_KEY` | Razorpay Merchant Key ID |
| `RAZORPAY_API_SECRET` | Razorpay Merchant Key Secret |

### Frontend Configuration (`frontend/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_API_BASE_URL` | Base URL of the Spring Boot backend (`http://localhost:8080` for local dev) |
| `VITE_RAZORPAY_KEY` | Public publishable Razorpay Key ID |

---

## 📡 Key API Endpoints

| Module | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register new user account | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate user & return JWT | Public |
| **OTP** | `POST` | `/api/otp/verify` | Verify email registration OTP | Public |
| **Products** | `GET` | `/api/products` | Fetch all products with filters | Public |
| **Products** | `GET` | `/api/products/{id}` | Get product details by ID | Public |
| **Cart** | `GET` | `/api/cart` | View current user's cart | Customer |
| **Cart** | `POST` | `/api/cart/add` | Add item to cart | Customer |
| **Orders** | `POST` | `/api/orders` | Place a new order | Customer |
| **Payment** | `POST` | `/api/payment/create-order` | Initialize Razorpay order | Customer |
| **Payment** | `POST` | `/api/payment/verify` | Verify payment signature | Customer |
| **Seller** | `POST` | `/api/seller/apply` | Submit merchant onboarding application | Customer |
| **Seller** | `POST` | `/api/seller/products` | Create a new product listing | Seller |
| **Admin** | `GET` | `/api/admin/sellers/pending` | List pending seller applications | Admin |
| **Admin** | `PUT` | `/api/admin/sellers/{id}/approve` | Approve seller account | Admin |

---

## 📜 Scripts

### Frontend
- `npm run dev`: Launch Vite local dev server with HMR.
- `npm run build`: Compile and minify production assets into `dist/`.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint checks across JSX and JavaScript files.

### Backend
- `./mvnw spring-boot:run`: Start the Spring Boot application.
- `./mvnw clean package`: Compile source code and produce an executable `.jar` in `target/`.
- `./mvnw test`: Execute JUnit and Spring test suites.

---

## 🛡️ License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
