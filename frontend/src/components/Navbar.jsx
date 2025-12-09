import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import EditProfileForm from "./EditProfileForm.jsx";
import user from "../modules/user.js";
import Server from "../modules/ServerConnector.js";
import styles from "../css/Navbar.module.css";

function TrailNavbar() {
  const [username, setUsername] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkLogin() {
      const currentUsername = await user.getCurrentUser();
      console.log("currentusername:", currentUsername);
      if (currentUsername) {
        setUsername(currentUsername);
      }
    }
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(Server.serverName + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUsername(null);
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleProfileUpdate = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <>
      <Navbar className={styles.navbar}>
        <Container>
          <Navbar.Brand href="/" className={styles.brand}>
            APPALACHIAN STORIES
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/" className={styles.navLink}>
              Upload
            </Nav.Link>
            <Nav.Link href={`/viewPost/${username}`} className={styles.navLink}>
              Posts
            </Nav.Link>
            <Nav.Link href="/new" className={styles.navLink}>
              View
            </Nav.Link>
          </Nav>
          <Nav>
            {username ? (
              <>
                <Navbar.Text className={styles.userDisplay}>
                  {username}
                </Navbar.Text>
                <Nav.Link
                  onClick={() => setShowEditModal(true)}
                  className={styles.navLink}
                >
                  Edit Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className={styles.navLink}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link href="/login" className={styles.navLink}>
                Login
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Body>
          <EditProfileForm
            currentUsername={username}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleProfileUpdate}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default TrailNavbar;
