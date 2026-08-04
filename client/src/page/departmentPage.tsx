import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

interface Department {
    _id: string;
    name: string;
}

const getToken = () => localStorage.getItem('token');

function deptInitial(name: string) {
    return name.trim().charAt(0).toUpperCase() || '#';
}

const DepartmentPage = () => {
    const { organizationId } = useParams();
    const baseurl = `http://localhost:3000/api/departments/${organizationId}/`;

    const [deptlist, setDeptlist] = useState<Department[]>([]);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (organizationId) {
            getAllDept();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [organizationId]);

    async function getAllDept() {
        setLoading(true);
        setError('');
        try {
            
            const response = await axios.get(baseurl, {
                headers: { token: getToken() },
            });
            const data = response.data;
            const list: Department[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.departments)
                ? data.departments
                : Array.isArray(data?.organizations)
                ? data.organizations
                : Array.isArray(data?.organization)
                ? data.organization
                : [];
            setDeptlist(list);
        } catch (err) {
            console.error('Failed to fetch departments', err);
            setError('Could not load the departments. Check your connection and try again.');
            setDeptlist([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim() || submitting) return;

        setSubmitting(true);
        setError('');
        try {
            const response = await axios.post(
                `${baseurl}create`,
                { name: name.trim() },
                { headers: { token: getToken() } }
            );

            if (response.status !== 201 && response.status !== 200) {
                setError('Could not add that department. Try again.');
                return;
            }

            setName('');
            await getAllDept();
        } catch (err) {
            console.error('Failed to add department', err);
            setError('Could not add that department. Try again.');
        } finally {
            setSubmitting(false);
        }
    }

    async function deleteDept(deptId: string) {
        setDeletingId(deptId);
        try {
            const response = await axios.delete(`${baseurl}${deptId}`, {
                headers: { token: getToken() },
            });
            if (response.status === 200) {
                setDeptlist((prev) => prev.filter((item) => item._id !== deptId));
            }
        } catch (err) {
            console.error('Failed to remove department', err);
            setError('Could not remove that department. Try again.');
        } finally {
            setDeletingId(null);
        }
    }

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

                .dept-icon {
                    flex-shrink: 0;
                    width: 36px; height: 36px;
                    border-radius: 10px;
                    background: rgba(124,111,240,0.12);
                    border: 1px solid rgba(124,111,240,0.25);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    font-weight: 600;
                    color: #A79CF5;
                }
                .dept-name {
                    flex: 1;
                    font-size: 14px;
                    font-weight: 500;
                    color: #F1F2F4;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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

                .empty-state {
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
                    ← Back to organization
                </button>

                <div className="header-row">
                    <div>
                        <h1 className="headline">Departments</h1>
                        <p className="subhead">
                            Organize this workspace into departments. Add a new one or remove one below.
                        </p>
                    </div>
                    <div className="stat-chip">
                        <span className="stat-dot" />
                        {deptlist.length} {deptlist.length === 1 ? 'department' : 'departments'}
                    </div>
                </div>

                <div className="grid">

                    <form className="card invite-card" onSubmit={handleSubmit}>

                        <div className="card-label">Add a department</div>

                        <label className="field-label" htmlFor="dept-name">
                            Department name
                        </label>
                        
                        <input
                            id="dept-name"
                            className="input"
                            type="text"
                            value={name}
                            placeholder="Engineering"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button className="submit-btn" type="submit" disabled={submitting || !name.trim()}>
                            {submitting ? 'Adding…' : 'Add department →'}
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
                        {loading ? (
                            <>
                                {[0, 1, 2].map((i) => (
                                    <div className="skeleton-row" key={i}>
                                        <div className="skel" style={{ width: 36, height: 36, borderRadius: 10 }} />
                                        <div style={{ flex: 1 }}>
                                            <div className="skel" style={{ width: '40%', height: 12 }} />
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : deptlist.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="7" width="18" height="13" rx="2" />
                                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                    </svg>
                                </div>
                                No departments yet — add the first one.
                            </div>
                        ) : (
                            deptlist.map((item) => (
                                <div className="roster-row" key={item._id}>
                                    <div className="dept-icon">{deptInitial(item.name)}</div>
                                    <span className="dept-name">{item.name}</span>
                                    <button
                                        className="remove-btn"
                                        onClick={() => deleteDept(item._id)}
                                        disabled={deletingId === item._id}
                                        title="Remove department"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
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

export default DepartmentPage;