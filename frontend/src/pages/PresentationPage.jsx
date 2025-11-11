import TrailNavbar from "../components/NavBar";
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import ServerConnector from "../modules/ServerConnector.js"
import Map from "../components/Map.jsx"

export default function PresentationPage() {
  const [openPic, setOpenPic] = useState(() => -1);
  const [percent, setCurrentPercent] = useState(() => -1);
  const location = useLocation();
  console.log(location);
  const url = ServerConnector.getURLforMap("debug",0,100); //format the query appropriately
  
  return (
    <>
      <TrailNavbar />
      <h1>Presentation Page</h1>
      <Map url={url} percent={percent} setCurrentPercent={setCurrentPercent} openPic={openPic} setOpenPic={setOpenPic}/>

      <div className="contentContainer"></div>
    </>
  );
}
