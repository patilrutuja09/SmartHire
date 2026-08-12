import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="main-container">
      <div className="card" style={{ padding: '56px 40px', textAlign: 'center' }}>
        <span className="eyebrow">Recruitment, simplified</span>
        <h1 style={{ fontSize: '2.2rem', maxWidth: 560, margin: '0 auto 12px' }}>
          Move candidates from applied to hired, in one place.
        </h1>
        <p className="text-muted" style={{ maxWidth: 480, margin: '0 auto 28px' }}>
          SmartHire connects recruiters and candidates through one clean pipeline —
          post jobs, apply in minutes, and track every stage without the spreadsheet.
        </p>

        {!user ? (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-accent">Get started</Link>
            <Link to="/jobs" className="btn btn-outline">Browse jobs</Link>
          </div>
        ) : user.role === 'recruiter' ? (
          <Link to="/recruiter/dashboard" className="btn btn-accent">Go to dashboard</Link>
        ) : (
          <Link to="/jobs" className="btn btn-accent">Browse jobs</Link>
        )}
      </div>
    </div>
  );
}
