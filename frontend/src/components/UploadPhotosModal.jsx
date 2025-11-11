import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from "../css/Modal.module.css";
import toast from "react-hot-toast";
import Server from "../modules/ServerConnector.js"

export default function UploadPhotostModal({ onPhotoUploaded }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);

  const handleClose = () => {
    setShow(false);
    setFile(null);
  };

  const handleShow = () => setShow(true);

  const handleFileChange = (e) => {
    console.log("handleFileChange called!");
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    console.log("handleUpload called!");
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    console.log("File to upload:", file);
    const formData = new FormData();

    formData.append("photo", file);
    console.log("About to fetch...");


    try {
      const res = await fetch(Server.serverName + "/api/upload", {
        method: "POST",
        body: formData,
        credentials: "omit"
      });
      console.log("Response received:", res.status);

      const text = await res.text();
      console.log("Response text:", text);

      const data = JSON.parse(text);
      if (res.ok) {
        toast.success("Upload successful!");
        onPhotoUploaded(data.filename); // send to parent
        handleClose();
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.log("Caught error:", error);
      toast.error("Upload error");
      console.error(error);
    }
  };

  return (
    <>
      <button className={styles.button} onClick={handleShow}>
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
          />
          <label htmlFor="image-input" className={styles.customButton}>
            Choose File
          </label>
          {file && <p className={styles.selected}>Selected: {file.name}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button className={styles.saveButton} onClick={handleUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
