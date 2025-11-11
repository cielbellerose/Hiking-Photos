const user = {};

user.getCurrentUser = async () => {
  try {
    const response = await fetch("/api/current_user", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      return data.username;
    }
    return null;
  } catch (error) {
    console.error("Error checking login info:", error);
    return null;
  }
};

export default user;
