import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import AuthLayout from '@/components/AuthLayout'
import FormField from '@/components/FormField'
import { Button } from '@/components/ui/button'
import { api, getErrorMessage } from '@/lib/api'
import { setSession, type SessionUser } from '@/lib/auth'

type Errors = Partial<Record<'email' | 'password', string>>

function validate(email: string, password: string): Errors {
  const errs: Errors = {}
  if (!email.trim()) errs.email = 'Enter your email'
  else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email'
  if (!password) errs.password = 'Enter your password'
  return errs
}

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState(
    params.get('expired') ? 'Your session expired. Please sign in again.' : '',
  )

  const errors = validate(email, password)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setShowErrors(true)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    setFormError('')
    try {
      const { data } = await api.post<{ token: string; user: SessionUser }>('/users/login', {
        email,
        password,
      })
      setSession(data.token, data.user)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? '/organizations', { replace: true })
    } catch (err) {
      setFormError(getErrorMessage(err, 'Could not sign you in. Try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to pick up where you left off."
      footer={
        <>
          New here?{' '}
          <Link to="/user/register" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
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
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={showErrors ? errors.password : undefined}
        />
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin" /> : null}
          {submitting ? 'Signing in…' : 'Sign in'}
          {!submitting && <ArrowRight />}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
