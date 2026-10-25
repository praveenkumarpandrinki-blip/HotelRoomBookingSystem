import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import FormInput from '../components/FormInput';
import { HOTEL_INFO } from '../data/rooms';
import { isValidEmail } from '../utils/bookingHelpers';
import { contactAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!isValidEmail(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) {
      errs.subject = 'Please specify the subject of your inquiry.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message or question.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await contactAPI.submit(formData);
      setSubmitted(true);
      success(res.message || 'Your inquiry has been stored in MongoDB. Our concierge will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toastError(err.message || 'Failed to submit contact message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-cream" style={{ padding: '3.5rem 0 5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">Reach Out To Us</span>
          <h1 className="section-title">Contact & Concierge Desk</h1>
          <p className="section-desc">
            We are here to assist with suite inquiries, private airport transfers, event dining, and custom itinerary requests.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start' }}>
          {/* Contact Information & Map */}
          <div>
            <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '2rem' }}>
              <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
                Resort Headquarters
              </span>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-green-dark)', marginBottom: '1.5rem' }}>
                The Grand Aurelia
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9375rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-green-tint)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Resort Address</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>{HOTEL_INFO.address}</p>
                    <small style={{ color: 'var(--text-muted)' }}>*Sample college project location data</small>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-green-tint)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Reservations & Front Desk</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>{HOTEL_INFO.phone}</p>
                    <small style={{ color: 'var(--text-muted)' }}>Available 24 hours daily</small>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-green-tint)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Electronic Mail</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>{HOTEL_INFO.email}</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{HOTEL_INFO.supportEmail}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--primary-green-tint)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>Operating Hours</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Front Desk: 24/7 &bull; Concierge: 7:00 AM – 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder Graphic */}
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              position: 'relative',
              aspectRatio: '16 / 9',
              background: 'linear-gradient(135deg, #0f382c 0%, #164f3e 100%)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <MapPin className="w-10 h-10 text-amber-400" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '0.35rem' }}>Heritage Coastline Road, South Goa</h4>
              <p style={{ color: '#c9d8d3', fontSize: '0.8125rem', maxWidth: '320px' }}>
                15 minutes from Goa International Airport. Valet parking & EV charging stations on-site.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div style={{ backgroundColor: 'var(--bg-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-xl)' }}>
            <span className="badge badge-green" style={{ marginBottom: '1rem' }}>
              Online Dispatch
            </span>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-green-dark)', marginBottom: '0.5rem' }}>
              Send an Inquiry
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Fill in your details below. Your message will be recorded in our MongoDB database.
            </p>

            {submitted && (
              <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#166534',
                fontSize: '0.9rem'
              }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Thank you! Your message has been saved to the database.</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <FormInput
                  label="Your Full Name"
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Vikram Malhotra"
                  required
                  error={errors.name}
                />

                <FormInput
                  label="Email Address"
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. vikram@example.com"
                  required
                  error={errors.email}
                />
              </div>

              <FormInput
                label="Subject of Inquiry"
                id="contact-subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Banquet booking, suite upgrade, special anniversary request..."
                required
                error={errors.subject}
              />

              <FormInput
                label="Message / Requirements"
                id="contact-message"
                name="message"
                as="textarea"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Please describe your dates, party size, or specific inquiries..."
                required
                error={errors.message}
              />

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={isSubmitting}
                style={{ marginTop: '0.5rem' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
