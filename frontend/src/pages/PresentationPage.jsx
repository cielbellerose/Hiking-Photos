import TrailNavbar from "../components/NavBar";
import { useState } from "react";
import Map from "../components/Map.jsx";

export default function PresentationPage() {
  console.log("Hello from React!");
  const [openPic, setOpenPic] = useState(() => -1);

  return (
    <>
      <TrailNavbar />
      <h1>My Trail</h1>
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
