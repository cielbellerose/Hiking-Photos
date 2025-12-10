import TrailNavbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Server from "../modules/ServerConnector.js";
import Map from "../components/Map.jsx";
import PostText from "../components/PostText.jsx";
import userGetter from "../modules/user.js";
import styles from "../css/Presentation.module.css";

export default function PresentationPage() {
  const [openPic, setOpenPic] = useState(-1);
  const [percent, setCurrentPercent] = useState(-1);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    async function fetchMapUrl() {
      try {
        setLoading(true);

        const user = await userGetter.getCurrentUser();

        if (user && user.authenticated) {
          const username = user.username || user.user?.username;

          // load posts for user
          if (username) {
            const postsData = await Server.getPostsForUser(username);
            setPosts(postsData.d || postsData.posts || postsData || []);
          }

          // load map
          if (username) {
            const urlgot = await Server.getURLforMap(username, 0, 100);
            setUrl(urlgot);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMapUrl();
  }, []);

  const post = selectedPost
    ? {
        text: selectedPost.text || "",
        title: selectedPost.title || "Untitled Post",
      }
    : null;

  return (
    <>
      <TrailNavbar />
      <div className={styles.container}>
        {/* Left map */}
        <div className={styles.leftColumn}>
          <h2>View All Posts</h2>
          <div className="map">
            {url && (
              <Map
                url={url}
                percent={percent}
                setCurrentPercent={setCurrentPercent}
                openPic={openPic}
                setOpenPic={setOpenPic}
              />
            )}
          </div>
          {post && (
            <div className="post">
              <PostText post={post} />
            </div>
          )}
        </div>

        {/* Right posts */}
        <div className={`PostForm ${styles.postsSidebar}`}>
          <h3 className={`post-title ${styles.sidebarTitle}`}>
            All Posts ({posts.length})
          </h3>
          {loading ? (
            <div className={styles.loadingContainer}>
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.noPostsContainer}>
              <p>No posts yet.</p>
            </div>
          ) : (
            <div className={styles.postsList}>
              {posts.map((postItem, index) => (
                <div
                  key={postItem._id || index}
                  className={`post ${styles.postItem} ${
                    selectedPost === postItem ? styles.selectedPost : ""
                  }`}
                  onClick={() => setSelectedPost(postItem)}
                >
                  <div className="post-title">
                    {postItem.title || "Untitled Post"}
                  </div>
                  <div className={styles.postExcerpt}>
                    {postItem.text?.substring(0, 120)}...
                  </div>
                  <div className={styles.postTrailInfo}>
                    {postItem.Percent1 !== undefined &&
                      postItem.Percent2 !== undefined &&
                      `Trail: ${postItem.Percent1}% - ${postItem.Percent2}%`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
