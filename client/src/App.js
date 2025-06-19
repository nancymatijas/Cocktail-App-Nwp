import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './features/profile/Profile';
import AdminProfilePage from './features/admin/AdminProfilePage';
import UserProfilePage from './features/profile/UserProfilePage';
import EditUserPage from './features/admin/EditUserPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        
        {/* User routes */}
        <Route
          path="/profile"
          element={
            user && user.role !== 'admin'
              ? <Profile user={user} onLogout={handleLogout} />
              : <Navigate to={user && user.role === 'admin' ? "/admin" : "/login"} replace />
          }
        />
        <Route
          path="/user-profile"
          element={
            user
              ? <UserProfilePage user={user} onLogout={handleLogout} setUser={setUser} />
              : <Navigate to="/login" replace />
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            user && user.role === 'admin'
              ? <AdminProfilePage user={user} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/edit-user/:userId"
          element={
            user && user.role === 'admin'
              ? <EditUserPage user={user} onLogout={handleLogout} token={user.token} />
              : <Navigate to="/login" replace />
          }
        />

        {/* Default routes */}
        <Route
          path="/"
          element={
            <Navigate to={
              user
                ? (user.role === 'admin' ? '/admin' : '/profile')
                : '/login'
            } replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
