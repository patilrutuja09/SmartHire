import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [coverNote, setCoverNote] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((res) => setJob(res.data.job));
    if (user?.role === 'candidate') {
      api.get('/applications/my-applications').then((res) => {
        setAlreadyApplied(res.data.applications.some((a) => a.job?._id === id));
      }).catch(() => {});
    }
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true);
    setError('');
    try {
      await api.post(`/applications/${id}`, { coverNote });
      setMessage('Application submitted! You can track its status from "My Applications".');
      setAlreadyApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit application');
    } finally {
      setApplying(false);
    }
  };

  if (!job) return <div className="main-container">Loading…</div>;

  return (
    <div className="main-container">
      <div className="card">
        <span className="eyebrow">{job.jobType}</span>
        <h1>{job.title}</h1>
        <p className="text-muted">{job.company} · {job.location}{job.salaryRange ? ` · ${job.salaryRange}` : ''}</p>

        {job.skillsRequired?.length > 0 && (
          <div className="chip-row mt-16">
            {job.skillsRequired.map((s) => <span className="skill-chip" key={s}>{s}</span>)}
          </div>
        )}

        <h3 className="mt-24">Job description</h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{job.description}</p>

        {job.experienceRequired && (
          <p><strong>Experience required:</strong> {job.experienceRequired}</p>
        )}

        {user?.role !== 'recruiter' && (
          <div className="mt-24">
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            {alreadyApplied ? (
              <span className="status-badge status-applied">You already applied to this job</span>
            ) : (
              <form onSubmit={handleApply}>
                <div className="field">
                  <label>Cover note (optional)</label>
                  <textarea rows={4} value={coverNote} onChange={(e) => setCoverNote(e.target.value)} placeholder="Tell the recruiter why you're a great fit…" />
                </div>
                <button className="btn btn-accent" disabled={applying}>
                  {applying ? 'Submitting…' : user ? 'Apply now' : 'Log in to apply'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
