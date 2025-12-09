import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import TrailNavbar from "../components/Navbar.jsx";
import Post from "../components/Post.jsx";
import userModule from "../modules/user.js";
import { Button, Container, Alert, Spinner } from "react-bootstrap";
import Server from "../modules/ServerConnector.js";

export default function PostListPage() {
  const { user } = useParams();
  const [posts, setPosts] = useState(() => []);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
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

        const user = user || userData.username || userData.id || userData._id;

        // fetch posts for user
        const postsData = await Server.getPostsForUser(user);
        setPosts(postsData.d || postsData.posts || postsData);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        setError(error.message || "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [user, reloadNeeded]);

  const handleCreateNewPost = () => {
    navigate("/new");
  };

  const handleRefresh = () => {
    setReloadNeeded((prev) => !prev);
  };

  const canModify =
    !user ||
    (currentUser && (currentUser.username === user || currentUser.id === user));

  return (
    <>
      <TrailNavbar />
      <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>My Posts</h1>
          <div>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateNewPost}
              disabled={!currentUser}
            >
              Create New Post
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Loading posts...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            <Alert.Heading>Error Loading Posts</Alert.Heading>
            <p>{error}</p>
            {!currentUser && (
              <Button
                variant="outline-danger"
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            )}
          </Alert>
        ) : posts.length === 0 ? (
          <Alert variant="info">
            <Alert.Heading>No Posts Found</Alert.Heading>
            <p>
              {user
                ? `${user} hasn't created any posts yet.`
                : "You haven't created any posts yet."}
            </p>
            {!user && currentUser && (
              <Button variant="outline-info" onClick={handleCreateNewPost}>
                Create Your First Post
              </Button>
            )}
          </Alert>
        ) : (
          <div className="posts-list">
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
      </Container>
    </>
  );
}
