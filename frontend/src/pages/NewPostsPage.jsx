import { useEffect, useState } from "react";
import Map from "../components/Map.jsx";
import PostMaker from "../components/PostMaker.jsx";
import ServerConnector from "../modules/ServerConnector.js";
import { useLocation, useNavigate } from "react-router-dom";
import TrailNavbar from "../components/Navbar.jsx";
import userModule from "../modules/user.js";

export default function NewPostsPage() {
  const [openPic, setOpenPic] = useState(() => -1);
  const [percent, setCurrentPercent] = useState(-1);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUser() {
      const currentUser = await userModule.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (location.state !== null) {
      setOpenPic(location.state.start); //setup right open pic
    }
  }, []);

  const url = ServerConnector.getURLforMap(user, 0, 100); //format the query appropriately
  console.log("posts for ", user, url);

  return (
    <>
      <TrailNavbar />
      <h1>Add Posts</h1>
      <h2>Select start and end photos to create a post!</h2>
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
