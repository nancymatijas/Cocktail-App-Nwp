import { useState, useEffect } from 'react';

export function useUsers(token) {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    if (!token) return setUsers([]);
    setUsersLoading(true);
    setUsersError(null);
    fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setUsers(data))
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  }, [token]);

  return { users, setUsers, usersLoading, usersError };
}

export function useSingleUser(userId, token) {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;
    setLoading(true);
    setError(null);

    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('User not found');
        const data = await response.json();
        setUserData(data);
        setFormData({ username: data.username, email: data.email });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const updateUser = async (formData) => {
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Update failed');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    userData,
    formData,
    setFormData,
    loading,
    error,
    updateUser,
  };
}


