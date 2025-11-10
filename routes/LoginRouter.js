import express from "express";
import bcrypt from "bcrypt";
// import { getDB } from "../db/connection.js";

const LoginRouter = express.Router();

LoginRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Please enter a username and password" });
    }

    // --- add when db set up ---
    // const db = getDB();
    // const usersCollection = db.collection("users");

    // const user = await usersCollection.findOne({ username });

    // if (!user) {
    //   return res.status(400).json({ error: "User not found" });
    // }

    // const isPasswordCorrect = await bcrypt.compare(
    //   password,
    //   user.password,
    // );

    // if (!isPasswordCorrect) {
    //   return res.status(400).json({ error: "Incorrect password" });
    // }

    // req.session.userId = user._id.toString();

    // ===== temp login before db set up ======
    if (username !== "testuser") {
      return res.status(400).json({ error: "User not found" });
    }

    if (password !== "testpass") {
      return res.status(400).json({ error: "User not found" });
    }

    // ========================================

    console.log("Successfully logged in");
    req.session.username = /*user*/ "testuser";
    res.json({
      success: true,
      username: /*user*/ "testuser",
      message: "Login successful",
    });
  } catch (error) {
    console.error("Failed to log in", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

LoginRouter.post("/signup", async (req, res) => {
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

    // ===== temp login before db set up ======

    // mock that allows any signup
    const hashedPassword = await bcrypt.hash(password, 10);

    // ========================================

    // --- add when db set up ---
    // const db = getDB();
    // const usersCollection = db.collection("users");

    // is the username already in the database?
    // const isExistingUser = await usersCollection.findOne({ username: username.toLowerCase() });
    // if (isExistingUser) {
    //   return res.status(400).json({ error: "Username already taken" });
    // }

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username,
      password: hashedPassword,
    };

    // await usersCollection.insertOne(user);
    // req.session.userId = result.insertedId.toString();

    console.log("User created successfully", user);
    req.session.username = user.username;
    res.json({
      success: true,
      message: "User created successfully",
      user: { username: user.username, password: user.hashedPassword },
    });
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

LoginRouter.get("/current_user", (req, res) => {
  const username = req.session.username;

  if (username) {
    res.json({ username });
  } else {
    res.status(400).json({ error: "Not logged in" });
  }
});

LoginRouter.post("/logout", (req, res) => {
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

LoginRouter.put("/update-profile", async (req, res) => {
  const currentName = req.session.username;
  console.log("currentName", currentName);
  if (!currentName) {
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

    //     const db = getDB();
    //     const usersCollection = db.collection("users");
    //     const currentUser = await usersCollection.findOne({
    //       username: currentName,
    //     });
    //     if (!currentUser) {
    //       return res.status(404).json({ error: "Logged in user not found" });
    //     }
    //     if (username && username !== currentName) {
    //       const existingUser = await usersCollection.findOne({ username });
    //       if (existingUser) {
    //         return res.status(400).json({ error: "Username already exists" });
    //       } else {
    //         currentUser.username = username;
    //         req.session.username = username;
    //       }
    //     }
    //     if (password) {
    //       const hashedPassword = await bcrypt.hash(password, 10);
    //       currentUser.password = hashedPassword;
    //     }
    //     await usersCollection.replaceOne({ username: currentName }, currentUser);
    //     console.log("Successfully updated user");
    //     res.json({
    //       success: true,
    //       message: "Profile updated successfully",
    //       username: username || currentName,
    //     });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

LoginRouter.delete("/delete-profile", async (req, res) => {
  const currentName = req.session.username;
  if (!currentName) {
    return res.status(401).json({ error: "User not logged in" });
  }
  try {
    //     const db = getDB();
    //     const usersCollection = db.collection("users");
    //     await usersCollection.deleteOne({ username: currentName });
    //     const deletedUser = await users.findOne({ display_name: currentName });
    // if (!deletedUser) {
    //     return {
    //       success: true,
    //       message: "User deleted successfully",
    //     };
    //   }
    //     req.session.destroy((error) => {
    //       if (error) {
    //         return res.status(500).json({ error: "Failed to delete user" });
    //       }
    //       res.json({
    //         success: true,
    //         message: "Profile deleted successfully",
    //       });
    //     });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default LoginRouter;
