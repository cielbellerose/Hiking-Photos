import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";

function TrailNavbar() {
  const [username, setUsername] = useState(null);

  // use effect to check if a user is currently logged in
  useEffect(() => {
    async function checkLogin() {
      try {
        const response = await fetch("/api/current_user", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        }
      } catch (error) {
        console.error("Error checking login info:", error);
      }
    }
    checkLogin();
  }, []);

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Hiking Stories</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Edit</Nav.Link>
            <Nav.Link href="/view">Present</Nav.Link>
            {/* Change this formatting later */}
            <Nav.Link href="/login">Login</Nav.Link>
            {/* Remove this but just for ease of access rn*/}
            <Nav.Link href="/viewPost">Post View</Nav.Link>
            <Nav.Link href="/new">New</Nav.Link>
          </Nav>
          <Nav>
            {username ? (
              <>
                <Navbar.Text className="user" style={{ color: "#03b50fff", fontWeight: "600", marginRight: "20px" }}>
                  {username}
                </Navbar.Text>
                <Nav.Link onClick={() => {}}>Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default TrailNavbar;
