require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
const client = process.env.MONGODB_URI ? new MongoClient(process.env.MONGODB_URI) : null;
const databaseName = process.env.MONGODB_DB || "EverLocker";

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

let db;

function tokenFor(user) {
  return jwt.sign({
    id: user._id.toString(),
    role: user.Role,
    name: user.Name,
    email: user.Email
  }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "8h" });
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Login required" });
  }
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET || "dev-secret");
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired login" });
  }
}

function admin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

function queryResponse(query) {
  return {
    QueryID: query._id.toString(),
    Name: query.Name,
    Email: query.Email,
    Category: query.Category,
    Question: query.Question,
    Reply: query.Reply || null,
    Status: query.Status,
    CreatedAt: query.CreatedAt,
    RepliedAt: query.RepliedAt || null
  };
}

function documentResponse(document) {
  return {
    DocumentID: document._id.toString(),
    UserName: document.UserName,
    DocumentType: document.DocumentType,
    StoredFileName: document.StoredFileName,
    OriginalFileName: document.OriginalFileName,
    UploadedAt: document.UploadedAt
  };
}

app.get("/api/health", (req, res) => res.json({ ok: true, project: "EverLocker" }));

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const hash = await bcrypt.hash(password, 10);
    await db.collection("Users").insertOne({
      Name: name.trim(),
      Email: normalizedEmail,
      PasswordHash: hash,
      Role: "user",
      CreatedAt: new Date()
    });
    res.json({ message: "Registration successful" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error("Registration failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await db.collection("Users").findOne({ Email: email.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.PasswordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json({
      token: tokenFor(user),
      user: {
        id: user._id.toString(),
        name: user.Name,
        email: user.Email,
        role: user.Role
      }
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/api/queries", async (req, res) => {
  try {
    const { name, email, category, question } = req.body;
    if (!name || !email || !question) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const result = await db.collection("Queries").insertOne({
      Name: name.trim(),
      Email: email.trim().toLowerCase(),
      Category: category || "Other",
      Question: question,
      Reply: null,
      Status: "Pending",
      CreatedAt: new Date(),
      RepliedAt: null
    });
    res.json({ message: "Query saved", queryId: result.insertedId.toString() });
  } catch (error) {
    console.error("Saving query failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/api/admin/queries", auth, admin, async (req, res) => {
  try {
    const queries = await db.collection("Queries").find().sort({ CreatedAt: -1 }).toArray();
    res.json(queries.map(queryResponse));
  } catch (error) {
    console.error("Loading queries failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.put("/api/admin/queries/:id", auth, admin, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid query ID" });
    }
    const reply = typeof req.body.reply === "string" ? req.body.reply.trim() : "";
    if (!reply) {
      return res.status(400).json({ message: "Reply cannot be empty" });
    }
    const queryId = new ObjectId(req.params.id);
    const query = await db.collection("Queries").findOne({ _id: queryId });
    if (!query) {
      return res.status(404).json({ message: "Query not found" });
    }
    const result = await db.collection("Queries").updateOne(
      { _id: queryId },
      { $set: { Reply: reply, Status: "Resolved", RepliedAt: new Date() } }
    );
    if (!result.matchedCount) {
      return res.status(404).json({ message: "Query not found" });
    }
    res.json({
      message: "Reply saved",
      learnerName: query.Name,
      learnerEmail: query.Email
    });
  } catch (error) {
    console.error("Saving reply failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.post("/api/documents", upload.single("document"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file selected" });
    }
    const storedFileName = new ObjectId().toString();
    await db.collection("Documents").insertOne({
      UserName: req.body.name || "Demo User",
      DocumentType: req.body.type || "Other",
      StoredFileName: storedFileName,
      OriginalFileName: req.file.originalname,
      ContentType: req.file.mimetype,
      Content: req.file.buffer,
      UploadedAt: new Date()
    });
    res.json({ message: "Demo document uploaded. Do not use real Aadhaar/PAN documents." });
  } catch (error) {
    console.error("Document upload failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/uploads/:filename", async (req, res) => {
  try {
    const document = await db.collection("Documents").findOne(
      { StoredFileName: req.params.filename },
      { projection: { Content: 1, ContentType: 1, OriginalFileName: 1 } }
    );
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.type(document.ContentType || "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="${encodeURIComponent(document.OriginalFileName)}"`);
    res.send(document.Content);
  } catch (error) {
    console.error("Loading document failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/api/admin/documents", auth, admin, async (req, res) => {
  try {
    const documents = await db.collection("Documents")
      .find({}, { projection: { Content: 0 } })
      .sort({ UploadedAt: -1 })
      .toArray();
    res.json(documents.map(documentResponse));
  } catch (error) {
    console.error("Loading documents failed:", error);
    res.status(500).json({ message: "Database error" });
  }
});

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required. Set it in backend/.env to your MongoDB Atlas connection string.");
  }
  if (!client) {
    throw new Error("MongoDB client was not configured.");
  }
  await client.connect();
  db = client.db(databaseName);
  await db.collection("Users").createIndex({ Email: 1 }, { unique: true });
  app.listen(process.env.PORT || 5000, () => {
    console.log(`EverLocker API running on http://localhost:${process.env.PORT || 5000}`);
  });
}

start().catch(async error => {
  console.error("Could not start EverLocker API:", error);
  if (client) {
    await client.close();
  }
  process.exitCode = 1;
});
