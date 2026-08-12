import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function CandidateSearch() {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const [skill, setSkill] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (skill) params.skill = skill;
      const res = await api.get('/candidates', { params });
      setCandidates(res.data.candidates);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="main-container">
      <div className="page-header">
        <div>
          <span className="eyebrow">Talent pool</span>
          <h1>Search candidates</h1>
          <p>Find candidates by name, skill, or education.</p>
        </div>
      </div>

      <form className="card" onSubmit={handleSearch} style={{ marginBottom: 24 }}>
        <div className="form-row">
          <div className="field">
            <label>Keyword</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or education" />
          </div>
          <div className="field">
            <label>Skill</label>
            <input value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="e.g. React" />
          </div>
        </div>
        <button className="btn btn-primary">Search</button>
      </form>

      {loading ? (
        <p className="text-muted">Loading candidates…</p>
      ) : candidates.length === 0 ? (
        <div className="empty-state card">
          <h3>No candidates found</h3>
          <p>Try broadening your search.</p>
        </div>
      ) : (
        candidates.map((c) => (
          <div className="card" key={c._id}>
            <div className="flex-between">
              <div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{c.name}</div>
                <div className="text-muted" style={{ fontSize: '0.86rem' }}>{c.email}{c.phone ? ` · ${c.phone}` : ''}</div>
              </div>
              {c.resumeUrl && <a className="btn btn-outline btn-sm" href={c.resumeUrl} target="_blank" rel="noreferrer">View resume</a>}
            </div>
            {c.skills?.length > 0 && (
              <div className="chip-row mt-16">
                {c.skills.map((s) => <span className="skill-chip" key={s}>{s}</span>)}
              </div>
            )}
            {c.education && <p className="mt-16" style={{ marginBottom: 0 }}><strong>Education:</strong> {c.education}</p>}
            {c.experience && <p style={{ marginTop: 4 }}><strong>Experience:</strong> {c.experience}</p>}
          </div>
        ))
      )}
    </div>
  );
}
