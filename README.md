# User Authentication & JWT

A secure user authentication REST API built using Node.js and Express.js. This project implements user registration, login, password hashing, and JWT-based authentication.

## Features

- User Registration
- User Login
- Password Hashing using bcrypt
- JWT Token Generation
- JWT Authentication Middleware
- Protected User Profile API
- Duplicate Email Validation
- Environment Variable Configuration

## Tech Stack

- Node.js
- Express.js
- bcryptjs
- JSON Web Token (JWT)
- dotenv
- JavaScript

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Access protected profile |

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
```

4. Start the server:

```bash
node server.js
```

## Testing

API endpoints can be tested using VS Code terminal or Postman.

## Security

- Passwords are stored as bcrypt hashes.
- JWT tokens protect private routes.
- Secret keys are managed through environment variables.
- Sensitive files are excluded using `.gitignore`.

## Storage

User information is stored in a local JSON file (`data/users.json`) for demonstration purposes.

## Author

Durga Devi
