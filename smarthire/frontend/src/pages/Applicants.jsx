import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import PipelineTrack from '../components/PipelineTrack';

export default function Applicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = async () => {
    const [appsRes, jobRes] = await Promise.all([
      api.get(`/applications/job/${jobId}`),
      api.get(`/jobs/${jobId}`),
    ]);
    setApplications(appsRes.data.applications);
    setJob(jobRes.data.job);
  };

  useEffect(() => { load(); }, [jobId]);

  const updateStatus = async (appId, status) => {
    await api.put(`/applications/${appId}/status`, { status });
    load();
  };

  const visible = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  return (
    <div className="main-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Applicants</span>
          <h1>{job ? job.title : 'Loading…'}</h1>
          <p>{applications.length} candidate{applications.length === 1 ? '' : 's'} applied</p>
        </div>
        <div className="field" style={{ margin: 0, minWidth: 180 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty-state card">
          <h3>No applicants here</h3>
          <p>Once candidates apply, they'll show up in this list.</p>
        </div>
      ) : (
        visible.map((app) => (
          <div className="card" key={app._id}>
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{app.candidate?.name}</div>
                <div className="text-muted" style={{ fontSize: '0.86rem' }}>{app.candidate?.email}{app.candidate?.phone ? ` · ${app.candidate.phone}` : ''}</div>
              </div>
              <StatusBadge status={app.status} />
            </div>

            {app.candidate?.skills?.length > 0 && (
              <div className="chip-row mt-16">
                {app.candidate.skills.map((s) => <span className="skill-chip" key={s}>{s}</span>)}
              </div>
            )}

            {app.candidate?.education && <p className="mt-16" style={{ marginBottom: 0 }}><strong>Education:</strong> {app.candidate.education}</p>}
            {app.candidate?.experience && <p style={{ marginTop: 4 }}><strong>Experience:</strong> {app.candidate.experience}</p>}
            {app.coverNote && <p style={{ fontStyle: 'italic', color: 'var(--ink-soft)' }}>"{app.coverNote}"</p>}

            <div className="mt-16">
              <PipelineTrack status={app.status} />
            </div>

            <div className="flex-between mt-16">
              <div style={{ display: 'flex', gap: 8 }}>
                {app.candidate?.resumeUrl && (
                  <a className="btn btn-outline btn-sm" href={app.candidate.resumeUrl} target="_blank" rel="noreferrer">View resume</a>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-accent btn-sm" onClick={() => updateStatus(app._id, 'shortlisted')} disabled={app.status === 'shortlisted'}>Shortlist</button>
                <button className="btn btn-success btn-sm" onClick={() => updateStatus(app._id, 'hired')} disabled={app.status === 'hired'}>Hire</button>
                <button className="btn btn-danger btn-sm" onClick={() => updateStatus(app._id, 'rejected')} disabled={app.status === 'rejected'}>Reject</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
