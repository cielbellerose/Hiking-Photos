import express from "express";
import { addPost, deletePost, getPosts, updatePost } from "../models/posts.js";

const PostsRouter = express.Router();

PostsRouter.post("/", (req, res) => {
  console.log("📨 POSTS ROUTE - Received request");
  console.log("📨 POSTS ROUTE - Request body:", req.body);
  console.log("📨 POSTS ROUTE - User authenticated?", req.isAuthenticated());
  console.log("📨 POSTS ROUTE - User:", req.user);
  console.log(req.body);
  const data = req.body;
  if (!req.isAuthenticated()) {
    console.log("❌ POSTS ROUTE - User not authenticated");
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (!data.user && req.user) {
    data.user = req.user.username || req.user._id;
    console.log("📨 POSTS ROUTE - Added user to data:", data.user);
  }
  console.log("📨 POSTS ROUTE - Final data being saved:", data);
  addPost(data);
  res.sendStatus(200);
});

PostsRouter.post("/update", async (req, res) => {
  console.log("updating post");
  const id = req.body._id;
  const data = req.body;
  delete data._id;
  try {
    await updatePost(id, data);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating post", error);
    res.status(500).json({ error: "Error updating post" });
  }
});

PostsRouter.get("/", async (req, res) => {
  const { user } = req.query;
  try {
    const data = await getPosts(user);
    res.json({ d: data });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ error: "Error getting posts" });
  }
});

PostsRouter.post("/delete", async (req, res) => {
  console.log("Deleting post");
  try {
    await deletePost(req.body.id);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error deleting post", error);
    res.status(500).json({ error: "Error deleting post" });
  }
});

export default PostsRouter;
