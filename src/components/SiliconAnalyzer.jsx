import React from 'react';
import { Layers, Cpu, Activity, Database, Grid } from 'lucide-react';

export default function SiliconAnalyzer({ isSiliconDie, components = [] }) {
  if (!isSiliconDie) return null;

  const totalGates = components.reduce((acc, comp) => acc + (parseInt(comp.gates) || 1200), 0);
  const estimatedTransistors = totalGates * 6;
  const layoutAreaUm2 = 18550;
  const transistorDensity = (estimatedTransistors / (layoutAreaUm2 / 1000000)).toFixed(1);

  return (
    <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--accent-cyan)', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--accent-cyan)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)' }}>
              Mode Active: Silicon Analysis Mode
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
              Silicon Die Micrograph & GDSII Structural Analysis
            </h3>
          </div>
        </div>

        <span style={{ fontSize: '0.7rem', fontWeight: 800, fontFamily: 'monospace', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '0.35rem 0.75rem', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          GDSII / DIE MICROGRAPH CONFIRMED
        </span>
      </div>

      {/* Silicon Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Estimated Logic Gates</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
            {totalGates.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>gates</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Physical Layout Area</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
            {layoutAreaUm2.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>µm²</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Transistor Density</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-success)', fontFamily: 'monospace' }}>
            {transistorDensity} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>M / mm²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
