# EverLocker — Simple Explanation (Viva Cheat Sheet)

> Read this before your viva. Each member has a short section to explain their work in plain language.

---

## What is this project?

EverLocker is a **training website** that teaches people how to use three Indian government digital services:
- **DigiLocker** — for storing and sharing digital documents
- **Aadhaar** — for identity services (UIDAI)
- **PAN** — for tax-related identity (Income Tax)

It is NOT the real DigiLocker. It is an **educational project** that explains these services, answers user questions, and has a quiz to test knowledge.

---

## How does it work? (Simple version)

```
User opens website
   ↓
Reads about DigiLocker / Aadhaar / PAN
   ↓
Has a question? → Fills the Help form → Data goes to MongoDB Atlas (cloud database)
   ↓
Admin logs in → Sees the question → Types a reply → Reply saved in database
   ↓
(Optional) Email sent to the user with the reply
```

**Three parts of our project:**
1. **Frontend** = What the user sees (HTML + CSS + JavaScript)
2. **Backend** = The server that processes requests (Node.js + Express)
3. **Database** = Where data is stored (MongoDB Atlas — cloud)

---

## Member 1 — I built the HTML pages

### What I did:
I created the **structure** of all the web pages using HTML. Think of HTML as the **skeleton** of the website — it defines what content goes where.

### What I made:
- **Main page** (`index.html`) — has 10 sections:
  - Header with navigation bar and logo
  - Hero section (welcome message with buttons)
  - Services section (3 cards for DigiLocker, Aadhaar, PAN)
  - Common Issues section (4 problems with solutions)
  - FAQ section (6 questions with expandable answers)
  - Official Resources (YouTube videos + government links)
  - Help form (name, email, category, question)
  - Quiz section (container for the quiz game)
  - Footer (project info + links)
  - Login popup (email + password form)

- **Admin page** (`admin.html`) — has:
  - Login form (only admins can enter)
  - Welcome message with admin's name
  - 3 stat cards (total / pending / resolved queries)
  - Search bar and filter buttons
  - List of all user questions with reply boxes

### Simple explanation of my work:
> "I wrote all the HTML code that creates the layout of our website. Every heading, paragraph, button, form, card, and section you see — I structured it using HTML tags like `<header>`, `<section>`, `<form>`, `<article>`, and `<details>`. I also set up the navigation so users can click links to jump to different sections on the same page."

### If asked — key terms:
- **Semantic HTML** = Using tags that describe meaning (`<nav>` for navigation, `<article>` for a card, `<footer>` for bottom section) instead of putting everything in `<div>`
- **Anchor links** = Links like `#faq` that scroll to a section on the same page instead of opening a new page
- **Modal** = A popup box that appears over the page (our login form)
- **`<details>` tag** = HTML element that creates an expandable/collapsible section (used for FAQ)

---

## Member 2 — I built the CSS styling

### What I did:
I designed how the website **looks** — all the colors, fonts, sizes, spacing, shadows, and how it adjusts on phones. CSS is like the **clothes and makeup** of the website.

### What I designed:
- **Color scheme** — soft blue-white theme (`#f5f9ff` background, `#4b7bec` primary blue)
- **Fonts** — Baloo 2 for headings (bold, fun), Poppins for body text (clean, modern)
- **Cards** — white boxes with rounded corners (22px), soft shadows, borders
- **Buttons** — 3 types: filled blue (primary), bordered white (outline), bordered with blue text (secondary)
- **Sticky navbar** — stays at top when you scroll, has a blur effect behind it
- **Responsive design** — website looks good on desktop, tablet, and phone
- **Admin dashboard** — separate professional look with different fonts (DM Sans, Manrope) and darker blue accent (`#536ee8`)

### How responsive design works:
```
Desktop (wide screen)  → 3 columns for cards, 2 columns for help form
Tablet (< 850px)       → 1 column for everything, navbar hidden
Phone (< 700px)        → Smaller text, tighter spacing
Small phone (< 390px)  → Even more compact
```

### Simple explanation of my work:
> "I wrote all the CSS that makes our website look good. I chose the colors, fonts, card designs, and button styles. I also made it responsive — meaning if you open it on a phone, the layout changes from multi-column to single-column so it's still easy to use. I used CSS variables so all colors are defined in one place, and I used `@media` queries to change the design at different screen sizes."

### If asked — key terms:
- **CSS Variables** = Defining a color once (like `--primary: #4b7bec`) and using it everywhere, so changing it in one place updates the whole site
- **`@media` query** = A CSS rule that says "if screen is smaller than 850px, apply these different styles"
- **`position: sticky`** = Makes the navbar stick to the top when scrolling
- **`backdrop-filter: blur()`** = Creates a frosted-glass effect on the navbar
- **`grid-template-columns`** = Defines how many columns a grid has (e.g., `repeat(3, 1fr)` = 3 equal columns)
- **`box-shadow`** = Adds a soft shadow around cards to make them look elevated

---

## Member 3 — I built the JavaScript (quiz + forms)

### What I did:
I wrote the **JavaScript** that makes the website interactive. Without JS, the website would just be static text — JS makes buttons work, forms send data, and the quiz function.

### What I made:

**1. Quiz Game:**
- 5 questions about DigiLocker, Aadhaar, and digital safety
- User clicks an option → it highlights
- User clicks "Next" → answer is checked, score is tracked
- After 5 questions → final score shown ("You scored 4/5")

**2. Login/Register System (frontend side):**
- Click "Login / Sign up" → popup opens
- Can switch between login and register mode
- Sends email + password to the backend using `fetch()`
- If login works → saves the token in browser storage (`localStorage`)
- If user is admin → automatically goes to admin page

**3. Help Form:**
- User fills name, email, category, question
- Clicks "Send Query" → JavaScript sends data to backend → shows success message
- No page reload needed (uses `fetch()` in background)

### Simple explanation of my work:
> "I wrote the JavaScript that makes everything interactive. The quiz game tracks your answers and shows a score at the end. The login system sends your email and password to our backend server and saves a login token in the browser. The help form sends your question to the database without reloading the page. I used `fetch()` to communicate with the backend API and `localStorage` to remember if you're logged in."

### If asked — key terms:
- **`fetch()`** = JavaScript function that sends a request to a server and gets a response, without reloading the page
- **`localStorage`** = Browser storage that saves data even after closing the tab (we store the login token here)
- **JWT (JSON Web Token)** = A login token the server creates. It contains your user ID and role. We send it with every protected request so the server knows who we are.
- **`async/await`** = A way to write code that waits for a server response before continuing (e.g., wait for login response, then save the token)
- **`e.preventDefault()`** = Stops the form from reloading the page when submitted, so we can handle it with JavaScript instead
- **API_BASE** = The URL of our backend server. Default is our Render deployment, but can be changed to localhost for testing.

---

## Member 4 — I built the backend + database + admin dashboard

### What I did:
I built the **server** (Node.js + Express) that handles all requests, connects to **MongoDB Atlas** (cloud database), manages **user authentication** (login/register with hashed passwords), and wrote the **admin dashboard logic** that lets admins reply to user queries.

### What I made:

**1. Backend Server (`server.js`):**
- 9 API routes (endpoints) that the frontend calls
- User registration → password hashed with bcrypt before storing
- User login → password verified → JWT token created and returned
- Help query saving → stored in MongoDB with status "Pending"
- Admin query viewing → returns all queries, newest first
- Admin reply → updates query with reply text, status → "Resolved"
- Demo document upload → stored as binary in MongoDB (5 MB max)

**2. Security:**
- **bcrypt** — passwords are hashed (one-way) before storing. Nobody can read the original password, not even us.
- **JWT** — after login, the server creates a signed token. For admin routes, the server checks this token and verifies the user is an admin.
- **Middleware chain** — admin routes go through `auth()` → `admin()` → handler. If any check fails, the request is rejected.

**3. Email System (`mail.js`):**
- When admin replies, an email can be sent to the user
- Uses Nodemailer with SMTP settings from `.env` file
- If email is not configured, the reply is still saved (no crash)

**4. Admin Dashboard Logic (JavaScript in `admin.html`):**
- Login form that blocks non-admin users
- Loads all queries from the API and displays them as cards
- Search box — filters queries by any text in name/email/question/reply
- Filter buttons — All / Needs reply / Replied
- Reply textarea with save button → sends reply to API
- Stat cards update automatically (total, pending, resolved)

**5. Database (MongoDB Atlas):**
- 3 collections: Users, Queries, Documents
- Users have a unique index on Email (no duplicate registrations)
- All data stored in the cloud — no local database needed

**6. Admin Creation Tool (`create-admin.js`):**
- Run from terminal: `node create-admin.js "Name" "email" "password"`
- Creates an admin account (or updates existing one to admin)

### Simple explanation of my work:
> "I built the backend — the server that runs behind the website. When a user registers, my code hashes their password and saves it in MongoDB Atlas. When they log in, my code checks the password and creates a JWT token. When someone submits a help query, my code saves it in the database. When an admin replies, my code updates the query status and can send an email notification. I also wrote the admin dashboard JavaScript that loads queries, lets admins search and filter them, and send replies. All data is stored securely in MongoDB Atlas cloud database."

### If asked — key terms:
- **Express** = A Node.js framework for creating API routes (like `app.post("/api/auth/login", ...)`)
- **MongoDB Atlas** = A cloud database that stores data as JSON-like documents (no tables — uses collections)
- **bcrypt** = A library that hashes passwords. `bcrypt.hash()` creates the hash, `bcrypt.compare()` checks if a password matches
- **JWT** = A signed token containing user info. Created with `jwt.sign()`, verified with `jwt.verify()`. Expires after 8 hours.
- **Middleware** = A function that runs BEFORE the main route handler. Our `auth()` checks the token, `admin()` checks the role.
- **CORS** = Browser security rule that blocks requests between different domains. Our `cors()` middleware allows the frontend to call the backend.
- **`.env` file** = A secret file (not uploaded to GitHub) that stores database passwords, JWT secret, and email credentials
- **`upsert`** = MongoDB operation that creates a document if it doesn't exist, or updates it if it does (used in create-admin.js)

---

## Common Questions for Everyone

**Q: What is the difference between frontend and backend?**
A: Frontend is what the user sees in the browser (HTML, CSS, JS). Backend is the server running behind the scenes that processes data and talks to the database. The frontend sends requests to the backend using `fetch()`.

**Q: Why MongoDB and not SQL?**
A: MongoDB Atlas is a cloud database — no installation needed. It stores data as JSON documents, which works naturally with JavaScript. Our `schema.sql` file was the initial design reference; we moved to MongoDB for easier deployment.

**Q: How is data protected?**
A: Passwords are hashed with bcrypt (cannot be reversed). Login sessions use JWT tokens (expire in 8 hours). Admin routes require both a valid token AND admin role. The `.env` file with secrets is never uploaded to GitHub.

**Q: Can this be deployed online?**
A: Yes. Our backend is already deployed on Render (`cep-16gz.onrender.com`). The frontend can be hosted on Netlify. MongoDB Atlas is already in the cloud. All three work together over the internet.

**Q: Is this the real DigiLocker?**
A: No. This is an educational training project. It teaches users ABOUT DigiLocker, Aadhaar, and PAN services. We never collect or store real government IDs, OTPs, or sensitive documents.
