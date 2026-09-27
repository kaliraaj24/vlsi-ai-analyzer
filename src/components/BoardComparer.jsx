import React, { useState } from 'react';
import { Columns, ArrowRightLeft, AlertTriangle, CheckCircle2, XCircle, Download, FileText, Upload, RefreshCw } from 'lucide-react';
import { runAIDetectionPipeline } from './aiDetectorEngine.js';

export default function BoardComparer() {
  const [boardAImage, setBoardAImage] = useState(null);
  const [boardBImage, setBoardBImage] = useState(null);
  const [boardAResults, setBoardAResults] = useState(null);
  const [boardBResults, setBoardBResults] = useState(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleUploadBoardA = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const src = evt.target.result;
        setBoardAImage(src);
        const res = await runAIDetectionPipeline(src);
        setBoardAResults(res);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBoardB = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async (evt) => {
        const src = evt.target.result;
        setBoardBImage(src);
        const res = await runAIDetectionPipeline(src);
        setBoardBResults(res);
      };
      reader.readAsDataURL(file);
    }
  };

  // Defect Comparison Logic
  const getComparisonDiffs = () => {
    if (!boardAResults || !boardBResults) return { matched: [], missing: [], modified: [], damaged: [] };

    const compA = boardAResults.components || [];
    const compB = boardBResults.components || [];

    const matched = [];
    const missing = [];
    const modified = [];
    const damaged = [];

    compA.forEach(itemA => {
      const matchInB = compB.find(itemB => itemB.type === itemA.type || itemB.name === itemA.name);
      if (!matchInB) {
        missing.push(itemA);
      } else if (matchInB.name !== itemA.name || matchInB.partNumber !== itemA.partNumber) {
        modified.push({ boardA: itemA, boardB: matchInB });
      } else {
        matched.push(itemA);
      }
    });

    compB.forEach(itemB => {
      if (itemB.name === 'Unknown Component' || parseFloat((itemB.confidence || '95').replace('%','')) < 70) {
        damaged.push(itemB);
      }
    });

    return { matched, missing, modified, damaged };
  };

  const diffs = getComparisonDiffs();

  // Export JSON Report
  const exportJSONReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      system: "Silicon Layout Scanner AI System v2.0",
      boardA: boardAResults ? boardAResults.recognizedBoard : null,
      boardB: boardBResults ? boardBResults.recognizedBoard : null,
      summary: {
        totalComponentsA: boardAResults ? boardAResults.components.length : 0,
        totalComponentsB: boardBResults ? boardBResults.components.length : 0,
        matchedCount: diffs.matched.length,
        missingCount: diffs.missing.length,
        modifiedCount: diffs.modified.length,
        damagedCount: diffs.damaged.length
      },
      differences: diffs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hardware_diff_report_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export Printable PDF Summary
  const printPDFReport = () => {
    window.print();
  };

  return (
    <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ArrowRightLeft style={{ color: 'var(--accent-cyan)' }} size={22} />
            Multi-Board Side-by-Side Comparison & Defect Analyzer
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Upload reference Board A and target Board B to automatically detect missing, misplaced, or damaged components.
          </p>
        </div>

        {boardAResults && boardBResults && (
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button onClick={exportJSONReport} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Download size={14} /> Export JSON Report
            </button>
            <button onClick={printPDFReport} className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText size={14} /> Print / Save PDF Report
            </button>
          </div>
        )}
      </div>

      {/* Dual Board Uploaders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {/* BOARD A */}
        <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>Board A (Golden Reference)</h4>
            {boardAResults && boardAResults.recognizedBoard && (
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '6px' }}>
                {boardAResults.recognizedBoard.name}
              </span>
            )}
          </div>

          {boardAImage ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={boardAImage} alt="Board A Reference" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <label style={{ height: '180px', border: '2px dashed var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
              <Upload size={24} style={{ color: 'var(--accent-cyan)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Upload Golden Board A Image</span>
              <input type="file" accept="image/*" onChange={handleUploadBoardA} style={{ display: 'none' }} />
            </label>
          )}
        </div>

        {/* BOARD B */}
        <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Board B (Target Inspection)</h4>
            {boardBResults && boardBResults.recognizedBoard && (
              <span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '6px' }}>
                {boardBResults.recognizedBoard.name}
              </span>
            )}
          </div>

          {boardBImage ? (
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={boardBImage} alt="Board B Target" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          ) : (
            <label style={{ height: '180px', border: '2px dashed var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-secondary)' }}>
              <Upload size={24} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Upload Target Board B Image</span>
              <input type="file" accept="image/*" onChange={handleUploadBoardB} style={{ display: 'none' }} />
            </label>
          )}
        </div>
      </div>

      {/* Comparison Results & Defect Summary Cards */}
      {boardAResults && boardBResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Defect & Differential Inspection Summary</h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-success)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Matched Components</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-success)' }}>{diffs.matched.length}</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '4px solid #ef4444', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Missing Components</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ef4444' }}>{diffs.missing.length}</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-warning)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Modified / Revision Shift</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-warning)' }}>{diffs.modified.length}</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1rem', borderRadius: '8px', borderLeft: '4px solid #a855f7', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Unidentified / Low Conf.</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a855f7' }}>{diffs.damaged.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
