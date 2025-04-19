import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

function ProfileNavbar({ user, onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">Cocktail App🍹</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={user.username} id="user-nav-dropdown" align="end">
              <NavDropdown.Item disabled>
                <strong>Email:</strong> {user.email}
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ProfileNavbar;
