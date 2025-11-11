import { useState, useEffect } from "react";
import TrailNavbar from "../components/Navbar";
import UploadPhotostModal from "../components/UploadPhotosModal";
import ServerConnector from "../modules/ServerConnector.js";

export default function TrailEditPage() {
  const [photos, setPhotos] = useState([]);

  // for getting photos from local storage
  useEffect(() => {
    async function loadPhotos() {
      const currentUser = await userModule.getCurrentUser();
      try {
        const response = await fetch(ServerConnector.getURLforMap(currentUser,-1,100), {credentials: "include"});
        if (response.ok) {
          const data = await response.json();
          setPhotos(data);
        }
      } catch (error) {
        console.error("Failed to load photos:", error);
      }
    }
    loadPhotos();
  }, []);

  const handlePhotoUploaded = (filename) => {
    setPhotos([...photos, filename]);
  };

  return (
    <>
      <TrailNavbar />
      <h1>Edit</h1>
      <div className="contentContainer">
        <UploadPhotostModal onPhotoUploaded={handlePhotoUploaded} />
        {/* If no photos - for debugging*/}
        {photos.length === 0 && <p>No photos uploaded yet.</p>}
      </div>
    </>
  );
}
