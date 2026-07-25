# Smart Expense Tracker

Senior Engineering Project for **SFWRTECH 4FD3 – Senior Engineering Project**  
McMaster University

---

## Live Demo

**Frontend (Access website from here):**  
https://smart-expense-tracker-rouge-omega.vercel.app

**Backend API (Hosted on Railway):**  
https://smart-expense-tracker-production-0638.up.railway.app

> The application is fully deployed and can be accessed through the production website mentioned here.

---

## Project Overview

Smart Expense Tracker is a full-stack web application that helps users manage their personal finances by tracking income and expenses, creating monthly budgets, organizing financial accounts, and viewing spending reports.

The application provides a simple and responsive interface while securely storing user data using JWT authentication and a MySQL database.

---

## Features

### User Authentication

- User registration
- Secure login
- JWT authentication
- Password strength validation
- Forgot Password
- Reset Password via email
- Delete account

### Dashboard

- Personalized dashboard
- Safe-to-spend calculation
- Monthly budget overview
- Recent transactions
- Net worth summary
- Income and expense overview

### Budget Management

- Create monthly budgets
- Edit budgets
- Delete budgets
- Track spending against budgets
- Budget progress indicators

### Transaction Management

- Add income
- Add expenses
- Edit transactions
- Delete transactions
- View transaction history

### Account Management

- Create financial accounts
- Checking accounts
- Savings accounts
- Credit cards
- Cash accounts
- Investment accounts

### Categories

- Create categories
- Edit categories
- Delete categories
- Income categories
- Expense categories

### Reports

- Spending summaries
- Budget reports
- Category analysis
- Monthly financial overview

### User Experience

- Responsive design
- Light and Dark mode
- Mobile-friendly interface
- Modern dashboard design

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- CSS
- Lucide React

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Resend Email API

### Database

- MySQL

### Deployment

- Vercel (Frontend)
- Railway (Backend & Database)
- GitHub

---

## Installation

### Clone the repository

```bash
git clone https://github.com/Amisha2801/Smart-Expense-Tracker.git
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

---

## Project Structure

```
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

GitHub Repository

https://github.com/Amisha2801/Smart-Expense-Tracker

---

## Future Improvements

- Email verification during registration
- User profile management
- Export reports (PDF/CSV)
- Recurring transactions
- Savings goals
- Multi-currency support
- Advanced analytics

---

## License

This project was developed as part of the **SFWRTECH 4FD3 Senior Engineering Project** at McMaster University and is intended for educational purposes.
