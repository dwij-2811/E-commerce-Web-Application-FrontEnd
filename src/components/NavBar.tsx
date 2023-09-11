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
        border: "1px solid #007bff",
        color: "white",
        padding: "10px",
      }}
    >
      <Container>
        <Navbar.Brand href="#">Navbar</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" />
        <Navbar.Collapse id="navbarSupportedContent" className="mx-auto">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link href="/products">Menu</Nav.Link>
            <Nav.Link href="#">About Us</Nav.Link>
            <Nav.Link href="/contact-us">Contact Us</Nav.Link>
          </Nav>
          {!authToken && (
            <Nav className="mb-2 mb-lg-0">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">SignUp</Nav.Link>
            </Nav>
          )}
          {authToken && (
            <Nav className="mb-2 mb-lg-0" style={{ marginLeft: "20px" }}>
              <Button variant="outline-danger" onClick={handleLogout}>
                LogOut
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
