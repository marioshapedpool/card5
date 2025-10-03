import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Confirm from './pages/Confirm';
import Terms from './pages/Terms';
import Dashboard from './pages/Dashboard';
import useUser from './hooks/useUser';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/UI/Navbar';

export default function App() {
  const { user, loading, signOut, isPremium } = useUser();

  return (
    <div>
      <Navbar
        user={user}
        loading={loading}
        signOut={signOut}
        isPremium={isPremium}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
