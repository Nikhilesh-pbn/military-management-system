# Military Asset Management System (MAMS) - Technical Documentation

## 1. Project Overview

The **Military Asset Management System (MAMS)** is a specialized logistics framework designed to provide transparency and accountability for critical military assets (vehicles, weapons, and ammunition) across multiple bases.

**Live Deployment Links:**
* **Frontend (UI):** [https://military-management-system-gy3o.vercel.app](https://military-management-system-gy3o.vercel.app)
* **Backend (API):** [https://military-management-system-2.onrender.com](https://military-management-system-2.onrender.com)

---

### Key Assumptions:
* **Connectivity:** Users are assumed to have stable internet access to reach the hosted API and database.
* **Predefined Roles:** System roles (Admin, Commander, Logistics) are predefined in the database to ensure immediate access control.
* **Asset Consumption:** "Expended" assets specifically refer to consumable military stock, such as ammunition or fuel.

### System Limitations:
* **Database Choice:** Uses a file-based **SQLite** database. While this ensures high portability and easy auditing for a project framework, it is optimized for single-instance usage.
* **Hosting Behavior:** Due to the use of **Render’s free tier** for the backend, users may experience a "cold start" delay (30-60 seconds) during the initial request after a period of inactivity.
## 2. Tech Stack & Architecture

- **Frontend:** **React.js** with **Tailwind CSS**. Chosen for a responsive, component-based UI that handles real-time data updates for the dashboard.
- **Backend:** **Node.js** with **Express.js**. Provides a lightweight, scalable environment for RESTful APIs and middleware-based security.
- **Database:** **SQLite3**. Chosen for this initial framework because it is serverless and stores the entire database in a single file, ensuring high portability and easy auditing.

## 3. Data Models / Schema

The system utilizes a relational schema to track movements and balances:

- **Users:** `id`, `username`, `password_hash`, `role` (Admin, Commander, Logistics).
- **Assets:** `id`, `name`, `type` (Vehicle, Weapon, Ammo), `base_id`, `quantity`.
- **Transactions:** `id`, `asset_id`, `type` (Purchase, Transfer, Expenditure), `amount`, `source_base`, `dest_base`, `timestamp`.
- **Personnel_Assignments:** `id`, `asset_id`, `personnel_name`, `status`.

## 4. Role-Based Access Control (RBAC)

RBAC is enforced via **JWT (JSON Web Token) Middleware**:

- **Admin:** Full system access to all data and operations across all bases.
- **Base Commander:** Access restricted to data and operations for their specific assigned base (e.g., Nellore Base).
- **Logistics Officer:** Permissions restricted to the `/purchases` and `/transfers` routes only.
- **Enforcement:** The backend decodes the JWT on every request and validates the `user.role` before granting access to specific API controllers.

## 5. API Logging

Accountability is maintained through two logging layers:

1.  **Audit Trail:** Every transaction (Purchase, Transfer, Assignment) creates a permanent record in the `Transactions` table with a timestamp and the initiating user's ID.
2.  **Server Middleware:** All incoming API requests are logged to the console for real-time monitoring of system traffic and status codes.

## 6. Setup Instructions

### Backend

1.  Navigate to `/backend`.
2.  Run `npm install`.
3.  Start the server with `node index.js`. (Database initializes automatically).

### Frontend

1.  Navigate to `/frontend`.
2.  Run `npm install`.
3.  Run `npm start` to view the app at `http://localhost:3000`.

## 7. Key API Endpoints

- `POST /api/auth/login`: Authenticates user and returns JWT.
- `GET /api/dashboard`: Returns calculated metrics (Net Movement = Purchases + Transfers In - Transfers Out).
- `POST /api/transfers`: Records an asset movement between two base IDs.
- `POST /api/purchases`: Adds new stock to a specific base inventory.

## 8. Login Credentials

Use these credentials for the live demo or local testing:

| Role          | Username            | Password       |
| :------------ | :------------------ | :------------- |
| **Admin**     | `admin_user`        | `admin123`     |
| **Commander** | `commander_base1`   | `base456`      |
| **Logistics** | `logistics_officer` | `logistics789` |
