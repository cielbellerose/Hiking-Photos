import TrailNavbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ServerConnector from "../modules/ServerConnector.js";
import Map from "../components/Map.jsx";
import PostText from "../components/PostText.jsx";
import userGetter from "../modules/user.js"

export default function PresentationPage() {
  const [openPic, setOpenPic] = useState(() => -1);
  const [percent, setCurrentPercent] = useState(() => -1);
  const location = useLocation();
  const [url, setUrl] = useState("");


  useEffect( async () => {
    const programUser = await userModule.getCurrentUser();
    const urlgot = ServerConnector.getURLforMap(
    programUser,
    location.state.Percent1,
    location.state.Percent2
  );
  setUrl(urlgot)
  },[])


   //format the query appropriately
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
    </>
  );
}
