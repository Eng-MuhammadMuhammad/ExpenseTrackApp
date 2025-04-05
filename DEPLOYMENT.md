# Expense Tracker Deployment Guide

This document provides instructions for deploying the Expense Tracker application to Firebase Hosting.

## Prerequisites

1. Firebase account
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. Firebase project created in the Firebase Console

## Configuration

1. Update the Firebase configuration in `src/firebase/config.js` with your project credentials:

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

2. Update the project name in `.firebaserc` if needed:

```json
{
  "projects": {
    "default": "YOUR_PROJECT_ID"
  }
}
```

## Deployment Steps

1. Build the application:

```bash
npm run build
```

2. Login to Firebase:

```bash
firebase login
```

3. Deploy to Firebase Hosting:

```bash
firebase deploy
```

4. Access your deployed application at:
   https://YOUR_PROJECT_ID.web.app

## Security Rules

Ensure your Firestore security rules are properly configured to protect user data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /expenseItems/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

- If you encounter CORS issues, ensure your Firebase project has the correct domain whitelisted
- For authentication issues, verify your Firebase Authentication providers are properly configured
- For deployment issues, check the Firebase CLI output for specific error messages
