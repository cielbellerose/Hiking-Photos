import { useState } from "react";
import { useParams } from "react-router-dom";
import ServerConnector from "../modules/ServerConnector.js";
import { useEffect } from "react";
import TrailNavbar from "../components/Navbar.jsx";
import Post from "../components/Post.jsx";
import userModule from "../modules/user.js";

export default function PostListPage() {
  const [posts, setPosts] = useState(() => []);
  const [reload, setReloadNeeded] = useState(false);

  useEffect(async () => {
    const currentUser = await userModule.getCurrentUser();
    ServerConnector.getPostsForUser(currentUser).then((d) => setPosts(d.d));
    setReloadNeeded(false);
  }, [reload]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  function makePost(post) {
    //console.log(posts)
    if (post) {
      console.log(post);
      return <Post post={post} key={post._id} />;
    }
  }

  return (
    <>
      <TrailNavbar />
      {posts.map((post) => makePost(post))}
    </>
  );
}
