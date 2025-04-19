import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';

function Login({ setUser }) {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [message, setMessage] = useState('');
  
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (data.success) {
      setUser({ ...data.user, token: data.token });
      localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
      setMessage('Prijava uspješna! Preusmjeravam...');
      setTimeout(() => window.location.href = '/profile', 500);
    } else {
      setMessage(data.error || 'Greška!');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6}>
          <h2 className="text-center mb-4">Prijava</h2>
          {message && <Alert variant={message.includes('uspješna') ? 'success' : 'danger'}>{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicUsernameOrEmail">
              <Form.Label>Korisničko ime ili email</Form.Label>
              <Form.Control
                type="text"
                name="usernameOrEmail"
                placeholder="Unesi korisničko ime ili email"
                value={form.usernameOrEmail}
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
            <Button variant="primary" type="submit" className="w-100">
              Prijavi se
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
