# 📄 Advanced-Express-CRUD API

> Secure and Shareable Document Management System

A comprehensive RESTful API built with **Node.js**, **Express**, and **MongoDB**, showcasing modern API design patterns, authentication, and access control mechanisms.

This project draws inspiration from Google Drive-like systems (without file uploads), focusing on the core logic of document sharing with configurable privacy settings: private, shared with specific users, or accessible via unique links.

## 🚀 Key Features

### 🔐 Authentication & Security

| Feature | Implementation |
|---------|----------------|
| JWT Authentication | `Authorization: Bearer <token>` |
| Token Security | Secure refresh token rotation |
| CSRF Protection | Token support for browser contexts |
| Security Headers | Helmet integration for HTTP header protection |
| Access Control | Fine-grained permissions system |
| API Protection | CORS with whitelist, rate limiting |

### 🧾 Document Management

* **Complete CRUD Operations:**
  * Create new documents
  * Read documents (with appropriate permissions)
  * Update documents (PUT for replacement, PATCH for partial updates)
  * Delete documents (with ownership verification)

* **Sophisticated Access Control:**
  * Ownership-based access
  * User-specific sharing via `sharedWith` array
  * Visibility modes: `private`, `public`, or `link`
  * Secure `linkToken` generation for shared links

* **Advanced Document Features:**
  * Full-text search across title and content
  * Pagination with customizable limit/offset
  * Filtering by multiple parameters
  * Sorting options for all document attributes
  * Automatic `linkToken` management
  * Link regeneration and disabling options

### 👤 User Management

**User Authentication Flow:**

1. **Registration** - Create a new account with email verification
2. **Login** - Authenticate and receive access/refresh tokens
3. **API Access** - Use tokens to access protected resources
4. **Token Refresh** - Maintain session with token rotation
5. **Logout** - Securely terminate session and invalidate tokens

* User Registration with validation
* Secure Login with JWT issuance
* Profile management
* Token refresh mechanism
* Secure logout (invalidates refresh tokens)

### 🧠 Architecture

**Key Components:**

- **Routes** - Define API endpoints and HTTP methods
- **Controllers** - Handle request processing and response formatting
- **Services** - Implement business logic and data operations
- **Middleware** - Provide authentication, validation, and error handling
- **Models** - Define data schemas and database interactions

* **Clean, Modular Structure:**
  * Separation of concerns with dedicated directories
  * Clear responsibility boundaries
  * Scalable architecture pattern

* **Industry Best Practices:**
  * Async/await pattern with proper error handling
  * Centralized error management
  * Environment-based configuration
  * ECMAScript Modules (ESM)

## ⚙️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT, Refresh Tokens |
| **Security** | Helmet, CORS, Rate-limiting |
| **Module System** | ECMAScript Modules (`"type": "module"`) |

## 📡 API Authentication

## 🔧 API Routes

### 📌 Auth Routes

| Method | Endpoint             | Description                    | Auth Required |
|--------|----------------------|--------------------------------|---------------|
| POST   | `/auth/register`     | Register a new user            | ❌            |
| POST   | `/auth/login`        | Login & get tokens             | ❌            |
| POST   | `/auth/logout`       | Logout & delete refresh token  | ✅            |
| POST   | `/auth/refresh`      | Refresh access token           | ✅ (cookie)   |
| GET    | `/user`              | Get current user profile       | ✅            |

---

### 📄 Document Routes

| Method | Endpoint                          | Description                             | Auth Required |
|--------|-----------------------------------|-----------------------------------------|---------------|
| POST   | `/documents`                      | Create new document                     | ✅            |
| GET    | `/documents`                      | Get paginated documents (owned/shared)  | ✅            |
| GET    | `/documents/:id`                  | Get single document by ID               | ✅ (if allowed)|
| PUT    | `/documents/:id`                  | Replace a document                      | ✅ (owner)     |
| PATCH  | `/documents/:id`                  | Partially update a document             | ✅ (owner)     |
| DELETE | `/documents/:id`                  | Delete a document                       | ✅ (owner)     |

---

### 🔗 Link-Based Access

| Method | Endpoint                            | Description                              | Auth Required |
|--------|-------------------------------------|------------------------------------------|---------------|
| GET    | `/documents/access/:linkToken`      | Access doc via secure link               | ❌            |
| POST   | `/documents/:id/regenerate-link`    | Generate a new linkToken                 | ✅ (owner)     |
| DELETE | `/documents/:id/disable-link`       | Disable link access                      | ✅ (owner)     |

---

### 👥 Document Sharing

| Method | Endpoint                                | Description                            | Auth Required |
|--------|-----------------------------------------|----------------------------------------|---------------|
| PATCH  | `/documents/:id/share`                  | Share with specific users              | ✅ (owner)     |
| PATCH  | `/documents/:id/unshare`                | Remove users from shared list          | ✅ (owner)     |

---

### 🔍 Search, Filter & Pagination

| Method | Endpoint             | Query Params                             | Description                      |
|--------|----------------------|------------------------------------------|----------------------------------|
| GET    | `/documents`         | `?search=&page=&limit=&sort=`            | Full-text search & pagination    |

> Search is case-insensitive and supports indexed full-text queries on `title` and `content`.

---

### Protected Routes

All protected routes require the following header:

```http
Authorization: Bearer <accessToken>
```

### Link-based Access (No Login Required)

For accessing documents via shared links:

```http
GET /documents/access/:linkToken
```

## 📌 Future Enhancements

* 🔍 **Input Validation**
  * Integration with Joi or Zod
  * Request schema validation

* 🧼 **Enhanced Security**
  * XSS protection with `xss-clean`
  * MongoDB injection prevention with `express-mongo-sanitize`

* 📊 **Monitoring & Analytics**
  * Request tracking
  * Performance metrics

## 🚀 Getting Started

```bash
# Clone the repository
git clone <repo-url>

# Navigate to project directory
cd advanced-express-crud

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env

# Start development server
npm run dev
```

---

&copy; 2025 Document API - [GitHub Repository](https://github.com/Sunanda-05/advanced-express-crud)