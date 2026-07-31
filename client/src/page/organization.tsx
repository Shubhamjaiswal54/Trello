import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface Organization {
  _id: string;
  name: string;
}

const token = localStorage.getItem('token');

// Turns a mongo _id into a short, ledger-style reference number.
function regNumber(id: string) {
  return id.slice(-6).toUpperCase();
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
  return letters.toUpperCase();
}

const Organization = () => {
  const [name, setName] = useState('');
  const [orglist, setOrglist] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const navigate = useNavigate();


  function handlepage(id :string ) {
    navigate(`/organizations/${id}`);
  }



  useEffect(() => {
    getOrgs();
  }, []);

  async function getOrgs() {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        'http://localhost:3000/api/organizations/allorganizations',
        { headers: { token } }
      );
      const data = response.data;
      const list: Organization[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.organizations)
          ? data.organizations
          : Array.isArray(data?.organization)
            ? data.organization
            : [];
      setOrglist(list);
    } catch (err) {
      console.error('Failed to fetch organizations', err);
      setError('Could not load the registry. Check your connection and try again.');
      setOrglist([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrg(organizationId: string) {
    setDeletingId(organizationId);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/organizations/${organizationId}`,
        { headers: { token } }
      );
      if (response.status === 200) {
        setOrglist((prev) => prev.filter((item) => item._id !== organizationId));
      }
    } catch (err) {
      console.error('Failed to delete organization', err);
      setError('Could not remove that entry. Try again.');
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:3000/api/organizations/create',
        { name: name.trim() },
        { headers: { token } }
      );

      if (response.status !== 201) {
        setError('Registration failed. Try again.');
        return;
      }
      setName('');
      await getOrgs();
      const created = response.data?._id ?? response.data?.organization?._id;
      if (created) {
        setJustAddedId(created);
        setTimeout(() => setJustAddedId(null), 900);
      }
    } catch (err) {
      console.error('Failed to create organization', err);
      setError('Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="registry-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .registry-root {
          min-height: 100vh;
          background: #14181f;
          background-image:
            radial-gradient(circle at 15% 0%, rgba(201,162,39,0.06), transparent 45%),
            radial-gradient(circle at 100% 100%, rgba(107,143,113,0.05), transparent 40%);
          color: #EDE7D9;
          font-family: 'Inter', sans-serif;
          padding: 64px 24px 80px;
        }
        .registry-shell { max-width: 920px; margin: 0 auto; }
        .eyebrow {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.18em;
          color: #C9A227;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }
        .eyebrow-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6B8F71;
          box-shadow: 0 0 0 3px rgba(107,143,113,0.18);
        }
        .headline {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: clamp(32px, 5vw, 48px);
          letter-spacing: -0.01em;
          margin: 0 0 10px;
        }
        .subhead {
          color: #A7A093;
          font-size: 15px;
          margin: 0 0 40px;
          max-width: 52ch;
          line-height: 1.5;
        }
        .grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 720px) {
          .grid { grid-template-columns: 1fr; }
        }
        .card {
          background: #1c222c;
          border: 1px solid rgba(201,162,39,0.18);
          border-radius: 3px;
          padding: 24px;
        }
        .card-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.14em;
          color: #C9A227;
          margin-bottom: 16px;
        }
        .field-label {
          display: block;
          font-size: 13px;
          color: #A7A093;
          margin-bottom: 8px;
        }
        .input {
          width: 100%;
          background: #14181f;
          border: 1px solid rgba(237,231,217,0.16);
          border-radius: 2px;
          padding: 11px 12px;
          color: #EDE7D9;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s ease;
          box-sizing: border-box;
        }
        .input:focus {
          border-color: #C9A227;
          box-shadow: 0 0 0 3px rgba(201,162,39,0.14);
        }
        .submit-btn {
          margin-top: 16px;
          width: 100%;
          background: #C9A227;
          color: #14181f;
          border: none;
          border-radius: 2px;
          padding: 11px 14px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: filter 0.15s ease, transform 0.1s ease;
        }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.08); }
        .submit-btn:active:not(:disabled) { transform: translateY(1px); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-banner {
          margin-top: 14px;
          font-size: 13px;
          color: #E2A5A5;
          background: rgba(179,58,58,0.1);
          border: 1px solid rgba(179,58,58,0.3);
          border-radius: 2px;
          padding: 10px 12px;
        }
        .ledger-header {
          display: grid;
          grid-template-columns: 90px 1fr 44px;
          gap: 12px;
          padding: 0 16px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #6b6a63;
          border-bottom: 1px solid rgba(237,231,217,0.1);
        }
        .ledger-row {
          display: grid;
          grid-template-columns: 90px 1fr 44px;
          gap: 12px;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(237,231,217,0.06);
          transition: background 0.15s ease;
        }
        .ledger-row:hover { background: rgba(237,231,217,0.03); }
        .ledger-row.entering {
          animation: stamp-in 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.2);
        }
        @keyframes stamp-in {
          0% { transform: scale(1.04); opacity: 0; }
          60% { transform: scale(0.99); opacity: 1; }
          100% { transform: scale(1); }
        }
        .reg-no {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #C9A227;
        }
        .org-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .seal {
          flex-shrink: 0;
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 1.5px solid #C9A227;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #C9A227;
        }
        .org-name {
          font-size: 14px;
          color: #EDE7D9;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .void-btn {
          background: none;
          border: 1px solid rgba(179,58,58,0.4);
          color: #B33A3A;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          border-radius: 2px;
          padding: 5px 6px;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.15s ease, background 0.15s ease;
        }
        .ledger-row:hover .void-btn { opacity: 1; }
        .void-btn:hover:not(:disabled) { background: rgba(179,58,58,0.12); }
        .void-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .empty-state, .loading-state {
          padding: 40px 16px;
          text-align: center;
          color: #6b6a63;
          font-size: 13px;
        }
        .loading-state {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.06em;
        }
      `}</style>

      <div className="registry-shell">
        <div className="eyebrow">
          <span className="eyebrow-dot" />
          REGISTRY · LIVE
        </div>
        <h1 className="headline">Organization Registry</h1>
        <p className="subhead">
          Every tenant on the platform gets a reference number the moment it's registered here.
          Add a new entry or retire one below.
        </p>

        <div className="grid">
          <form className="card" onSubmit={handleSubmit}>
            <div className="card-label">NEW ENTRY</div>
            <label className="field-label" htmlFor="org-name">
              Organization name
            </label>
            <input
              id="org-name"
              className="input"
              type="text"
              value={name}
              placeholder="e.g. Acme Logistics"
              onChange={(e) => setName(e.target.value)}
            />
            <button className="submit-btn" type="submit" disabled={submitting || !name.trim()}>
              {submitting ? 'Registering…' : 'Register organization →'}
            </button>
            {error && <div className="error-banner">{error}</div>}
          </form>

          <div className="card" style={{ padding: 0 }}>
            <div className="ledger-header">
              <span>REG NO</span>
              <span>ORGANIZATION</span>
              <span></span>
            </div>

            {loading ? (
              <div className="loading-state">fetching entries…</div>
            ) : orglist.length === 0 ? (
              <div className="empty-state">No organizations registered yet — add the first entry.</div>
            ) : (
              orglist.map((item) => (
                <div
                  key={item._id}
                  className={`ledger-row${item._id === justAddedId ? ' entering' : ''}`}
                >
                  <span className="reg-no">{regNumber(item._id)}</span>
                  <span className="org-cell">
                    <span className="seal">{initials(item.name)}</span>
                    <span className="org-name">{item.name}</span>

                  </span>

                  <button onClick={() => handlepage(item._id)}>go to the page</button>
                  <button
                    className="void-btn"
                    onClick={() => deleteOrg(item._id)}
                    disabled={deletingId === item._id}
                    title="Remove organization"
                  >
                    VOID
                  </button>


                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Organization;