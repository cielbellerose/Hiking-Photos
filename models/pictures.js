import { getDB } from "../db/connection.js";

export const addPicture = async (pictureData) => {
  try {
    const db = await getDB();
    // Add timestamp
    const dataWithTimestamp = {
      ...pictureData,
      uploadedAt: new Date(),
      filename: pictureData.url?.split("/").pop() || `photo_${Date.now()}.jpg`,
    };
    const result = await db
      .collection("user-pictures")
      .insertOne(dataWithTimestamp);

    return result.insertedId;
  } catch (err) {
    console.error("Error adding picture:", err);
    throw err;
  }
};

export const getPicturesForPosts = async (userID, percent1, percent2) => {
  try {
    percent2 = parseFloat(percent2);
    percent1 = parseFloat(percent1);

    if (percent1 >= percent2) {
      (percent1++, percent2--);
    } else {
      (percent2++, percent1--);
    }

    const query =
      percent1 <= percent2
        ? {
            $and: [
              { percent: { $gte: parseInt(percent1) } },
              { percent: { $lte: parseInt(percent2) } },
              { user: userID },
            ],
          }
        : {
            $and: [
              { percent: { $gte: parseInt(percent2) } },
              { percent: { $lte: parseInt(percent1) } },
              { user: userID },
            ],
          };

    const db = await getDB();
    const data = await db.collection("user-pictures").find(query).toArray();
    return data;
  } catch (err) {
    console.error("Error fetching pictures:", err);
    throw err;
  }
};

export const getUserPhotos = async (username) => {
  try {
    const db = await getDB();
    const photos = await db
      .collection("user-pictures")
      .find({ user: username })
      .sort({ uploadedAt: -1 }) // newest first
      .toArray();
    return photos;
  } catch (err) {
    console.error("Error fetching user photos:", err);
    throw err;
  }
};
