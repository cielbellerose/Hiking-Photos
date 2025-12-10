import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { getDB } from "../db/connection.js";

export const createUser = async (username, password) => {
  try {
    const db = await getDB();
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      username,
      passwordHash,
      createdAt: new Date(),
    };
    const result = await db.collection("users").insertOne(user);
    return { ...user, _id: result.insertedId };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const findUserByUsername = async (username) => {
  try {
    const db = await getDB();
    return await db.collection("users").findOne({ username });
  } catch (error) {
    console.error("Error finding user by username:", error);
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    const db = await getDB();
    return await db.collection("users").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const db = await getDB();
    return await db.collection("users").find().toArray();
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};
