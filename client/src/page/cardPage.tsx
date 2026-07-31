import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Member {
    _id: string;
    name: string;
    role?: string;
    email:string;
}

const token = localStorage.getItem('token');

function initials(name: string) {
    const parts = name.trim().split(/\s+/);
    const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
    return letters.toUpperCase();
}

const MembersPage = () => {
    const { organizationId } = useParams();
    const navigate = useNavigate();
    const baseurl = `http://localhost:3000/api/organizations/${organizationId}/`;
    const [orgdetails , setorgdetails] = useState();
    const [email, setemail] = useState('');
    const [memberlist, setMemberlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [justAddedId, setJustAddedId] = useState<string | null>(null);

    useEffect(() => {
        if (organizationId) getMembers();
    }, [organizationId]);

    async function getMembers() {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(baseurl, { headers: { token } });
            const data = response.data;
            const list = data.organization.members;
            setorgdetails(data.organization);

            setMemberlist(list);
        } catch (err) {
            console.error('Failed to fetch members', err);
            setError('Could not load the roster. Check your connection and try again.');
            setMemberlist([]);
        } finally {
            setLoading(false);
        }
    }

    async function deleteMember(memberId: string) {
        console.log(memberId);
        setDeletingId(memberId);
        try {
            const response = await axios.delete(`${baseurl}${memberId}`, { headers: { token } });
            if (response.status === 200) {
                setMemberlist((prev) => prev.filter((item) => item._id !== memberId));
            }
        } catch (err) {
            console.error('Failed to remove member', err);
            setError('Could not remove that member. Try again.');
        } finally {
            setDeletingId(null);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim() || submitting) return;

        setSubmitting(true);
        setError('');
        try {
            const response = await axios.post(
                baseurl + "members",
                { email: email.trim() },
                { headers: { token } }
            );

            if (response.status !== 201) {
                setError('Could not add that member. Try again.');
                return;
            }
            setemail('');
            await getMembers();

            const created = response.data?._id ?? response.data?.member?._id;
            if (created) {
                setJustAddedId(created);
                setTimeout(() => setJustAddedId(null), 900);
            }
        } catch (err) {
            console.error('Failed to add member', err);
            setError('Could not add that member. Try again.');
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
        .back-link {
          background: none;
          border: none;
          color: #A7A093;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.08em;
          cursor: pointer;
          padding: 0;
          margin-bottom: 24px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.15s ease;
        }
        .back-link:hover { color: #C9A227; }
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
          grid-template-columns: 1fr 90px 44px;
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
          grid-template-columns: 1fr 90px 44px;
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
        .member-cell {
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
        .member-name {
          font-size: 14px;
          color: #EDE7D9;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .role-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #6B8F71;
          text-align: right;
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
                <button className="back-link" onClick={() => navigate(-1)}>
                    ← Back to registry
                </button>

                <div className="eyebrow">
                    <span className="eyebrow-dot" />
                    MEMBER ROSTER · LIVE
                </div>
                <h1 className="headline">Members</h1>
                <p className="subhead">
                    Everyone with access to this organization. Add a new member or remove one below.
                </p>

                <div className="grid">
                    <form className="card" onSubmit={handleSubmit}>
                        <div className="card-label">NEW MEMBER</div>
                        <label className="field-label" htmlFor="member-name">
                            Member name
                        </label>
                        <input
                            id="member-name"
                            className="input"
                            type="text"
                            value={email}
                            placeholder="e.g. Jordan Lee"
                            onChange={(e) => setemail(e.target.value)}
                        />
                        <button className="submit-btn" type="submit" disabled={submitting || !email.trim()}>
                            {submitting ? 'Adding…' : 'Add member →'}
                        </button>
                        {error && <div className="error-banner">{error}</div>}
                    </form>

                    <div className="card" style={{ padding: 0 }}>
                        <div className="ledger-header">
                            <span>MEMBER</span>
                            <span>ROLE</span>
                            <span></span>
                        </div>

                        {loading ? (
                            <div className="loading-state">fetching roster…</div>
                        ) : memberlist.length === 0 ? (
                            <div className="empty-state">No members yet — add the first one.</div>
                        ) : (
                            memberlist.map((item) => (
                                <div
                                    key={item._id}
                                    className={`ledger-row${item._id === justAddedId ? ' entering' : ''}`}
                                >
                                    <span className="member-cell">
                                        <span className="seal">{initials(item.name)}</span>
                                        <span className="member-name">{item.name}</span>
                                        <span className="member-name">{item.email}</span>
                                    </span>
                                    <span className="role-tag">{item._id == orgdetails.owner._id ?"Owner" :"Member"}</span>
                                    <button
                                        className="void-btn"
                                        onClick={() => deleteMember(item._id)}
                                        disabled={deletingId === item._id}
                                        title="Remove member"
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

export default MembersPage;