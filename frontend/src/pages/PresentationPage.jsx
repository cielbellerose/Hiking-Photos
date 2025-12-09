import TrailNavbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "../components/Map.jsx";
import PostText from "../components/PostText.jsx";
import Server from "../modules/ServerConnector.js";

export default function PresentationPage() {
  const [openPic, setOpenPic] = useState(() => -1);
  const [percent, setCurrentPercent] = useState(() => -1);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function fetchMapUrl() {
      try {
        setLoading(true);
        setError(null);

        if (!location.state) {
          setError("No post data provided. Please select a post to view.");
          setLoading(false);
          return;
        }

        const programUser = await Server.getCurrentUser();
        if (!programUser) {
          setError("Please log in to view posts");
          setLoading(false);
          return;
        }
        if (!location.state.Percent1 || !location.state.Percent2) {
          setError("Missing post data. The post may be incomplete.");
          setLoading(false);
          return;
        }

        const urlgot = await Server.getURLforMap(
          programUser.username || programUser._id || programUser.id,
          location.state.Percent1,
          location.state.Percent2
        );

        console.log("Generated URL:", urlgot);
        setUrl(urlgot);
      } catch (error) {
        console.error("Error fetching map URL:", error);
        setError("Failed to load trail map: " + error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMapUrl();
  }, [location.state]);

  const post = location.state
    ? {
        text: location.state.text || "",
        title: location.state.title || "Untitled Post",
      }
    : null;

  return (
    <>
      <TrailNavbar />
      <h1>Trail Presentation</h1>
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
