# Sowaka - Performance Evaluation System

Sowaka is a full-stack, multi-tenant performance management platform designed to handle complex hierarchical team structures and streamline feedback cycles.

## Features
- **Role-Based Access Control**: Distinct dashboards and capabilities for Employees, Managers, and HR personnel.
- **Multi-Tenancy Architecture**: Data is securely isolated per company (tenant), allowing multiple organizations to operate on the same deployment.
- **Hierarchical Evaluations**: Supports n-level deep organizational hierarchies using self-referencing data models.
- **Cycle Management**: HR can initiate and track organization-wide review cycles, monitoring pending vs. completed evaluations.
- **Granular Performance Analytics**: Employees and Managers can track performance trends over time, broken down by individual parameters (e.g., Ownership, Communication, Quality of Work).

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) & bcrypt

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Running locally or via Docker)

### 1. Clone the repository
```bash
git clone https://github.com/ssoni1236789/Sowaka.git
cd Sowaka
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Configure your environment variables:
1. Copy the example env file: 
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and replace `YOUR_PASSWORD_HERE` in the `DATABASE_URL` with your actual local PostgreSQL password.

Run database migrations and seed the initial assignment data:
```bash
npx prisma db push
npx prisma db seed
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173`.

---

## 🧪 Test Credentials

The database seed script automatically populates two companies (Ashoka Textiles and Bright Path Consulting) with historical data and the following test users. 

**All accounts use the password:** `Password@123`

### Ashoka Textiles (Deep Hierarchy)
- **HR**: `hr@ashoka.com`
- **COO (Top Level Manager)**: `coo@ashoka.com`
- **Manager**: `rohan@ashoka.com` (Reports to COO)
- **Manager**: `priya@ashoka.com` (Reports to Rohan)
- **Employee**: `rahul@ashoka.com` (Reports to Priya)

### Bright Path Consulting (Flat Hierarchy)
- **HR**: `hr@brightpath.com`
- **Founder (Manager)**: `founder@brightpath.com`
- **Employee**: `employee1@brightpath.com` (Reports to Founder)
