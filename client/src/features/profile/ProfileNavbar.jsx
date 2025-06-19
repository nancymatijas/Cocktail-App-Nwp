import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function ProfileNavbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand style={{ cursor: 'default' }}>
          Cocktail App🍹
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={user.username} id="user-nav-dropdown" align="end">
              {location.pathname === '/profile' ? (
                <NavDropdown.Item onClick={() => navigate('/user-profile')}>
                  My Profile
                </NavDropdown.Item>
              ) : (
                <NavDropdown.Item onClick={() => navigate('/')}>
                  Home
                </NavDropdown.Item>
              )}
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
