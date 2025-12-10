import { Link } from "react-router-dom";
import Server from "../modules/ServerConnector";
import Card from "react-bootstrap/Card";

export default function Post({ post, setReloadNeeded }) {
  function handleDelete(postID) {
    if (window.confirm("Are you sure you want to delete this post?")) {
      Server.deletePost(postID);
      if (setReloadNeeded) {
        setReloadNeeded(true);
      }
    }
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text className="text-muted">
          {post.text?.substring(0, 150)}...
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Posted by: {post.username || post.user || "Unknown"}
          </small>

          <div className="d-flex gap-2">
            <>
              <Link state={post} to="/new" className="secondary-button">
                Edit
              </Link>
              <button
                className="secondary-button"
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </button>
            </>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
