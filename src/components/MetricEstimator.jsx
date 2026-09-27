import React, { useState, useEffect, useRef } from 'react';
import { FileCode, Zap, Cpu, Activity, Clock, X, ArrowRight, Layers, Sliders } from 'lucide-react';
import { EXCEL_DATASET } from './excelDataset';

// Get list of circuits from parsed Excel sheet
const CIRCUIT_KEYS = Object.keys(EXCEL_DATASET);

const getVerilogTemplate = (name) => {
  if (name === 'Half Adder') {
    return `module half_adder (
    input a,
    input b,
    output sum,
    output carry
);
    assign sum = a ^ b;
    assign carry = a & b;
endmodule`;
  }
  if (name === 'Full Adder') {
    return `module full_adder (
    input a,
    input b,
    input cin,
    output sum,
    output cout
);
    assign sum = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));
endmodule`;
  }
  if (name === 'Half Subtractor') {
    return `module half_subtractor (
    input a,
    input b,
    output diff,
    output borrow
);
    assign diff = a ^ b;
    assign borrow = ~a & b;
endmodule`;
  }
  if (name === 'Full Subtractor') {
    return `module full_subtractor (
    input a,
    input b,
    input bin,
    output diff,
    output borrow
);
    assign diff = a ^ b ^ bin;
    assign borrow = (~a & b) | (~(a ^ b) & bin);
endmodule`;
  }
  if (name === '2:1 Multiplexer') {
    return `module mux2to1 (
    input a,
    input b,
    input sel,
    output out
);
    assign out = sel ? b : a;
endmodule`;
  }
  
  const moduleName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `// Circuit Template: ${name}
// Reference metrics loaded from Book1_180_90_45nm.xlsx
module ${moduleName} (
    input clk,
    input rst_n,
    output reg out
);
    always @(posedge clk or negedge rst_n) begin
        if (!rst_n) begin
            out <= 1'b0;
        end else begin
            // TODO: Add implementation for ${name}
        end
    end
endmodule`;
};

export default function MetricEstimator() {
  const [selectedCircuit, setSelectedCircuit] = useState('Half Adder');
  const [selectedNode, setSelectedNode] = useState('45'); // nm (45, 90, 180)
  const [evaluationMode, setEvaluationMode] = useState('dataset'); // 'dataset' or 'custom'
  const [verilogCode, setVerilogCode] = useState(getVerilogTemplate('Half Adder'));
  const [synthesisReport, setSynthesisReport] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Search query dropdown state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Filter circuit list based on search query
  const filteredCircuits = CIRCUIT_KEYS.filter(name => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Custom metrics fallbacks state
  const [customInfo, setCustomInfo] = useState({
    cellCount: 0,
    seqCells: 0,
    combCells: 0,
    netCount: 0
  });

  const [metrics, setMetrics] = useState({
    area: 0.53,
    delay: 0.168,
    maxFreq: 5920,
    totalPower: 0.2
  });

  // Handle circuit choice change
  const handleCircuitChange = (name) => {
    setSelectedCircuit(name);
    setVerilogCode(getVerilogTemplate(name));
    setEvaluationMode('dataset');
  };

  // Run parser to map gate counts if custom code is modified
  const runParser = () => {
    let cellCount = 0;
    let seqCells = 0;
    let combCells = 0;
    let netCount = 0;

    const cellMatch = synthesisReport.match(/Logical Cell Count:\s*(\d+)/i);
    const seqMatch = synthesisReport.match(/(?:Sequential Cells|DFF):\s*(\d+)/i);
    const netMatch = synthesisReport.match(/Total Net Count:\s*(\d+)/i);

    if (cellMatch) cellCount = parseInt(cellMatch[1], 10);
    if (seqMatch) seqCells = parseInt(seqMatch[1], 10);
    if (netMatch) netCount = parseInt(netMatch[1], 10);

    if (cellCount === 0 && verilogCode.trim() !== '') {
      const flipFlops = (verilogCode.match(/always\s*@\s*\(\s*posedge/gi) || []).length * 8;
      const alwaysBlocks = (verilogCode.match(/always\s*@/gi) || []).length;
      const assigns = (verilogCode.match(/assign/gi) || []).length;
      seqCells = flipFlops > 0 ? flipFlops : alwaysBlocks * 8;
      combCells = (assigns * 12) + (alwaysBlocks * 24) + 10;
      cellCount = seqCells + combCells;
      netCount = Math.floor(cellCount * 1.4);
    }

    setCustomInfo({
      cellCount,
      seqCells,
      combCells: cellCount - seqCells,
      netCount
    });
  };

  // Compute metrics dynamically based on node/mode
  useEffect(() => {
    if (evaluationMode === 'dataset' && selectedCircuit && EXCEL_DATASET[selectedCircuit]) {
      const data = EXCEL_DATASET[selectedCircuit][selectedNode];
      setMetrics({
        area: data.area,
        delay: data.delay,
        maxFreq: data.freq,
        totalPower: data.power
      });
    } else {
      // Custom parser using statistical parameters fitted directly to the Excel dataset
      runParser();
      const nodeNum = parseInt(selectedNode, 10);
      
      // Determine baseline scaling parameters directly fitted to the Excel sheet
      let baseAreaPerGate = 0.08125;
      let basePowerPerGate = 0.03125;
      let baseDelay = 0.1375;
      
      if (nodeNum === 180) {
        baseAreaPerGate = 1.30;
        basePowerPerGate = 0.50;
        baseDelay = 0.55;
      } else if (nodeNum === 90) {
        baseAreaPerGate = 0.325;
        basePowerPerGate = 0.125;
        baseDelay = 0.275;
      }

      const activeCells = customInfo.cellCount > 0 ? customInfo.cellCount : 12; // Fallback to 12 if empty
      
      const estimatedArea = activeCells * baseAreaPerGate;
      const estimatedPower = activeCells * basePowerPerGate;
      
      // Delay scales logarithmically with gate count (simulating critical logic depth)
      const estimatedDelay = baseDelay * (1 + 0.18 * Math.log2(activeCells));
      const calculatedMaxFreq = Math.min(2500, (1000 / (estimatedDelay * 1.15)));

      setMetrics({
        area: estimatedArea,
        delay: estimatedDelay,
        maxFreq: calculatedMaxFreq,
        totalPower: estimatedPower
      });
    }
  }, [selectedCircuit, selectedNode, evaluationMode, verilogCode, synthesisReport, customInfo.cellCount]);

  const renderCurvedGraph = () => {
    const width = 460;
    const height = 150;
    const padding = 35;

    let points = [];
    if (evaluationMode === 'dataset' && selectedCircuit && EXCEL_DATASET[selectedCircuit]) {
      // Plot Power across the 3 spreadsheet nodes (180nm, 90nm, 45nm)
      const data180 = EXCEL_DATASET[selectedCircuit]["180"];
      const data90 = EXCEL_DATASET[selectedCircuit]["90"];
      const data45 = EXCEL_DATASET[selectedCircuit]["45"];

      const maxPower = Math.max(data180.power, data90.power, data45.power) || 10;
      
      points = [
        { x: padding, y: height - padding - (data180.power / maxPower) * (height - 2*padding), label: "180nm", val: data180.power },
        { x: width / 2, y: height - padding - (data90.power / maxPower) * (height - 2*padding), label: "90nm", val: data90.power },
        { x: width - padding, y: height - padding - (data45.power / maxPower) * (height - 2*padding), label: "45nm", val: data45.power }
      ];
    } else {
      // Plot scaling curve across custom frequencies
      const freqs = [500, 1000, 1500, 2000, 2500];
      const maxPower = 5000;
      points = freqs.map((f, idx) => {
        const pDyn = 0.15 * (customInfo.cellCount || 50) * (5 * 1e-15) * 0.81 * (f * 1e6) * 1e6;
        const pLeak = (customInfo.cellCount || 50) * 0.05;
        const power = pDyn + pLeak;

        return {
          x: padding + (idx / (freqs.length - 1)) * (width - 2*padding),
          y: height - padding - (power / maxPower) * (height - 2*padding),
          label: `${f}M`,
          val: power
        };
      });
    }

    if (points.length === 0) return null;

    // Create cubic bezier curve path for smooth plotting
    let pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i+1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

    return (
      <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Activity size={14} style={{ color: 'var(--accent-cyan)' }} />
            {evaluationMode === 'dataset' ? "Power CMOS Scaling Curve (180nm → 90nm → 45nm)" : "Power vs. Frequency Curve"}
          </h4>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'monospace' }}>
            {evaluationMode === 'dataset' ? "Measured Excel Data" : "AI Scaling Fallback"}
          </span>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
            <defs>
              <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="var(--border-color)" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1={padding} y1={(height - 2*padding)/2 + padding} x2={width - padding} y2={(height - 2*padding)/2 + padding} stroke="var(--border-color)" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--border-color)" strokeWidth="1" />

            {/* Area Fill */}
            <path d={areaD} fill="url(#glowGrad)" />

            {/* Curved Path */}
            <path d={pathD} fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Coordinate circles and values */}
            {points.map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="4.5" fill="var(--accent-cyan)" stroke="var(--bg-primary)" strokeWidth="2" />
                <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="var(--text-primary)" fontSize="8.5px" fontWeight="700" fontFamily="monospace">
                  {pt.val > 1000 ? `${(pt.val / 1000).toFixed(2)}mW` : `${pt.val.toFixed(2)}µW`}
                </text>
              </g>
            ))}

            {/* X-axis labels */}
            {points.map((pt, i) => (
              <text key={`lbl-${i}`} x={pt.x} y={height - 12} textAnchor="middle" fill="var(--text-muted)" fontSize="8px" fontWeight="700" fontFamily="monospace">
                {pt.label}
              </text>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const renderIdeInputs = (isFullscreen = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: isFullscreen ? '100%' : 'auto' }}>
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', flex: isFullscreen ? 1 : 'none', background: 'var(--glass-bg)' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: '11px', height: '11px', background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ width: '11px', height: '11px', background: '#eab308', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ width: '11px', height: '11px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }}></span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'monospace', marginLeft: '0.75rem', fontWeight: 600 }}>HDL_SYNTHESIS_IDE</span>
          </div>
          
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <div 
              className="btn-tab active"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem', borderBottom: '2px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <FileCode size={12} />
              <span>verilog_workspace.v</span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: isFullscreen ? 1 : 'none', overflowY: isFullscreen ? 'auto' : 'visible' }}>
          <div className="form-group" style={{ margin: 0, display: 'flex', flexDirection: 'column', flex: isFullscreen ? 1 : 'none' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <span>Verilog Module Code</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--accent-cyan)', textTransform: 'none' }}>syntax: verilog_2001</span>
            </label>
            <textarea
              className="textarea-code"
              style={{ flex: isFullscreen ? 1 : 'none', minHeight: isFullscreen ? '250px' : '220px' }}
              value={verilogCode}
              onChange={(e) => {
                setVerilogCode(e.target.value);
                setEvaluationMode('custom'); // Switch to custom code mode if they type manually
              }}
              placeholder="// Paste your custom Verilog module code here..."
              spellCheck="false"
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.4rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <span>Synthesis Gate Report (Optional)</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--accent-success)', textTransform: 'none' }}>target_node: {selectedNode}nm</span>
            </label>
            <textarea
              className="textarea-code"
              style={{ height: '110px', color: '#059669', borderLeft: '3px solid var(--accent-success)' }}
              value={synthesisReport}
              onChange={(e) => {
                setSynthesisReport(e.target.value);
                setEvaluationMode('custom');
              }}
              placeholder="// Paste your synthesis logs here to extract precise cell lists..."
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative' }}>
      
      {/* MAIN SCREEN: Single Full-width Editor Workspace with Dataset Selectors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
        
        {/* Dataset Choice Card - Set overflow to visible to allow dropdown menus to overlay outside card boundaries */}
        <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', background: 'var(--glass-bg)', overflow: 'visible', zIndex: 50 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Circuit Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1, minWidth: '240px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={14} style={{ color: 'var(--accent-cyan)' }} />
                Select Circuit Template from Excel Dataset
              </label>
              <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
                <input
                  type="text"
                  placeholder={selectedCircuit ? `Selected: ${selectedCircuit}` : "🔍 Type to search circuit (e.g., Adder, Mux...)"}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                  }}
                  style={{ 
                    width: '100%', 
                    background: 'var(--bg-secondary)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: '8px', 
                    padding: '0.65rem 0.85rem', 
                    color: 'var(--text-primary)', 
                    outline: 'none', 
                    fontSize: '0.85rem' 
                  }}
                />
                
                {isDropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    zIndex: 120,
                    maxHeight: '220px',
                    overflowY: 'auto',
                    marginTop: '4px'
                  }}>
                    {filteredCircuits.length > 0 ? (
                      filteredCircuits.map((name) => (
                        <div
                          key={name}
                          onClick={() => {
                            handleCircuitChange(name);
                            setSearchQuery('');
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            padding: '0.6rem 0.85rem',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            background: selectedCircuit === name ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                            color: selectedCircuit === name ? 'var(--accent-primary)' : 'var(--text-primary)',
                            transition: 'background 0.15s ease',
                            borderBottom: '1px solid var(--border-color)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--bg-secondary)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = selectedCircuit === name ? 'rgba(99, 102, 241, 0.08)' : 'transparent';
                          }}
                        >
                          {name}
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '0.6rem 0.85rem', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                        No matching circuits found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Target Tech Node selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sliders size={14} style={{ color: 'var(--accent-primary)' }} />
                Target Technology Node
              </label>
              <div style={{ display: 'flex', gap: '0.35rem', padding: '3px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {['180', '90', '45'].map((node) => (
                  <button
                    key={node}
                    onClick={() => setSelectedNode(node)}
                    className={`btn btn-outline ${selectedNode === node ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem', border: 'none', borderRadius: '6px' }}
                  >
                    {node}nm
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {renderIdeInputs(false)}

        {/* Action Button Panel */}
        <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem', border: '1px solid var(--border-color)', background: 'var(--glass-bg)' }}>
          {evaluationMode === 'dataset' ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              Using reference measurements from spreadsheet dataset.
            </p>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
              Custom design edits detected. Fallback AI estimation activated.
            </p>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
            disabled={verilogCode.trim() === ""}
            style={{ 
              padding: '0.75rem 1.75rem', 
              fontSize: '0.9rem',
              opacity: verilogCode.trim() === "" ? 0.5 : 1,
              cursor: verilogCode.trim() === "" ? 'not-allowed' : 'pointer',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
              boxShadow: verilogCode.trim() === "" ? 'none' : '0 4px 15px rgba(99, 102, 241, 0.25)'
            }}
          >
            Analyze & View Metrics Dialogue <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* DIALOGUE BOX (MODAL OVERLAY): LEFT (Verilog Code Editor) | RIGHT (Estimated Metrics & Sliders) */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--modal-overlay)',
          backdropFilter: 'blur(10px)',
          zIndex: 150,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '1200px',
            width: '95vw',
            height: '85vh',
            maxHeight: '850px',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid var(--border-color)',
            boxShadow: '0 30px 60px var(--glass-shadow)',
            padding: '1.5rem',
            overflow: 'hidden',
            background: 'var(--glass-bg)',
            animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Activity size={20} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  AI-VLSI Metrics Estimation Dialogue
                </h3>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="btn btn-outline"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Grid Content: flexbox wrapping for responsive mobile stacking */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.25rem', paddingBottom: '1rem' }}>
              
              {/* LEFT COLUMN: Verilog code input */}
              <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  {renderIdeInputs(true)}
                </div>
              </div>

              {/* RIGHT COLUMN: Estimated Metrics and nice power graph only */}
              <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* AI-Estimated Metrics cards (values only, inline styled for absolute rendering safety) */}
                <div className="glass-card" style={{ border: '1px solid var(--border-color)', padding: '1.25rem', background: 'var(--bg-primary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Cpu size={14} style={{ color: 'var(--accent-primary)' }} />
                      Estimated Hardware Metrics
                    </h4>
                  </div>

                  {/* Switcher Controls (Technology Node Options & Evaluation Mode) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technology Node</span>
                      <div style={{ display: 'flex', gap: '0.35rem', padding: '2px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        {['180', '90', '45'].map((node) => (
                          <button
                            key={node}
                            onClick={() => setSelectedNode(node)}
                            className={`btn btn-outline ${selectedNode === node ? 'active' : ''}`}
                            style={{ fontSize: '0.65rem', padding: '0.3rem 0.65rem', border: 'none', borderRadius: '4px' }}
                          >
                            {node}nm
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Evaluation Mode</span>
                      <div style={{ display: 'flex', gap: '0.35rem', padding: '2px', background: 'var(--bg-secondary)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <button
                          onClick={() => setEvaluationMode('dataset')}
                          disabled={!selectedCircuit}
                          className={`btn btn-outline ${evaluationMode === 'dataset' ? 'active' : ''}`}
                          style={{ fontSize: '0.65rem', padding: '0.3rem 0.65rem', border: 'none', borderRadius: '4px' }}
                        >
                          Excel Ref
                        </button>
                        <button
                          onClick={() => setEvaluationMode('custom')}
                          className={`btn btn-outline ${evaluationMode === 'custom' ? 'active' : ''}`}
                          style={{ fontSize: '0.65rem', padding: '0.3rem 0.65rem', border: 'none', borderRadius: '4px' }}
                        >
                          AI Custom
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                    {/* AREA */}
                    <div style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '160px', padding: '1rem 0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                        <Cpu size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Silicon Area</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                          {metrics.area < 100 ? metrics.area.toFixed(3) : Math.round(metrics.area)}
                          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.15rem' }}>µm²</span>
                        </div>
                      </div>
                    </div>

                    {/* FREQUENCY */}
                    <div style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '160px', padding: '1rem 0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                        <Activity size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Frequency</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                          {metrics.maxFreq > 1000 ? (metrics.maxFreq / 1000).toFixed(2) : Math.round(metrics.maxFreq)}
                          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.15rem' }}>{metrics.maxFreq > 1000 ? 'GHz' : 'MHz'}</span>
                        </div>
                      </div>
                    </div>

                    {/* TIME DELAY */}
                    <div style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '160px', padding: '1rem 0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-warning)' }}>
                        <Clock size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Delay</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                          {metrics.delay.toFixed(4)}
                          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.15rem' }}>ns</span>
                        </div>
                      </div>
                    </div>

                    {/* POWER DISSIPATION */}
                    <div style={{ flex: '1 1 calc(50% - 0.5rem)', minWidth: '160px', padding: '1rem 0.75rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)' }}>
                        <Zap size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Power Dissipation</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                          {metrics.totalPower > 1000 ? (metrics.totalPower / 1000).toFixed(3) : metrics.totalPower.toFixed(2)}
                          <span style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: '0.15rem' }}>{metrics.totalPower > 1000 ? 'mW' : 'µW'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nice curved power graph */}
                {renderCurvedGraph()}

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
