require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const [, , name, email, password] = process.argv;

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is required. Set it in backend/.env.");
  process.exit(1);
}
if (!name || !email || !password) {
  console.error('Usage: node create-admin.js "Admin Name" "admin@example.com" "StrongPassword"');
  process.exit(1);
}

async function createAdmin() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || "EverLocker");
    const users = db.collection("Users");
    await users.createIndex({ Email: 1 }, { unique: true });

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);
    await users.updateOne(
      { Email: normalizedEmail },
      {
        $set: {
          Name: name.trim(),
          PasswordHash: passwordHash,
          Role: "admin"
        },
        $setOnInsert: {
          Email: normalizedEmail,
          CreatedAt: new Date()
        }
      },
      { upsert: true }
    );
    console.log("Admin account created or updated:", normalizedEmail);
  } finally {
    await client.close();
  }
}

createAdmin().catch(error => {
  console.error("Could not create admin account:", error);
  process.exitCode = 1;
});
