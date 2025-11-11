import { useState } from "react";
import Map from "../components/Map.jsx";
import TrailNavbar from "../components/NavBar.jsx";
import PostMaker from "../components/postMaker.jsx";
import ServerConnector from "../modules/ServerConnector.js"

export default function NewPostsPage() {
  const [openPic, setOpenPic] = useState(() => -1);
  const [percent, setCurrentPercent] = useState(() => -1);
  const user = "debug"; //TODO integrate real user
  const url = ServerConnector.getURLforMap(user,0,100); //format the query appropriately
  return (
    <>
      <TrailNavbar />
      <Map url={url} percent={percent} setCurrentPercent={(v) => setCurrentPercent(v)} openPic={openPic} setOpenPic={(v) => {setOpenPic(v)}}/>
      <PostMaker openPic={openPic} setOpenPic={setOpenPic} percent={percent} setCurrentPercent={(v) => setCurrentPercent(v)}/>
    </>
  );
}
