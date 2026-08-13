import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import PageHero from '../components/ui/PageHero'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store'
import { customerAuthApi, getErrorMessage } from '../lib/services'

export function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@') || password.length < 4) {
      toast.error('Enter a valid email and password (min 4 characters)')
      return
    }
    setLoading(true)
    try {
      const { data } = await customerAuthApi.login({ email, password })
      login({
        email: data.data.customer.email,
        name: data.data.customer.name,
        id: data.data.customer.id,
      })
      toast.success('Signed in')
      navigate('/account')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to view orders and manage your profile."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-gold hover:text-gold-bright">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        New here?{' '}
        <Link to="/register" className="text-gold hover:text-gold-bright">
          Create an account
        </Link>
      </p>
    </AuthShell>
  )
}

export function RegisterPage() {
  const registerUser = useAuthStore((s) => s.register)
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.includes('@') || password.length < 6) {
      toast.error('Please complete all fields (password min 6 characters)')
      return
    }
    setLoading(true)
    try {
      const { data } = await customerAuthApi.register({ name, email, password })
      registerUser({
        name: data.data.customer.name,
        email: data.data.customer.email,
        id: data.data.customer.id,
      })
      toast.success('Account created')
      navigate('/account')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create account" description="Register to track your Mushk Fragrance orders.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="name" label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Register'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-gold hover:text-gold-bright">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      toast.error('Enter a valid email')
      return
    }
    setSent(true)
    toast.success('Reset link simulated — check back in Phase 3 for real email flow')
  }

  return (
    <AuthShell
      title="Forgot password"
      description="Enter your email and we will simulate a password reset request."
    >
      {sent ? (
        <div className="border border-border bg-ink/40 p-4 text-sm text-muted">
          If an account exists for <span className="text-ivory">{email}</span>, a reset link would be
          sent. This is a UI prototype only.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-muted">
        <Link to="/login" className="text-gold hover:text-gold-bright">
          Back to login
        </Link>
      </p>
    </AuthShell>
  )
}

function AuthShell({ title, description, children }) {
  return (
    <>
      <PageHero
        eyebrow="Account"
        title={title}
        description={description}
        crumbs={<Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: title }]} />}
      />
      <div className="container-site section-pad py-10 md:py-14">
        <div className="mx-auto max-w-md border border-border bg-charcoal p-6">{children}</div>
      </div>
    </>
  )
}
