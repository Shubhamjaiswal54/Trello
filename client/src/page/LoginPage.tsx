import { useState } from 'react';
import { Eye, EyeOff, User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Errors = Partial<Record<'email' | 'password', string>>;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');
    
    const baseURL = 'http://localhost:3000';
    const navigate = useNavigate();

    const validate = (): Errors => {
        const errs: Errors = {};
        if (!email.trim()) errs.email = 'Enter your email';
        else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email';
        
        if (!password) errs.password = 'Enter a password';
        else if (password.length < 8) errs.password = 'Use at least 8 characters';
        
        return errs;
    };

    const errors = validate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        setFormError('');
        try {
            const response = await axios.post(baseURL + '/api/users/login', {
                email,
                password,
            });

            if (response.status === 200) {
                
                const token = response.data;
                localStorage.setItem('token', token);
                console.log(response +"hello from logoin");
                navigate('/organizations');
            } else {
                console.error('Login error:', response.data);
                setFormError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error('Error logging in:', err);
            setFormError('Could not log into your account. Check your details and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const fieldError = (key: keyof Errors) => !!touched[key] && !!errors[key];

    return (
        <div className="enroll-root">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

                * { box-sizing: border-box; }

                .enroll-root {
                    min-height: 100vh;
                    background: #14181f;
                    background-image:
                        radial-gradient(circle at 10% 5%, rgba(201,162,39,0.06), transparent 45%),
                        radial-gradient(circle at 95% 95%, rgba(107,143,113,0.05), transparent 40%);
                    color: #EDE7D9;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 32px 20px;
                }
                .enroll-shell {
                    width: 100%;
                    max-width: 920px;
                    display: grid;
                    grid-template-columns: 300px 1fr;
                    border: 1px solid rgba(201,162,39,0.18);
                    border-radius: 3px;
                    overflow: hidden;
                    background: #1c222c;
                }
                @media (max-width: 760px) {
                    .enroll-shell { grid-template-columns: 1fr; }
                    .enroll-preview { display: none; }
                }

                /* Left: preview panel */
                .enroll-preview {
                    background: #14181f;
                    border-right: 1px solid rgba(201,162,39,0.14);
                    padding: 32px 28px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .eyebrow {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    letter-spacing: 0.18em;
                    color: #C9A227;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 16px;
                }
                .eyebrow-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: #6B8F71;
                    box-shadow: 0 0 0 3px rgba(107,143,113,0.18);
                }
                .preview-heading {
                    font-family: 'Fraunces', serif;
                    font-weight: 600;
                    font-size: 24px;
                    line-height: 1.3;
                    margin: 0 0 10px;
                }
                .preview-copy {
                    color: #A7A093;
                    font-size: 13px;
                    line-height: 1.6;
                    margin: 0;
                }
                .preview-card {
                    margin-top: 28px;
                    background: #1c222c;
                    border: 1px solid rgba(237,231,217,0.1);
                    border-radius: 3px;
                    padding: 18px;
                }
                .preview-id-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    min-width: 0;
                }
                .preview-seal {
                    flex-shrink: 0;
                    width: 38px; height: 38px;
                    border-radius: 50%;
                    border: 1.5px solid #C9A227;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #C9A227;
                }
                .preview-name {
                    font-size: 14px;
                    color: #EDE7D9;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .preview-email {
                    font-size: 12px;
                    color: #6b6a63;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .preview-footnote {
                    margin-top: 24px;
                    color: #565349;
                    font-size: 11px;
                    line-height: 1.5;
                }

                /* Right: form panel */
                .enroll-form-panel { padding: 36px 34px; }
                .form-title {
                    font-family: 'Fraunces', serif;
                    font-weight: 600;
                    font-size: 26px;
                    margin: 0 0 6px;
                }
                .form-subtitle {
                    color: #A7A093;
                    font-size: 13px;
                    margin: 0 0 26px;
                }
                .field-group { margin-bottom: 16px; }
                .field-label {
                    display: block;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    letter-spacing: 0.08em;
                    color: #A7A093;
                    margin-bottom: 7px;
                }
                .field-wrap { position: relative; }
                .field-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b6a63;
                    pointer-events: none;
                }
                .field-input {
                    width: 100%;
                    background: #14181f;
                    border: 1px solid rgba(237,231,217,0.16);
                    border-radius: 2px;
                    padding: 11px 12px 11px 38px;
                    color: #EDE7D9;
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.15s ease, box-shadow 0.15s ease;
                }
                .field-input::placeholder { color: #565349; }
                .field-input:focus {
                    border-color: #C9A227;
                    box-shadow: 0 0 0 3px rgba(201,162,39,0.14);
                }
                .field-input.has-error {
                    border-color: #B33A3A;
                }
                .field-input.has-error:focus {
                    box-shadow: 0 0 0 3px rgba(179,58,58,0.14);
                }
                .toggle-visibility {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: #6b6a63;
                    cursor: pointer;
                    padding: 4px;
                    display: flex;
                }
                .toggle-visibility:hover { color: #A7A093; }
                .field-error {
                    margin-top: 6px;
                    font-size: 12px;
                    color: #E2A5A5;
                }
                .submit-btn {
                    margin-top: 6px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: #C9A227;
                    color: #14181f;
                    border: none;
                    border-radius: 2px;
                    padding: 12px 14px;
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: filter 0.15s ease, transform 0.1s ease;
                }
                .submit-btn:hover:not(:disabled) { filter: brightness(1.08); }
                .submit-btn:active:not(:disabled) { transform: translateY(1px); }
                .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
                .submit-btn:focus-visible,
                .field-input:focus-visible,
                .toggle-visibility:focus-visible {
                    outline: 2px solid #C9A227;
                    outline-offset: 2px;
                }
                .form-error-banner {
                    margin-bottom: 16px;
                    font-size: 13px;
                    color: #E2A5A5;
                    background: rgba(179,58,58,0.1);
                    border: 1px solid rgba(179,58,58,0.3);
                    border-radius: 2px;
                    padding: 10px 12px;
                }
            `}</style>

            <div className="enroll-shell">
                <div className="enroll-preview">
                    <div>
                        <div className="eyebrow">
                            <span className="eyebrow-dot" />
                            SECURE LOGIN
                        </div>
                        <h2 className="preview-heading">Welcome Back</h2>
                        <p className="preview-copy">Access your organization's dashboard.</p>

                        <div className="preview-card">
                            <div className="preview-id-row">
                                <div className="preview-seal">
                                    <UserIcon size={16} />
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <p className="preview-name">User Account</p>
                                    <p className="preview-email">{email.trim() || 'you@example.com'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="preview-footnote">Protected by standard encryption.</p>
                </div>

                <div className="enroll-form-panel">
                    <h1 className="form-title">Login to Account</h1>
                    <p className="form-subtitle">Fill in your details to continue.</p>

                    {formError && <div className="form-error-banner">{formError}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="field-group">
                            <label htmlFor="email" className="field-label">EMAIL</label>
                            <div className="field-wrap">
                                <Mail size={16} className="field-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                    className={`field-input${fieldError('email') ? ' has-error' : ''}`}
                                />
                            </div>
                            {fieldError('email') && <p className="field-error">{errors.email}</p>}
                        </div>

                        <div className="field-group">
                            <label htmlFor="password" className="field-label">PASSWORD</label>
                            <div className="field-wrap">
                                <Lock size={16} className="field-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="At least 8 characters"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                    className={`field-input${fieldError('password') ? ' has-error' : ''}`}
                                    style={{ paddingRight: 38 }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="toggle-visibility"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {fieldError('password') && <p className="field-error">{errors.password}</p>}
                        </div>

                        <button type="submit" disabled={submitting} className="submit-btn">
                            {submitting ? 'Authenticating...' : 'Sign In'}
                            {!submitting && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;