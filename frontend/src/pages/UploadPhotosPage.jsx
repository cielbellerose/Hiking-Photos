import { useState, useEffect } from "react";
import TrailNavbar from "../components/Navbar.jsx";
import UploadPhotosModal from "../components/UploadPhotosModal.jsx";
import Server from "../modules/ServerConnector.js";

export default function UploadPhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // for getting photos from local storage
  useEffect(() => {
    async function loadPhotos() {
      try {
        setLoading(true);
        const currentUser = await Server.getCurrentUser();
        setCurrentUser(currentUser);

        if (currentUser) {
          const username = currentUser.username || currentUser.user?.username;
          const photosData = await Server.getUserPhotos(username);
          setPhotos(photosData);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPhotos();
  }, []);

  const handlePhotoUploaded = (uploadResult) => {
    try {
      setPhotos([...photos, uploadResult]);
    } catch (error) {
      console.error("Failed to update photos after upload:", error);
    }
  };

  return (
    <>
      <TrailNavbar />
      <div className="container mt-4">
        <h1>Appalachian Stories</h1>
        <h3>Upload your photos taken on the Appalachian Trail!</h3>
        <div className="contentContainer">
          {currentUser ? (
            <>
              <UploadPhotosModal onPhotoUploaded={handlePhotoUploaded} />
              {loading ? (
                <p>Loading photos...</p>
              ) : photos.length === 0 ? (
                <div className={"mt-3"}>No photos uploaded.</div>
              ) : (
                <div className="mt-4">
                  <h3>Your Photos ({photos.length})</h3>
                  <div className="row">
                    {photos.map((photo, index) => {
                      return (
                        <div key={index} className="col-md-4 col-lg-3 mb-3">
                          <div className="card">
                            <img
                              src={
                                photo.url ||
                                `/user_data/${photo.filename || photo}`
                              }
                              alt={`Trail photo ${index + 1}`}
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "cover" }}
                              onError={(e) => {
                                console.error(
                                  "Image failed to load:",
                                  e.target.src
                                );
                              }}
                              onLoad={() => {
                                console.log("Image Loaded");
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>Please log in to upload photos.</div>
          )}
        </div>
      </div>
    </>
  );
}
