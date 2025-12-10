import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import EditProfileForm from "./EditProfileForm.jsx";
import Server from "../modules/ServerConnector.js";
import styles from "../css/Navbar.module.css";

function TrailNavbar() {
  const [username, setUsername] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkLogin() {
      try {
        const userData = await Server.getCurrentUser();
        if (userData && userData.authenticated) {
          setUsername(userData.username || userData.user?.username);
        } else {
          setUsername(null);
        }
      } catch (error) {
        console.error("Error checking login:", error);
        setUsername(null);
      }
    }
    checkLogin();
  }, []);

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await Server.logoutUser();
      setUsername(null);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setUsername(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (newUsername) => {
    setUsername(newUsername);
  };

  const handlePostsClick = (e) => {
    if (!username) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar className={styles.navbar}>
        <Container>
          <Navbar.Brand className={styles.brand}>
            APPALACHIAN STORIES
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/" className={styles.navLink}>
              Upload
            </Nav.Link>
            <Nav.Link
              href={`/view/${username}`}
              className={styles.navLink}
              onClick={handlePostsClick}
            >
              View
            </Nav.Link>
            <Nav.Link href="/new" className={styles.navLink}>
              New
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
                  disabled={loading}
                >
                  Edit Profile
                </Nav.Link>
                <Nav.Link
                  onClick={handleLogout}
                  className={styles.navLink}
                  disabled={loading}
                >
                  {loading ? "Logging out..." : "Logout"}
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
