import { useState } from 'react';
import { Eye, EyeOff, User as UserIcon, Mail, Lock, Building2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

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
        // Handle form submission logic here
        const response = await axios.post(baseURL + '/api/users/signup', {
            name,
            email,
            password,
            organizationId
        });
        console.log(response.data);

        if(response.status === 200) {
            const token= response.data;
            localStorage.setItem('token', token);
            navigate('/organizations');
        }else{
            console.error('Error creating account:', response.data);
            navigate('/user');
        }

        setName('');
        setEmail('');
        setPassword('');
        setOrganizationId(''); 
        setSubmitting(false);
    };

    const initials = name.trim()
        ? name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
        : '';

    const fieldClass = (hasError: boolean) =>
        `w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:ring-2 ${
            hasError
                ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'
        }`;

    return (
        <div className="min-h-screen bg-zinc-500 flex items-center justify-center p-6">

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl shadow-xl overflow-hidden bg-white">

                {/* Left: live preview panel */}
                <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-indigo-300 font-medium">Preview</p>
                        <h2 className="mt-3 text-2xl font-semibold leading-snug">
                            You're setting up<br />a new account
                        </h2>
                        <p className="mt-3 text-sm text-slate-400">
                            This card updates as you fill in the form.
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-800/70 border border-slate-700 p-5">
                        <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-semibold">
                                {initials || <UserIcon size={18} />}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {name.trim() || 'Your name'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {email.trim() || 'you@example.com'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
                            <span className="text-xs text-slate-400">Organization</span>
                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-700 text-slate-200">
                                {organizationId.trim() || '—'}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-slate-500">
                        Your details are only used to create your account.
                    </p>
                </div>

                {/* Right: form */}
                <div className="p-8 sm:p-10">
                    <h1 className="text-xl font-semibold text-slate-900">Create your account</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Fill in your details to get started.
                    </p>

                    <form className="mt-7 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-slate-700 mb-1.5">
                                Name
                            </label>
                            <div className="relative">
                                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {touched.password && errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="organizationId" className="block text-xs font-medium text-slate-700 mb-1.5">
                                Organization ID
                            </label>
                            <div className="relative">
                                <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
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
                                <p className="mt-1 text-xs text-red-500">{errors.organizationId}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="mt-2 w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
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