import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function CandidateProfile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    education: user?.education || '',
    experience: user?.experience || '',
    skills: (user?.skills || []).join(', '),
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    setSaving(true);
    try {
      const res = await api.put('/candidates/profile', form);
      setUser(res.data.user);
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const data = new FormData();
      data.append('resume', file);
      const res = await api.post('/candidates/resume', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser({ ...user, resumeUrl: res.data.resumeUrl, resumeFileName: res.data.resumeFileName });
      setMessage('Resume uploaded.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="main-container" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div>
          <span className="eyebrow">Your profile</span>
          <h1>Candidate profile</h1>
          <p>Keep this up to date so recruiters can find and evaluate you.</p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form className="card" onSubmit={handleSave}>
        <div className="form-row">
          <div className="field">
            <label>Full name</label>
            <input value={form.name} onChange={handleChange('name')} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={handleChange('phone')} />
          </div>
        </div>
        <div className="field">
          <label>Skills</label>
          <input value={form.skills} onChange={handleChange('skills')} placeholder="Comma-separated, e.g. Python, React, SQL" />
        </div>
        <div className="field">
          <label>Education</label>
          <input value={form.education} onChange={handleChange('education')} placeholder="e.g. B.Tech CSE, XYZ College" />
        </div>
        <div className="field">
          <label>Experience</label>
          <textarea rows={3} value={form.experience} onChange={handleChange('experience')} placeholder="Brief summary of your experience" />
        </div>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
      </form>

      <div className="card">
        <h3>Resume</h3>
        {user?.resumeFileName ? (
          <p>Current file: <strong>{user.resumeFileName}</strong> — <a href={user.resumeUrl} target="_blank" rel="noreferrer">view</a></p>
        ) : (
          <p className="text-muted">No resume uploaded yet.</p>
        )}
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
          <button className="btn btn-outline" disabled={uploading || !file}>{uploading ? 'Uploading…' : 'Upload resume'}</button>
        </form>
        <small>PDF, DOC or DOCX, up to 5MB.</small>
      </div>
    </div>
  );
}
