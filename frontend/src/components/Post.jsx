import { Link } from "react-router-dom";
import Server from "../modules/ServerConnector";
import styles from "../css/Post.module.css";

export default function Post({ post, setReloadNeeded }) {
  function handleDelete(postID) {
    Server.deletePost(postID);
    setReloadNeeded(true);
  }

  return (
    <div className={styles.post} style={{ display: "flex" }}>
      <Link state={post} to={{ pathname: "/view" }} className="post-title">
        {post.title}
      </Link>
      <Link state={post} to={{ pathname: "/new" }} className="post-edit">
        Edit
      </Link>
      <Link
        onClick={() => handleDelete(post._id)}
        to={{ pathname: `/viewPost/${post.user}` }}
        className="post-delete"
      >
        Delete
      </Link>
    </div>
  );
}
