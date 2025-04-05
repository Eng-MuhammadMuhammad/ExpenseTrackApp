# Expense Tracker Application

A complete web application for tracking daily expenses, built with React and Tailwind CSS.

## Features

- Track daily expenses in Syrian Pounds (SP)
- Add multiple items with their prices
- Record dates (with today's date as default)
- Save all purchase history
- Generate monthly and annual summaries
- Secure online data storage with Firebase
- User authentication and protected routes

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components
- `/src/contexts` - React context providers
- `/src/firebase` - Firebase configuration and services
- `/src/styles` - Tailwind CSS configuration

## Getting Started

### Prerequisites

- Node.js and npm installed
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Update Firebase configuration in `src/firebase/config.js` with your credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};
```

4. Start the development server:
```bash
npm start
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Technologies Used

- React.js
- Tailwind CSS
- Firebase (Authentication, Firestore)
- Chart.js
- React Router

## License

This project is licensed under the MIT License.
