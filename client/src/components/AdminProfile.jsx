import React, { useEffect, useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';

function AdminProfile({ token }) {
  const [users, setUsers] = useState([]);
  const adminId = jwtDecode(token).id;

  useEffect(() => {
    fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Jesi li siguran da želiš obrisati ovog korisnika?')) return;
    const response = await fetch(`http://localhost:5000/api/users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.ok) setUsers(users.filter(user => user._id !== id));
  };

  return (
    <div className="mt-4">
      <h4>Svi korisnici</h4>
      <ListGroup>
        {users.map(user => (
          <ListGroup.Item key={user._id} className="d-flex justify-content-between align-items-center">
            <span>{user.username} ({user.email})</span>
            {user._id !== adminId && (
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user._id)}>
                Obriši
              </Button>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default AdminProfile;
