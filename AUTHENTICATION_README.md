# Authentication System

This application now includes bearer token authentication for all routes except `/login` and `/register`.

## Setup

1. **Database Setup**: Run the `database_setup.sql` script to create the necessary tables with user authentication support.

2. **Environment Variables**: Make sure you have the following environment variables set:
   ```
   JWT_SECRET=your_secure_jwt_secret_key
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=todo_db
   DB_PASSWORD=your_password
   DB_PORT=5435
   ```

## API Endpoints

### Public Routes (No Authentication Required)

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Protected Routes (Authentication Required)

All other routes require a valid bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

#### Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

#### Logout
```
POST /api/users/logout
Authorization: Bearer <token>
```

#### Get All Todos (for authenticated user)
```
GET /api/todos
Authorization: Bearer <token>
```

#### Create Todo
```
POST /api/todo
Authorization: Bearer <token>
Content-Type: application/json

{
  "task": "Buy groceries"
}
```

#### Update Todo
```
PUT /api/todo/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "task": "Buy groceries",
  "completed": true
}
```

#### Delete Todo
```
DELETE /api/todo/:id
Authorization: Bearer <token>
```

## Security Features

1. **JWT Token Authentication**: All protected routes require a valid JWT token
2. **Token Storage**: Tokens are stored in the database for logout functionality
3. **User Isolation**: Users can only access their own todos
4. **Token Expiration**: Tokens expire after 1 hour
5. **Secure Password Hashing**: Passwords are hashed using bcrypt

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 401 Unauthorized (Invalid Token)
```json
{
  "error": "Invalid or expired token"
}
```

### 401 Unauthorized (Token Expired)
```json
{
  "error": "Token expired"
}
```

## Usage Example

1. **Register a new user**:
   ```bash
   curl -X POST http://localhost:3000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
   ```

2. **Login to get a token**:
   ```bash
   curl -X POST http://localhost:3000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'
   ```

3. **Use the token for authenticated requests**:
   ```bash
   curl -X GET http://localhost:3000/api/todos \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

4. **Create a todo**:
   ```bash
   curl -X POST http://localhost:3000/api/todo \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json" \
     -d '{"task":"Buy groceries"}'
   ```

5. **Logout**:
   ```bash
   curl -X POST http://localhost:3000/api/users/logout \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ``` 