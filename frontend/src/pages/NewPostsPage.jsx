import { useEffect, useState } from "react";
import Map from "../components/Map.jsx";
import PostMaker from "../components/PostMaker.jsx";
import ServerConnector from "../modules/ServerConnector.js";
import { useLocation } from "react-router-dom";
import TrailNavbar from "../components/Navbar.jsx";

export default function NewPostsPage() {
  const [openPic, setOpenPic] = useState(() => -1);
  const [percent, setCurrentPercent] = useState(-1);
  const user = "debug"; //TODO integrate real user
  const url = ServerConnector.getURLforMap(user, 0, 100); //format the query appropriately
  const location = useLocation();
  // console.log("data",location.state);
  useEffect(() => {
    if (location.state !== null) {
      setOpenPic(location.state.start); //setup right open pic
    }
  }, []);

  return (
    <>
      <TrailNavbar />
      <Map
        url={url}
        percent={percent}
        setCurrentPercent={(v) => setCurrentPercent(v)}
        openPic={openPic}
        setOpenPic={(v) => {
          setOpenPic(v);
        }}
      />
      <PostMaker
        PrevData={location.state}
        openPic={openPic}
        setOpenPic={setOpenPic}
        percent={percent}
        setCurrentPercent={(v) => setCurrentPercent(v)}
      />
    </>
  );
}
