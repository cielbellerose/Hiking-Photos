import express from "express";
import session from "express-session";
import passport from "./config/passport.js";

import LoginRouter from "./routes/LoginRouter.js";

import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
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
app.use("/api/auth", LoginRouter);

app.get("*splat", function (req, res) {
  res.sendFile("index.html", {
    root: join(__dirname, "./frontend/dist"),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.post("/api/upload", (req, res) => {
//   console.log("UPLOAD ROUTE HIT!");
//   const username = req.session?.username || req.user?.username;
//   // if (!username) {
//   //   return res.status(401).json({ error: "Not logged in" });
//   // }
//   try {
//     const form = formidable({
//       multiples: false,
//       keepExtensions: true,
//       uploadDir: path.join(__dirname, "user_data"),
//     });
//     form.parse(req, function (err, fields, files) {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Upload failed" });
//       }
//       console.log("Files received:", files);

//       const file = files.photo[0];
//       if (!file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }
//       // fixes issue with spaces in files
//       const cleanFilename = file.originalFilename.replace(
//         /[^a-zA-Z0-9.-]/g,
//         "_"
//       );
//       const newPath = path.join(__dirname, "user_data", cleanFilename);

//       fs.rename(file.filepath, newPath, function (err) {
//         if (err) {
//           console.error(err);
//           return res.status(500).json({ error: "File save failed" });
//         }
//         console.log("File saved successfully:", cleanFilename);
//         getEXIFdata(newPath, cleanFilename, username);
//         return res.json({
//           success: true,
//           message: "Successfully uploaded",
//           filename: cleanFilename,
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Upload route error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// async function getEXIFdata(path, filename, username) {
//   let { latitude, longitude } = await exifr.gps(path);
//   let percentage = mappify.calculatePercentage(latitude, longitude);
//   const data = {};
//   data.lat = latitude;
//   data.lon = longitude;
//   data.percent = percentage * 100;
//   data.url =
//     "https://hiking-photos-66kz.onrender.com" + "/user_data/" + filename;
//   data.user = username;
//   console.log("storing photo", data);
//   mongoPicturesConnnector.addPicture(data);
// }

// //routes to user pictures
// app.use("/user_data/", express.static("./user_data/"));

// app.get("/api/photos", (req, res) => {
//   try {
//     const userDataPath = path.join(__dirname, "user_data");

//     fs.readdir(userDataPath, (err, files) => {
//       if (err) {
//         console.error("Error reading user_data directory:", err);
//         return res.status(500).json({ error: "Could not read photos" });
//       }

//       console.log("Found photos:", files);
//       res.json({ photos: files });
//     });
//   } catch (error) {
//     console.error("Photos endpoint error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.post("/api/posts", (req, res) => {
//   console.log(req.body);
//   const data = req.body;
//   MongoConnector.addPost(data);
//   res.sendStatus(200);
// });

// app.post("/api/updatePost", async (req, res) => {
//   console.log("updating post");
//   const id = req.body._id;
//   const data = req.body;
//   delete data._id;
//   try {
//     await mongoConnection.updatePost(id, data);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error updating post", error);
//   }
// });

// app.post("/api/posts/delete", async (req, res) => {
//   console.log("Deleting post");
//   try {
//     await mongoConnection.deletePost(req.body.id);
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Error deleting post", error);
//   }
// });

// app.get("/api/posts", (req, res) => {
//   const { user } = req.query;

//   MongoConnector.getPosts(user).then((d) => res.json({ d }));
// });

// app.get("/api/pic", async (req, res) => {
//   const { user, p1, p2 } = req.query;
//   const data = await mongoPicturesConnnector.getPicturesForPosts(user, p1, p2);
//   res.json(data);
// });
