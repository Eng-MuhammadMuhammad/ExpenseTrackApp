# Expense Tracker Database Schema

## Overview
This document outlines the database schema for the expense tracking application. The schema is designed to store expense data securely and efficiently, allowing for easy retrieval and analysis.

## Data Models

### User
- `id`: Unique identifier for the user
- `email`: User's email address (used for authentication)
- `displayName`: User's display name
- `createdAt`: Timestamp when the user account was created
- `lastLogin`: Timestamp of the user's last login

### Expense
- `id`: Unique identifier for the expense record
- `userId`: Reference to the user who created the expense
- `date`: Date when the expense occurred
- `totalAmount`: Total amount of the expense in Syrian Pounds (SP)
- `createdAt`: Timestamp when the record was created
- `updatedAt`: Timestamp when the record was last updated

### ExpenseItem
- `id`: Unique identifier for the expense item
- `expenseId`: Reference to the parent expense record
- `name`: Name/description of the item purchased
- `price`: Price of the item in Syrian Pounds (SP)
- `createdAt`: Timestamp when the item was created
- `updatedAt`: Timestamp when the item was last updated

## Relationships
- One User can have many Expenses (one-to-many)
- One Expense can have many ExpenseItems (one-to-many)

## Indexes
- User email (for authentication)
- Expense date (for filtering and reporting)
- Expense userId (for filtering user's expenses)

## Security Considerations
- User authentication will be implemented using Firebase Authentication
- Database rules will ensure users can only access their own expense data
- All data will be encrypted at rest and in transit

## Backend Service Selection
Firebase Firestore will be used as the backend service for the following reasons:
1. Built-in authentication system
2. Real-time data synchronization
3. Secure data storage with customizable security rules
4. Scalability for future growth
5. Offline capabilities for improved user experience
6. Easy integration with React applications
