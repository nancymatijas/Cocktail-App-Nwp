import React from 'react';
import { Card, ListGroup, Button, Badge, Image, Spinner, Alert } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { useUsers } from './hooks/useUsers';
import { Link } from 'react-router-dom';

function AdminProfile({ token }) {
  const adminId = jwtDecode(token).id;
  const { users, loading, error, setUsers } = useUsers(token);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.ok) setUsers(users.filter(user => user._id !== id));
  };

  return (
    <Card className="mt-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3 text-center display-6 fw-bold">User List</Card.Title>
        {loading && <Spinner animation="border" className="d-block mx-auto my-4" />}
        {error && <Alert variant="danger">{error}</Alert>}
        <ListGroup variant="flush">
          {users.map(user => (
            <ListGroup.Item
              key={user._id}
              className="d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center">
                <Image
                  src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
                  roundedCircle
                  width={36}
                  height={36}
                  className="me-3"
                  alt="avatar"
                />
                <span>
                  <strong>{user.username}</strong> <span className="text-muted">({user.email})</span>
                  {user.role === 'admin' && (
                    <Badge bg="warning" text="dark" className="ms-2">Admin</Badge>
                  )}
                </span>
              </div>
              {user._id !== adminId && (
                <div className="d-flex gap-2">
                  <Button 
                    as={Link}
                    to={`/edit-user/${user._id}`}
                    variant="outline-primary" 
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
}

export default AdminProfile;
