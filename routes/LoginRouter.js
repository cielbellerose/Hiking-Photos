import express from "express";
import bcrypt from "bcrypt";
import { getDB } from "../db/connection.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please enter a username and password" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    console.log("Successfully logged in");
    req.session.username = user.username;
    res.json({
      success: true,
      username: user.username,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Failed to log in", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please enter a username and password" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    // is the username already in the database?
    const isExistingUser = await usersCollection.findOne({ username });
    if (isExistingUser) {
      return res.status(400).json({ error: "Username taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      password: hashedPassword,
    };

    await usersCollection.insertOne(user);
    console.log("User created successfully");
    req.session.username = user.username;
    res.json({
      success: true,
      message: "User created successfully",
      username: user.username,
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/current_user", (req, res) => {
  const username = req.session.username;

  if (username) {
    res.json({ username });
  } else {
    res.status(400).json({ error: "Not logged in" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
    res.json({
      success: true,
      message: "successfully logged out",
    });
  });
});

router.put("/update-profile", async (req, res) => {
  try {
    const currentName = req.session.username;
    console.log("currentName", currentName);
    if (!currentName) {
      return res.status(401).json({ error: "User not logged in" });
    }

    let { username, password } = req.body;

    // save inputs and remove whitespace
    username = username?.trim() || null;
    password = password?.trim() || null;

    if (!username && !password) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const db = getDB();
    const usersCollection = db.collection("users");

    const currentUser = await usersCollection.findOne({
      username: currentName,
    });
    if (!currentUser) {
      return res.status(404).json({ error: "Logged in user not found" });
    }

    if (username && username !== currentName) {
      const existingUser = await usersCollection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      } else {
        currentUser.username = username;
        req.session.username = username;
      }
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      currentUser.password = hashedPassword;
    }
    await usersCollection.replaceOne({ username: currentName }, currentUser);
    console.log("Successfully updated user");
    res.json({
      success: true,
      message: "Profile updated successfully",
      username: username || currentName,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/delete-profile", async (req, res) => {
  const currentName = req.session.username;
  if (!currentName) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    await usersCollection.deleteOne({ username: currentName });
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ error: "Delete user failed" });
      }
      res.json({
        success: true,
        message: "Profile deleted successfully",
      });
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
