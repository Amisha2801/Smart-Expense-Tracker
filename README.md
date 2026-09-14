# Smart Expense Tracker

Senior Engineering Project for **SFWRTECH 4FD3 – Senior Engineering Project**  
McMaster University

---

## Live Demo

**Frontend Preview:**  
https://smart-expense-tracker-rouge-omega.vercel.app

> Note: The frontend remains deployed on Vercel, but functionality requiring the backend API is currently unavailable because the original Railway backend and database deployment are offline.

**Backend API (Hosted on Railway):**  
https://smart-expense-tracker-production-0638.up.railway.app

## Deployment Status

The Smart Expense Tracker was successfully deployed during development using **Vercel** for the frontend and **Railway** for the Node.js backend and MySQL database.

The original Railway deployment is currently offline following the expiration of the project's hosting period. As a result, backend-dependent functionality such as authentication, transactions, budgets, and reports is not currently available through the hosted frontend.

The complete source code, application architecture, database implementation, and deployment configuration remain available in this repository.

---

## Project Overview

Smart Expense Tracker is a production-deployed full-stack web application designed to help users manage their personal finances through centralized tracking of income, expenses, financial accounts, monthly budgets, categories, and spending reports.

The application was developed as a collaborative Senior Engineering Project and incorporates full-stack application development, REST API design, relational database management, authentication and authorization, financial data processing, responsive UI development, and cloud deployment.

The system uses a React frontend communicating with a Node.js and Express backend through REST APIs, with financial and user data stored in a MySQL relational database.

Security features including JWT authentication, bcrypt password hashing, request validation, protected routes, resource ownership checks, and secure password recovery are integrated throughout the application.

---

## System Architecture

The application follows a separated frontend/backend architecture with a layered backend design.

```text
React + Vite Frontend
        │
        │ REST API
        ▼
Node.js + Express Backend
        │
        ▼
Controllers
        │
        ▼
Services / Business Logic
        │
        ▼
Repositories / Data Access
        │
        ▼
MySQL Database
```

The backend separates HTTP request handling, application logic, and database operations using controllers, services, and repositories.

Cross-cutting functionality including authentication, authorization, request validation, and error handling is implemented through middleware and shared application components.

---

## Features

### User Authentication and Security

- User registration
- Secure login
- JWT-based authentication
- bcrypt password hashing
- Password strength validation
- Protected application routes
- Forgot Password functionality
- Secure password reset through email
- Time-limited password reset tokens
- Secure account deletion with password confirmation
- User-level authorization
- Resource ownership validation
- Request validation using Zod

The password recovery workflow generates cryptographically random reset tokens and stores hashed representations of those tokens on the backend. Password reset links are time-limited and reset tokens are invalidated following successful password changes.

---

### Dashboard

- Personalized dashboard
- Safe-to-spend calculation
- Monthly budget overview
- Recent transactions
- Net worth summary
- Monthly income overview
- Monthly expense overview
- Financial account summaries

The dashboard consolidates financial information from multiple application modules to provide users with a centralized overview of their financial activity.

---

### Budget Management

- Create monthly budgets
- Edit existing budgets
- Delete budgets
- Associate budgets with spending categories
- Track spending against budget limits
- Budget progress indicators
- Compare budgeted amounts with actual spending

---

### Transaction Management

- Add income
- Add expenses
- Edit transactions
- Delete transactions
- View transaction history
- Categorize financial activity
- Associate transactions with financial accounts
- Maintain account balance consistency
- Running account balance calculations

Database transactions are used for multi-step financial operations where appropriate to help maintain consistency between transaction records and associated account balances.

Transaction history also includes running balance calculations implemented using SQL window-function logic.

---

### Account Management

Users can create and manage multiple types of financial accounts, including:

- Checking accounts
- Savings accounts
- Credit cards
- Cash accounts
- Investment accounts

Account balances are integrated with transaction activity to provide an updated financial overview.

---

### Categories

- Create custom categories
- Edit categories
- Delete categories
- Income categories
- Expense categories
- Category-based transaction organization
- Category-based budget tracking

Categories are associated with individual users and integrated throughout transaction and budgeting workflows.

---

### Reports and Financial Analytics

- Spending summaries
- Budget reports
- Category analysis
- Monthly financial overview
- Income vs. expense analysis
- Budget vs. actual spending
- Category-level spending analysis
- Historical financial trends
- Multi-month income and expense visualization

Interactive financial visualizations are implemented using **Recharts**.

---

### User Experience

- Responsive design
- Light and Dark mode
- Mobile-friendly interface
- Mobile navigation
- Modern dashboard design
- Reusable interface components
- Protected frontend routes
- Responsive financial dashboards and reports

---

## Security and Data Integrity

Security and data integrity were considered throughout the design and implementation of the application.

### Authentication

JWT authentication is used to protect application resources and identify authenticated users when accessing protected backend endpoints.

### Password Security

User passwords are hashed using **bcrypt** rather than being stored in plaintext.

### Password Recovery

The password recovery workflow uses cryptographically generated reset tokens, server-side token hashing, expiration controls, and email-based reset links.

### Authorization

Backend operations verify resource ownership to prevent authenticated users from accessing or modifying financial information belonging to another user.

### Request Validation

**Zod** validation schemas are used to validate incoming application data before it reaches application business logic.

### Database Integrity

The MySQL relational database uses:

- Primary keys
- Foreign keys
- Referential constraints
- Database indexes
- Cascade behavior where appropriate
- Database transactions for multi-step financial operations

These mechanisms help maintain consistency between users, accounts, transactions, categories, and budgets.

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS
- Recharts
- Lucide React

### Backend

- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt
- Zod
- Node.js Crypto
- Resend Email API

### Database

- MySQL
- SQL migrations
- Relational constraints
- SQL window functions
- Transactional database operations

### Deployment and Development

- Vercel (Frontend)
- Railway (Backend & Database)
- Git
- GitHub

---

## Backend Architecture

The backend uses a layered architecture to separate different application responsibilities.

```text
backend
│
├── controllers
│   └── HTTP request and response coordination
│
├── services
│   └── Application and business logic
│
├── repositories
│   └── Database access and SQL operations
│
├── routes
│   └── REST API endpoint definitions
│
├── middleware
│   └── Authentication, validation and error handling
│
├── db
│   └── Database configuration and migrations
│
└── ...
```

This structure separates request handling, business logic, and persistence concerns to improve maintainability and extensibility.

---

## Frontend Architecture

The frontend is built using React and Vite and follows a component-based architecture.

Key frontend functionality includes:

- React Router navigation
- Protected authenticated routes
- Reusable interface components
- Centralized backend API communication
- Responsive layouts
- Mobile navigation
- Light and Dark themes
- Financial dashboards
- Interactive reports and visualizations

---

## Production Deployment

The application is deployed using a cloud-based frontend, backend, and database architecture.

```text
User
 │
 ▼
Vercel
React Frontend
 │
 │ HTTPS / REST API
 ▼
Railway
Node.js + Express Backend
 │
 ▼
Railway
MySQL Database
```

Environment variables are used to separate sensitive configuration such as database credentials, authentication secrets, and external service credentials from the application source code.

---

## My Contributions

Smart Expense Tracker was developed collaboratively as part of the **SFWRTECH 4FD3 Senior Engineering Project** at McMaster University.

My contributions included work across frontend development, backend integration, authentication and security, financial management functionality, responsive design, and production deployment.

Key areas I contributed to included:

- Login interface and authentication setup
- Frontend authentication flow
- Frontend and backend integration
- CORS configuration
- Authentication and navigation integration
- Password validation
- Budget management frontend
- Transaction management frontend
- Dashboard summary backend API
- Frontend API configuration
- Password recovery functionality
- Authentication security improvements
- Responsive and mobile interface development
- Mobile navigation
- Secure account deletion functionality
- Email-based password reset integration
- Migration of password reset email delivery to Resend
- Vercel deployment and routing configuration
- Authenticated user integration within the dashboard
- Deployment and repository documentation

The project provided hands-on experience taking a software application through development, integration, testing, security considerations, and production deployment while collaborating within a software engineering team.

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/Amisha2801/Smart-Expense-Tracker.git
cd Smart-Expense-Tracker
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm start
```

Environment configuration is required for database connectivity, authentication secrets, email integration, and deployment-specific settings.

---

## Project Structure

```text
Smart-Expense-Tracker
│
├── frontend
│   ├── src
│   ├── public
│   └── ...
│
├── backend
│   ├── controllers
│   ├── services
│   ├── repositories
│   ├── routes
│   ├── middleware
│   ├── db
│   └── ...
│
└── README.md
```

---

## Repository

**GitHub Repository:**  
https://github.com/Amisha2801/Smart-Expense-Tracker

**Live Application:**  
https://smart-expense-tracker-rouge-omega.vercel.app

---

## Future Improvements

- Email verification during registration
- User profile management
- Export reports (PDF/CSV)
- Recurring transactions
- Savings goals
- Multi-currency support
- Advanced financial analytics

---

## Academic Context

This project was developed as part of **SFWRTECH 4FD3 – Senior Engineering Project** at **McMaster University**.

The project demonstrates the design, implementation, integration, and deployment of a full-stack software application incorporating frontend development, backend architecture, REST APIs, relational data management, authentication and authorization, security controls, financial data processing, responsive interface development, and cloud deployment.

---

## License

This project was developed as part of the **SFWRTECH 4FD3 Senior Engineering Project** at McMaster University and is intended for educational purposes.
