import AddPostModal from "../components/AddPostModal";
import TrailNavbar from "../components/NavBar";
import UploadPhotostModal from "../components/UploadPhotosModal";

export default function TrailEditPage() {
  return (
    <>
      <TrailNavbar />
      <h1>Trail Edit Page</h1>
      <div className="contentContainer">
        <AddPostModal />
        <UploadPhotostModal />
      </div>
    </>
  );
}
