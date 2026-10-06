# EverLocker CEP — Project Explanation Guide

> **Team Size:** 4 Members
> **Topic:** Training on DigiLocker, Aadhaar and PAN Services
> **Tech Stack:** HTML · CSS · JavaScript · Node.js · Express · MongoDB Atlas · Nodemailer

---

## Table of Contents

- [Overall Project Flow](#overall-project-flow)
- [Architecture Overview](#architecture-overview)
- [Codebase Summary](#codebase-summary)
- [Member 1 — HTML Pages & Navigation](#member-1--html-pages--navigation)
- [Member 2 — CSS Styling & Responsive Design](#member-2--css-styling--responsive-design)
- [Member 3 — JavaScript Quiz & Frontend Logic](#member-3--javascript-quiz--frontend-logic)
- [Member 4 — Node.js API, MongoDB & Admin Dashboard](#member-4--nodejs-api-mongodb--admin-dashboard)

---

## Overall Project Flow

EverLocker is a training website that helps users learn about three Indian government digital services — **DigiLocker**, **Aadhaar**, and **PAN**. The website provides educational content, an FAQ section, a common-issues guide, a help form for asking questions, an interactive quiz, and an admin dashboard where an author can reply to learner questions.

### How the full system works (end to end):

```
User opens the website (index.html)
        │
        ├── Reads learning content (Services, Issues, FAQ sections)
        │
        ├── Plays the Quiz (client-side JavaScript)
        │
        ├── Submits a Help Query (form → POST /api/queries → MongoDB Atlas)
        │
        ├── Registers / Logs in (form → POST /api/auth/register or /login → JWT token)
        │
        └── If admin → redirected to admin.html
                │
                ├── Views all learner queries (GET /api/admin/queries → MongoDB Atlas)
                │
                ├── Replies to a query (PUT /api/admin/queries/:id → MongoDB update)
                │
                └── Optional email notification sent to the learner (Nodemailer → SMTP)
```

### Data flow in one sentence:

> **Frontend sends requests → Express API processes them → MongoDB Atlas stores/retrieves data → response goes back to frontend.**

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│  index.html  ·  admin.html  ·  app.js  ·  style.css    │
│         (Served via Live Server / Netlify)               │
└────────────────────────┬────────────────────────────────┘
                         │ fetch() API calls
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)             │
│                     server.js                            │
│   Routes: /api/auth  ·  /api/queries  ·  /api/documents  │
│   Middleware: CORS  ·  JWT auth  ·  Admin check           │
│   Helpers: mail.js  ·  create-admin.js                    │
└────────────────────────┬────────────────────────────────┘
                         │ MongoDB driver
                         ▼
┌─────────────────────────────────────────────────────────┐
│              DATABASE (MongoDB Atlas — Cloud)             │
│   Collections: Users  ·  Queries  ·  Documents            │
└─────────────────────────────────────────────────────────┘
```

### Tech stack explained:

| Technology | What it does in our project |
|---|---|
| **HTML** | Structure of all pages (index.html, admin.html) |
| **CSS** | Styling, layout, responsiveness (style.css) |
| **JavaScript** | Quiz game, login/register modal, form submissions (app.js) |
| **Node.js** | Backend runtime that runs our API server |
| **Express** | Framework for building REST API routes |
| **MongoDB Atlas** | Cloud database — stores users, queries, documents |
| **JWT** | JSON Web Token — used for login sessions (8 hour expiry) |
| **bcryptjs** | Hashes passwords before storing them in the database |
| **Nodemailer** | Sends email notifications when admin replies to a query |
| **Multer** | Handles file uploads in the demo document feature |

---

## Codebase Summary

### Folder structure:
```
CEP/
├── frontend/
│   ├── index.html          ← Main website (home, services, FAQ, help, quiz)
│   ├── admin.html          ← Admin support dashboard
│   ├── app.js              ← Frontend JavaScript (quiz, auth, forms)
│   ├── style.css           ← All CSS for both pages
│   └── admin/index.html    ← Redirect to admin.html
├── backend/
│   ├── server.js           ← Express API (all routes and middleware)
│   ├── mail.js             ← Email helper (Nodemailer)
│   ├── create-admin.js     ← CLI script to create an admin user
│   ├── package.json        ← Dependencies list
│   ├── .env                ← Secret config (not in Git)
│   └── .env.example        ← Template for .env
├── database/
│   └── schema.sql          ← Legacy SQL schema (reference only)
├── README.md               ← Setup instructions
├── PROJECT_PLAN.md         ← Module list and future improvements
└── .gitignore              ← Keeps node_modules and .env out of Git
```

### API Endpoints (what the backend provides):

| Method | URL | Who can use it | What it does |
|---|---|---|---|
| GET | `/api/health` | Anyone | Returns `{ ok: true }` — checks if server is running |
| POST | `/api/auth/register` | Anyone | Creates a new user account |
| POST | `/api/auth/login` | Anyone | Returns a JWT token if email/password match |
| POST | `/api/queries` | Anyone | Saves a help query to the database |
| GET | `/api/admin/queries` | Admin only | Returns all queries (newest first) |
| PUT | `/api/admin/queries/:id` | Admin only | Saves admin's reply, marks query as Resolved |
| POST | `/api/documents` | Anyone | Uploads a demo document (max 5 MB) |
| GET | `/uploads/:filename` | Anyone | Downloads a previously uploaded document |
| GET | `/api/admin/documents` | Admin only | Lists all uploaded documents |

### MongoDB Collections:

| Collection | What it stores |
|---|---|
| **Users** | Name, Email (unique), PasswordHash, Role (user/admin), CreatedAt |
| **Queries** | Name, Email, Category, Question, Reply, Status (Pending/Resolved), CreatedAt, RepliedAt |
| **Documents** | UserName, DocumentType, OriginalFileName, StoredFileName, file content (binary), UploadedAt |

---

## Member 1 — HTML Pages & Navigation

### What I built:
The complete HTML structure of both pages — the **main website** (`index.html`) and the **admin dashboard** (`admin.html`). This includes the page layout, all sections, navigation, forms, and semantic HTML structure.

### Key files:
- `frontend/index.html` — 197 lines
- `frontend/admin.html` — 438 lines (HTML structure + inline script)
- `frontend/admin/index.html` — redirect page

### Sections I created in index.html:

| Section | HTML ID | What it contains |
|---|---|---|
| Header / Navbar | — | Brand logo, navigation links (Home, Services, Issues, FAQ, Help, Quiz), Login button |
| Hero | `#home` | Welcome message, project description, call-to-action buttons, feature checklist card |
| Services | `#services` | Three cards — DigiLocker, Aadhaar, PAN — with descriptions and official links |
| Common Issues | `#issues` | Four numbered issue cards with problems and solutions |
| FAQ | `#faq` | Six collapsible `<details>` elements with DigiLocker questions and answers |
| Official Resources | `#tutorials` | Two embedded YouTube videos and links to official portals |
| Help Form | `#help` | Form with name, email, category dropdown, textarea, and submit button |
| Quiz | `#quiz` | Container for quiz question, options, next button, and result display |
| Footer | — | Project name, description, official resource links |
| Login Modal | `#loginModal` | Login/register form with email, password, name field, and mode switcher |

### How navigation works:
- The navbar uses **anchor links** (`#home`, `#services`, etc.) for smooth scrolling within the same page.
- CSS `scroll-behavior: smooth` makes the scrolling animated.
- The Login button opens a **modal popup** instead of navigating to a new page.
- Admin login automatically redirects to `admin.html` using `location.href`.

### Admin dashboard HTML structure:
- **Auth gate** — login form shown before dashboard (blocks non-admin users)
- **Welcome section** — greeting with admin's name and refresh button
- **Stats cards** — three cards showing total, pending, and resolved query counts
- **Inbox** — search bar, filter toolbar (All / Needs reply / Replied), query list
- **Query cards** — each card shows category, question, user info, reply textarea, and save button

### Viva Q&A:

**Q: Why is the website a single HTML page instead of multiple pages?**
A: We used a single-page design with anchor-based navigation (`#services`, `#faq`, etc.) so users can scroll through all content smoothly without page reloads. The admin dashboard is a separate page because it has a different audience and layout.

**Q: What is semantic HTML and where did you use it?**
A: Semantic HTML means using tags that describe their meaning — like `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`, `<details>`. We used `<section>` for each content block, `<article>` for cards, `<details>/<summary>` for FAQ, `<nav>` for navigation links, and proper `<form>` and `<label>` for all forms.

**Q: How does the login modal work?**
A: The modal is a `<div>` with class `modal hidden` that sits at the bottom of the HTML. When the Login button is clicked, JavaScript removes the `hidden` class to show it. Clicking the close button or clicking outside the box adds `hidden` back. The form inside switches between Login and Sign-up modes using JavaScript.

**Q: Why is there an `admin/index.html` file?**
A: It's a simple redirect page. If someone navigates to `/admin/` instead of `/admin.html`, this page automatically redirects them to the correct admin dashboard using both `<meta http-equiv="refresh">` and JavaScript `location.replace()`.

---

## Member 2 — CSS Styling & Responsive Design

### What I built:
The complete visual design of the project — color scheme, typography, layout, card styles, form styling, modal design, admin dashboard styling, and responsive breakpoints for mobile devices.

### Key file:
- `frontend/style.css` — 142 lines (compressed), ~19 KB

### Design system:

**CSS Variables (root tokens):**
```css
:root {
  --bg: #f5f9ff;        /* Page background — light blue-white */
  --surface: #ffffff;    /* Card backgrounds */
  --text: #1f2d3d;       /* Primary text color */
  --muted: #66788a;      /* Secondary text color */
  --primary: #4b7bec;    /* Primary blue (buttons, links) */
  --primary2: #79a7ff;   /* Lighter blue */
  --border: #dce8f5;     /* Card borders */
  --soft: #edf5ff;       /* Soft background sections */
  --shadow: 0 14px 40px rgba(52,94,150,.10);  /* Card shadow */
}
```

**Fonts used:**
- **Baloo 2** (Google Fonts) — headings and brand name (bold, friendly)
- **Poppins** (Google Fonts) — body text and navigation (clean, modern)
- **DM Sans + Manrope** — admin dashboard (professional, compact)

### Major components styled:

| Component | CSS Classes | Design Details |
|---|---|---|
| Top navbar | `.topbar` | Sticky, semi-transparent white with backdrop blur, border bottom |
| Brand logo | `.brand`, `.brand-mark` | Blue square with rounded corners, "E" letter |
| Buttons | `.primary-btn`, `.secondary-btn`, `.outline-btn` | Rounded (12px), shadows on primary, border on outline |
| Hero section | `.hero`, `.hero-card` | Two-column grid, gradient card with feature checklist |
| Service cards | `.info-card`, `.icon` | White cards with colored icon badges (blue/mint/lavender) |
| Issue cards | `.issue`, `.issue-no` | Grid layout with large blue number + description |
| FAQ | `.faq-wrap details` | Expandable cards using native `<details>` element |
| Video section | `.video-grid`, `.video-card` | Two-column grid with 16:9 aspect-ratio iframes |
| Help form | `.form-card`, `label`, `input` | Clean inputs with focus border color change |
| Quiz | `.quiz-card`, `.quiz-option` | Option buttons with selected state highlight |
| Login modal | `.modal`, `.modal-box` | Centered overlay with white card and shadow |
| Footer | `footer` | Dark background (#17283e) with light text |
| Admin dashboard | `.admin-page`, `.admin-*` | Completely separate design system with its own tokens |

### Responsive design:

**Breakpoint: 850px (tablet/mobile)**
```
- Navigation bar hidden
- Hero section: single column
- Service cards: single column
- Video grid: single column
- Help form: single column
- Footer: stacked vertically
```

**Breakpoint: 700px (admin dashboard mobile)**
```
- Admin topbar: compact padding
- Stats cards: tighter spacing
- Inbox heading: stacked
- Query cards: smaller text
- Filters: full-width, smaller font
```

**Breakpoint: 390px (small phones — admin)**
```
- Brand section text hidden
- Stats: single column
- Even smaller text sizes
```

### Admin dashboard design:
The admin page has its **own complete design system** with separate CSS variables:
```css
.admin-page {
  --admin-ink: #202d43;     /* Text */
  --admin-muted: #8290a5;   /* Secondary */
  --admin-line: #e8edf5;    /* Borders */
  --admin-blue: #536ee8;    /* Accent */
  --admin-pale: #f5f8ff;    /* Background */
}
```
This gives the admin page a more **professional, dashboard-like** feel compared to the friendly main website.

### Viva Q&A:

**Q: Why did you use CSS variables?**
A: CSS variables (custom properties) let us define colors, shadows, and spacing in one place. If we want to change the primary blue color, we change it once in `:root` and it updates everywhere. This keeps the design consistent.

**Q: How does the sticky navbar work?**
A: We use `position: sticky; top: 0; z-index: 20;` on the `.topbar`. This makes the navbar scroll with the page until it reaches the top, then it "sticks" there. `backdrop-filter: blur(10px)` adds a frosted-glass effect so content is visible behind it.

**Q: How did you make the website responsive?**
A: We used CSS `@media` queries. When the screen width is below 850px, we change multi-column grids to single columns (`grid-template-columns: 1fr`), hide the navigation bar, and adjust padding/font sizes. This makes the site usable on phones and tablets.

**Q: Why does the admin dashboard have different fonts?**
A: The main site uses Baloo 2 and Poppins for a friendly, educational feel. The admin dashboard uses DM Sans and Manrope for a more professional, compact look suitable for a data-heavy workspace.

---

## Member 3 — JavaScript Quiz & Frontend Logic

### What I built:
All the **client-side interactivity** — the quiz game engine, login/register modal logic, authentication state management, and the help query form submission.

### Key file:
- `frontend/app.js` — 127 lines

### Feature 1: Quiz Game

**How it works:**
1. Five questions are stored in a JavaScript array with options and correct answer index.
2. `renderQuiz()` displays the current question and options as buttons.
3. When a user clicks an option, it gets highlighted (`.selected` class).
4. Clicking "Next Question" checks the answer, updates the score, and moves to the next question.
5. After the last question, the final score is shown with a feedback message.

**Quiz data structure:**
```javascript
const quiz = [
  {
    q: "What is DigiLocker mainly used for?",
    o: ["Digital document access and sharing", "Online gaming", "Food delivery", "Music streaming"],
    a: 0    // correct answer is index 0
  },
  // ... 4 more questions
];
```

**Key variables:**
- `qi` — current question index (starts at 0)
- `score` — number of correct answers
- `selected` — which option the user clicked (null if none)

### Feature 2: Login/Register Modal

**How it works:**
1. The page checks `localStorage` for `everlocker_token` and `everlocker_user`.
2. If a user is logged in, the button shows "Log out (Name)". Otherwise it shows "Login / Sign up".
3. Clicking the button either opens the login modal or logs the user out.
4. The modal can switch between **Login mode** and **Sign-up mode** using `setAuthMode()`.
5. On form submit:
   - **Sign-up:** sends `POST /api/auth/register` → shows success message → switches to login mode.
   - **Login:** sends `POST /api/auth/login` → saves token + user in localStorage → closes modal.
   - If the user has `role: "admin"`, they are **redirected to admin.html** after 400ms.

**API communication:**
```javascript
const r = await fetch(API_BASE + `/auth/${signingUp ? "register" : "login"}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
});
```

### Feature 3: Help Query Submission

**How it works:**
1. User fills in name, email, category, and question in the help form.
2. On submit, JavaScript sends `POST /api/queries` with the form data as JSON.
3. The backend saves it to MongoDB Atlas.
4. A success/error message is shown below the form.

### Feature 4: API Base URL Configuration

```javascript
const API_BASE = localStorage.getItem("everlocker_api") || "https://cep-16gz.onrender.com/api";
```
- By default, the frontend talks to our deployed backend on Render.
- Developers can override this by setting `localStorage.setItem("everlocker_api", "http://localhost:5000/api")` in the browser console.

### Viva Q&A:

**Q: How does the quiz track the score?**
A: We have a variable `score` starting at 0. Each time the user clicks "Next Question", we compare `selected` (the option they chose) with `quiz[qi].a` (the correct answer index). If they match, `score++`. After the last question, we display the total.

**Q: What is localStorage and why do you use it?**
A: `localStorage` is a browser API that stores key-value pairs even after the tab is closed. We use it to store the JWT login token (`everlocker_token`) and user details (`everlocker_user`) so the user stays logged in across page refreshes.

**Q: What is `fetch()` and how is it different from a form submission?**
A: `fetch()` is a JavaScript function that sends HTTP requests to a server and gets back a response — all without reloading the page. A normal HTML form submission causes a full page reload. With `fetch()`, we can send data to the backend, receive JSON, and update the page dynamically.

**Q: What is a JWT token?**
A: JWT (JSON Web Token) is a string that the server creates after a successful login. It contains the user's ID, role, and name — signed with a secret key. The frontend sends this token in the `Authorization` header for protected requests (like admin queries). It expires after 8 hours.

**Q: What happens if the backend is not running?**
A: The `fetch()` call will throw an error, which our `catch` block handles. The user sees a message like "Login failed (Is the backend running?)" — so they know the issue is with the server, not their input.

---

## Member 4 — Node.js API, MongoDB & Admin Dashboard

### What I built:
The entire **backend server**, **database integration**, **admin dashboard logic**, **email notification system**, and the **admin account creation tool**.

### Key files:
- `backend/server.js` — 281 lines (Express API with all routes)
- `backend/mail.js` — 37 lines (Nodemailer email helper)
- `backend/create-admin.js` — 51 lines (CLI tool for creating admin accounts)
- `backend/package.json` — dependencies
- `backend/.env.example` — environment variable template
- `frontend/admin.html` — inline JavaScript for the admin dashboard (lines 118–435)
- `database/schema.sql` — legacy SQL reference (68 lines)

### Backend architecture:

```
server.js
├── Middleware
│   ├── cors()             → Allows frontend to call the API
│   ├── express.json()     → Parses JSON request bodies
│   └── multer             → Handles file uploads (memory storage, 5 MB limit)
│
├── Auth helpers
│   ├── tokenFor(user)     → Creates a JWT with user ID, role, name, email
│   ├── auth(req,res,next) → Middleware that verifies JWT from Authorization header
│   └── admin(req,res,next)→ Middleware that checks if user role is "admin"
│
├── Public routes
│   ├── GET  /api/health           → Returns { ok: true }
│   ├── POST /api/auth/register    → Hashes password with bcrypt, saves user
│   ├── POST /api/auth/login       → Verifies password, returns JWT
│   ├── POST /api/queries          → Saves help query (Pending status)
│   ├── POST /api/documents        → Uploads demo file to MongoDB
│   └── GET  /uploads/:filename    → Serves a stored document
│
└── Protected routes (require JWT + admin role)
    ├── GET  /api/admin/queries    → Returns all queries (newest first)
    ├── PUT  /api/admin/queries/:id → Saves reply, sets status to Resolved
    └── GET  /api/admin/documents  → Lists uploaded document metadata
```

### How authentication works step by step:

```
1. User sends email + password  →  POST /api/auth/login
2. Server finds user in MongoDB by email (case-insensitive)
3. Server compares password with stored hash using bcrypt.compare()
4. If match → server creates JWT token with jwt.sign()
5. Token is sent back to frontend
6. Frontend stores token in localStorage
7. For admin routes, frontend sends: Authorization: Bearer <token>
8. auth() middleware decodes the token with jwt.verify()
9. admin() middleware checks if decoded role === "admin"
10. If both pass → request reaches the route handler
```

### How the email system works:

```
Admin replies to a query
        ↓
server.js calls sendReplyEmail() from mail.js
        ↓
mail.js checks: are SMTP settings configured in .env?
        ├── No  → returns { sent: false } (reply still saved)
        └── Yes → creates Nodemailer transporter
                → sends email to the learner's address
                → returns { sent: true }
        ↓
server.js reports emailStatus ("sent" / "not_configured" / "failed") back to admin
```

### Admin Dashboard (frontend/admin.html — JavaScript):

**Key functions:**
| Function | What it does |
|---|---|
| `showAuth()` / `showDashboard()` | Toggles between login form and dashboard |
| `setAuthMode(mode)` | Switches between login and signup on the auth gate |
| `loadQueries()` | Fetches all queries from the API and renders them |
| `renderQueries()` | Filters and renders query cards based on search and active filter |
| `makeQueryCard(query)` | Builds a complete query card DOM element with reply form |
| `saveReply(query, textarea, button)` | Sends reply to API and updates local state |
| `updateSummary()` | Recalculates and updates the stat cards |
| `formatDate(value)` | Converts ISO date string to readable format |

**Search and filter logic:**
- Search box filters queries by matching the search term against name, email, category, question, and reply text.
- Filter buttons: All / Needs reply / Replied — toggle `activeFilter` variable.
- Both are combined: a query must match the active filter AND contain the search term.

### Database setup:

**MongoDB Atlas** is our cloud database. The backend connects using the connection string from `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=EverLocker
```

On startup, the server:
1. Connects to Atlas with `client.connect()`
2. Opens the `EverLocker` database
3. Creates a unique index on `Users.Email` (prevents duplicate registrations)

### create-admin.js tool:

```bash
node create-admin.js "Admin Name" "admin@everlocker.local" "Admin@123"
```
This script:
1. Connects to MongoDB Atlas using the same `.env` config
2. Uses `updateOne` with `upsert: true` — creates the account if it doesn't exist, or updates it if it does
3. Sets `Role: "admin"` so the account can access the admin dashboard

### Viva Q&A:

**Q: Why MongoDB Atlas instead of SQL Server?**
A: MongoDB Atlas is a cloud database — no need to install anything locally. It stores data as JSON-like documents which works naturally with JavaScript. The `schema.sql` file was our initial reference design; we moved to MongoDB for easier setup and deployment.

**Q: How does bcrypt protect passwords?**
A: `bcrypt.hash(password, 10)` generates a one-way hash with 10 salt rounds. Even if someone accesses the database, they cannot reverse the hash back to the original password. During login, `bcrypt.compare()` checks the entered password against the stored hash without ever storing the plain password.

**Q: What happens if MongoDB is down?**
A: Every route has a `try/catch` block. If MongoDB is unreachable, the `catch` block sends a 500 status with `{ message: "Database error" }`. The frontend shows this error to the user instead of crashing.

**Q: How does JWT authentication work on protected routes?**
A: The `auth` middleware reads the `Authorization: Bearer <token>` header, verifies the token using `jwt.verify()` with the secret key, and attaches the decoded user data to `req.user`. The `admin` middleware then checks `req.user.role === "admin"`. If either check fails, the request is rejected with 401 or 403.

**Q: Why did you use Render for hosting the backend?**
A: Render provides free Node.js hosting with HTTPS support. We deploy the backend there so our frontend (hosted on Netlify or opened locally) can talk to a live API without needing everyone to run Node.js locally.

**Q: What is CORS and why is it needed?**
A: CORS (Cross-Origin Resource Sharing) is a browser security feature that blocks requests from one domain to another by default. Since our frontend (Live Server on port 5500) calls the backend (port 5000 or Render), they are different origins. The `cors()` middleware tells the browser that our API accepts requests from any origin.

---

## Quick Reference — Who Built What

| Member | Contribution | Key Files | Lines of Code |
|---|---|---|---|
| **Member 1** | HTML pages, page structure, navigation, forms, sections | `index.html`, `admin.html` (HTML), `admin/index.html` | ~530 lines |
| **Member 2** | CSS design, color scheme, typography, cards, responsive layout | `style.css` | ~142 lines (19 KB) |
| **Member 3** | Quiz game, login/register modal, auth state, form submission | `app.js` | ~127 lines |
| **Member 4** | Backend API, MongoDB, auth system, admin dashboard JS, email, CLI tool | `server.js`, `mail.js`, `create-admin.js`, `admin.html` (JS), `schema.sql` | ~750+ lines |

---

## How to Demo the Project

1. **Start backend:** `cd backend && npm start` → shows "EverLocker API running on http://localhost:5000"
2. **Open frontend:** Right-click `frontend/index.html` → Open with Live Server
3. **Show the main website:** Scroll through all sections, play the quiz
4. **Submit a help query:** Fill the help form, submit, show success message
5. **Login as admin:** Use the admin credentials created with `create-admin.js`
6. **Show admin dashboard:** View stats, search/filter queries, reply to a query
7. **Check MongoDB Atlas:** Show the Queries collection with the saved data
8. **Show health check:** Open `http://localhost:5000/api/health` in a browser
