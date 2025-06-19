import { Form } from 'react-bootstrap';

export default function ProfileFields({ form, onChange, loading }) {
  return (
    <>
      {/* Profile fields */}
      <Form.Group className="mb-3" controlId="editUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          name="username"
          value={form.username}
          onChange={onChange}
          disabled={loading}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="editEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          disabled={loading}
        />
      </Form.Group>

      {/* Password fields */}
      <hr />
      <Form.Group className="mb-3" controlId="oldPassword">
        <Form.Label>Current Password</Form.Label>
        <Form.Control
          type="password"
          name="oldPassword"
          value={form.oldPassword}
          onChange={onChange}
          disabled={loading}
          autoComplete="current-password"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="newPassword">
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type="password"
          name="newPassword"
          value={form.newPassword}
          onChange={onChange}
          disabled={loading}
          autoComplete="new-password"
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="confirmPassword">
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          disabled={loading}
          autoComplete="new-password"
        />
      </Form.Group>
    </>
  );
}
