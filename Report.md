# RateNest: Project Report and Interview Guide

Written for: you, preparing to explain and defend this project in an interview.

How to use it: read sections 1 to 8 so you can describe the project without notes, then practise the questions in section 9 out loud. Section 10 lists the weak spots an interviewer is likely to find, with honest answers.

---

## 1. What it is (one-minute pitch)

RateNest is a full-stack store rating platform. Registered users find stores and rate them from 1 to 5. Each store's overall rating is the average of all its ratings. There are three roles with one shared login:

- **Normal user:** registers, searches stores, submits and later changes one rating per store.
- **Store owner:** sees the average rating of their store, a chart of ratings over time, and which users rated it.
- **Administrator:** sees platform totals and charts, creates users, store owners and stores, and filters and sorts every list.

The stack is React (Vite) on the front end, Node.js with Express on the back end, MySQL for data, JWT for authentication and bcrypt for password hashing.

## 2. Why it exists (the problem it solves)

- Shoppers have no single trustworthy number for how good a store is. Averaging real user ratings gives one.
- Store owners want to know who rated them and how, without being able to touch other stores.
- A platform needs someone in charge. The administrator manages accounts and stores.
- As a project, it exercises the standard full-stack skills: authentication, role-based authorization, relational design, validation, REST design, search, filtering and sorting.

## 3. When (build timeline from the git history)

1. Initial commit and project documentation (`PROJECT_DOCUMENTATION.md`, the blueprint).
2. Backend authentication and admin APIs.
3. Complete backend APIs and role-based features.
4. User rating feature, then the store owner dashboard.
5. First frontend (single-page state switching, no routing).
6. Frontend rebuilt: React Router, auth context, route guards, design system.
7. Landing page, pagination, toasts, README screenshots.
8. Animated landing page and chart dashboards.

The spec's own implementation order was: setup, database, backend foundation, authentication, admin, user, owner, frontend integration, testing, finalization.

## 4. Tech stack and why each piece was chosen

| Piece | Used | Why |
| --- | --- | --- |
| UI | React 19 + Vite | Component model suits role-based screens. Vite gives fast dev reloads. |
| Routing | react-router-dom | Real URLs per page (`/admin/users`), route guards, back button works. |
| Styling | Plain CSS with design tokens | No framework needed. Tokens in one file keep colors, spacing and type consistent and make dark mode a small override. |
| Charts | Hand-built SVG | No chart library to ship. Full control over animation and accessibility. |
| Server | Node.js + Express 5 | Small, familiar, JSON APIs are quick to build. |
| Database | MySQL (`mysql2` pool) | Data is relational: users, stores and ratings with foreign keys. |
| Auth | JWT (`jsonwebtoken`) | Stateless. The server needs no session store. |
| Passwords | `bcryptjs` | Salted, slow hash. Plain text is never stored. |
| Validation | `express-validator` on the server, matching rules in the browser | Server is the real check. The browser check is for quick feedback. |

## 5. Architecture

```text
React (browser)
   |  HTTP + JSON, Authorization: Bearer <token>
   v
Express API  ->  routes -> middleware (authenticate, authorize, validate) -> controllers
   |
   v
MySQL (users, stores, ratings)
```

**Backend layout**

- `routes/` maps URLs to controllers and attaches middleware.
- `middleware/auth.js` verifies the JWT and puts `{ id, role }` on the request.
- `middleware/role.js` (`authorize("ADMIN")`) rejects roles that are not allowed with 403.
- `middleware/validate.js` turns express-validator results into a 400 response.
- `controllers/` hold the SQL and business logic.

**Frontend layout**

- `services/api.js` is the only place that calls `fetch`. It adds the token, normalises errors, and signs the user out on a 401.
- `context/AuthContext.jsx` holds the user and token (saved in `localStorage`).
- `components/ProtectedRoute` requires a login. `RoleRoute` requires a matching role. Both are convenience only. The server enforces access.
- `pages/` are grouped by role: `admin/`, `user/`, `owner/`.
- `hooks/useAsync` loads data and keeps old data visible while refetching.

## 6. Database design

Three tables.

- **users:** `id`, `name` (60), `email` (unique), `password_hash`, `address` (400), `role` (`ADMIN`, `USER`, `STORE_OWNER`), timestamps. Indexed on name and role.
- **stores:** `id`, `name`, `email`, `address`, `owner_id` (nullable foreign key to users, `ON DELETE SET NULL`), timestamps. Indexed on name and address.
- **ratings:** `id`, `user_id`, `store_id`, `rating` (TINYINT with `CHECK rating BETWEEN 1 AND 5`), timestamps. Foreign keys with `ON DELETE CASCADE`.

Key constraint: `UNIQUE (user_id, store_id)` means one rating per user per store. Updating a rating changes the row. It does not add one.

Relationships: one user has many ratings, one store has many ratings, one store owner can own stores.

Why the average is not stored: it is calculated with `AVG(rating)` in SQL each time. A stored average could drift out of sync with the ratings table.

## 7. Features and how each works

**Authentication**
- Register: validates input, rejects duplicate email (409), hashes the password with bcrypt (10 rounds), inserts the row with role fixed to `USER`. The role is never read from the request body.
- Login: finds the user by email, compares with `bcrypt.compare`, signs a JWT containing `{ id, role }` that expires in 1 day.
- Change password: needs a valid token, checks the current password, validates the new one, stores a new hash.

**Validation rules (browser and server)**
- Name: 20 to 60 characters. Address: up to 400. Email: valid format and unique.
- Password: 8 to 16 characters, at least one uppercase letter and one special character.
- Rating: an integer from 1 to 5.

**Normal user**
- `GET /api/stores` returns each store with its overall average and the current user's own rating (a second `LEFT JOIN` on the user's rating).
- `POST /api/ratings` creates a rating. A duplicate gets 409.
- `PUT /api/ratings` changes the existing rating. If none exists, 404.
- The UI filters by name and address (debounced) and sorts by name or rating.

**Store owner**
- `GET /api/owner/dashboard` returns only stores where `owner_id` is the logged-in user, with average rating and every rating (user name, email, score, date). The `WHERE s.owner_id = ?` clause is what stops an owner seeing another store.

**Administrator**
- `GET /api/admin/dashboard` returns totals, accounts by role, ratings per score, ratings per day for 14 days, and the top 5 stores.
- `POST/GET /api/admin/users`, `GET /api/admin/users/:id`, `POST/GET /api/admin/stores` with filters (name, email, address, role) and sorting.
- Sort fields come from a whitelist object, not from raw user input.

## 8. Security: what protects what

| Concern | Measure |
| --- | --- |
| Stolen database | Only bcrypt hashes are stored. |
| SQL injection | Every query uses `?` placeholders. Sort column and direction come from a whitelist. |
| Privilege escalation | Public registration hard-codes the role to `USER`. Admin and owner accounts are created only by an admin. |
| Role bypass in the UI | The server checks the role on every protected route (`authorize`). Hiding a page in React is not security. |
| Reading another user's data | Queries filter by the id inside the verified token, not an id sent by the client. |
| Invalid ratings | Checked in the server and by a database `CHECK` constraint. |
| Secrets | `.env` is in `.gitignore`. `.env.example` is committed instead. |

## 9. Interview questions and answers

### Project overview

**Q1. Describe your project in one minute.**
A store rating platform with three roles. Users rate stores from 1 to 5, owners see who rated their store, and admins manage users and stores. React front end, Express and MySQL back end, JWT auth. The overall rating is an average calculated from the ratings table.

**Q2. Why did you build it?**
To practise the core full-stack pieces together: authentication, role-based authorization, a normalised relational schema, validation, and search, filter and sort. It also had a clear business rule (one rating per user per store, editable) that needed the database and the API to agree.

**Q3. Who are the users?**
Shoppers who rate, store owners who monitor, and an administrator who runs the platform.

**Q4. What was the hardest part?**
Keeping one rule consistent in all layers: one rating per user per store. It is enforced by a unique constraint in the database, checked in the API (409 on duplicate), and reflected in the UI (the button reads "Update rating" once you have rated). Another was making authorization correct on the server rather than trusting the UI.

### Architecture and decisions

**Q5. Why React and Node?**
One language across the stack, a large ecosystem, and JSON moves between front and back end without translation. React's components fit screens that differ by role.

**Q6. Why MySQL and not MongoDB?**
The data is relational and the rules are relational. Foreign keys, a unique constraint on (user, store), and aggregate queries like `AVG` and `GROUP BY` are natural in SQL. A document store would make the one-rating-per-user rule and the averages harder to guarantee.

**Q7. Why JWT instead of sessions?**
Stateless: the server verifies the signature and needs no session table. That makes it simple to run. The trade-off is that a token cannot be revoked before it expires (see section 10).

**Q8. Why not store the average rating in the stores table?**
It would duplicate data and could become wrong if a rating changed and the average was not updated in the same transaction. Computing with `AVG` keeps a single source of truth. If performance ever needed it, I would cache it or use a summary table updated transactionally.

**Q9. How is the code organised on the server?**
Routes, middleware, controllers, validators, and a config module for the database pool. Middleware handles the cross-cutting concerns (auth, role, validation) so controllers only hold business logic.

**Q10. Why hand-built charts instead of a chart library?**
The charts are simple (line, columns, ranked bars, stacked bar, gauge). Building them in SVG avoids a dependency, keeps the bundle small, and gave full control of the animation and the screen-reader table behind each line chart. For many chart types or heavy interaction I would use a library.

### Authentication and security

**Q11. Walk me through login.**
The browser posts email and password. The server looks up the user by email, runs `bcrypt.compare` against the stored hash, and on success signs a JWT with the user id and role (1 day expiry). The front end stores it and sends it as `Authorization: Bearer <token>`. If the server returns 401 for a protected call, the client clears the session and goes to login.

**Q12. How are passwords stored?**
As a bcrypt hash with 10 salt rounds. bcrypt is deliberately slow and includes a salt, so identical passwords produce different hashes and brute force is expensive. The password and hash are never returned by the API.

**Q13. How does the server know a request is from an admin?**
The `authenticate` middleware verifies the token signature and expiry and sets `req.user = { id, role }`. Then `authorize("ADMIN")` checks the role and returns 403 otherwise. The role comes from the signed token, so the client cannot change it.

**Q14. Is the React route guard enough?**
No. It only hides pages. Someone can call the API directly with a tool, so every protected endpoint checks the role on the server.

**Q15. How do you prevent SQL injection?**
Parameterised queries with `?` placeholders through `mysql2`. For sorting, where a column name cannot be a placeholder, I map the requested field through a whitelist and fall back to a default.

**Q16. Where do you store the token and is that safe?**
In `localStorage`. It is simple, but readable by any script on the page, so an XSS bug could steal it. React escapes output by default, which reduces that risk. A more defensive option is an httpOnly, secure, SameSite cookie, with CSRF protection.

**Q17. How do you stop a user registering as an admin?**
The register endpoint ignores any role in the request and inserts `'USER'`. Only an authenticated admin can create other roles.

**Q18. What happens if a user's token is stolen?**
It stays valid until it expires (1 day). Mitigations I would add: shorter token life with a refresh token, a revocation list, and HTTPS only.

### Database

**Q19. How do you guarantee one rating per user per store?**
A `UNIQUE (user_id, store_id)` constraint, plus an API check that returns 409. The constraint is the real guarantee, because it also protects against two simultaneous requests.

**Q20. What do the foreign keys do on delete?**
Deleting a user or store cascades to its ratings. Deleting a store owner sets `stores.owner_id` to NULL, so the store stays but has no owner.

**Q21. How is the overall rating computed?**
`AVG(rating)` grouped by store, rounded to two decimals, with `LEFT JOIN` so stores with no ratings still appear (shown as 0 or "No ratings yet").

**Q22. What indexes did you add and why?**
On `users.name`, `users.role`, `stores.name` and `stores.address`, because those are searched and filtered. `users.email` is indexed by its unique constraint. The `(user_id, store_id)` unique key covers lookups by user.

**Q23. A `LIKE '%text%'` search can't use an index. Is that a problem?**
At this size no. With large data I would use a full-text index or a search service.

**Q24. Explain the query that returns a store plus the current user's rating.**
It joins `ratings` twice: once as `allRatings` to compute the average over everyone, and once as `userRating` restricted to the current user id to pull that user's own score. It groups by store and selects both.

### API design

**Q25. What do your status codes mean?**
200 success, 201 created, 400 validation error, 401 not logged in or bad token or wrong credentials, 403 logged in but not allowed, 404 not found, 409 duplicate, 500 server error.

**Q26. Why separate 401 and 403?**
401 means "we don't know who you are". 403 means "we know, and you are not allowed". The front end reacts differently: 401 logs you out.

**Q27. The spec says `POST /api/stores/:storeId/ratings`, but you used `POST /api/ratings`. Why?**
I built the endpoint with the store id in the body. Both work, but the nested path is more RESTful. It is on my list to align the code with the spec. (Be upfront about this.)

**Q28. How do you handle errors consistently?**
Every error response is `{ success: false, message }`, and validation errors add an `errors` array. The front end's single `request` function reads either and throws an Error with a readable message that the UI shows.

### Frontend

**Q29. How does the front end know what to show per role?**
After login the user object holds the role. `RoleRoute` only renders a page for allowed roles and otherwise redirects to that role's home page. The navigation links also come from a per-role list.

**Q30. How do you manage server data?**
A small `useAsync` hook: it runs a fetch whenever its dependencies change, keeps previous data while refetching, and exposes `loading`, `error` and `reload`. For a bigger app I would use TanStack Query for caching and deduplication.

**Q31. How do search inputs avoid hitting the API on every keystroke?**
A `useDebounce` hook waits 300 ms after typing stops before the value used in the request changes.

**Q32. How is form validation done?**
Shared rules in `utils/validation.js` mirror the server. Fields validate on blur, errors show below the field and are linked with `aria-describedby`. The server still validates everything, and its messages are shown if it rejects.

**Q33. How did you handle accessibility?**
Labelled fields, a skip link, visible focus styles, the rating input as a keyboard-friendly radio group, `aria-sort` on sortable table headers, native `<dialog>` for modals, a table version of the line chart for screen readers, and `prefers-reduced-motion` support for all animation.

**Q34. How are the animations done and are they safe for performance?**
CSS transitions and keyframes using only `transform` and `opacity` (plus stroke dash offsets for lines). An `IntersectionObserver` triggers them when the element scrolls into view. Scroll position is passed to CSS through a custom property, updated at most once per animation frame.

**Q35. How is pagination implemented?**
Client-side. The API returns the full filtered list and a `usePagination` hook slices 10 rows per page, resetting to page 1 when the filters or sort change. For large data I would move it to the server with `LIMIT` and `OFFSET`.

### Testing and quality

**Q36. How did you test it?**
I ran lint and a production build, and clicked through each role against a real database. I also took screenshots of every page. The spec lists a test plan (auth, authorization, rating bounds, search, sort). Automated tests are not written yet.

**Q37. What would your automated tests cover?**
API tests with a test database: register and login, wrong password, duplicate email, role access (user gets 403 on admin routes), rating below 1 or above 5, updating a rating changes the average. Component tests for validation and route guards.

### Scaling and improvement

**Q38. What would break first at scale?**
Unpaginated list endpoints, `LIKE '%x%'` searches, and averages computed on every list request. Fixes: server-side pagination, full-text search, caching or a summary table, and a database index review.

**Q39. What would you improve next?**
Automated tests, server-side pagination, rate limiting on login, restricting CORS to the client origin, failing fast when `JWT_SECRET` is missing, a central error handler, and httpOnly cookie auth.

**Q40. How would you deploy it?**
Build the React app to static files and host them on a CDN or static host. Run the Express API on a Node host with environment variables, a managed MySQL instance, HTTPS, and CORS restricted to the front end's domain.

## 10. Honest weak spots (be ready for these)

An interviewer who reads the code may find these. Admit them and say how you would fix them. That reads as maturity, not weakness.

1. **No automated tests yet.** Verified by hand, lint and build only.
2. **Token in `localStorage`.** Exposed if an XSS bug exists. Fix: httpOnly cookie.
3. **No login rate limiting.** Allows password guessing. Fix: `express-rate-limit`.
4. **CORS is open (`cors()`).** Fix: allow only the front end origin.
5. **`JWT_SECRET` not checked on startup.** A missing secret fails at login. Fix: fail fast.
6. **Race on rating creation.** The API checks for an existing rating and then inserts. Two simultaneous requests could both pass the check. The unique constraint still prevents a duplicate row, but the second request returns a 500 instead of a clean 409. Fix: catch the duplicate-key error.
7. **Admin cannot change their own password.** The server route allows only users and store owners.
8. **Rating routes differ from the spec** (`/api/ratings` with a body, not `/api/stores/:id/ratings`).
9. **Pagination is client-side**, so large tables load fully.
10. **No central error middleware** and no request logging.
11. **A store owner is linked to a store only by an admin at creation.** There is no screen to reassign an owner later.
12. **`LIKE '%text%'` searches** do not use indexes.

## 11. Quick facts to memorise

- Roles: `ADMIN`, `USER`, `STORE_OWNER`.
- Name 20 to 60 characters, address max 400, password 8 to 16 with an uppercase letter and a special character.
- Rating is an integer from 1 to 5. One per user per store, editable.
- JWT payload: `{ id, role }`, expiry 1 day. bcrypt rounds: 10.
- Ports: API 5000, front end 5173 in development.
- Seed admin: created by `server/createAdmin.js`.
- Run: `npm run dev` in `server/` and in `client/`.
- Key files: `server/src/middleware/auth.js`, `server/src/middleware/role.js`, `server/src/controllers/storeController.js`, `database/schema.sql`, `client/src/services/api.js`, `client/src/App.jsx`.
