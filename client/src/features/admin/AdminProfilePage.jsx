import { Container } from 'react-bootstrap';
import AdminProfile from './AdminProfile';
import AdminNavbar from './AdminNavbar';

function AdminProfilePage({ user, onLogout }) {
  return (
    <>
      <AdminNavbar user={user} onLogout={onLogout} />
      <Container className="mt-4">
        <AdminProfile token={user.token} />
      </Container>
    </>
  );
}

export default AdminProfilePage;
