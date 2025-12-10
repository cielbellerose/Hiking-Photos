import Server from "./ServerConnector.js";

const user = {};

user.getCurrentUser = async () => {
  try {
    const response = await fetch(Server.serverName + "/api/auth/current_user", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      if (data.authenticated) {
        return data.username;
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error("Error checking login info:", error);
    return null;
  }
};

export default user;
