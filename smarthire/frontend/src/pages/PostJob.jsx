import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', company: '', location: '', jobType: 'Full-time',
    skillsRequired: '', salaryRange: '', experienceRequired: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/jobs', form);
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <span className="eyebrow">New listing</span>
          <h1>Post a job</h1>
          <p>Publish a role and start receiving applications.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Job title</label>
          <input required value={form.title} onChange={handleChange('title')} placeholder="e.g. Backend Developer" />
        </div>
        <div className="form-row">
          <div className="field">
            <label>Company</label>
            <input required value={form.company} onChange={handleChange('company')} placeholder="Your company" />
          </div>
          <div className="field">
            <label>Location</label>
            <input required value={form.location} onChange={handleChange('location')} placeholder="City or Remote" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Job type</label>
            <select value={form.jobType} onChange={handleChange('jobType')}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </div>
          <div className="field">
            <label>Salary range</label>
            <input value={form.salaryRange} onChange={handleChange('salaryRange')} placeholder="e.g. ₹6–9 LPA" />
          </div>
        </div>
        <div className="field">
          <label>Experience required</label>
          <input value={form.experienceRequired} onChange={handleChange('experienceRequired')} placeholder="e.g. 0–2 years" />
        </div>
        <div className="field">
          <label>Skills required</label>
          <input value={form.skillsRequired} onChange={handleChange('skillsRequired')} placeholder="Comma-separated, e.g. React, Node.js, MongoDB" />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea required rows={6} value={form.description} onChange={handleChange('description')} placeholder="Responsibilities, requirements, benefits…" />
        </div>
        <button className="btn btn-primary" disabled={loading}>{loading ? 'Publishing…' : 'Publish job'}</button>
      </form>
    </div>
  );
}
