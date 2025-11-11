import { useState, useEffect } from "react";
import TrailNavbar from "../components/Navbar";
import UploadPhotostModal from "../components/UploadPhotosModal";

export default function TrailEditPage() {
  const [photos, setPhotos] = useState([]);

  // for getting photos from local storage
  useEffect(() => {
    async function loadPhotos() {
      try {
        const response = await fetch("/api/photos");
        if (response.ok) {
          const data = await response.json();
          setPhotos(data.photos);
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
        {photos.map((photo, index) => (
          <div key={index} style={{ margin: "10px" }}>
            <img
              src={`http://localhost:3000/user_data/${photo}`}
              alt={`Upload ${index + 1}`}
              width="300"
              onError={(e) => {
                console.error(`Failed to load image: /user_data/${photo}`);
                e.target.style.border = "2px solid red";
              }}
              onLoad={() =>
                console.log(`Successfully loaded: /user_data/${photo}`)
              }
            />
          </div>
        ))}
        {/* If no photos - for debugging*/}
        {photos.length === 0 && <p>No photos uploaded yet.</p>}
      </div>
    </>
  );
}
