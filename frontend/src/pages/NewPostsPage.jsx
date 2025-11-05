import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import Map from "../components/Map.jsx";
import TrailNavbar from "../components/NavBar.jsx";

export default function NewPostsPage() {
  return (
    <>
      <TrailNavbar />
      <h1>Map!</h1>
      <div className="contentContainer">
        <Map url="http://localhost:3000/api/test" />
      </div>
    </>
  );
}
