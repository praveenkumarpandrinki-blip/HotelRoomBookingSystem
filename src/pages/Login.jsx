import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, Shield, User } from 'lucide-react';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isValidEmail } from '../utils/bookingHelpers';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!isValidEmail(email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      success(`Welcome back, ${result.user.name}!`);
      navigate(from, { replace: true });
    } else {
      toastError(result.error);
      setErrors({ general: result.error });
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrors({});
  };

  return (
    <div className="section section-cream" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '520px' }}>
        <div style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '2.5rem',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              Simulated Guest Portal
            </span>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-green-dark)', marginBottom: '0.5rem' }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Sign in to manage your bookings and access exclusive concierge privileges.
            </p>
          </div>

          {/* Quick Demo Credentials Assistant */}
          <div style={{
            backgroundColor: 'var(--bg-cream)',
            border: '1px solid var(--accent-gold-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: '700', color: 'var(--accent-gold-dark)', marginBottom: '0.6rem' }}>
              <Sparkles className="w-4 h-4" />
              <span>College Project Demo Credentials (Click to autofill):</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                onClick={() => handleQuickFill('guest@example.com', 'Password@123')}
              >
                <User className="w-3.5 h-3.5" />
                <span>Guest Account</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
                onClick={() => handleQuickFill('admin@grandaurelia.com', 'Admin@123')}
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Account</span>
              </button>
            </div>
          </div>

          {errors.general && (
            <div className="form-error" style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-sm)' }}>
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email Address"
              id="login-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. guest@example.com"
              icon={Mail}
              required
              error={errors.email}
            />

            <div className="form-group" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="login-password" className="form-label">
                  Password <span style={{ color: '#dc2626' }}>*</span>
                </label>
              </div>

              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock className="input-icon w-4 h-4" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`form-control ${errors.password ? 'has-error' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
              style={{ marginTop: '1.5rem' }}
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          {/* Footer note & link to register */}
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: 'var(--accent-gold-dark)', fontWeight: '700' }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
