import React from 'react';
import { Card, Button } from 'react-bootstrap';
import AdminProfile from './AdminProfile';

function Profile({ user, onLogout }) {
  return (
    <Card className="mx-auto mt-5" style={{ maxWidth: '400px' }}>
      <Card.Body>
        <Card.Title>Profil</Card.Title>
        <Card.Text>
          <strong>Korisničko ime:</strong> {user.username}<br />
          <strong>Email:</strong> {user.email}
        </Card.Text>
        <Button variant="outline-danger" onClick={onLogout}>Odjavi se</Button>
        {user.role === 'admin' && <AdminProfile token={user.token} />}
      </Card.Body>
    </Card>
  );
}

export default Profile;
