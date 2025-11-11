export default function PostText({ post }) {
  return (
    <div className="post">
      <div className="post-title">{post.title}</div>
      <div>{post.text}</div>
    </div>
  );
}
