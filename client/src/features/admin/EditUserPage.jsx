import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Spinner, Alert, Card, Table, Image } from 'react-bootstrap';
import AdminNavbar from './AdminNavbar';
import { useSingleUser } from './hooks/useUsers';

function EditUserPage({ token, user, onLogout }) {
  const { userId } = useParams();
  const [message, setMessage] = useState('');
  const { userData, cocktails, formData, setFormData, loading, error, updateUser, refreshCocktails, fetchUserData } = useSingleUser(userId, token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUser(formData);
    if (success) {
      setMessage("User updated successfully!");
      if (typeof fetchUserData === 'function') await fetchUserData();
      if (typeof refreshCocktails === 'function') await refreshCocktails();
    }
  };

  const handleDeleteCocktail = async (cocktailId) => {
    if (!window.confirm('Are you sure you want to remove this cocktail from favorites?')) return;
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/favorites/${cocktailId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error deleting cocktail');
      }
      if (typeof refreshCocktails === 'function') await refreshCocktails();
    } catch (err) {
      alert(err.message);
    }
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

            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h2 className="mb-4 display-6 fw-bold text-center">Edit User</h2>
                {message && <Alert variant="success">{message}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between gap-2 mt-4">
                    <Button variant="primary" type="submit">Save Changes</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <h4 className="mb-4">Saved Cocktails ({cocktails?.length || 0})</h4>
                {loading ? (
                  <Spinner animation="border" />
                ) : cocktails?.length > 0 ? (
                  <Table bordered hover responsive>
                    <thead className="bg-light">
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Cocktail Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cocktails.map((cocktail, index) => (
                        <tr key={cocktail.idDrink || cocktail._id || index}>
                          <td>{index + 1}</td>
                          <td>
                            <Image
                              src={cocktail.strDrinkThumb || cocktail.image}
                              alt={cocktail.strDrink || cocktail.name}
                              rounded
                              className="shadow-sm"
                              style={{
                                width: '70px',
                                height: '70px',
                                objectFit: 'cover'
                              }}
                            />
                          </td>
                          <td className="align-middle">
                            {cocktail.strDrink || cocktail.name}
                          </td>
                          <td className="align-middle">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteCocktail(cocktail.idDrink || cocktail._id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="info" className="mb-0">This user has no saved cocktails.</Alert>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUserPage;
