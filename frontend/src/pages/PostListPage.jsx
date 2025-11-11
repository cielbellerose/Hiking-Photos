import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerConnector from "../modules/ServerConnector.js";
import { useEffect } from "react";
import Post from "../components/post.jsx";
import TrailNavbar from "../components/Navbar.jsx";

export default function PostListPage() {
  const [posts, setPosts] = useState(() => []);
  const [reload, setReloadNeeded] = useState(false);
  const { user } = useParams();

  useEffect(() => {
    ServerConnector.getPostsForUser(user).then((d) => setPosts(d.d));
    setReloadNeeded(false);
  }, [reload]);

  function makePost(post) {
    //console.log(posts)
    if (post) {
      console.log(post);
      return <Post post={post} key={post._id} />;
    }
  }

  console.log(user);
  return (
    <>
      <TrailNavbar />
      {posts.map((post) => makePost(post))}
    </>
  );
}
