# Algofi Insight Backend

NestJS backend API for the Algofi Insight Admin Panel.

## Features

- ✅ NestJS with TypeScript
- ✅ MongoDB with Mongoose
- ✅ JWT Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Class-validator for DTO validation
- ✅ Joi for environment configuration validation
- ✅ Swagger API Documentation
- ✅ Rate Limiting
- ✅ CORS Support

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/algofi-insight
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

3. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
API Documentation (Swagger) will be available at `http://localhost:3000/api/docs`

## Project Structure

```
backend/
├── src/
│   ├── admin/          # Admin module (dashboard, stats)
│   ├── auth/           # Authentication module (JWT, guards)
│   ├── config/         # Configuration service with Joi validation
│   ├── database/       # Database module
│   ├── users/          # Users module (CRUD operations)
│   ├── app.module.ts   # Root module
│   └── main.ts         # Application entry point
├── .env                # Environment variables (create this)
└── package.json
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (protected)

### Users (Admin/Moderator only)
- `GET /users` - Get all users (with pagination, search, filters)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Admin
- `GET /admin/dashboard` - Get dashboard statistics (Admin/Moderator)

## User Roles

- **admin**: Full access to all features
- **moderator**: Can view users and dashboard
- **user**: Regular user (no admin access)

## Creating the First Admin User

You can create an admin user using the registration endpoint or directly in MongoDB:

```bash
# Using the API
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

Then update the user role to admin in MongoDB or use the update endpoint (if you have another admin).

## Development

```bash
# Development mode with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm test
```

## Environment Variables

All environment variables are validated using Joi schema. Required variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (minimum 32 characters)
- `JWT_EXPIRES_IN` - JWT token expiration (default: 7d)
- `CORS_ORIGIN` - Allowed CORS origin
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production/test)

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Rate limiting
- Input validation with class-validator
- CORS protection

## API Documentation

Swagger documentation is available at `/api/docs` when the server is running.
