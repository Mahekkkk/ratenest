# RateNest

## Full-Stack Store Rating Platform

**Repository:** `https://github.com/Mahekkkk/ratenest`

**Technology Stack**

* Frontend: React.js
* Backend: Node.js + Express.js
* Database: MySQL
* Authentication: JWT
* Password Security: bcrypt
* API Communication: REST
* Version Control: Git + GitHub

---

# 1. Project Overview

RateNest is a full-stack web application that allows users to discover registered stores and submit ratings from 1 to 5.

The platform supports three different user roles:

1. System Administrator
2. Normal User
3. Store Owner

A single authentication system is used for all roles. After login, the user's role determines which features and dashboard they can access.

The application will provide store management, user management, rating submission and modification, store search, filtering, sorting, and role-specific dashboards.

---

# 2. Project Objectives

The main objectives are:

* Implement a secure authentication system.
* Support role-based authorization.
* Allow normal users to register and rate stores.
* Allow users to modify their previously submitted ratings.
* Allow administrators to manage users and stores.
* Allow store owners to view ratings and rating-related information for their stores.
* Provide search, filtering, and sorting functionality.
* Maintain a properly normalized relational database.
* Implement frontend and backend validation.
* Follow REST API and full-stack development best practices.

---

# 3. User Roles

## 3.1 System Administrator

The administrator can:

* Log in.
* Add stores.
* Add normal users.
* Add administrator users.
* View dashboard statistics.
* View all stores.
* View normal and administrator users.
* View details of users.
* Filter listings.
* Sort listings.
* View store ratings.
* View a store owner's rating information.
* Log out.

### Administrator Dashboard

The dashboard will display:

* Total number of users
* Total number of stores
* Total number of submitted ratings

---

## 3.2 Normal User

A normal user can:

* Register.
* Log in.
* Change their password.
* View all registered stores.
* Search stores by name.
* Search stores by address.
* View overall store ratings.
* View their own submitted rating.
* Submit a rating from 1 to 5.
* Modify their existing rating.
* Log out.

---

## 3.3 Store Owner

A store owner can:

* Log in.
* Change their password.
* View their store's average rating.
* View users who submitted ratings for their store.
* View the ratings submitted by those users.
* Log out.

A store owner cannot manage other users or stores.

---

# 4. Technology Architecture

The application follows a three-layer architecture.

```text
                    React Frontend
                          |
                          | HTTP / REST API
                          ↓
                  Express.js Backend
                          |
              -------------------------
              |           |           |
          Routes      Controllers   Middleware
              |           |           |
              -------- Services -------
                          |
                          ↓
                       MySQL
```

## Frontend

React.js will handle:

* User interface
* Forms
* Routing
* Authentication state
* API requests
* Dashboard screens
* Tables
* Search and filtering
* Rating submission

## Backend

Express.js will handle:

* REST APIs
* Authentication
* Authorization
* Validation
* Business logic
* Database operations
* Error handling

## Database

MySQL will store:

* Users
* Stores
* Ratings

---

# 5. Database Design

The database will contain three primary tables:

1. `users`
2. `stores`
3. `ratings`

---

# 6. Users Table

Table name:

`users`

| Column        | Type         | Constraints                 |
| ------------- | ------------ | --------------------------- |
| id            | INT          | Primary Key, Auto Increment |
| name          | VARCHAR(60)  | NOT NULL                    |
| email         | VARCHAR(255) | NOT NULL, UNIQUE            |
| password_hash | VARCHAR(255) | NOT NULL                    |
| address       | VARCHAR(400) | NOT NULL                    |
| role          | ENUM         | NOT NULL                    |
| created_at    | TIMESTAMP    | Default current timestamp   |
| updated_at    | TIMESTAMP    | Updated automatically       |

Allowed roles:

```text
ADMIN
USER
STORE_OWNER
```

Passwords must never be stored in plain text.

Only bcrypt password hashes will be stored.

---

# 7. Stores Table

Table name:

`stores`

| Column     | Type         | Constraints                       |
| ---------- | ------------ | --------------------------------- |
| id         | INT          | Primary Key, Auto Increment       |
| name       | VARCHAR(60)  | NOT NULL                          |
| email      | VARCHAR(255) | NOT NULL                          |
| address    | VARCHAR(400) | NOT NULL                          |
| owner_id   | INT          | Foreign Key, nullable if required |
| created_at | TIMESTAMP    | Default current timestamp         |
| updated_at | TIMESTAMP    | Updated automatically             |

`owner_id` references:

```text
users.id
```

A store can be associated with a store owner.

---

# 8. Ratings Table

Table name:

`ratings`

| Column     | Type      | Constraints                 |
| ---------- | --------- | --------------------------- |
| id         | INT       | Primary Key, Auto Increment |
| user_id    | INT       | Foreign Key                 |
| store_id   | INT       | Foreign Key                 |
| rating     | TINYINT   | Value between 1 and 5       |
| created_at | TIMESTAMP | Default current timestamp   |
| updated_at | TIMESTAMP | Updated automatically       |

Foreign keys:

```text
user_id → users.id
store_id → stores.id
```

A unique constraint will be added to:

```text
(user_id, store_id)
```

This ensures that one normal user can have only one rating for a particular store.

If the user submits another rating, the existing rating will be updated instead of creating another rating.

---

# 9. Database Relationships

The relationships are:

```text
User 1 -------- * Ratings

Store 1 ------- * Ratings

User(Store Owner) 1 ------- * Stores
```

A user can submit ratings for multiple stores.

A store can receive ratings from multiple users.

A store owner can own one or more stores depending on the implementation.

---

# 10. Rating Calculation

The overall store rating will be calculated from the ratings stored in the `ratings` table.

Example:

```text
Ratings:
5
4
4
3

Average:
(5 + 4 + 4 + 3) / 4 = 4.0
```

The average rating should preferably be calculated dynamically using SQL aggregation rather than storing a separate average value that could become inconsistent.

Example SQL concept:

```sql
SELECT AVG(rating)
FROM ratings
WHERE store_id = ?;
```

---

# 11. Authentication

A single login page will be used for all roles.

The user provides:

* Email
* Password

The backend will:

1. Find the user by email.
2. Compare the supplied password with the stored bcrypt hash.
3. Verify the account.
4. Generate a JWT.
5. Include the user's ID and role in the token.
6. Return the token to the frontend.

Example JWT payload:

```json
{
  "userId": 12,
  "role": "USER"
}
```

The frontend will use the authentication token for protected API requests.

---

# 12. Authorization

Authentication determines whether a user is logged in.

Authorization determines what the logged-in user is allowed to access.

Example:

```text
ADMIN
    → Admin dashboard
    → User management
    → Store management

USER
    → Store listing
    → Submit rating
    → Modify rating
    → Change password

STORE_OWNER
    → Owner dashboard
    → Store ratings
    → Rating users
```

Backend authorization middleware must verify the user's role before allowing access to role-specific endpoints.

Authorization must not rely only on frontend route protection.

---

# 13. Password Security

Passwords will be hashed using bcrypt.

Plain-text passwords must never be:

* Stored in the database
* Returned through APIs
* Logged in the server console
* Included in API responses

Password requirements:

* Minimum 8 characters
* Maximum 16 characters
* At least one uppercase letter
* At least one special character

Example validation pattern:

```text
^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$
```

---

# 14. Form Validation

## Name

Requirements:

* Minimum 20 characters
* Maximum 60 characters

Validation:

```text
20 <= length <= 60
```

The validation must be implemented on both frontend and backend.

---

## Address

Maximum:

```text
400 characters
```

---

## Email

Email must follow standard email validation rules.

Example:

```text
user@example.com
```

Email addresses must be unique in the users table.

---

## Password

Requirements:

* 8–16 characters
* At least one uppercase letter
* At least one special character

---

## Rating

Allowed values:

```text
1
2
3
4
5
```

Values outside this range must be rejected by the backend.

---

# 15. REST API Design

Base URL:

```text
/api
```

---

# 16. Authentication APIs

## Register

```http
POST /api/auth/register
```

Used by normal users to create accounts.

Request:

```json
{
  "name": "Example User Full Name",
  "email": "user@example.com",
  "password": "Password@123",
  "address": "Example Address"
}
```

The role will automatically be:

```text
USER
```

Normal users must not be able to register themselves as administrators or store owners.

---

## Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "Password@123"
}
```

Response will contain the JWT token and basic user information.

---

## Change Password

```http
PUT /api/auth/change-password
```

Protected endpoint.

Request:

```json
{
  "currentPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```

---

# 17. Admin APIs

## Dashboard Statistics

```http
GET /api/admin/dashboard
```

Returns:

```json
{
  "totalUsers": 20,
  "totalStores": 10,
  "totalRatings": 75
}
```

---

## Create User

```http
POST /api/admin/users
```

Admin can create:

* Normal user
* Administrator
* Store owner

Request:

```json
{
  "name": "Example User Full Name",
  "email": "user@example.com",
  "password": "Password@123",
  "address": "Example Address",
  "role": "USER"
}
```

---

## Get Users

```http
GET /api/admin/users
```

Supports:

* Search
* Filtering
* Sorting

Possible query parameters:

```text
?name=John
?email=user@example.com
?address=Pune
?role=USER
?sortBy=name
?order=asc
```

---

## Get User Details

```http
GET /api/admin/users/:id
```

Returns:

```json
{
  "id": 1,
  "name": "Example User Full Name",
  "email": "user@example.com",
  "address": "Example Address",
  "role": "STORE_OWNER"
}
```

For store owners, relevant store rating information can also be included.

---

## Create Store

```http
POST /api/admin/stores
```

Request:

```json
{
  "name": "Example Store Name",
  "email": "store@example.com",
  "address": "Example Store Address",
  "ownerId": 5
}
```

---

## Get Stores

```http
GET /api/admin/stores
```

Supports:

* Name filtering
* Email filtering
* Address filtering
* Sorting

---

# 18. Normal User APIs

## Get Stores

```http
GET /api/stores
```

Supports:

```text
?name=
?address=
?sortBy=
?order=
```

The response should include:

* Store name
* Address
* Overall rating
* Current user's rating

Example:

```json
{
  "id": 1,
  "name": "Example Store",
  "address": "Pune",
  "overallRating": 4.2,
  "userRating": 5
}
```

If the user has not rated the store:

```json
"userRating": null
```

---

## Submit Rating

```http
POST /api/stores/:storeId/ratings
```

Request:

```json
{
  "rating": 5
}
```

The backend verifies that:

* User is authenticated.
* User has the normal user role.
* Store exists.
* Rating is between 1 and 5.
* User has not already rated the store.

---

## Modify Rating

```http
PUT /api/stores/:storeId/ratings
```

Request:

```json
{
  "rating": 4
}
```

The existing rating is updated.

---

# 19. Store Owner APIs

## Owner Dashboard

```http
GET /api/owner/dashboard
```

The response should contain:

* Store information
* Average rating
* Rating count
* Users who submitted ratings
* Submitted ratings

Example:

```json
{
  "store": {
    "id": 1,
    "name": "Example Store",
    "averageRating": 4.3
  },
  "ratings": [
    {
      "userName": "Example User Full Name",
      "userEmail": "user@example.com",
      "rating": 5
    }
  ]
}
```

---

# 20. Search

Normal users can search stores by:

* Store name
* Store address

Example:

```text
GET /api/stores?name=mart
```

or:

```text
GET /api/stores?address=Pune
```

The backend should use parameterized queries to avoid SQL injection.

---

# 21. Filtering

Administrator listings should support filtering by:

* Name
* Email
* Address
* Role

Filters should be optional and combinable.

Example:

```text
/api/admin/users?role=USER&address=Pune
```

---

# 22. Sorting

Tables must support ascending and descending sorting.

Example:

```text
?sortBy=name&order=asc
```

and:

```text
?sortBy=name&order=desc
```

Possible sortable fields:

* Name
* Email
* Address
* Role
* Rating

The backend should validate allowed sort fields instead of directly inserting arbitrary user input into SQL.

---

# 23. Frontend Pages

The React application will contain the following main pages.

## Public Pages

```text
/login
/register
```

---

## Administrator Pages

```text
/admin/dashboard
/admin/users
/admin/users/:id
/admin/stores
```

---

## Normal User Pages

```text
/stores
/change-password
```

---

## Store Owner Pages

```text
/owner/dashboard
/change-password
```

---

# 24. Frontend Component Structure

Possible component structure:

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── RoleRoute.jsx
│   ├── SearchBar.jsx
│   ├── SortableTable.jsx
│   ├── RatingInput.jsx
│   └── Loading.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ChangePassword.jsx
│   │
│   ├── admin/
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── UserDetails.jsx
│   │   └── Stores.jsx
│   │
│   ├── user/
│   │   └── Stores.jsx
│   │
│   └── owner/
│       └── Dashboard.jsx
│
├── services/
│   └── api.js
│
├── context/
│   └── AuthContext.jsx
│
├── App.jsx
└── main.jsx
```

The exact structure may be adjusted during implementation.

---

# 25. Backend Folder Structure

Recommended Express structure:

```text
server/
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── storeController.js
│   │   └── ownerController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── storeRoutes.js
│   │   └── ownerRoutes.js
│   │
│   ├── validators/
│   │   └── validation.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── README.md
```

---

# 26. Environment Variables

Sensitive configuration must not be committed to GitHub.

Example `.env`:

```text
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ratenest

JWT_SECRET=your_secret_key
```

`.env` must be included in `.gitignore`.

An `.env.example` file should be committed instead:

```text
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ratenest

JWT_SECRET=
```

---

# 27. Error Handling

The backend should return consistent JSON error responses.

Example:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Common HTTP status codes:

```text
200 → Successful request
201 → Resource created
400 → Validation error
401 → Authentication required / invalid credentials
403 → Insufficient permissions
404 → Resource not found
409 → Duplicate resource
500 → Internal server error
```

---

# 28. Security Requirements

The application should follow these security practices:

* Hash passwords using bcrypt.
* Never store plain-text passwords.
* Use JWT authentication.
* Protect private routes.
* Implement backend role authorization.
* Validate all incoming data.
* Use parameterized SQL queries.
* Do not expose database passwords.
* Do not commit `.env`.
* Validate rating values server-side.
* Prevent users from modifying another user's ratings.
* Prevent normal users from creating administrator or store owner accounts through public registration.

---

# 29. Database Best Practices

The database should:

* Use primary keys.
* Use foreign keys.
* Use appropriate data types.
* Use unique constraints where required.
* Use indexes for frequently searched fields.
* Avoid unnecessary duplicate data.
* Maintain referential integrity.
* Use transactions where multiple related operations must succeed together.

Potential indexes:

```text
users.email
users.name
users.role
stores.name
stores.address
ratings.user_id
ratings.store_id
```

---

# 30. Important Business Rules

1. Every user email must be unique.
2. Normal users can register themselves.
3. Public registration always creates a `USER` account.
4. Administrators can create other roles.
5. A user can submit only one rating per store.
6. Existing ratings can be modified.
7. Ratings must be integers from 1 to 5.
8. A user cannot modify another user's rating.
9. Store owners can only view rating information related to their own stores.
10. Passwords must satisfy the specified password rules.
11. Authentication and authorization must be enforced by the backend.
12. Users should not be able to access dashboards belonging to other roles.

---

# 31. Testing Strategy

Testing should cover the following scenarios.

## Authentication

* Register valid user.
* Reject invalid name.
* Reject invalid email.
* Reject invalid password.
* Reject duplicate email.
* Login with valid credentials.
* Reject incorrect credentials.
* Change password.
* Reject incorrect current password.

## Administrator

* Login as administrator.
* View dashboard.
* Create user.
* Create store.
* View users.
* View stores.
* Filter users.
* Sort users.
* Filter stores.
* Sort stores.
* View user details.

## Normal User

* Register.
* Login.
* View stores.
* Search stores.
* Sort stores.
* Submit rating.
* Reject rating below 1.
* Reject rating above 5.
* Modify rating.
* Verify overall store rating changes.

## Store Owner

* Login.
* View dashboard.
* View average rating.
* View users who rated the store.
* Verify owner cannot access administrator functionality.

## Authorization

Test that:

* Normal users cannot access admin APIs.
* Store owners cannot access admin APIs.
* Users cannot access another user's rating.
* Unauthenticated users cannot access protected APIs.

---

# 32. Git Workflow

The project will be maintained using Git.

Suggested workflow:

```bash
git add .
git commit -m "Initial project documentation"
git push origin main
```

During development, commits should describe meaningful changes.

Examples:

```text
feat: add authentication APIs
feat: add store rating functionality
feat: add admin dashboard
feat: add store owner dashboard
fix: validate rating range
fix: resolve authentication issue
```

---

# 33. README Requirements

The main `README.md` should eventually contain:

* Project name
* Project description
* Features
* Technology stack
* Screenshots
* Setup instructions
* Environment variables
* Database setup
* How to run backend
* How to run frontend
* API overview
* Test credentials
* Future improvements

The README should only claim features that have actually been implemented.

---

# 34. Implementation Order

Development should follow this order.

## Phase 1 — Project Setup

* Initialize Git repository.
* Create frontend and backend folders.
* Initialize React.
* Initialize Express.
* Install required dependencies.
* Configure MySQL.
* Create environment variables.
* Create database.

## Phase 2 — Database

* Create users table.
* Create stores table.
* Create ratings table.
* Add relationships.
* Add constraints.
* Add indexes.
* Insert initial administrator account.

## Phase 3 — Backend Foundation

* Configure Express.
* Configure database connection.
* Create API structure.
* Add error handling.
* Add validation.

## Phase 4 — Authentication

* Registration.
* Login.
* Password hashing.
* JWT generation.
* Authentication middleware.
* Role middleware.
* Change password.

## Phase 5 — Administrator

* Dashboard statistics.
* User creation.
* Store creation.
* User listing.
* Store listing.
* Filtering.
* Sorting.
* User details.

## Phase 6 — Normal User

* Store listing.
* Search.
* Sorting.
* Overall ratings.
* Current user's rating.
* Submit rating.
* Modify rating.

## Phase 7 — Store Owner

* Owner dashboard.
* Average rating.
* Rating users.
* Rating details.

## Phase 8 — Frontend Integration

* Login.
* Registration.
* Protected routes.
* Role-based navigation.
* Admin dashboard.
* User store page.
* Owner dashboard.
* Change password.

## Phase 9 — Testing

* Test all roles.
* Test validation.
* Test authorization.
* Test rating functionality.
* Test search.
* Test filtering.
* Test sorting.
* Fix bugs.

## Phase 10 — Finalization

* Improve UI.
* Add screenshots.
* Update README.
* Verify `.gitignore`.
* Remove sensitive information.
* Add setup instructions.
* Final Git commit.
* Push to GitHub.

---

# 35. Final Project Structure

The expected final repository structure is:

```text
ratenest/
│
├── client/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── server/
│   ├── src/
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── database/
│   └── schema.sql
│
├── README.md
├── PROJECT_DOCUMENTATION.md
└── .gitignore
```

---

# 36. Future Improvements

Possible future improvements include:

* Store images.
* User profile management.
* Pagination for large datasets.
* Advanced analytics.
* Rating distribution charts.
* Email notifications.
* Password reset through email.
* Store categories.
* Location-based store search.
* Deployment to a cloud platform.
* Automated testing and CI/CD.

These features are outside the core assignment requirements and should only be implemented if the required functionality is completed first.

---

# 37. Definition of Done

The project will be considered complete when:

* All three roles can log in.
* Normal users can register.
* Authentication works securely.
* Role-based authorization works.
* Administrators can manage users and stores.
* Dashboard statistics work.
* Normal users can search stores.
* Normal users can submit ratings.
* Normal users can modify ratings.
* Store owners can view their store's ratings.
* All required validations work.
* Search works.
* Filtering works.
* Sorting works.
* Database relationships work correctly.
* Passwords are securely hashed.
* Sensitive configuration is not committed.
* The application can be run from a fresh setup using the documented instructions.
* README and project documentation accurately describe the implemented application.

---

# 38. Development Principle

The project should prioritize:

1. Correct functionality
2. Security
3. Database integrity
4. Clean API design
5. Maintainable code
6. Validation
7. User experience

Complex features should not be added at the expense of completing the required assignment functionality.

This document serves as the initial technical blueprint. It should be updated if implementation decisions change during development.
