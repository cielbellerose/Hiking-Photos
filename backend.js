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

app.use(express.static(join(__dirname, "./frontend/dist")));
app.use("/user_data", express.static(join(__dirname, "user_data")));

// Session configuration
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGODB_URI ||
        "mongodb://localhost:27017/appalachian-stories",
      ttl: 24 * 60 * 60,
      autoRemove: "native",
      collectionName: "sessions",
      stringify: false,
    }),
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "none",
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", LoginRouter);
app.use("/api/posts", PostsRouter);
app.use("/api/pic", PicturesRouter);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(`   Path: ${req.path}`);
  console.log(`   Original URL: ${req.originalUrl}`);
  next();
});

app.get("*splat", function (req, res) {
  res.sendFile(join(__dirname, "./frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
