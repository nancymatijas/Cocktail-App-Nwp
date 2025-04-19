import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (data.success) {
      setMessage('Registracija uspješna! Preusmjeravam...');
      setTimeout(() => window.location.href = '/login', 1000);
    } else {
      setMessage(data.error || 'Greška!');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Registracija</h2>
          {message && <Alert variant={message.includes('uspješna') ? 'success' : 'danger'}>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Korisničko ime</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Unesi korisničko ime"
                value={form.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Unesi email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Lozinka</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Unesi lozinku"
                value={form.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Registriraj se
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
