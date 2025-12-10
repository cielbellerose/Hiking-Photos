const me = {};

me.serverName = import.meta.env.PROD
  ? "https://appalachian-stories.onrender.com"
  : "http://localhost:10000";

/* Allows sending a post update. Takes JSON postdata, as well as an optional
react hook to indicate when done.
*/
me.sendPostToServer = (postdata, setTrueWhenDone) => {
  fetch(me.serverName + "/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(postdata),
  })
    .then(() => {
      if (setTrueWhenDone) {
        setTrueWhenDone(true);
      }
    })
    .catch((error) => {
      console.error("Error sending post:", error);
    });
};

me.getPostsForUser = async (username) => {
  try {
    const res = await fetch(
      me.serverName + "/api/posts?" + new URLSearchParams({ user: username }),
      { credentials: "include" }
    );
    if (!res.ok) {
      console.error("Failed to fetch posts");
      throw new Error("Failed to fetch posts");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

me.getURLforMap = (user, percent1, percent2) => {
  const url =
    me.serverName +
    "/api/pic?" +
    new URLSearchParams({ user: user, p1: percent1, p2: percent2 });
  return url;
};

me.updatePost = (postdata) => {
  fetch(me.serverName + "/api/posts/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(postdata),
  }).catch((error) => {
    console.error("Error updating post:", error);
  });
};

me.deletePost = (id) => {
  const data = { id: id };
  fetch(me.serverName + "/api/posts/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  }).catch((error) => {
    console.error("Error deleting post:", error);
  });
};

// Auth helper functions
me.loginUser = async (username, password) => {
  try {
    const res = await fetch(me.serverName + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

me.signupUser = async (username, password) => {
  try {
    const res = await fetch(me.serverName + "/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Signup failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

me.getCurrentUser = async () => {
  try {
    const res = await fetch(me.serverName + "/api/auth/current_user", {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Not authenticated");
    }
    return await res.json();
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

me.logoutUser = async () => {
  try {
    const res = await fetch(me.serverName + "/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Logout failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

me.updateProfile = async (username, password) => {
  try {
    const res = await fetch(me.serverName + "/api/auth/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Update failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Update profile error:", error);
    throw error;
  }
};

me.deleteProfile = async () => {
  try {
    const res = await fetch(me.serverName + "/api/auth/delete-profile", {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Delete failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Delete profile error:", error);
    throw error;
  }
};

// Picture functions
me.getPicturesForPosts = async (user, p1, p2) => {
  try {
    const res = await fetch(
      me.serverName + "/api/pic?" + new URLSearchParams({ user, p1, p2 }),
      { credentials: "include" }
    );
    if (!res.ok) {
      throw new Error("Failed to fetch pictures");
    }
    return await res.json();
  } catch (error) {
    console.error("Error getting pictures:", error);
    throw error;
  }
};

me.uploadPicture = async (formData) => {
  try {
    const res = await fetch(me.serverName + "/api/pic/upload", {
      method: "POST",
      credentials: "include",
      body: formData, // FormData object with file
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Upload failed");
    }
    return await res.json();
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

me.getUserPhotos = async (userId) => {
  try {
    console.log("Getting ALL photos for user:", userId);

    const response = await fetch(`${me.serverName}/api/pic/user/${userId}`, {
      credentials: "include",
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to fetch photos");
    }

    const data = await response.json();
    console.log("Photos received:", data.length, "photos");

    return data;
  } catch (error) {
    console.error("Error getting user photos:", error);
    throw error;
  }
};

export default me;
