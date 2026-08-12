import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    if (user?.role === 'candidate') {
      api.get('/applications/my-applications').then((res) => {
        setAppliedIds(new Set(res.data.applications.map((a) => a.job?._id)));
      }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="main-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Open roles</span>
          <h1>Browse jobs</h1>
          <p>Search and filter roles that match your skills.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSearch} style={{ marginBottom: 24 }}>
        <div className="form-row">
          <div className="field">
            <label>Keyword</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Title, skill, or company" />
          </div>
          <div className="field">
            <label>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City or Remote" />
          </div>
          <div className="field">
            <label>Job type</label>
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">Any</option>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary">Search jobs</button>
      </form>

      {loading ? (
        <p className="text-muted">Loading jobs…</p>
      ) : jobs.length === 0 ? (
        <div className="empty-state card">
          <h3>No jobs found</h3>
          <p>Try a different keyword or clear your filters.</p>
        </div>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => (
            <Link to={`/jobs/${job._id}`} key={job._id} className="card job-card">
              <div className="job-title">{job.title}</div>
              <div className="job-meta">
                <span>{job.company}</span>
                <span>{job.location}</span>
                <span>{job.jobType}</span>
              </div>
              <p className="job-desc">{job.description}</p>
              {job.skillsRequired?.length > 0 && (
                <div className="chip-row">
                  {job.skillsRequired.slice(0, 4).map((s) => (
                    <span className="skill-chip" key={s}>{s}</span>
                  ))}
                </div>
              )}
              {appliedIds.has(job._id) && <span className="status-badge status-applied">Already applied</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
