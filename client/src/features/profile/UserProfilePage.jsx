import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import ProfileNavbar from '../profile/ProfileNavbar';
import EditProfileForm from './EditProfileForm';

function UserProfilePage({ user, onLogout, setUser }) {
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  if (!user) return <div className="text-center mt-5">No user data.</div>;

  return (
    <>
      <ProfileNavbar user={user} onLogout={onLogout} />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card className="shadow-lg border-0 rounded-4">
              <Card.Body>
                <div className="d-flex flex-column align-items-center mb-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                    alt="avatar"
                    width="80"
                    className="mb-3 rounded-circle shadow"
                  />
                  <h3 className="fw-bold mb-1 text-center">{user.username}</h3>
                  <p className="text-muted mb-2 text-center">{user.email}</p>
                </div>
                {!editing ? (
                  <div className="d-flex justify-content-center mt-4">
                    <Button 
                      variant="primary" 
                      onClick={() => setEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <EditProfileForm
                    user={user}
                    setUser={setUser}
                    setEditing={setEditing}
                    setMessage={setMessage}
                  />
                )}
                {message && (
                  <div className="d-flex justify-content-center mt-3">
                    <Alert 
                      variant={message.toLowerCase().includes('success') ? 'success' : 'danger'} 
                      className="w-100 text-center"
                    >
                      {message}
                    </Alert>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UserProfilePage;
