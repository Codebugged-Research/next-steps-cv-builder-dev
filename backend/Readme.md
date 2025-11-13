# Next Steps CV Builder - Backend API

This backend provides RESTful APIs for user management and CV creation, built with Express.js and MongoDB.

## Base URL

```
{will be updated}
```

## Endpoints

### User APIs (`/api/users`)

- `POST /api/users/register`  
  Register a new user.  
  **Body:** `{ fullName, email, password, ... }`

- `POST /api/users/login`  
  Authenticate user and return a token.  
  **Body:** `{ email, password }`

- `GET /api/users/profile`  
  Get logged-in user's profile.  
  **Auth required**

### CV APIs (`/api/cv`)

- `POST /api/cv/save`  
  Save or update user's CV.  
  **Body:** `CV data object`

- `GET /api/cv/:userId`  
  Get CV for a specific user.

- `POST /api/cv/upload`  
  Upload CV file (PDF, DOC, DOCX).  
  **Form Data:** `file`

## File Uploads

- Uses [Multer](https://github.com/expressjs/multer) for file uploads.
- Supports GridFS for storing files in MongoDB.

## Setup

1. Clone the repo.
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set environment variables in `.env` (see `.env.example`).
4. Start the server:  
   ```bash
   npm start
   ```

## License

MIT
