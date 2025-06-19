import { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card, Spinner } from 'react-bootstrap';
import 'animate.css';

function Login({ setUser }) {
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (data.success) {
        setUser({ ...data.user, token: data.token });
        localStorage.setItem('user', JSON.stringify({ ...data.user, token: data.token }));
        setMessage('Login successful! Redirecting...');

        const redirectPath = data.user.role === 'admin' ? '/admin' : '/profile';
        setTimeout(() => window.location.href = redirectPath, 700);
      } else {
        setMessage(data.error || 'An error occurred!');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="register-bg">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={7} lg={5}>
            <Card className="shadow-lg border-0 rounded-4 p-2 animate__animated animate__fadeInDown">
              <Card.Body>
                <div className="text-center mb-4">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="Login"
                    width="64"
                    className="mb-2"
                  />
                  <h2 className="fw-bold" style={{ color: 'var(--color-primary)' }}>Login</h2>
                  <p className="text-muted mb-0">Welcome back! Please sign in to continue.</p>
                </div>
                {message && (
                  <Alert
                    variant={message.includes('successful') ? 'success' : 'danger'}
                    dismissible
                    onClose={() => setMessage('')}
                    className="animate__animated animate__fadeIn"
                  >
                    {message}
                  </Alert>
                )}
                <Form onSubmit={handleSubmit} className="mt-3">
                  <Form.Group className="mb-3" controlId="formBasicUsernameOrEmail">
                    <Form.Label>Username or Email</Form.Label>
                    <Form.Control
                      type="text"
                      name="usernameOrEmail"
                      placeholder="Enter username or email"
                      value={form.usernameOrEmail}
                      onChange={handleChange}
                      required
                      size="lg"
                    />
                  </Form.Group>
                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      size="lg"
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 py-2 fw-bold mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Logging in...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                  <div className="text-center">
                    <span className="text-muted">Don't have an account?</span>
                    <Button
                      variant="outline-primary"
                      className="ms-2 px-4"
                      href="/register"
                      type="button"
                    >
                      Register
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
