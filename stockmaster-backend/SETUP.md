# Backend Setup Guide

## Environment Variables

Create a `.env` file in the `stockmaster-backend` directory with the following content:

```env
# MongoDB Connection
# For local MongoDB: mongodb://localhost:27017/stockmaster
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/stockmaster
MONGO_URI=mongodb://localhost:27017/stockmaster

# JWT Secret - Change this to a random string in production
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=3h

# Server Port
PORT=5000

# Email Configuration (for OTP)
# Gmail: Use App Password, not your regular password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

## MongoDB Setup

### Option 1: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use: `MONGO_URI=mongodb://localhost:27017/stockmaster`

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get your connection string
4. Use: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/stockmaster`

## Quick Start

1. Create the `.env` file with your MongoDB URI
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`

The server will run on `http://localhost:5000`

