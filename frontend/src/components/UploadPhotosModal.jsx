import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from "../css/Modal.module.css";
import toast from "react-hot-toast";
import Server from "../modules/ServerConnector.js";

export default function UploadPhotosModal({ onPhotoUploaded }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleClose = () => {
    setShow(false);
    setFile(null);
    setUploading(false);
  };

  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    console.log("Handle file change:", selectedFile);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    setUploading(true);
    console.log("File to upload:", file);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      console.log("About to fetch...");

      const data = await Server.uploadPicture(formData);
      toast.success("Upload successful!");

      onPhotoUploaded(data.filename);
      handleClose();
    } catch (error) {
      console.log("Caught error:", error);
      toast.error("Upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button className="accent-button" onClick={handleShow}>
        Upload Photos
      </button>
      <Modal
        contentClassName={styles.modal}
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Upload Photos</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          <input
            id="image-input"
            type="file"
            accept=".png,.jpg,.jpeg,.gif"
            onChange={handleFileChange}
            className={styles.hiddenInput}
            disabled={uploading}
          />
          <label htmlFor="image-input" className="accent-button">
            {uploading ? "Uploading..." : "Choose File"}
          </label>
          {file && <p className={styles.selected}>Selected: {file.name}</p>}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="secondary-button"
            onClick={handleClose}
            disabled={uploading}
          >
            Close
          </button>
          <button
            className="accent-button"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload Photo"}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
