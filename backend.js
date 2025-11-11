import express from "express";
import session from "express-session";
import { formidable } from "formidable";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import LoginRouter from "./routes/LoginRouter.js";
import cors from "cors";
import MongoConnector from "./db/mongoConnection.js";
import exifr from "exifr"; // => exifr/dist/full.umd.cjs
import mappify from "./frontend/src/modules/mappify.js";
import mongoPicturesConnnector from "./db/mongoPicturesConnnector.js";
import mongoConnection from "./db/mongoConnection.js";
import MongoStore from "connect-mongo";

import * as dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const baseURL = "http://localhost:3000";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); //for resovling cors issues

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret", //change later
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

app.use(express.static("./frontend/dist"));
app.use("/api", LoginRouter);

//this route just returns static files test JSON data to not have to deal with
//seting up data flows quite yet
// app.use("/api/test", (req, res) => {
//   console.log("Sending JSON test data", date.getMinutes(), date.getSeconds());
//   res.json({ staticTestCoodinates });
// });

app.post("/api/upload", (req, res) => {
  console.log("UPLOAD ROUTE HIT!");
  try {
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      uploadDir: path.join(__dirname, "user_data"),
    });
    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Upload failed" });
      }
      console.log("Files received:", files);

      const file = files.photo[0];
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      // fixes issue with spaces in files
      const cleanFilename = file.originalFilename.replace(
        /[^a-zA-Z0-9.-]/g,
        "_",
      );
      const newPath = path.join(__dirname, "user_data", cleanFilename);

      fs.rename(file.filepath, newPath, function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "File save failed" });
        }
        console.log("File saved successfully:", cleanFilename);
        getEXIFdata(newPath, cleanFilename);
        return res.json({
          success: true,
          message: "Successfully uploaded",
          filename: cleanFilename,
        });
      });
    });
  } catch (error) {
    console.error("Upload route error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function getEXIFdata(path, filename) {
  let { latitude, longitude } = await exifr.gps(path);
  let percentage = mappify.calculatePercentage(latitude, longitude);
  const data = {};
  data.lat = latitude;
  data.lon = longitude;
  data.percent = percentage * 100;
  data.url = baseURL + "/user_data/" + filename;
  data.user = "debug"; //TODO add in getting actual username here
  console.log("storing photo", data);
  mongoPicturesConnnector.addPicture(data);
}

//routes to user pictures
app.use("/user_data/", express.static("./user_data/"));

app.get("/api/photos", (req, res) => {
  try {
    const userDataPath = path.join(__dirname, "user_data");

    fs.readdir(userDataPath, (err, files) => {
      if (err) {
        console.error("Error reading user_data directory:", err);
        return res.status(500).json({ error: "Could not read photos" });
      }

      console.log("Found photos:", files);
      res.json({ photos: files });
    });
  } catch (error) {
    console.error("Photos endpoint error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/api/posts", (req, res) => {
  console.log(req.body);
  const data = req.body;
  //data.date = Date.now();
  MongoConnector.addPost(data);
  res.sendStatus(200);
});

app.post("/api/updatePost", async (req, res) => {
  console.log("updating post");
  const id = req.body._id;
  const data = req.body;
  delete data._id;
  try {
    await mongoConnection.updatePost(id, data);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating post", error);
  }
});

app.post("/api/posts/delete", async (req, res) => {
  console.log("Deleting post");
  try {
    await mongoConnection.deletePost(req.body.id);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting post", error);
  }
});

app.get("/api/posts", (req, res) => {
  const { user } = req.query;

  MongoConnector.getPosts(user).then((d) => res.json({ d }));
});

app.get("/api/pic", async (req, res) => {
  const { user, p1, p2 } = req.query;
  const data = await mongoPicturesConnnector.getPicturesForPosts(user, p1, p2);
  res.json(data);
});
