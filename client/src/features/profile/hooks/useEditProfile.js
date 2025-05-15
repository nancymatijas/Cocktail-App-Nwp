import { useState } from 'react';

export function useEditProfile(user, setUser, setEditing, setMessage) {
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setMessage('New passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const resProfile = await fetch('http://localhost:5000/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email
        })
      });
      const dataProfile = await resProfile.json();
      if (!resProfile.ok) throw new Error(dataProfile.error || 'Error saving changes.');

      if (form.oldPassword && form.newPassword) {
        const resPass = await fetch('http://localhost:5000/api/users/me/password', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword
          })
        });
        const dataPass = await resPass.json();
        if (!resPass.ok) throw new Error(dataPass.error || 'Error changing password.');
      }

      const updatedUser = { ...user, username: dataProfile.user.username, email: dataProfile.user.email };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage('Changes saved successfully!');
      setEditing(false);
    } catch (error) {
      setMessage(error.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, loading, handleChange, handleSubmit };
}
