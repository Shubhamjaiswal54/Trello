import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Board {
    _id: string;
    name: string;
    departmentId: string;
}

const getToken = () => localStorage.getItem('token');

function boardInitial(name: string) {
    return name.trim().charAt(0).toUpperCase() || '#';
}

const BoardsPage = () => {
    const { departmentId } = useParams();
    const baseurl = `http://localhost:3000/api/boards/${departmentId}/`;

    const [boardlist, setBoardlist] = useState<Board[]>([]);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (departmentId) {
            getAllBoards();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentId]);

    async function getAllBoards() {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(baseurl, {
                headers: { token: getToken() },
            });
            const data = response.data;
            const list: Board[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.boards)
                ? data.boards
                : [];
            setBoardlist(list);
        } catch (err) {
            console.error('Failed to fetch boards', err);
            setError('Could not load the boards. Check your connection and try again.');
            setBoardlist([]);
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
                setError('Could not add that board. Try again.');
                return;
            }

            setName('');
            await getAllBoards();
        } catch (err) {
            console.error('Failed to add board', err);
            setError('Could not add that board. Try again.');
        } finally {
            setSubmitting(false);
        }
    }

    async function deleteBoard(boardId: string, e: React.MouseEvent) {
        e.stopPropagation();
        setDeletingId(boardId);
        try {
            const response = await axios.delete(`${baseurl}${boardId}`, {
                headers: { token: getToken() },
            });
            if (response.status === 200) {
                setBoardlist((prev) => prev.filter((item) => item._id !== boardId));
            }
        } catch (err) {
            console.error('Failed to remove board', err);
            setError('Could not remove that board. Try again.');
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

                .roster-card {
                    padding: 0;
                    overflow: hidden;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                }

                .board-tile {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    border-right: 1px solid rgba(255,255,255,0.05);
                    cursor: pointer;
                    transition: background 0.15s ease;
                }
                .board-tile:hover { background: rgba(255,255,255,0.02); }
                .board-tile:hover .remove-btn { opacity: 1; }

                .board-tile-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 8px;
                }
                .board-icon {
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
                .board-name {
                    font-size: 14px;
                    font-weight: 500;
                    color: #F1F2F4;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }

                .remove-btn {
                    flex-shrink: 0;
                    width: 26px; height: 26px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: none;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 8px;
                    color: #8B909B;
                    cursor: pointer;
                    opacity: 0;
                    transition: all 0.15s ease;
                }
                .remove-btn:hover:not(:disabled) {
                    color: #FF9B9B;
                    border-color: rgba(220,80,80,0.35);
                    background: rgba(220,80,80,0.08);
                }
                .remove-btn:disabled { opacity: 0.35 !important; cursor: not-allowed; }

                .empty-state {
                    grid-column: 1 / -1;
                    padding: 52px 20px;
                    text-align: center;
                    color: #6b6f79;
                    font-size: 13.5px;
                }
                .empty-icon { margin-bottom: 12px; opacity: 0.5; }

                .skeleton-tile {
                    padding: 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    border-right: 1px solid rgba(255,255,255,0.05);
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
                    ← Back to departments
                </button>

                <div className="header-row">
                    <div>
                        <h1 className="headline">Boards</h1>
                        <p className="subhead">
                            Boards belonging to this department. Create a new one or open one below.
                        </p>
                    </div>
                    <div className="stat-chip">
                        <span className="stat-dot" />
                        {boardlist.length} {boardlist.length === 1 ? 'board' : 'boards'}
                    </div>
                </div>

                <div className="grid">
                    <form className="card invite-card" onSubmit={handleSubmit}>
                        <div className="card-label">Create a board</div>
                        <label className="field-label" htmlFor="board-name">
                            Board name
                        </label>
                        <input
                            id="board-name"
                            className="input"
                            type="text"
                            value={name}
                            placeholder="Sprint 12"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <button className="submit-btn" type="submit" disabled={submitting || !name.trim()}>
                            {submitting ? 'Creating…' : 'Create board →'}
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
                                {[0, 1, 2, 3].map((i) => (
                                    <div className="skeleton-tile" key={i}>
                                        <div className="skel" style={{ width: 36, height: 36, borderRadius: 10, marginBottom: 12 }} />
                                        <div className="skel" style={{ width: '70%', height: 12 }} />
                                    </div>
                                ))}
                            </>
                        ) : boardlist.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <rect x="3" y="4" width="18" height="16" rx="2" />
                                        <line x1="9" y1="4" x2="9" y2="20" />
                                        <line x1="15" y1="4" x2="15" y2="20" />
                                    </svg>
                                </div>
                                No boards yet — create the first one.
                            </div>
                        ) : (
                            boardlist.map((item) => (
                                <div
                                    className="board-tile"
                                    key={item._id}
                                    onClick={() => navigate(`/${item._id}/cards`)}
                                >
                                    <div className="board-tile-top">
                                        <div className="board-icon">{boardInitial(item.name)}</div>
                                        <button
                                            className="remove-btn"
                                            onClick={(e) => deleteBoard(item._id, e)}
                                            disabled={deletingId === item._id}
                                            title="Delete board"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                    <span className="board-name">{item.name}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoardsPage;