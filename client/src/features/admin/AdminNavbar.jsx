import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AdminNavbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand style={{ cursor: 'default' }}>
          Cocktail App - Admin Dashboard
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown 
              title={user?.username || 'Admin'} 
              id="admin-nav-dropdown" 
              align="end"
            >
              <NavDropdown.Item onClick={() => navigate('/admin')}>
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AdminNavbar;
