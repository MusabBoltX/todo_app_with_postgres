# API Documentation

## Authentication Endpoints

### Register User
- **POST** `/api/users/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Login User
- **POST** `/api/users/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Forget Password
- **POST** `/api/users/forget-password`
- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset email sent successfully"
  }
  ```

### Reset Password
- **POST** `/api/users/reset-password`
- **Body:**
  ```json
  {
    "token": "reset_token_from_email",
    "newPassword": "newpassword123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Password reset successfully"
  }
  ```

### Get User Profile
- **GET** `/api/users/profile`
- **Headers:** `Authorization: Bearer <token>`

### Logout
- **POST** `/api/users/logout`
- **Headers:** `Authorization: Bearer <token>`

## Todo Endpoints

### Get All Todos
- **GET** `/api/todos/list`
- **Headers:** `Authorization: Bearer <token>`

### Create Todo
- **POST** `/api/todos/create`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "task": "Complete project"
  }
  ```

### Update Todo
- **PUT** `/api/todos/:todoId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "task": "Updated task",
    "completed": true
  }
  ```

### Delete Todo
- **DELETE** `/api/todos/:todoId`
- **Headers:** `Authorization: Bearer <token>` 