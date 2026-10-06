# EverLocker — CEP Project

## Topic
Training on DigiLocker, Aadhaar and PAN Services

This project is designed for a 4-member IT student team. It has:
- Login/register backend
- Main learning interface
- DigiLocker / Aadhaar / PAN sections
- FAQ
- Common issues and solutions
- Official service learning links
- Help form that stores queries in MongoDB Atlas
- Admin dashboard for replying to queries
- Demo document upload API
- JavaScript quiz game
- Light, simple responsive design
- MongoDB Atlas storage for user accounts, help queries, replies and uploaded demo files

## Important
This is an educational CEP project. Do NOT use real Aadhaar numbers, PAN numbers, OTPs, passwords or real sensitive documents in demonstrations.

## What you need to install
1. VS Code
2. Node.js LTS
3. A MongoDB Atlas cluster and database user

## Folder structure
frontend/     -> HTML, CSS, JavaScript
backend/      -> Node.js + Express API and MongoDB Atlas connection
database/     -> Legacy SQL Server script (not used by the current backend)
uploads/      -> Not required; demo file contents are stored in MongoDB

## Step 1 — Configure MongoDB Atlas
Create an Atlas cluster and a database user. In Network Access, allow connections from the machine where the backend runs.

Copy `backend/.env.example` to `backend/.env`. Set `MONGODB_URI` to the connection string Atlas provides, including the database user's credentials. URL-encode special characters in the username or password. Set `MONGODB_DB` to the database name you want to use.

The backend creates its collections and a unique email index automatically. Keep `backend/.env` private and never put the Atlas URI in frontend files.

To email learners when an admin replies, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, and `MAIL_FROM` in `backend/.env` using credentials from your email provider. Use an app password or provider-issued SMTP credential where required. If SMTP is not configured or delivery fails, the reply is still saved and the admin dashboard reports the email status.

## Step 2 — Install backend packages
Open VS Code terminal inside the backend folder:
npm install

## Step 3 — Start backend
npm start

You should see:
EverLocker API running on http://localhost:5000

Open:
http://localhost:5000/api/health

It should return JSON showing ok=true.

## Step 4 — Create your author/admin account
After configuring `backend/.env`, run this from the backend folder:

node create-admin.js "EverLocker Admin" "admin@everlocker.local" "Admin@123"

You can change the name, email and password. This command creates the account in MongoDB Atlas and gives it the `admin` role.

Then open the website and use that email/password in Login. An admin login automatically opens `admin.html`.

Keep the admin password private. For a real public deployment, use a strong password and proper production security.

## Step 5 — Run frontend
The easiest method is VS Code + Live Server extension:
- Install "Live Server" in VS Code.
- Right-click frontend/index.html.
- Choose "Open with Live Server."

The page opens in your browser.

If you change the backend port, edit API_BASE at the top of frontend/app.js.

## Step 6 — Test the full flow
1. Open website.
2. Submit a Help query.
3. Check the `Queries` collection in MongoDB Atlas.
4. Login as admin.
5. Open Admin Dashboard.
6. Reply to the query.
7. Check MongoDB Atlas: the reply and status are updated.

The backend stores demo upload contents in MongoDB as well as their metadata. Existing records in the old SQL Server database are not migrated automatically.

## Deployment & Live Links

- **Live Website (GitHub Pages):** [https://maniac-nerd.github.io/CEP/](https://maniac-nerd.github.io/CEP/)
- **Admin Support Desk:** [https://maniac-nerd.github.io/CEP/admin.html](https://maniac-nerd.github.io/CEP/admin.html)
- **Backend API (Render):** [https://cep-16gz.onrender.com/api](https://cep-16gz.onrender.com/api)
- **Backend Health Check:** [https://cep-16gz.onrender.com/api/health](https://cep-16gz.onrender.com/api/health)
- **Database:** MongoDB Atlas (Cloud)
- **Email Service:** EmailJS (`service_omtbyhk` / `template_zun3nmp`)

The frontend automatically connects to the deployed Render backend by default. Developers testing locally can override the endpoint anytime using `localStorage.setItem("everlocker_api", "http://localhost:5000/api")` or via the **Email Settings** modal in the Admin Dashboard.

## Suggested 4-member division
Member 1: HTML pages + navigation
Member 2: CSS + responsive design
Member 3: JavaScript quiz + frontend logic
Member 4: Node.js API + MongoDB Atlas + Admin Dashboard

## Viva explanation
Frontend -> sends request -> Node.js API -> MongoDB Atlas -> response -> frontend.

Example:
User submits Help query
        ↓
JavaScript fetch()
        ↓
POST /api/queries
        ↓
Node.js / Express
        ↓
MongoDB Atlas Queries collection
        ↓
Admin Dashboard reads query
        ↓
Admin writes reply
        ↓
MongoDB Atlas updates Status = Resolved

## Official information
DigiLocker: https://www.digilocker.gov.in/
UIDAI: https://www.uidai.gov.in/
Income Tax: https://www.incometax.gov.in/
