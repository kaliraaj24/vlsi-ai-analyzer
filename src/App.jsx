import React, { useState, useEffect } from 'react';
import MetricEstimator from './components/MetricEstimator';
import ComponentDetector from './components/ComponentDetector';
import { Cpu, Layout, ArrowRight, ArrowLeft, Sun, Moon } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'metrics', 'detector'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      {/* Premium Cyber Header */}
      <header className="header">
        <div 
          className="brand" 
          onClick={() => setView('home')} 
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
          title="Return to Main Menu"
        >
          <Cpu size={24} style={{ marginRight: '0.25rem', filter: 'drop-shadow(0 0 8px var(--accent-cyan))' }} />
          <span>AI-VLSI <span style={{ color: 'var(--accent-cyan)', fontWeight: 300 }}>DESIGN HUB</span></span>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Navigation Tabs (Only visible when inside a specific analyzer) */}
          {view !== 'home' && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                onClick={() => setView('home')}
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', border: '1px dashed var(--border-color)' }}
              >
                <ArrowLeft size={12} /> Home Menu
              </button>
              
              <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <button 
                  className={`btn`}
                  onClick={() => setView('metrics')}
                  style={{ 
                    fontSize: '0.825rem', 
                    padding: '0.5rem 1rem', 
                    background: view === 'metrics' ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                    color: view === 'metrics' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    border: view === 'metrics' ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid transparent',
                    borderRadius: '8px',
                    fontWeight: 700
                  }}
                >
                  <Cpu size={14} />
                  Metrics Estimator
                </button>
                <button 
                  className={`btn`}
                  onClick={() => setView('detector')}
                  style={{ 
                    fontSize: '0.825rem', 
                    padding: '0.5rem 1rem', 
                    background: view === 'detector' ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                    color: view === 'detector' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                    border: view === 'detector' ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid transparent',
                    borderRadius: '8px',
                    fontWeight: 700
                  }}
                >
                  <Layout size={14} />
                  Layout Scanner
                </button>
              </div>
            </div>
          )}

          {/* Theme Toggle Switch */}
          <button
            onClick={toggleTheme}
            className="btn btn-outline"
            style={{ 
              borderRadius: '50%', 
              width: '38px', 
              height: '38px', 
              padding: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        
        {/* LANDING PAGE (VIEW === 'HOME') */}
        {view === 'home' && (
          <div style={{ animation: 'fadeIn 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '3rem', margin: '1rem 0' }}>
            
            {/* Main Title & Hero */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                width: '250px',
                height: '250px',
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                filter: 'blur(130px)',
                opacity: 0.18,
                top: '-60px',
                left: 'calc(50% - 125px)',
                pointerEvents: 'none'
              }} />
              
              <span style={{ 
                fontSize: '0.75rem', 
                fontWeight: 800, 
                letterSpacing: '0.25em', 
                textTransform: 'uppercase', 
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                padding: '0.35rem 1rem',
                borderRadius: '99px',
                background: 'rgba(6, 182, 212, 0.04)',
                textShadow: '0 0 10px rgba(6, 182, 212, 0.15)',
                display: 'inline-block',
                marginBottom: '1.25rem'
              }}>
                VLSI DESIGN & SCAN INTEGRATION
              </span>
              
              <h1 className="heading-lg" style={{ fontSize: '3rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.04em' }}>
                AI-Based VLSI Analyzer
              </h1>
              <p className="subtitle" style={{ maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-secondary)' }}>
                Select an analyzer module below to start scaling hardware metrics or recognizing layout structures using machine learning models.
              </p>
            </div>

            {/* Split Options Choice Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              maxWidth: '960px',
              width: '100%',
              margin: '0 auto'
            }}>
              
              {/* Option 1: Predict Chip Details */}
              <div 
                className="glass-card glass-card-interactive" 
                style={{ 
                  padding: '2.25rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.25rem', 
                  border: '1px solid rgba(99, 102, 241, 0.15)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 15px rgba(99, 102, 241, 0.02)'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.15)' }}>
                  <Cpu size={24} />
                </div>
                
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Predict Chip Details</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Upload Verilog codes and synthesis logs. Scaled calculations estimate physical metrics like Area, operating Delay, dynamic Power, and max Clock frequency.
                  </p>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span>
                      Random Forest Regressor Backend
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span>
                      Tech Node scaling (45nm to 7nm)
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-primary)', borderRadius: '50%' }}></span>
                      Live Dynamic Power Scaling SVG Graph
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => setView('metrics')}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '0.85rem', marginTop: 'auto' }}
                >
                  Launch Metrics Estimator <ArrowRight size={16} />
                </button>
              </div>

              {/* Option 2: Detect Components */}
              <div 
                className="glass-card glass-card-interactive" 
                style={{ 
                  padding: '2.25rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.25rem', 
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 15px rgba(6, 182, 212, 0.02)'
                }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', boxShadow: '0 0 15px rgba(6, 182, 212, 0.15)' }}>
                  <Layout size={24} />
                </div>
                
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Detect Layout Components</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Scan layout die images or silicon layouts. Visual computer vision contour scanner detects and catalogs component locations, blocks, and shapes.
                  </p>
                </div>

                <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <ul style={{ listStyleType: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-cyan)', borderRadius: '50%' }}></span>
                      OpenCV Pattern Contour Matching
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-cyan)', borderRadius: '50%' }}></span>
                      HUD Laser Scanner sweeps
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '5px', height: '5px', background: 'var(--accent-cyan)', borderRadius: '50%' }}></span>
                      Vector Circuit Blueprints pop-ups
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => setView('detector')}
                  className="btn btn-primary" 
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem', 
                    marginTop: 'auto',
                    background: 'linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-primary) 100%)',
                    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.35)'
                  }}
                >
                  Launch Layout Scanner <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* WORK PANELS (ONLY SHOWN WHEN VIEW IS NOT 'HOME') */}
        {view === 'metrics' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            {/* Title description inside container instead of global hero */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Metrics Estimator & Parameters
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scale details (Area, Delay, Power) via physical parameters.</p>
              </div>
            </div>
            <MetricEstimator />
          </div>
        )}

        {view === 'detector' && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Silicon Layout Component Scanner
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Scan silicon layers to detect boundaries and count sub-blocks.</p>
              </div>
            </div>
            <ComponentDetector />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2rem',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        background: '#02050b',
        marginTop: '3.5rem',
        fontFamily: 'monospace'
      }}>
        [ SYSTEM_ID: AI_VLSI_HUB_V1.1 • LOCALHOST_MODE • ENGINE: MULTI_MODAL_ML_REGRESSION ]
      </footer>
    </div>
  );
}
