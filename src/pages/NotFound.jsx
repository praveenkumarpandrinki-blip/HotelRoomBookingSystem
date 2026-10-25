import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Home, BedDouble } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="section section-cream" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
      <div className="container container-narrow" style={{ textAlign: 'center' }}>
        <div style={{
          width: '5rem',
          height: '5rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--primary-green-tint)',
          color: 'var(--primary-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <Hotel className="w-10 h-10" />
        </div>

        <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
          Error 404
        </span>

        <h1 style={{ fontSize: '3rem', color: 'var(--primary-green-dark)', marginBottom: '1rem' }}>
          Page Not Found
        </h1>

        <p style={{ maxWidth: '500px', margin: '0 auto 2.5rem auto', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7' }}>
          The page or corridor you are seeking appears to have moved or does not exist within The Grand Aurelia.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link to="/rooms" className="btn btn-outline btn-lg">
            <BedDouble className="w-4 h-4" />
            <span>Explore Rooms</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
