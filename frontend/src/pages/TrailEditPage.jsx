import { useState } from "react";
import AddPostModal from "../components/AddPostModal";
import TrailNavbar from "../components/NavBar";
import UploadPhotostModal from "../components/UploadPhotosModal";

export default function TrailEditPage() {
  const [photos, setPhotos] = useState([]);
  const handlePhotoUploaded = (filename) => {
    setPhotos([...photos, filename]);
  };

  return (
    <>
      <TrailNavbar />
      <h1>Trail Edit Page</h1>
      <div className="contentContainer">
        <AddPostModal />
        <UploadPhotostModal onPhotoUploaded={handlePhotoUploaded} />
        {photos.map((photo, index) => (
          <img
            key={index}
            src={`/user_data/${photo}`}
            alt="Upload"
            width="300"
          />
        ))}
      </div>
    </>
  );
}
