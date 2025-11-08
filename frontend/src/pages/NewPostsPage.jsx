import { useState } from "react";
import Map from "../components/Map.jsx";
import TrailNavbar from "../components/NavBar.jsx";
import PostMaker from "../components/postMaker.jsx";

export default function NewPostsPage() {
  const [openPic, setOpenPic] = useState(() => -1);

  return (
    <>
      <TrailNavbar />
      <h1>Map!</h1>
      <Map url="http://localhost:3000/api/test" openPic={openPic} setOpenPic={(v) => {setOpenPic(v)}}/>
      <PostMaker openPic={openPic} setOpenPic={setOpenPic} />
    </>
  );
}
