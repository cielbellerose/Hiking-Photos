import TrailNavbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ServerConnector from "../modules/ServerConnector.js";
import Map from "../components/Map.jsx";
import PostText from "../components/PostText.jsx";

export default function PresentationPage() {
  const [openPic, setOpenPic] = useState(() => -1);
  const [percent, setCurrentPercent] = useState(() => -1);
  const location = useLocation();
  const url = ServerConnector.getURLforMap(
    location.state.user,
    location.state.Percent1,
    location.state.Percent2
  ); //format the query appropriately
  const post = { text: location.state.text, title: location.state.title };
  console.log("Api endpoint", url);
  return (
    <>
      <TrailNavbar />
      <h1>Presentation Page</h1>
      <PostText post={post}></PostText>
      <Map
        url={url}
        percent={percent}
        setCurrentPercent={setCurrentPercent}
        openPic={openPic}
        setOpenPic={setOpenPic}
      />

      <div className="contentContainer"></div>
      <Map
        url="http://localhost:3000/api/test"
        openPic={openPic}
        setOpenPic={(v) => {
          setOpenPic(v);
        }}
      />
    </>
  );
}
