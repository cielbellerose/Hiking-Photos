import { ObjectId } from "mongodb";
import { getDB } from "../db/connection.js";

export const addPost = async (postData) => {
  try {
    const db = await getDB();
    const result = await db.collection("user-posts").insertOne(postData);
    return result.insertedId;
  } catch (err) {
    console.error("Error adding post:", err);
    throw err;
  }
};

export const getPosts = async (userID) => {
  try {
    const db = await getDB();
    const data = await db
      .collection("user-posts")
      .find({ user: userID })
      .limit(50)
      .toArray();
    return data;
  } catch (err) {
    console.error("Error fetching posts:", err);
    throw err;
  }
};

export const deletePost = async (postId) => {
  try {
    const db = await getDB();
    await db.collection("user-posts").deleteOne({ _id: new ObjectId(postId) });
  } catch (err) {
    console.error("Error deleting post:", err);
    throw err;
  }
};

export const updatePost = async (postId, replacement) => {
  try {
    const db = await getDB();
    await db
      .collection("user-posts")
      .findOneAndReplace({ _id: new ObjectId(postId) }, replacement);
  } catch (err) {
    console.error("Error updating post:", err);
    throw err;
  }
};
