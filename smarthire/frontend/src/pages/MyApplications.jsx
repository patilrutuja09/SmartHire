import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import PipelineTrack from '../components/PipelineTrack';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my-applications').then((res) => setApplications(res.data.applications)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="main-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Your pipeline</span>
          <h1>My applications</h1>
          <p>Track the status of every job you've applied to.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : applications.length === 0 ? (
        <div className="empty-state card">
          <h3>No applications yet</h3>
          <p>Browse open roles and apply to get started.</p>
          <Link to="/jobs" className="btn btn-primary mt-16">Browse jobs</Link>
        </div>
      ) : (
        applications.map((app) => (
          <div className="card" key={app._id}>
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  <Link to={`/jobs/${app.job?._id}`}>{app.job?.title || 'Job removed'}</Link>
                </div>
                <div className="text-muted" style={{ fontSize: '0.86rem' }}>{app.job?.company} · {app.job?.location}</div>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="mt-16">
              <PipelineTrack status={app.status} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
