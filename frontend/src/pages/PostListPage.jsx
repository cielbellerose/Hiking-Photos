import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TrailNavbar from "../components/Navbar.jsx";
import Post from "../components/Post.jsx";
import userModule from "../modules/user.js";
import Server from "../modules/ServerConnector.js";
import Map from "../components/Map.jsx";

export default function PostListPage() {
  const { user } = useParams();
  const [posts, setPosts] = useState(() => []);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [url, setUrl] = useState("");
  const [percent, setCurrentPercent] = useState(-1);
  const [openPic, setOpenPic] = useState(-1);
  const [reloadNeeded, setReloadNeeded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);

        const userData = await userModule.getCurrentUser();
        setCurrentUser(userData);

        if (!userData) {
          setError("Please log in to view posts");
          return;
        }
        const targetUser =
          user || userData.username || userData.id || userData._id;

        // fetch posts for user
        const postsData = await Server.getPostsForUser(targetUser);
        setPosts(postsData.d || postsData.posts || postsData);

        const urlgot = await Server.getURLforMap(targetUser, 0, 100);
        setUrl(urlgot);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError(error.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [user, reloadNeeded]);

  const handleRefresh = () => {
    setReloadNeeded((prev) => !prev);
  };

  const canModify =
    !user ||
    (currentUser && (currentUser.username === user || currentUser.id === user));

  return (
    <>
      <TrailNavbar />
      <div className="contentContainer" style={{ padding: "20px" }}>
        <h1>{user ? `${user}'s Adventure` : "My Adventure"}</h1>

        <div
          style={{
            display: "flex",
            gap: "20px",
            height: "calc(100vh - 150px)",
          }}
        >
          {/* Left map */}
          <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <div className="map" style={{ flex: 1, marginTop: "0" }}>
              {url && (
                <Map
                  url={url}
                  percent={percent}
                  setCurrentPercent={(v) => setCurrentPercent(v)}
                  openPic={openPic}
                  setOpenPic={(v) => {
                    setOpenPic(v);
                  }}
                />
              )}
            </div>
          </div>
          {/* Right posts lists */}
          <div
            style={{
              flex: 1,
              minWidth: "400px",
              maxWidth: "500px",
              overflowY: "auto",
              paddingRight: "10px",
            }}
          >
            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <button
                className="accent-button"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {loading ? (
              <div className="text-center" style={{ padding: "40px 0" }}>
                <p className="mt-2">Loading posts...</p>
              </div>
            ) : error ? (
              <div>
                <h2>Error Loading Posts</h2>
                <p>{error}</p>
                {!currentUser && (
                  <button
                    className="accent-button"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </button>
                )}
              </div>
            ) : posts.length === 0 ? (
              <h2>No Posts Found</h2>
            ) : (
              <div
                className="posts-list"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {posts.map((post) => (
                  <Post
                    key={post._id || post.id}
                    post={post}
                    setReloadNeeded={setReloadNeeded}
                    canModify={canModify}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
