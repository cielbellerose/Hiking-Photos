import express from "express";
import passport from "passport";
import bcrypt from "bcrypt";
import { createUser, findUserByUsername } from "../models/users.js";
import { getDB } from "../db/connection.js";

const loginRouter = express.Router();

loginRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Passport auth error:", err);
      return res.status(500).json({ error: "Authentication error" });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || "Login failed" });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Login error:", loginErr);
        return res.status(500).json({ error: "Session error" });
      }

      res.json({
        success: true,
        username: user.username,
        userId: user._id,
        message: "Login successful",
        sessionId: req.sessionID,
      });
    });
  })(req, res, next);
});

loginRouter.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please enter a username and password" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ error: "Password should be more than 5 characters" });
    }
    const existingUser = await findUserByUsername(username.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = await createUser(username.toLowerCase(), password);

    req.login(newUser, (err) => {
      if (err) {
        console.error("Auto-login error:", err);
        return res.status(500).json({ error: "User created but login failed" });
      }
      const userResponse = { ...newUser };
      delete userResponse.passwordHash;

      res.json({
        success: true,
        message: "User created successfully",
        username: newUser.username,
        user: userResponse,
      });
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

loginRouter.get("/current_user", (req, res) => {
  if (req.isAuthenticated()) {
    const userResponse = { ...req.user };
    delete userResponse.passwordHash;
    res.json({
      authenticated: true,
      username: req.user.username,
      user: userResponse,
    });
  } else {
    res.json({ authenticated: false });
  }
});

loginRouter.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({
      success: true,
      message: "Successfully logged out",
    });
  });
});

loginRouter.put("/update-profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    let { username, password } = req.body;
    // save inputs and remove whitespace
    username = username?.trim() || null;
    password = password?.trim() || null;

    if (!username && !password) {
      return res
        .status(400)
        .json({ error: "Please enter a new username or password" });
    }

    const db = await getDB();
    const usersCollection = db.collection("users");

    const updateData = {};

    // is it taken?
    if (username && username.toLowerCase() !== req.user.username) {
      const existingUser = await findUserByUsername(username.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      updateData.username = username.toLowerCase();
    }

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length > 0) {
      await usersCollection.updateOne(
        { _id: req.user._id },
        { $set: updateData }
      );

      if (updateData.username) {
        req.user.username = updateData.username;
      }
    }
    res.json({
      success: true,
      message: "Profile updated successfully",
      username: updateData.username || req.user.username,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

loginRouter.delete("/delete-profile", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const db = await getDB();
    const usersCollection = db.collection("users");
    await usersCollection.deleteOne({ _id: req.user._id });

    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(500)
          .json({ error: "Failed to logout after deletion" });
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

export default loginRouter;
