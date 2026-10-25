import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, Info } from 'lucide-react';
import FormInput from '../components/FormInput';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { isValidEmail, isValidPhone } from '../utils/bookingHelpers';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = 'Please provide a valid 10-digit phone number.';
    }

    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirmation password is required.';
    } else if (formData.confirmPassword !== formData.password) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await register({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password
    });
    setIsSubmitting(false);

    if (result.success) {
      success('Account registered successfully! Welcome to The Grand Aurelia.');
      navigate('/');
    } else {
      toastError(result.error);
      setErrors({ general: result.error });
    }
  };

  return (
    <div className="section section-cream" style={{ minHeight: '85vh', padding: '3rem 0', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ maxWidth: '580px' }}>
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
              Guest Registration
            </span>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-green-dark)', marginBottom: '0.5rem' }}>
              Join Aurelia Privileges
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Create your demo account to easily book suites and track your reservation history.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary-green-tint)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8125rem',
            color: 'var(--primary-green)',
            marginBottom: '1.75rem'
          }}>
            <Info className="w-4 h-4 flex-shrink-0" />
            <span>Frontend demo mode: Account is stored securely in browser localStorage.</span>
          </div>

          {errors.general && (
            <div className="form-error" style={{ marginBottom: '1.25rem', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-sm)' }}>
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Full Name"
              id="register-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Ananya Deshmukh"
              icon={User}
              required
              error={errors.name}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <FormInput
                label="Email Address"
                id="register-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. ananya@example.com"
                icon={Mail}
                required
                error={errors.email}
              />

              <FormInput
                label="Phone Number"
                id="register-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                icon={Phone}
                required
                error={errors.phone}
              />
            </div>

            <div className="form-group">
              <label htmlFor="register-password" className="form-label">
                Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock className="input-icon w-4 h-4" />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
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

            <div className="form-group">
              <label htmlFor="register-confirm-password" className="form-label">
                Confirm Password <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock className="input-icon w-4 h-4" />
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`form-control ${errors.confirmPassword ? 'has-error' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={isSubmitting}
              style={{ marginTop: '1.5rem' }}
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering Account...' : 'Create Demo Account'}</span>
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--accent-gold-dark)', fontWeight: '700' }}>
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
