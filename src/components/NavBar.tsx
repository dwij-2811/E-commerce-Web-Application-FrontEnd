// NavBar.tsx
import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useAuth } from "./AuthContext";

const NavBar: React.FC = () => {
  const { authToken, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar
      bg="bg-body-tertiary"
      expand="lg"
      className="main-nav-bar top"
      style={{
        top: "0",
        left: "0",
        right: "0",
        border: "1px solid",
        color: "white",
        padding: "10px",
      }}
    >
      <Container>
        <Navbar.Brand href="#">
          <img
            src="https://amdavadistreetzimages.s3.us-west-2.amazonaws.com/amdavadistreetzTransparent.png"
            alt="AmdavadiStreetz Logo"
            width="65" // Adjust the width as needed
            height="50" // Adjust the height as needed
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent" className="mx-auto">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link className="mb-2 mb-lg-0" href="/products">
              <Button variant="primary">Menu</Button>
            </Nav.Link>
            <Nav.Link className="mb-2 mb-lg-0" href="/about-us">
              <Button variant="primary">About Us</Button>
            </Nav.Link>
            <Nav.Link className="mb-2 mb-lg-0" href="/contact-us">
              <Button variant="primary">Contact Us</Button>
            </Nav.Link>
          </Nav>
          {!authToken && (
            <Nav className="mb-2 mb-lg-0">
              <Nav.Link className="mb-2 mb-lg-0" href="/login">
                <Button variant="outline-primary">Login</Button>
              </Nav.Link>
              <Nav.Link className="mb-2 mb-lg-0" href="/signup">
                <Button variant="outline-primary">SignUp</Button>
              </Nav.Link>
            </Nav>
          )}
          {authToken && (
            <Nav.Link className="mb-2 mb-lg-0">
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
