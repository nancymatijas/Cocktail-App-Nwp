import { useState, useEffect, useCallback } from 'react';

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


export const useSingleUser = (userId, token) => {
  const [userData, setUserData] = useState(null);
  const [cocktails, setCocktails] = useState([]);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Korisnik nije pronađen');
      const data = await response.json();
      setUserData(data);
      setFormData({
        username: data.username,
        email: data.email
      });
    } catch (err) {
      setError(err.message);
    }
  }, [userId, token]);

  const fetchUserCocktails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/cocktails`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Greška pri dohvatu koktela');
      const data = await response.json();
      setCocktails(data || []); 
    } catch (err) {
      setCocktails([]);
      console.error('Error fetching cocktails:', err);
    }
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        await Promise.all([fetchUserData(), fetchUserCocktails()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, token, fetchUserData, fetchUserCocktails]);

  const updateUser = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Greška pri ažuriranju');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    userData,
    cocktails,
    formData,
    setFormData,
    loading,
    error,
    updateUser,
    refreshCocktails: fetchUserCocktails,
    fetchUserData 
  };
};
