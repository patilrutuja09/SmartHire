import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">SH</span>
        SmartHire
      </NavLink>

      {user && (
        <nav className="nav-links">
          {user.role === 'recruiter' ? (
            <>
              <NavLink to="/recruiter/dashboard">Dashboard</NavLink>
              <NavLink to="/recruiter/jobs/new">Post a Job</NavLink>
              <NavLink to="/recruiter/candidates">Search Candidates</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/jobs">Browse Jobs</NavLink>
              <NavLink to="/candidate/applications">My Applications</NavLink>
              <NavLink to="/candidate/profile">Profile</NavLink>
            </>
          )}
        </nav>
      )}

      <div className="nav-user">
        {user ? (
          <>
            <span className="nav-role-tag">{user.role}</span>
            <span className="text-muted" style={{ fontSize: '0.88rem' }}>{user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn btn-outline btn-sm">Log in</NavLink>
            <NavLink to="/register" className="btn btn-primary btn-sm">Sign up</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
