import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function RecruiterDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);

  const load = async () => {
    const [statsRes, jobsRes] = await Promise.all([
      api.get('/candidates/dashboard-stats'),
      api.get('/jobs/my-jobs'),
    ]);
    setStats(statsRes.data);
    setJobs(jobsRes.data.jobs);
  };

  useEffect(() => { load(); }, []);

  const toggleStatus = async (job) => {
    await api.put(`/jobs/${job._id}`, { status: job.status === 'open' ? 'closed' : 'open' });
    load();
  };

  const removeJob = async (job) => {
    if (!confirm(`Delete "${job.title}"? This also removes its applications.`)) return;
    await api.delete(`/jobs/${job._id}`);
    load();
  };

  return (
    <div className="main-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Recruitment dashboard</h1>
          <p>Track your open roles and pipeline at a glance.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="btn btn-accent">Post a job</Link>
      </div>

      {stats && (
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-value">{stats.totalJobs}</div><div className="stat-label">Jobs posted</div></div>
          <div className="stat-card"><div className="stat-value">{stats.openJobs}</div><div className="stat-label">Currently open</div></div>
          <div className="stat-card"><div className="stat-value">{stats.totalApplications}</div><div className="stat-label">Total applicants</div></div>
          <div className="stat-card"><div className="stat-value">{stats.shortlisted}</div><div className="stat-label">Shortlisted</div></div>
          <div className="stat-card"><div className="stat-value">{stats.hired}</div><div className="stat-label">Hired</div></div>
          <div className="stat-card"><div className="stat-value">{stats.rejected}</div><div className="stat-label">Rejected</div></div>
        </div>
      )}

      <div className="flex-between mt-24" style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Your job postings</h2>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state card">
          <h3>No jobs posted yet</h3>
          <p>Post your first role to start receiving applications.</p>
          <Link to="/recruiter/jobs/new" className="btn btn-primary mt-16">Post a job</Link>
        </div>
      ) : (
        <div className="table-wrap card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Location</th><th>Type</th><th>Applicants</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td><Link to={`/jobs/${job._id}`} style={{ fontWeight: 600 }}>{job.title}</Link></td>
                  <td>{job.location}</td>
                  <td>{job.jobType}</td>
                  <td>
                    <Link to={`/recruiter/jobs/${job._id}/applicants`}>{job.applicantCount} applicant{job.applicantCount === 1 ? '' : 's'}</Link>
                  </td>
                  <td><StatusBadge status={job.status === 'open' ? 'applied' : 'rejected'} /> {job.status}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(job)}>
                      {job.status === 'open' ? 'Close' : 'Reopen'}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => removeJob(job)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
