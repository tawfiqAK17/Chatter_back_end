# Chatter - Back End

This is the back-end server component of the Chatter application, built with Express.js.

## Technologies Used

- JavaScript
- Express.js framework
- Socket.IO (for real-time messaging)
- Mongoose (for MongoDB database connection)
- MinIO (for object storage)

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGO_URL=mongodb://localhost:27017/chatter
FRONT_END_URL1=http://localhost:5173
FRONT_END_URL2=http://127.0.0.1:5173
JWT_SECRET_STRING=your_jwt_secret_here
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key
```

Adjust the values according to your development environment.

## Running the Server

To start the development server:

```
npm run dev
```

To start in production mode:

```
npm start
```

## API Routes

The server provides several API endpoints for:
- User authentication
- Message handling
- File uploads
- User profile management

## Socket.IO Events

The server implements Socket.IO for real-time communication, handling events for:
- User connections/disconnections
- Message sending/receiving
- Typing indicators
- Read receipts
