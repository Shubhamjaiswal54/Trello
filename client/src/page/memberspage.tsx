import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Member {
    _id: string;
    name?: string;
    role?: string;
    email: string;
}

interface Organization {
    _id: string;
    owner: {
        _id: string;
    };
    members: Member[];
}

function initials(name?: string) {
    if (!name) return '--';
    const parts = name.trim().split(/\s+/);
    const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
    return letters.toUpperCase();
}

// Deterministic hue per person so the same member always gets the same avatar color.
function hashHue(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
}

function avatarStyle(seed: string) {
    const hue = hashHue(seed);
    return {
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 52%), hsl(${(hue + 45) % 360}, 70%, 40%))`,
    };
}

const getToken = () => localStorage.getItem('token');

const MembersPage = () => {
    const { organizationId } = useParams();
    const navigate = useNavigate();

    const baseurl = `http://localhost:3000/api/organizations/${organizationId}/`;

    const [orgdetails, setOrgdetails] = useState<Organization | null>(null);
    const [memberlist, setMemberlist] = useState<Member[]>([]);
    const [query, setQuery] = useState('');

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [justAddedId, setJustAddedId] = useState<string | null>(null);

    const getMembers = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(baseurl, {
                headers: { token: getToken() },
            });
            const data = response.data;

            setOrgdetails(data.organization);
            setMemberlist(data.organization.members || []);
        } catch (err) {
            console.error('Failed to fetch members', err);
            setError('Could not load the roster. Check your connection and try again.');
            setMemberlist([]);
        } finally {
            setLoading(false);
        }
    }, [baseurl]);

    useEffect(() => {
        if (organizationId) {
            getMembers();
        }
    }, [organizationId, getMembers]);

    async function deleteMember(memberId: string) {
        setDeletingId(memberId);
        try {
            const response = await axios.delete(`${baseurl}${memberId}`, {
                headers: { token: getToken() },
            });
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
                `${baseurl}members`,
                { email: email.trim() },
                { headers: { token: getToken() } }
            );

            if (response.status !== 201 && response.status !== 200) {
                setError('Could not add that member. Try again.');
                return;
            }

            setEmail('');
            await getMembers();

            const created = response.data?._id ?? response.data?.member?._id;
            if (created) {
                setJustAddedId(created);
                setTimeout(() => setJustAddedId(null), 700);
            }
        } catch (err) {
            console.error('Failed to add member', err);
            setError('Could not add that member. Try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const filteredMembers = memberlist.filter((m) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return m.name?.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    });

    return (
        <div className="page-root">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

                * { box-sizing: border-box; }

                .page-root {
                    min-height: 100vh;
                    background: #0B0D12;
                    background-image:
                        radial-gradient(circle at 10% -10%, rgba(124,111,240,0.14), transparent 40%),
                        radial-gradient(circle at 100% 0%, rgba(240,180,41,0.06), transparent 35%);
                    color: #F1F2F4;
                    font-family: 'Inter', sans-serif;
                    padding: 56px 24px 80px;
                }
                .shell { max-width: 980px; margin: 0 auto; }

                .back-link {
                    background: none;
                    border: none;
                    color: #8B909B;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 28px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    transition: color 0.15s ease;
                }
                .back-link:hover { color: #F1F2F4; }

                .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 20px;
                    margin-bottom: 36px;
                    flex-wrap: wrap;
                }
                .headline {
                    font-family: 'Space Grotesk', sans-serif;
                    font-weight: 700;
                    font-size: clamp(28px, 4vw, 38px);
                    letter-spacing: -0.02em;
                    margin: 0 0 8px;
                }
                .subhead {
                    color: #8B909B;
                    font-size: 14.5px;
                    margin: 0;
                    max-width: 46ch;
                    line-height: 1.5;
                }
                .stat-chip {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 999px;
                    padding: 8px 16px;
                    font-size: 13px;
                    color: #C7CAD1;
                    white-space: nowrap;
                }
                .stat-dot {
                    width: 7px; height: 7px; border-radius: 50%;
                    background: #7C6FF0;
                    box-shadow: 0 0 0 4px rgba(124,111,240,0.18);
                }

                .grid {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 24px;
                    align-items: start;
                }
                @media (max-width: 760px) {
                    .grid { grid-template-columns: 1fr; }
                }

                .card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 16px;
                    backdrop-filter: blur(20px);
                }
                .invite-card { padding: 22px; position: sticky; top: 24px; }

                .card-label {
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    color: #7C6FF0;
                    margin-bottom: 14px;
                    text-transform: uppercase;
                }
                .field-label {
                    display: block;
                    font-size: 13px;
                    color: #8B909B;
                    margin-bottom: 8px;
                }
                .input {
                    width: 100%;
                    background: #14161C;
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 10px;
                    padding: 11px 13px;
                    color: #F1F2F4;
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }
                .input::placeholder { color: #565A63; }
                .input:focus {
                    border-color: #7C6FF0;
                    box-shadow: 0 0 0 3px rgba(124,111,240,0.16);
                }

                .submit-btn {
                    margin-top: 14px;
                    width: 100%;
                    background: linear-gradient(135deg, #7C6FF0, #6355D6);
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    padding: 11px 14px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: filter 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
                    box-shadow: 0 4px 14px rgba(124,111,240,0.25);
                }
                .submit-btn:hover:not(:disabled) { filter: brightness(1.08); box-shadow: 0 6px 18px rgba(124,111,240,0.35); }
                .submit-btn:active:not(:disabled) { transform: translateY(1px); }
                .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }

                .error-banner {
                    margin-top: 14px;
                    font-size: 13px;
                    color: #FF9B9B;
                    background: rgba(220,80,80,0.1);
                    border: 1px solid rgba(220,80,80,0.25);
                    border-radius: 10px;
                    padding: 10px 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 10px;
                }
                .error-close {
                    background: none;
                    border: none;
                    color: #FF9B9B;
                    cursor: pointer;
                    font-size: 14px;
                    line-height: 1;
                    padding: 0;
                    opacity: 0.7;
                }
                .error-close:hover { opacity: 1; }

                .roster-card { padding: 0; overflow: hidden; }
                .roster-toolbar {
                    padding: 16px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .search-wrap { position: relative; }
                .search-icon {
                    position: absolute;
                    left: 12px; top: 50%;
                    transform: translateY(-50%);
                    color: #565A63;
                    pointer-events: none;
                }
                .search-input {
                    width: 100%;
                    background: #14161C;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    padding: 9px 13px 9px 34px;
                    color: #F1F2F4;
                    font-size: 13.5px;
                    outline: none;
                    transition: border-color 0.15s ease;
                }
                .search-input:focus { border-color: rgba(124,111,240,0.5); }

                .roster-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    transition: background 0.15s ease;
                }
                .roster-row:last-child { border-bottom: none; }
                .roster-row:hover { background: rgba(255,255,255,0.02); }
                .roster-row.entering {
                    animation: row-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes row-in {
                    0% { transform: translateY(-6px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }

                .avatar {
                    flex-shrink: 0;
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    font-weight: 600;
                    color: #fff;
                }
                .member-details {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    flex: 1;
                }
                .member-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #F1F2F4;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .member-email {
                    font-size: 12.5px;
                    color: #8B909B;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .role-pill {
                    font-size: 11.5px;
                    font-weight: 600;
                    border-radius: 999px;
                    padding: 5px 11px;
                    white-space: nowrap;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                }
                .role-pill.owner {
                    color: #F0B429;
                    background: rgba(240,180,41,0.12);
                    border: 1px solid rgba(240,180,41,0.25);
                }
                .role-pill.member {
                    color: #9CA1AB;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                }

                .remove-btn {
                    flex-shrink: 0;
                    width: 28px; height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    color: #8B909B;
                    cursor: pointer;
                    transition: all 0.15s ease;
                }
                .remove-btn:hover:not(:disabled) {
                    color: #FF9B9B;
                    border-color: rgba(220,80,80,0.35);
                    background: rgba(220,80,80,0.08);
                }
                .remove-btn:disabled { opacity: 0.35; cursor: not-allowed; }
                .remove-placeholder { width: 28px; flex-shrink: 0; }

                .empty-state, .no-results {
                    padding: 52px 20px;
                    text-align: center;
                    color: #6b6f79;
                    font-size: 13.5px;
                }
                .empty-icon { margin-bottom: 12px; opacity: 0.5; }

                .skeleton-row {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .skel {
                    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 37%, rgba(255,255,255,0.04) 63%);
                    background-size: 400% 100%;
                    animation: shimmer 1.4s ease infinite;
                    border-radius: 8px;
                }
                @keyframes shimmer {
                    0% { background-position: 100% 50%; }
                    100% { background-position: 0 50%; }
                }
            `}</style>

            <div className="shell">
                <button className="back-link" onClick={() => navigate(-1)}>
                    ← Back to organizations
                </button>

                <div className="header-row">
                    <div>
                        <h1 className="headline">Members</h1>
                        <p className="subhead">
                            Everyone with access to this organization. Invite someone new or remove access below.
                        </p>
                    </div>
                    <div className="stat-chip">
                        <span className="stat-dot" />
                        {memberlist.length} {memberlist.length === 1 ? 'member' : 'members'}
                    </div>
                </div>

                <div className="grid">
                    
                    <form className="card invite-card" onSubmit={handleSubmit}>
                        <div className="card-label">Invite someone</div>
                        <label className="field-label" htmlFor="member-email">
                            Email address
                        </label>
                        <input
                            id="member-email"
                            className="input"
                            type="email"
                            value={email}
                            placeholder="jordan@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button className="submit-btn" type="submit" disabled={submitting || !email.trim()}>
                            {submitting ? 'Sending invite…' : 'Send invite →'}
                        </button>
                        {error && (
                            <div className="error-banner">
                                <span>{error}</span>
                                <button className="error-close" onClick={() => setError('')} type="button">
                                    ✕
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="card roster-card">
                        <div className="roster-toolbar">
                            <div className="search-wrap">
                                <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="7" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <input
                                    className="search-input"
                                    type="text"
                                    placeholder="Search members…"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {loading ? (
                            <>
                                {[0, 1, 2].map((i) => (
                                    <div className="skeleton-row" key={i}>
                                        <div className="skel" style={{ width: 38, height: 38, borderRadius: '50%' }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="skel" style={{ width: '40%', height: 12, marginBottom: 6 }} />
                                            <div className="skel" style={{ width: '60%', height: 10 }} />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : memberlist.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </div>
                                No members yet — invite the first one.
                            </div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="no-results">No members match "{query}".</div>
                        ) : (
                            filteredMembers.map((item) => {
                                const isOwner = item._id === orgdetails?.owner?._id;
                                return (
                                    <div
                                        key={item._id}
                                        className={`roster-row${item._id === justAddedId ? ' entering' : ''}`}
                                    >
                                        <div className="avatar" style={avatarStyle(item.email || item.name || item._id)}>
                                            {initials(item.name || item.email)}
                                        </div>
                                        <div className="member-details">
                                            {item.name && <span className="member-name">{item.name}</span>}
                                            <span className="member-email">{item.email}</span>
                                        </div>
                                        <span className={`role-pill ${isOwner ? 'owner' : 'member'}`}>
                                            {isOwner ? '★ Owner' : 'Member'}
                                        </span>
                                        {isOwner ? (
                                            <span className="remove-placeholder" />
                                        ) : (
                                            <button
                                                className="remove-btn"
                                                onClick={() => deleteMember(item._id)}
                                                disabled={deletingId === item._id}
                                                title="Remove member"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MembersPage;