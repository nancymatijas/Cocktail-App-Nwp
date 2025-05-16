import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Spinner, Alert, Card } from 'react-bootstrap';
import AdminNavbar from './AdminNavbar';
import { useSingleUser } from './hooks/useUsers';

function EditUserPage({ token, user, onLogout }) {
  const { userId } = useParams();
  const navigate = useNavigate();

  const {
    userData,
    formData,
    setFormData,
    loading,
    error,
    updateUser,
  } = useSingleUser(userId, token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUser(formData);
    if (success) navigate('/admin');
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;
  if (!userData) return <Alert variant="warning" className="m-4">User not found</Alert>;

  return (
    <>
      <AdminNavbar user={user} onLogout={onLogout} />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="mb-4 display-6 fw-bold text-center">Edit User</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      required
                      placeholder="Enter username"
                      autoComplete="username"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      required
                      placeholder="Enter email"
                      autoComplete="email"
                    />
                  </Form.Group>

                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                  
                  <div className="d-flex justify-content-between gap-2 mt-4">
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin')}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUserPage;
