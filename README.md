# Secure Cloud File Server 🔒

A production-ready, secure cloud-based file server API built with Node.js, featuring end-to-end encryption, JWT authentication, and cloud storage integration.

## 🌟 Features

- **Secure Authentication**: JWT-based user authentication with bcrypt password hashing
- **End-to-End Encryption**: AES-256-GCM encryption for file data at rest
- **Cloud Storage**: Integration with AWS S3 for scalable file storage
- **RESTful API**: Well-structured API endpoints following REST principles
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **Security Headers**: Helmet.js for setting secure HTTP headers
- **CORS Support**: Configurable Cross-Origin Resource Sharing
- **File Management**: Upload, download, delete, and share files securely

## 🛠️ Tech Stack

- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Encryption**: Node.js Crypto (AES-256-GCM)
- **Cloud Storage**: AWS SDK (S3)
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Validation**: express-validator
- **File Upload**: Multer

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- MongoDB instance (local or cloud)
- AWS S3 bucket (for file storage)

## 🚀 Installation

1. Clone the repository:
```bash
git clone https://github.com/ravadasashank/secure-cloud-file-server.git
cd secure-cloud-file-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/secure-file-server

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
secure-cloud-file-server/
├── src/
│   └── app.js                 # Express app entry point
├── routes/
│   ├── authRoutes.js          # Authentication routes
│   └── fileRoutes.js          # File management routes
├── controllers/
│   ├── authController.js      # Authentication logic
│   └── fileController.js      # File operations logic
├── services/
│   ├── userService.js         # User database operations
│   ├── fileService.js         # File database operations
│   ├── storageService.js      # Cloud storage operations
│   └── encryptionService.js   # Encryption/decryption utilities
├── middleware/
│   ├── auth.js                # JWT authentication middleware
│   ├── upload.js              # File upload middleware
│   ├── validation.js          # Input validation middleware
│   └── errorHandler.js        # Global error handler
├── utils/
│   └── helpers.js             # Utility functions
├── .gitignore
├── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### File Management

#### Upload File
```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary_data>
```

#### Get All Files
```http
GET /api/files
Authorization: Bearer <token>
```

#### Download File
```http
GET /api/files/:id/download
Authorization: Bearer <token>
```

#### Delete File
```http
DELETE /api/files/:id
Authorization: Bearer <token>
```

#### Share File
```http
PUT /api/files/:id/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "recipient@example.com"
}
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **JWT Tokens**: Signed tokens with expiration for stateless authentication
- **File Encryption**: AES-256-GCM encryption for all uploaded files
- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Input Validation**: All inputs validated before processing
- **Secure Headers**: Helmet.js for setting security-related HTTP headers
- **CORS Protection**: Configurable origin whitelist
- **Error Sanitization**: No sensitive information leaked in error responses

## 🧪 Testing

```bash
# Run tests with coverage
npm test

# Run linter
npm run lint
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `AWS_REGION` | AWS region | Yes |
| `AWS_S3_BUCKET` | S3 bucket name | Yes |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | No |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Ravada Sashank**
- GitHub: [@ravadasashank](https://github.com/ravadasashank)

## 🙏 Acknowledgments

- Express.js community for excellent middleware
- MongoDB for scalable database solutions
- AWS for reliable cloud storage
- Node.js crypto module for encryption capabilities

---

**Note**: Never commit your `.env` file or any files containing sensitive information. Always use environment variables for configuration.
