export default function PostText({ post }) {
  if (!post) {
    return (
      <div className="post">
        <div></div>
      </div>
    );
  }

  return (
    <div className="post">
      <div className="post-title">{post.title || "Untitled Post"}</div>
      <div>{post.text || "No content available"}</div>
    </div>
  );
}
