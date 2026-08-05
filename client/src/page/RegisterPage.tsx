import { useState } from 'react';
import { Eye, EyeOff, User as UserIcon, Mail, Lock, Building2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Errors = Partial<Record<'name' | 'email' | 'password' | 'organizationId', string>>;

const User = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [organizationId, setOrganizationId] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [submitting, setSubmitting] = useState(false);
    const baseURL = 'http://localhost:3000'; 
    const navigate = useNavigate();

    const validate = (): Errors => {
        const errs: Errors = {};
        if (!name.trim()) errs.name = 'Enter your name';
        if (!email.trim()) errs.email = 'Enter your email';
        else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email';
        if (!password) errs.password = 'Enter a password';
        else if (password.length < 8) errs.password = 'Use at least 8 characters';
        if (!organizationId.trim()) errs.organizationId = 'Enter your organization ID';
        return errs;
    };

    const errors = validate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true, organizationId: true });
        if (Object.keys(errors).length > 0) return;

        setSubmitting(true);
        try {
            const response = await axios.post(baseURL + '/api/users/signup', {
                name,
                email,
                password,
                organizationId
            });
            console.log(response.data);

            if (response.status === 200) {
                const token = response.data;
                localStorage.setItem('token', token);
                navigate('/organizations');
            } else {
                console.error('Error creating account:', response.data);
                navigate('/user');
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setName('');
            setEmail('');
            setPassword('');
            setOrganizationId(''); 
            setSubmitting(false);
        }
    };

    const initials = name.trim()
        ? name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
        : '';

    const fieldClass = (hasError: boolean) =>
        `w-full rounded-[2px] border bg-[#1b2129] py-[11px] pl-[38px] pr-3 text-[14px] text-[#eef1f5] placeholder:text-[#6b7280] outline-none transition-all focus:ring-[3px] focus:outline-offset-[2px] ${
            hasError
                ? 'border-[#d1495b] focus:border-[#d1495b] focus:ring-[#d1495b]/15 focus:outline-[#d1495b]'
                : 'border-[#eef1f5]/15 focus:border-[#5b7ea3] focus:ring-[#5b7ea3]/15 focus:outline-[#5b7ea3]'
        }`;

    return (
        <div className="min-h-screen bg-[#1b2129] bg-[radial-gradient(circle_at_10%_5%,rgba(91,126,163,0.08),transparent_45%),radial-gradient(circle_at_95%_95%,rgba(122,155,116,0.08),transparent_40%)] flex items-center justify-center p-6 font-sans text-[#eef1f5]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
                .font-fraunces { font-family: 'Fraunces', serif; }
                .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
            `}</style>

            <div className="w-full max-w-[920px] grid grid-cols-1 lg:grid-cols-[300px_1fr] rounded-[3px] border border-[#5b7ea3]/20 overflow-hidden bg-[#232b36] shadow-2xl">
                
                {/* Left: live preview panel */}
                <div className="hidden lg:flex flex-col justify-between bg-[#1b2129] border-r border-[#5b7ea3]/15 p-8 pb-9">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#7a9b74] shadow-[0_0_0_3px_rgba(122,155,116,0.18)]" />
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#5b7ea3] font-jetbrains">
                                Preview
                            </p>
                        </div>
                        <h2 className="font-fraunces text-2xl font-semibold leading-snug">
                            You're setting up<br />a new account
                        </h2>
                        <p className="mt-2.5 text-[13px] text-[#8b93a1] leading-relaxed">
                            This card updates as you fill in the form.
                        </p>
                    </div>

                    <div className="rounded-[3px] bg-[#232b36] border border-[#eef1f5]/10 p-[18px] mt-8 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="h-[38px] w-[38px] shrink-0 rounded-full border-[1.5px] border-[#5b7ea3] flex items-center justify-center text-sm font-medium text-[#5b7ea3]">
                                {initials || <UserIcon size={16} />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-[14px] font-medium truncate text-[#eef1f5]">
                                    {name.trim() || 'Your name'}
                                </p>
                                <p className="text-[12px] text-[#8b93a1] truncate">
                                    {email.trim() || 'you@example.com'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 pt-4 border-t border-[#eef1f5]/10 flex items-center justify-between">
                            <span className="text-[11px] text-[#8b93a1]">Organization</span>
                            <span className="text-[11px] font-jetbrains px-2 py-1 rounded-[2px] bg-[#1b2129] border border-[#eef1f5]/10 text-[#eef1f5]">
                                {organizationId.trim() || '—'}
                            </span>
                        </div>
                    </div>

                    <p className="text-[11px] text-[#6b7280] leading-relaxed">
                        Your details are securely encrypted and only used for your account.
                    </p>
                </div>

                {/* Right: form */}
                <div className="p-8 sm:p-9 lg:p-[36px_34px]">
                    <h1 className="font-fraunces text-[26px] font-semibold text-[#eef1f5]">Create Account</h1>
                    <p className="mt-1.5 text-[13px] text-[#8b93a1] mb-[26px]">
                        Fill in your details to get started.
                    </p>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label htmlFor="name" className="block text-[11px] tracking-[0.08em] font-jetbrains text-[#8b93a1] mb-[7px]">
                                NAME
                            </label>
                            <div className="relative">
                                <UserIcon size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b93a1] pointer-events-none" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Jane Doe"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                                    className={fieldClass(!!touched.name && !!errors.name)}
                                />
                            </div>
                            {touched.name && errors.name && (
                                <p className="mt-1.5 text-[12px] text-[#d1495b]">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-[11px] tracking-[0.08em] font-jetbrains text-[#8b93a1] mb-[7px]">
                                EMAIL
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b93a1] pointer-events-none" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                    className={fieldClass(!!touched.email && !!errors.email)}
                                />
                            </div>
                            {touched.email && errors.email && (
                                <p className="mt-1.5 text-[12px] text-[#d1495b]">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-[11px] tracking-[0.08em] font-jetbrains text-[#8b93a1] mb-[7px]">
                                PASSWORD
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b93a1] pointer-events-none" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="At least 8 characters"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                    className={`${fieldClass(!!touched.password && !!errors.password)} pr-10`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[#8b93a1] hover:text-[#eef1f5] p-1 rounded-sm focus:outline-[#5b7ea3] focus:outline-offset-2"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1.5 text-[12px] text-[#d1495b]">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="organizationId" className="block text-[11px] tracking-[0.08em] font-jetbrains text-[#8b93a1] mb-[7px]">
                                ORGANIZATION ID
                            </label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#8b93a1] pointer-events-none" />
                                <input
                                    id="organizationId"
                                    type="text"
                                    placeholder="org_123456"
                                    name="organizationId"
                                    value={organizationId}
                                    onChange={(e) => setOrganizationId(e.target.value)}
                                    onBlur={() => setTouched((t) => ({ ...t, organizationId: true }))}
                                    className={fieldClass(!!touched.organizationId && !!errors.organizationId)}
                                />
                            </div>
                            {touched.organizationId && errors.organizationId && (
                                <p className="mt-1.5 text-[12px] text-[#d1495b]">{errors.organizationId}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 w-full flex items-center justify-center gap-2 rounded-[2px] bg-[#5b7ea3] py-[12px] px-[14px] text-[14px] font-semibold text-[#101418] transition-all hover:opacity-90 active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#5b7ea3] focus:ring-offset-2 focus:ring-offset-[#232b36]"
                        >
                            {submitting ? 'Creating account…' : 'Create account'}
                            {!submitting && <ArrowRight size={16} />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default User;