import TrailNavbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Server from "../modules/ServerConnector.js";
import Map from "../components/Map.jsx";
import PostText from "../components/PostText.jsx";
import userGetter from "../modules/user.js";

export default function PresentationPage() {
  const [openPic, setOpenPic] = useState(-1);
  const [percent, setCurrentPercent] = useState(-1);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function fetchMapUrl() {
      try {
        setLoading(true);
        const programUser = await userGetter.getCurrentUser();

        if (
          location.state &&
          location.state.Percent1 &&
          location.state.Percent2
        ) {
          const urlgot = await Server.getURLforMap(
            programUser,
            location.state.Percent1,
            location.state.Percent2
          );
          console.log("Generated URL:", urlgot);
          setUrl(urlgot);
        }
      } catch (error) {
        console.error("Error fetching map URL:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMapUrl();
  }, [location.state]);

  // Check if we have the required data
  if (!location.state) {
    return (
      <>
        <TrailNavbar />
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Presentation Page</h1>
          <p>No post data provided. Please select a post to view.</p>
        </div>
      </>
    );
  }

  const post = {
    text: location.state.text || "",
    title: location.state.title || "Untitled Post",
  };

  return (
    <>
      <TrailNavbar />
      <div style={{ padding: "20px" }}>
        <h1>Presentation Page</h1>

        {loading ? (
          <p>Loading map...</p>
        ) : (
          <>
            <PostText post={post}></PostText>
            {url ? (
              <Map
                url={url}
                percent={percent}
                setCurrentPercent={setCurrentPercent}
                openPic={openPic}
                setOpenPic={setOpenPic}
              />
            ) : (
              <p>No map available for this post.</p>
            )}
          </>
        )}
      </div>
    </>
  );
}
