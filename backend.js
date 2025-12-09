import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "./config/passport.js";
import fs from "fs";

import LoginRouter from "./routes/LoginRouter.js";
import PostsRouter from "./routes/PostsRouter.js";
import PicturesRouter from "./routes/PicturesRouter.js";

import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { findUserByUsername, getAllUsers } from "./models/users.js";
import { connectDB } from "./db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database initialized");
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });

const userDataDir = join(__dirname, "user_data");
if (!fs.existsSync(userDataDir)) {
  fs.mkdirSync(userDataDir, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI ||
        "mongodb://localhost:27017/appalachian-stories",
      ttl: 24 * 60 * 60,
    }),
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", express.static("./frontend/dist"));
app.use("/user_data", express.static(join(__dirname, "user_data")));

app.use("/api/auth", LoginRouter);
app.use("/api/posts", PostsRouter);
app.use("/api/pic", PicturesRouter);

// TEST remove later
app.get("/api/debug/users", async (req, res) => {
  try {
    const testUser = await findUserByUsername("testuser");
    const allUsers = await getAllUsers();

    res.json({
      testUser,
      allUsers,
      userCount: allUsers.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Formatting for Render
app.get("/*", function (req, res) {
  const indexPath = join(__dirname, "./frontend/dist/index.html");

  console.log(`=== Serving index.html for: ${req.path} ===`);
  console.log(`Request URL: ${req.url}`);
  console.log(`Looking for index.html at: ${indexPath}`);
  console.log(`File exists: ${fs.existsSync(indexPath)}`);

  if (!fs.existsSync(indexPath)) {
    console.error("ERROR: index.html not found!");
    console.log("Current directory contents:");
    const distPath = join(__dirname, "./frontend/dist");
    if (fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath);
      console.log("Files in dist:", files);
    } else {
      console.log("dist folder doesn't exist!");
    }
    return res.status(500).send("Frontend not built properly");
  }
  res.sendFile("index.html", {
    root: join(__dirname, "./frontend/dist"),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
