import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, BedDouble, CalendarCheck } from 'lucide-react';

export default function AdminLayout({ children, title, subtitle }) {
  return (
    <div className="section-cream" style={{ minHeight: '85vh', padding: '3rem 0 5rem 0' }}>
      <div className="container">
        {title && (
          <div style={{ marginBottom: '2rem' }}>
            <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
              Management Portal
            </span>
            <h1 style={{ fontSize: '2rem', color: 'var(--primary-green-dark)' }}>{title}</h1>
            {subtitle && <p style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
