import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import FormField from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { api, getErrorMessage } from '@/lib/api'
import { setSession, type SessionUser } from '@/lib/auth'

type Errors = Partial<Record<'name' | 'email' | 'password', string>>

function validate(name: string, email: string, password: string): Errors {
  const errs: Errors = {}
  if (!name.trim()) errs.name = 'Enter your name'
  if (!email.trim()) errs.email = 'Enter your email'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email'
  if (!password) errs.password = 'Enter a password'
  else if (password.length < 8) errs.password = 'Use at least 8 characters'
  return errs
}

const RegisterPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const errors = validate(name, email, password)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setShowErrors(true)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setFormError('')
    try {
      const { data } = await api.post<{ token: string; user: SessionUser }>('/users/signup', {
        name,
        email,
        password,
      })
      setSession(data.token, data.user)
      navigate('/organizations', { replace: true })
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not create your account. Try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Start an organization, or get invited to one by its owner."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/user/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="grid gap-4">
        {formError && (
          <div role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {formError}
          </div>
        )}
        <FormField
          id="name"
          label="Name"
          autoComplete="name"
          placeholder="Jordan Lee"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={showErrors ? errors.name : undefined}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={showErrors ? errors.email : undefined}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={showErrors ? errors.password : undefined}
        />
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : null}
          {submitting ? 'Creating account…' : 'Create account'}
          {!submitting && <ArrowRight />}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
