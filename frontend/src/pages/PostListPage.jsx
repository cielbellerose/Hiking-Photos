import { useState } from "react";
import Map from "../components/Map.jsx";
import TrailNavbar from "../components/NavBar.jsx";
import PostMaker from "../components/postMaker.jsx";
import { data, useParams } from 'react-router-dom';
import ServerConnector from "../modules/ServerConnector.js"
import { useEffect } from "react";
import Post from "../components/post.jsx";

export default function PostListPage() {
  const [posts, setPosts] = useState(() =>[]);
  const { user } = useParams();
  
  useEffect(()=> {
    ServerConnector.getPostsForUser(user)
    .then((d) => setPosts(d.d))}
  ,[])

  

  function makePost(post,value){
    console.log(posts)
    if (post){
        console.log(post);
        return <Post Posttext={post.text} key={posts.length - value} number={posts.length - value} />
    }
  }




  console.log(user);
  return (
    <>
      <TrailNavbar/>
      {posts.map((post,value) => makePost(post,value))}
    </>
  );
}
