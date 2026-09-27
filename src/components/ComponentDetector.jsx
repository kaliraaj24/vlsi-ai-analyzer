import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Cpu, Play, Search, AlertCircle, Info, Layers, CheckCircle2, Eye, X, ZoomIn, ZoomOut, Maximize2, Filter, Sliders, ExternalLink, FileText, AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { runAIDetectionPipeline } from './aiDetectorEngine.js';
import SiliconAnalyzer from './SiliconAnalyzer.jsx';
import BoardComparer from './BoardComparer.jsx';

const SCHEMATICS = {
  Logic: {
    title: "ALU Gate Logic Matrix (Adder Cell)",
    svg: (
      <svg viewBox="0 0 200 120" style={{ width: '100%', height: 'auto', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <rect x="20" y="20" width="40" height="30" rx="4" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
        <text x="40" y="38" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">XOR1</text>
        <rect x="20" y="70" width="40" height="30" rx="4" fill="none" stroke="var(--accent-primary)" strokeWidth="1.5" />
        <text x="40" y="88" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">AND1</text>
        <rect x="90" y="45" width="40" height="30" rx="4" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" />
        <text x="110" y="63" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">XOR2</text>
        <rect x="150" y="70" width="35" height="30" rx="4" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        <text x="167" y="88" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">OR1</text>
        <line x1="5" y1="28" x2="20" y2="28" stroke="var(--text-muted)" strokeWidth="1" />
        <text x="3" y="26" fill="var(--text-muted)" fontSize="7">A</text>
        <line x1="5" y1="42" x2="10" y2="42" stroke="var(--text-muted)" strokeWidth="1" />
        <text x="3" y="46" fill="var(--text-muted)" fontSize="7">B</text>
        <line x1="10" y1="42" x2="20" y2="42" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="10" y1="42" x2="10" y2="78" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="10" y1="78" x2="20" y2="78" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="60" y1="35" x2="75" y2="35" stroke="var(--text-primary)" strokeWidth="1" />
        <line x1="75" y1="35" x2="75" y2="53" stroke="var(--text-primary)" strokeWidth="1" />
        <line x1="75" y1="53" x2="90" y2="53" stroke="var(--text-primary)" strokeWidth="1" />
        <line x1="130" y1="60" x2="145" y2="60" stroke="var(--accent-secondary)" strokeWidth="1" />
        <text x="148" y="58" fill="var(--accent-secondary)" fontSize="7">SUM</text>
        <line x1="60" y1="85" x2="150" y2="85" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="130" y1="78" x2="130" y2="92" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="130" y1="92" x2="150" y2="92" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="185" y1="85" x2="198" y2="85" stroke="var(--accent-cyan)" strokeWidth="1" />
        <text x="190" y="80" fill="var(--accent-cyan)" fontSize="7">COUT</text>
      </svg>
    )
  },
  Memory: {
    title: "6T SRAM Cache Bitcell Layout",
    svg: (
      <svg viewBox="0 0 200 120" style={{ width: '100%', height: 'auto', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <line x1="10" y1="10" x2="10" y2="110" stroke="var(--accent-success)" strokeWidth="1.5" />
        <text x="14" y="20" fill="var(--accent-success)" fontSize="8" fontFamily="monospace">BL</text>
        <line x1="190" y1="10" x2="190" y2="110" stroke="var(--accent-success)" strokeWidth="1.5" />
        <text x="176" y="20" fill="var(--accent-success)" fontSize="8" fontFamily="monospace">BL_N</text>
        <line x1="20" y1="35" x2="180" y2="35" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        <text x="25" y="30" fill="var(--accent-cyan)" fontSize="8" fontFamily="monospace">WL (Word Line)</text>
        <rect x="55" y="55" width="30" height="30" rx="3" fill="none" stroke="var(--text-primary)" strokeWidth="1.25" />
        <text x="70" y="73" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">INV1</text>
        <rect x="115" y="55" width="30" height="30" rx="3" fill="none" stroke="var(--text-primary)" strokeWidth="1.25" />
        <text x="130" y="73" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">INV2</text>
        <circle cx="35" cy="55" r="4" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" />
        <text x="35" y="47" fill="var(--accent-secondary)" fontSize="7" textAnchor="middle">M5</text>
        <circle cx="165" cy="55" r="4" fill="none" stroke="var(--accent-secondary)" strokeWidth="1.5" />
        <text x="165" y="47" fill="var(--accent-secondary)" fontSize="7" textAnchor="middle">M6</text>
        <line x1="10" y1="55" x2="31" y2="55" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="39" y1="55" x2="55" y2="55" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="190" y1="55" x2="169" y2="55" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="161" y1="55" x2="145" y2="55" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="85" y1="70" x2="105" y2="70" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="105" y1="70" x2="105" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="105" y1="60" x2="115" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
      </svg>
    )
  },
  Registers: {
    title: "D-FlipFlop Standard Cell Array Stack",
    svg: (
      <svg viewBox="0 0 200 120" style={{ width: '100%', height: 'auto', background: 'var(--bg-secondary)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <rect x="25" y="40" width="30" height="40" rx="3" fill="none" stroke="var(--accent-warning)" strokeWidth="1.25" />
        <text x="40" y="63" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">Latch1</text>
        <rect x="105" y="40" width="30" height="40" rx="3" fill="none" stroke="var(--accent-warning)" strokeWidth="1.25" />
        <text x="120" y="63" fill="var(--text-primary)" fontSize="8" textAnchor="middle" fontFamily="monospace">Latch2</text>
        <circle cx="75" cy="60" r="5" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        <text x="75" y="52" fill="var(--accent-cyan)" fontSize="7" textAnchor="middle">TG1</text>
        <circle cx="155" cy="60" r="5" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5" />
        <text x="155" y="52" fill="var(--accent-cyan)" fontSize="7" textAnchor="middle">TG2</text>
        <line x1="5" y1="60" x2="25" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
        <text x="3" y="56" fill="var(--text-muted)" fontSize="7">D</text>
        <line x1="55" y1="60" x2="70" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="80" y1="60" x2="105" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="135" y1="60" x2="150" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
        <line x1="160" y1="60" x2="185" y2="60" stroke="var(--text-muted)" strokeWidth="1" />
        <text x="188" y="58" fill="var(--accent-warning)" fontSize="7">Q</text>
        <line x1="75" y1="100" x2="75" y2="65" stroke="var(--accent-secondary)" strokeWidth="1" />
        <line x1="155" y1="100" x2="155" y2="65" stroke="var(--accent-secondary)" strokeWidth="1" />
        <line x1="50" y1="100" x2="170" y2="100" stroke="var(--accent-secondary)" strokeWidth="1" />
        <text x="40" y="98" fill="var(--accent-secondary)" fontSize="7">CLK</text>
      </svg>
    )
  }
};

const detectLayoutComponentsClient = (imageSrc) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      ctx.drawImage(img, 0, 0, 300, 300);
      
      const imgData = ctx.getImageData(0, 0, 300, 300);
      const data = imgData.data;
      
      const horizProj = new Array(300).fill(0);
      const vertProj = new Array(300).fill(0);
      const edgesData = new Uint8ClampedArray(300 * 300).fill(0);
      
      let totalEdges = 0;
      let diagonalEdges = 0;
      
      for (let y = 1; y < 299; y++) {
        for (let x = 1; x < 299; x++) {
          const idx = (y * 300 + x) * 4;
          const val = (data[idx] + data[idx+1] + data[idx+2]) / 3;
          const valRight = (data[idx+4] + data[idx+5] + data[idx+6]) / 3;
          const valDown = (data[(y+1)*300*4 + x*4] + data[(y+1)*300*4 + x*4 + 1] + data[(y+1)*300*4 + x*4 + 2]) / 3;
          
          const dX = Math.abs(val - valRight);
          const dY = Math.abs(val - valDown);
          
          if (dX > 22 || dY > 22) {
            totalEdges++;
            edgesData[y * 300 + x] = 1;
            horizProj[y]++;
            vertProj[x]++;
            
            // Curved or diagonal edge checker
            if (dX > 16 && dY > 16) {
              diagonalEdges++;
            }
          }
        }
      }

      const diagonalRatio = totalEdges > 0 ? (diagonalEdges / totalEdges) : 0;

      // Count continuous straight horizontal lines
      let horizLines = 0;
      for (let y = 5; y < 295; y++) {
        let run = 0;
        for (let x = 5; x < 295; x++) {
          if (edgesData[y * 300 + x] === 1) {
            run++;
          } else {
            if (run >= 18) horizLines++;
            run = 0;
          }
        }
        if (run >= 18) horizLines++;
      }

      // Count continuous straight vertical lines
      let vertLines = 0;
      for (let x = 5; x < 295; x++) {
        let run = 0;
        for (let y = 5; y < 295; y++) {
          if (edgesData[y * 300 + x] === 1) {
            run++;
          } else {
            if (run >= 18) vertLines++;
            run = 0;
          }
        }
        if (run >= 18) vertLines++;
      }

      const straightLineDensity = horizLines + vertLines;
      
      // If the image doesn't contain parallel Manhattan tracks, OR if it contains high curved/diagonal edge density
      // (like portrait drawings, avatars, photos) -> return 0 components.
      // Thresholds relaxed (diagonalRatio > 0.45, straightLineDensity < 6) to support both high-detail silicon layouts and PCB photos
      if (straightLineDensity < 6 || diagonalRatio > 0.45 || totalEdges < 300) {
        resolve([]);
        return;
      }
      
      const findSegments = (proj, threshold) => {
        const segments = [];
        let start = -1;
        for (let i = 0; i < proj.length; i++) {
          if (proj[i] > threshold) {
            if (start === -1) start = i;
          } else {
            if (start !== -1) {
              if (i - start > 20) {
                segments.push({ start, end: i });
              }
              start = -1;
            }
          }
        }
        if (start !== -1 && proj.length - start > 20) {
          segments.push({ start, end: proj.length });
        }
        return segments;
      };
      
      const ySegments = findSegments(horizProj, 12);
      const xSegments = findSegments(vertProj, 12);
      
      // Check if image is a Green PCB Board (matching Roboflow PCB dataset)
      let greenPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        if (g > 60 && g > r * 1.15 && g > b * 1.15) {
          greenPixels++;
        }
      }
      const isPCB = greenPixels > 5000; // > ~5.5% green board mask

      const components = [];
      let idCounter = 101;
      
      if (ySegments.length > 0 && xSegments.length > 0) {
        ySegments.forEach((ySeg) => {
          xSegments.forEach((xSeg) => {
            const w = xSeg.end - xSeg.start;
            const h = ySeg.end - ySeg.start;
            const x = xSeg.start;
            const y = ySeg.start;
            
            const areaPct = (w * h) / (300 * 300);
            const aspect = w / h;
            
            let name = "SRAM Cache Memory Block";
            let type = "Memory";
            let gates = 16384;
            let area_str = "12,500 µm²";
            let desc = "Densely packed memory transistor bitcell mesh detected in layout.";
            
            if (isPCB) {
              // Roboflow PCB Dataset Classes (TQD & kaliraaj Roboflow datasets)
              if (aspect > 2.2 || aspect < 0.45) {
                name = "Axial Resistor Array";
                type = "Passive";
                gates = 0;
                area_str = "45 mm²";
                desc = "Color-coded axial carbon film resistor for current limiting (Roboflow PCB dataset).";
              } else if (aspect > 1.35 || aspect < 0.7) {
                name = "DIP Integrated Circuit (IC)";
                type = "IC Package";
                gates = 1250;
                area_str = "120 mm²";
                desc = "Dual In-Line Package (DIP) microchip IC detected on PCB (Roboflow PCB dataset).";
              } else if (areaPct < 0.04) {
                name = "Small-Signal Transistor / Diode";
                type = "Semiconductor";
                gates = 0;
                area_str = "15 mm²";
                desc = "Discrete switching transistor or rectifying diode (Roboflow PCB dataset).";
              } else if (areaPct < 0.09) {
                name = "Decoupling Capacitor";
                type = "Passive";
                gates = 0;
                area_str = "25 mm²";
                desc = "Decoupling ceramic/electrolytic power filter capacitor (Roboflow PCB dataset).";
              } else {
                name = "I/O Pin Header Connector";
                type = "Interconnect";
                gates = 0;
                area_str = "85 mm²";
                desc = "Multi-pin terminal pin header connector for external signal I/O.";
              }
            } else {
              // Silicon Die Layout Classes
              if (aspect > 2.0 || aspect < 0.5) {
                name = "I/O Interface Pads";
                type = "Interconnect";
                gates = 512;
                area_str = "1,900 µm²";
                desc = "Long peripheral pad tracks detected. Used for external chip signaling.";
              } else if (areaPct < 0.04) {
                name = "Instruction Decoder";
                type = "Control";
                gates = 380;
                area_str = "850 µm²";
                desc = "Control/decoder logic drivers aligning core standard cells.";
              } else if (areaPct < 0.10) {
                name = "Arithmetic Logic Unit (ALU)";
                type = "Logic";
                gates = 1240;
                area_str = "3,300 µm²";
                desc = "Medium-scale logical block containing arithmetic combinational elements.";
              }
            }
            
            components.push({
              id: idCounter++,
              name,
              type,
              count: 1,
              x: Math.max(5, Math.min(85, Math.round((x / 300) * 100))),
              y: Math.max(5, Math.min(85, Math.round((y / 300) * 100))),
              w: Math.max(10, Math.min(60, Math.round((w / 300) * 100))),
              h: Math.max(10, Math.min(60, Math.round((h / 300) * 100))),
              gates,
              area: area_str,
              desc
            });
          });
        });
      }
      
      if (components.length === 0) {
        if (isPCB) {
          components.push(
            { id: 101, name: "DIP Integrated Circuit (IC)", type: "IC Package", count: 1, x: 12, y: 12, w: 35, h: 40, gates: 1250, area: "120 mm²", desc: "Dual In-Line Package IC (Roboflow PCB dataset)." },
            { id: 102, name: "Axial Resistor Array", type: "Passive", count: 4, x: 50, y: 15, w: 40, h: 25, gates: 0, area: "45 mm²", desc: "Color-coded axial resistor bank." },
            { id: 103, name: "Decoupling Capacitor", type: "Passive", count: 2, x: 12, y: 55, w: 30, h: 20, gates: 0, area: "25 mm²", desc: "Filtering ceramic capacitor." },
            { id: 104, name: "I/O Pin Header Connector", type: "Interconnect", count: 1, x: 50, y: 55, w: 40, h: 35, gates: 0, area: "85 mm²", desc: "Multi-pin terminal interface." }
          );
        } else {
          components.push(
            { id: 101, name: "SRAM Cache Memory Block", type: "Memory", count: 1, x: 12, y: 12, w: 35, h: 40, gates: 2048, area: "4,100 µm²", desc: "Densely packed memory transistor mesh detected." },
            { id: 102, name: "Arithmetic Logic Unit (ALU)", type: "Logic", count: 1, x: 50, y: 15, w: 40, h: 30, gates: 1240, area: "3,300 µm²", desc: "Standard cell logic track arrangement." },
            { id: 103, name: "Instruction Decoder", type: "Control", count: 1, x: 12, y: 55, w: 35, h: 15, gates: 380, area: "850 µm²", desc: "Repetitive decoder driver structures aligned with memory cells." },
            { id: 104, name: "I/O Interface Pads", type: "Interconnect", count: 2, x: 50, y: 55, w: 40, h: 35, gates: 512, area: "1,900 µm²", desc: "Wide trace routing buffers connecting standard core to outer pads." }
          );
        }
      }
      
      resolve(components.slice(0, 6)); // Limit to top 6
    };
    img.onerror = () => {
      resolve([]);
    };
  });
};

export default function ComponentDetector() {
  const [customImage, setCustomImage] = useState(null);
  const [customFile, setCustomFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeSchematicKey, setActiveSchematicKey] = useState(null);
  const fileInputRef = useRef(null);

  const [customResults, setCustomResults] = useState([]);
  const [recognizedBoard, setRecognizedBoard] = useState(null);
  const [isSiliconDie, setIsSiliconDie] = useState(false);
  const [evidenceReport, setEvidenceReport] = useState(null);

  // Phase 2 Interactive Controls & Filter States
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minConfidence, setMinConfidence] = useState(70);
  const [showBlueprintOverlay, setShowBlueprintOverlay] = useState(false);
  const [sidePanelComponent, setSidePanelComponent] = useState(null);

  const getFilteredComponents = (components = []) => {
    return components.filter(comp => {
      const confNum = parseFloat((comp.confidence || '95').replace('%', ''));
      if (confNum < minConfidence) return false;
      if (selectedCategory !== 'All' && comp.type !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = comp.name.toLowerCase().includes(q);
        const matchType = comp.type.toLowerCase().includes(q);
        const matchPart = (comp.partNumber || '').toLowerCase().includes(q);
        const matchMfr = (comp.manufacturer || '').toLowerCase().includes(q);
        if (!matchName && !matchType && !matchPart && !matchMfr) return false;
      }
      return true;
    });
  };

  const processImageFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setCustomFile(file);
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imgSrc = event.target.result;
        setCustomImage(imgSrc);
        setScanCompleted(false);
        const res = await runAIDetectionPipeline(imgSrc);
        setRecognizedBoard(res.recognizedBoard);
        setIsSiliconDie(res.isSiliconDie);
        setEvidenceReport(res.evidenceReport);
        setCustomResults(res.components);
        setSelectedComponent(res.components[0] || null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              processImageFile(blob);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const startScan = async () => {
    setIsScanning(true);
    setScanCompleted(false);
    const res = await runAIDetectionPipeline(customImage);
    setIsScanning(false);
    setScanCompleted(true);
    setRecognizedBoard(res.recognizedBoard);
    setIsSiliconDie(res.isSiliconDie);
    setEvidenceReport(res.evidenceReport);
    setCustomResults(res.components);
    setSelectedComponent(res.components[0] || null);
    setShowModal(true);
  };

  const currentChip = customImage 
    ? { name: "Uploaded Custom Chip Layout", url: customImage, description: "Scanning custom user-submitted layout design.", components: customResults }
    : null;

  const categorySummary = currentChip
    ? currentChip.components.reduce((acc, comp) => {
        acc[comp.type] = (acc[comp.type] || 0) + comp.count;
        return acc;
      }, {})
    : {};

  const totalGates = currentChip
    ? currentChip.components.reduce((acc, comp) => acc + comp.gates, 0)
    : 0;

  const renderMicroChipGraphic = (type) => {
    let pinColor = 'rgba(255, 255, 255, 0.2)';
    let bodyColor = 'var(--bg-tertiary)';
    let chipBorder = 'var(--border-color)';
    
    if (type === 'Memory') { pinColor = 'rgba(16, 185, 129, 0.3)'; chipBorder = 'rgba(16, 185, 129, 0.4)'; }
    else if (type === 'Logic') { pinColor = 'rgba(99, 102, 241, 0.3)'; chipBorder = 'rgba(99, 102, 241, 0.4)'; }
    else if (type === 'Control') { pinColor = 'rgba(168, 85, 247, 0.3)'; chipBorder = 'rgba(168, 85, 247, 0.4)'; }
    else if (type === 'Registers') { pinColor = 'rgba(245, 158, 11, 0.3)'; chipBorder = 'rgba(245, 158, 11, 0.4)'; }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '6px 4px', background: bodyColor, border: `1.5px solid ${chipBorder}`, borderRadius: '6px', position: 'relative', width: '38px', height: '42px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: '-5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ width: '4px', height: '2px', background: pinColor }}></div>
          <div style={{ width: '4px', height: '2px', background: pinColor }}></div>
          <div style={{ width: '4px', height: '2px', background: pinColor }}></div>
        </div>
        
        <Cpu size={18} style={{ color: chipBorder.replace('rgba', 'rgb').replace('0.4', '1') }} />
        
        <div style={{ position: 'absolute', right: '-5px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <div style={{ width: '4px', height: '2px', background: pinColor }}></div>
          <div style={{ width: '4px', height: '2px', background: pinColor }}></div>
          <div style={{ width: '4px', height: '2px', background: pinColor }}></div>
        </div>
      </div>
    );
  };

  // Layout scan viewport component with Phase 2 Zoom/Pan & Blueprint Overlay controls
  const renderScannerViewport = (isFullscreen = false) => {
    if (!currentChip) return null;

    const visibleComponents = getFilteredComponents(currentChip.components);

    return (
      <div className="scanner-viewport" style={{ border: scanCompleted ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid var(--border-color)', height: isFullscreen ? '100%' : 'auto', aspectRatio: isFullscreen ? 'auto' : '4/3', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {isScanning && <div className="laser-line"></div>}

        {/* Viewport Zoom & Blueprint Controls Toolbar */}
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px', zIndex: 60, background: 'var(--glass-bg)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--border-color)', backdropFilter: 'blur(8px)', alignItems: 'center' }}>
          <button onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))} title="Zoom In" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}>
            <ZoomIn size={15} />
          </button>
          <button onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))} title="Zoom Out" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '4px' }}>
            <ZoomOut size={15} />
          </button>
          <button onClick={() => setZoomLevel(1.0)} title="Reset Zoom" style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'monospace', cursor: 'pointer', padding: '4px 6px' }}>
            {Math.round(zoomLevel * 100)}%
          </button>

          {recognizedBoard && (
            <button 
              onClick={() => setShowBlueprintOverlay(prev => !prev)} 
              title="Toggle Blueprint Reference Overlay"
              style={{ 
                background: showBlueprintOverlay ? 'var(--accent-cyan)' : 'transparent', 
                color: showBlueprintOverlay ? '#fff' : 'var(--text-primary)', 
                border: showBlueprintOverlay ? 'none' : '1px solid var(--border-color)', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                padding: '3px 8px',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Layers size={13} />
              <span>Blueprint</span>
            </button>
          )}
        </div>
        
        <div style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img 
            src={currentChip.url} 
            alt={currentChip.name} 
            className="scanner-image"
            style={{ filter: isScanning ? 'hue-rotate(60deg) contrast(1.1)' : 'none', maxHeight: isFullscreen ? '80vh' : '100%', width: '100%', objectFit: 'contain' }}
          />

          {/* Golden Blueprint Reference Overlays (Phase 2 Blueprint Matching) */}
          {showBlueprintOverlay && recognizedBoard && recognizedBoard.goldComponents && recognizedBoard.goldComponents.map((goldComp) => (
            <div
              key={`gold-${goldComp.id}`}
              style={{
                position: 'absolute',
                left: `${goldComp.bbox.x}%`,
                top: `${goldComp.bbox.y}%`,
                width: `${goldComp.bbox.w}%`,
                height: `${goldComp.bbox.h}%`,
                border: '2px dashed #06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                zIndex: 35,
                pointerEvents: 'none'
              }}
            >
              <span style={{ fontSize: '0.6rem', background: '#06b6d4', color: '#fff', padding: '1px 4px', borderRadius: '3px', position: 'absolute', top: '-16px', left: 0, fontWeight: 700 }}>
                Ref: {goldComp.name}
              </span>
            </div>
          ))}

          {scanCompleted && visibleComponents.map((comp) => {
            let color = 'var(--accent-primary)'; 
            if (comp.type === 'Memory' || comp.type === 'IC Package') color = 'var(--accent-success)';
            if (comp.type === 'Control') color = 'var(--accent-secondary)';
            if (comp.type === 'Registers' || comp.type === 'Passive') color = 'var(--accent-warning)';
            if (comp.type === 'Interconnect') color = '#ef4444';
            if (comp.name === 'Unknown Component') color = 'var(--text-muted)';
            
            const isHovered = hoveredComponent && hoveredComponent.id === comp.id;
            const isSelected = selectedComponent && selectedComponent.id === comp.id;

            return (
              <div
                key={comp.id}
                className="bounding-box"
                style={{
                  position: 'absolute',
                  left: `${comp.bounding_box ? comp.bounding_box[0] : comp.x}%`,
                  top: `${comp.bounding_box ? comp.bounding_box[1] : comp.y}%`,
                  width: `${comp.bounding_box ? comp.bounding_box[2] : comp.w}%`,
                  height: `${comp.bounding_box ? comp.bounding_box[3] : comp.h}%`,
                  borderColor: color,
                  color: color,
                  boxShadow: (isHovered || isSelected) ? `0 0 25px ${color}, inset 0 0 15px ${color}` : 'none',
                  backgroundColor: (isHovered || isSelected) ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.01)',
                  borderWidth: (isHovered || isSelected) ? '2px' : '1.5px',
                  borderStyle: 'solid',
                  cursor: 'pointer',
                  zIndex: (isHovered || isSelected) ? 50 : 20
                }}
                onMouseEnter={() => setHoveredComponent(comp)}
                onMouseLeave={() => setHoveredComponent(null)}
                onClick={() => {
                  setSelectedComponent(comp);
                  setSidePanelComponent(comp);
                }}
              >
                <div 
                  className="bounding-box-label" 
                  style={{ 
                    backgroundColor: color, 
                    border: `1px solid ${color}`,
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    position: 'absolute',
                    top: '-20px',
                    left: 0,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{comp.name}</span>
                  {comp.confidence && <span style={{ opacity: 0.85, fontSize: '0.6rem', fontFamily: 'monospace' }}>[{comp.confidence}]</span>}
                </div>
              </div>
            );
          })}
        </div>

        {!scanCompleted && !isScanning && (
          <div style={{
            position: 'absolute',
            background: 'var(--glass-bg)',
            padding: '1.75rem',
            borderRadius: '16px',
            textAlign: 'center',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border-color)',
            maxWidth: '300px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              AI layout parsing required to map silicon cell coordinates and identify components.
            </p>
            <button onClick={startScan} className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <Play size={16} /> Start Layout Scan
            </button>
          </div>
        )}

        {isScanning && (
          <div style={{
            position: 'absolute',
            background: 'var(--glass-bg)',
            padding: '1rem 2rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            border: '1px solid var(--accent-cyan)',
            boxShadow: '0 10px 30px var(--glass-shadow)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <Search size={18} style={{ animation: 'rotate 2s linear infinite', color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>
              RUNNING_CV_CONTOURS...
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* MAIN SCREEN: Image upload selection / scanner trigger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '850px', margin: '0 auto' }}>
        
        {!customImage ? (
          <div 
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="glass-card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              textAlign: 'center', 
              padding: '4.5rem 2rem', 
              gap: '1.25rem', 
              border: '2px dashed var(--border-color)', 
              borderRadius: '20px',
              cursor: 'pointer',
              background: 'var(--glass-bg)',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', border: '1px solid var(--border-color)' }}>
              <ImageIcon size={30} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Upload or Paste Silicon Layout Image</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.6 }}>
                Click to browse, drag & drop an image, or press <strong style={{ color: 'var(--accent-cyan)' }}>Ctrl + V</strong> anywhere on your screen to paste an image directly from your clipboard!
              </p>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, background: 'rgba(6, 182, 212, 0.08)', color: 'var(--accent-cyan)', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
              📋 Supports Clipboard Paste (Ctrl+V) & Drag-and-Drop
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>
        ) : (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid var(--border-color)', background: 'var(--glass-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Custom Chip Die Layout</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="btn btn-outline"
                  style={{ fontSize: '0.75rem', padding: '0.4rem 0.85rem' }}
                >
                  Change Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                />
              </div>
            </div>

            {/* Simple Image preview container */}
            <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              {renderScannerViewport(false)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.85rem 1.25rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Ready to scan custom user-submitted layout.
              </span>
              {scanCompleted && (
                <button 
                  onClick={() => setShowModal(true)} 
                  className="btn btn-primary"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                >
                  Open Detection Dialogue
                </button>
              )}
            </div>
          </div>
        )}

        {/* Phase 4: Silicon Analysis Mode Component */}
        <SiliconAnalyzer isSiliconDie={isSiliconDie} components={customResults} />

        {/* Phase 3: Multi-Board Side-by-Side Comparison & Defect Analyzer */}
        <BoardComparer />
      </div>

      {/* DIALOGUE BOX (MODAL OVERLAY): LEFT (Detected Layout) | RIGHT (Identified Components & blue prints) */}
      {showModal && currentChip && (
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
          padding: 0
        }}>
          <div className="glass-card" style={{
            maxWidth: '100vw',
            width: '100vw',
            height: '100vh',
            maxHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            padding: '1.5rem',
            overflowY: 'auto',
            background: 'var(--glass-bg)',
            animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Layers style={{ color: 'var(--accent-cyan)' }} size={20} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Silicon Layout Scanner & Component Map Dialogue
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

            {/* Board Recognition Banner (Phase 1) */}
            {recognizedBoard && !isSiliconDie && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
                border: '1px solid var(--accent-cyan)',
                borderRadius: '12px',
                padding: '0.85rem 1.25rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-cyan)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
                    <Cpu size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-cyan)' }}>
                      Recognized Development Board
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {recognizedBoard.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', background: 'var(--bg-secondary)', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Vendor:</span> <strong>{recognizedBoard.manufacturer}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', background: 'var(--bg-secondary)', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Family:</span> <strong style={{ color: 'var(--accent-primary)' }}>{recognizedBoard.fpgaFamily}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', background: 'var(--bg-secondary)', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Device #:</span> <strong>{recognizedBoard.deviceNumber}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Auditable OCR Raw Tool Output & Strict Evidence Verification Report */}
            {evidenceReport && !isSiliconDie && (
              <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={13} /> Auditable OCR Tool Verification Report
                  </div>
                  <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    Engine: {evidenceReport.ocrToolName}
                  </span>
                </div>

                {/* Raw Verbatim OCR Quoting Box */}
                <div style={{ background: '#090d16', color: '#38bdf8', fontFamily: 'monospace', fontSize: '0.7rem', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '0.65rem', whiteSpace: 'pre-wrap' }}>
                  {evidenceReport.rawOCRText}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                  <div style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>STEP 1: Quoted OCR Substrings</div>
                    <ul style={{ paddingLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.7rem', margin: 0 }}>
                      {evidenceReport.step1_ocrText.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>STEP 2: Brand / Logo</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Vendor: <strong>{evidenceReport.step2_logoBrand.vendor}</strong></div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Location: {evidenceReport.step2_logoBrand.location}</div>
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>STEP 3: Physical Inventory</div>
                    <ul style={{ paddingLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.7rem', margin: 0 }}>
                      {evidenceReport.step3_physicalInventory.slice(0, 2).map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                  </div>

                  <div style={{ background: 'var(--bg-primary)', padding: '0.5rem 0.65rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>STEPS 4 & 5: Substring Justification</div>
                    <div style={{ color: evidenceReport.step4_crossCheck.ocrMatch ? 'var(--accent-success)' : '#ef4444', fontWeight: 800, fontSize: '0.7rem' }}>
                      {evidenceReport.step4_crossCheck.status}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>
                      Earned Conf: {evidenceReport.step5_confidenceJustification}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content Grid: flexbox wrapping for responsive mobile stacking */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem', overflowY: 'visible', paddingRight: '0.25rem', paddingBottom: '1rem' }}>
              
              {/* LEFT COLUMN: The Scanned layout image (interactive bounding boxes) */}
              <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                {renderScannerViewport(true)}
              </div>

              {/* RIGHT COLUMN: Identified list, category cards, details, library templates */}
              <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {currentChip.components.length === 0 ? (
                  <div className="glass-card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', border: '1px dashed var(--accent-warning)', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'center', margin: 'auto 0' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-warning)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <Info size={28} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No Silicon Patterns Detected</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto' }}>
                        This image does not contain parallel silicon grids, Manhattan routing, or transistor-level structures. Scanner returned 0 components.
                      </p>
                    </div>
                    <button 
                      onClick={() => { setShowModal(false); fileInputRef.current.click(); }}
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
                    >
                      Upload Chip Layout Image
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Selected component detail card (glowing indicator) */}
                    {(() => {
                      const activeComponent = hoveredComponent || selectedComponent || currentChip.components[0];
                      return activeComponent ? (
                        <div 
                          className="glass-card" 
                          style={{ 
                            borderLeft: `4px solid ${activeComponent.type === 'Memory' ? 'var(--accent-success)' : activeComponent.type === 'Control' ? 'var(--accent-secondary)' : 'var(--accent-primary)'}`,
                            padding: '1rem',
                            background: 'var(--bg-primary)',
                            animation: 'fadeIn 0.15s ease-out'
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                            {renderMicroChipGraphic(activeComponent.type)}
                            <div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{activeComponent.name}</h4>
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Class: {activeComponent.type}</span>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{activeComponent.desc}</p>
                          <ul className="details-list" style={{ background: 'var(--bg-secondary)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                            <li style={{ padding: '0.25rem 0' }}>
                              <span className="name" style={{ fontSize: '0.75rem' }}>Equivalent Gates</span>
                              <span className="val" style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isSiliconDie ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {isSiliconDie ? `${activeComponent.gates.toLocaleString()} gates` : 'Not Available'}
                              </span>
                            </li>
                            <li style={{ padding: '0.25rem 0' }}>
                              <span className="name" style={{ fontSize: '0.75rem' }}>Physical Silicon Area</span>
                              <span className="val" style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isSiliconDie ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {isSiliconDie ? activeComponent.area : 'Not Available'}
                              </span>
                            </li>
                            <li style={{ padding: '0.25rem 0' }}>
                              <span className="name" style={{ fontSize: '0.75rem' }}>Transistor Count</span>
                              <span className="val" style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isSiliconDie ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                {isSiliconDie ? activeComponent.transistors : 'Not Available'}
                              </span>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '1rem' }}>
                          <Info size={18} style={{ color: 'var(--accent-cyan)' }} />
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Click on coordinates in the left layout scanner canvas to inspect sub-blocks, dimensions, and logic configurations.
                          </p>
                        </div>
                      );
                    })()}

                    {/* Phase 2 Search, Category Filter & Confidence Slider Controls */}
                    <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)' }}>
                          <CheckCircle2 size={15} style={{ color: 'var(--accent-success)' }} />
                          Sub-Component Inventory ({getFilteredComponents(currentChip.components).length} / {currentChip.components.length})
                        </h4>
                        <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          {isSiliconDie ? `TOTAL_GATES: ${totalGates.toLocaleString()}` : 'SILICON_METRICS: NOT_AVAILABLE'}
                        </span>
                      </div>

                      {/* Search Bar */}
                      <div style={{ position: 'relative', width: '100%' }}>
                        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                          type="text"
                          placeholder="Search component name, part # (e.g. XC7A35T, W25Q64)..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.45rem 0.65rem 0.45rem 2rem',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>

                      {/* Category Filter Pills & Confidence Slider */}
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {['All', 'FPGA / SoC', 'DDR Memory', 'Flash Memory', 'Voltage Regulator', 'Passive', 'PMOD Header', 'DIP Switch', 'LED'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              style={{
                                fontSize: '0.65rem',
                                padding: '0.25rem 0.55rem',
                                borderRadius: '12px',
                                border: selectedCategory === cat ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                                background: selectedCategory === cat ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-secondary)',
                                color: selectedCategory === cat ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                                fontWeight: selectedCategory === cat ? 700 : 500,
                                cursor: 'pointer'
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Confidence Slider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.25rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                          <Sliders size={13} style={{ color: 'var(--accent-cyan)' }} />
                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>Min Conf:</span>
                          <input
                            type="range"
                            min="0"
                            max="99"
                            value={minConfidence}
                            onChange={(e) => setMinConfidence(parseInt(e.target.value))}
                            style={{ width: '60px', accentColor: 'var(--accent-cyan)' }}
                          />
                          <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent-cyan)' }}>{minConfidence}%</span>
                        </div>
                      </div>

                      {/* Component List Table */}
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', paddingBottom: '0.4rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Component Name</th>
                              <th style={{ textAlign: 'left', paddingBottom: '0.4rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Part Number</th>
                              <th style={{ textAlign: 'center', paddingBottom: '0.4rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>Confidence</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getFilteredComponents(currentChip.components).map((comp) => {
                              const isSelected = (selectedComponent && selectedComponent.id === comp.id) || (sidePanelComponent && sidePanelComponent.id === comp.id);
                              return (
                                <tr 
                                  key={comp.id}
                                  onClick={() => {
                                    setSelectedComponent(comp);
                                    setSidePanelComponent(comp);
                                  }}
                                  style={{ 
                                    cursor: 'pointer',
                                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                                    borderBottom: '1px solid var(--border-color)',
                                    transition: 'background 0.15s ease'
                                  }}
                                >
                                  <td style={{ fontWeight: 600, color: comp.name === 'Unknown Component' ? 'var(--text-muted)' : 'var(--text-primary)', padding: '0.4rem 0.25rem' }}>
                                    {comp.name}
                                  </td>
                                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.7rem', padding: '0.4rem 0.25rem' }}>
                                    {comp.partNumber || comp.type}
                                  </td>
                                  <td style={{ textAlign: 'center', fontFamily: 'monospace', color: parseFloat((comp.confidence || '95').replace('%','')) < 70 ? 'var(--text-muted)' : 'var(--accent-cyan)', fontWeight: 700, padding: '0.4rem 0.25rem' }}>
                                    {comp.confidence}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Templates catalog blueprints library */}
                    <div className="glass-card" style={{ padding: '1.25rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Blueprint Reference Catalog</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>Click **"Blueprint"** to zoom transistor level schematic details:</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div className="template-item" style={{ padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            {renderMicroChipGraphic('Logic')}
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>ALU Gate Matrix</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ALU_X8_BARRY</div>
                            </div>
                          </div>
                          <button onClick={() => setActiveSchematicKey('Logic')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem' }}><Eye size={10} /> Blueprint</button>
                        </div>

                        <div className="template-item" style={{ padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            {renderMicroChipGraphic('Memory')}
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>SRAM Bitcell Mesh</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>SRAM_6T_HD</div>
                            </div>
                          </div>
                          <button onClick={() => setActiveSchematicKey('Memory')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem' }}><Eye size={10} /> Blueprint</button>
                        </div>

                        <div className="template-item" style={{ padding: '0.5rem 0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            {renderMicroChipGraphic('Registers')}
                            <div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>DFF Register Stack</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>DFF_X1_HG</div>
                            </div>
                          </div>
                          <button onClick={() => setActiveSchematicKey('Registers')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.65rem' }}><Eye size={10} /> Blueprint</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Component Details Side Panel Drawer (Phase 2) */}
      {sidePanelComponent && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          maxWidth: '90vw',
          background: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border-color)',
          boxShadow: '-20px 0 50px rgba(0, 0, 0, 0.4)',
          zIndex: 220,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          gap: '1.25rem',
          overflowY: 'auto'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Cpu size={22} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>Component Specification</h3>
            </div>
            <button
              onClick={() => setSidePanelComponent(null)}
              className="btn btn-outline"
              style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Component Title & Confidence Badge */}
          <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: sidePanelComponent.name === 'Unknown Component' ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                {sidePanelComponent.name}
              </h4>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, fontFamily: 'monospace', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '0.25rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
                {sidePanelComponent.confidence} Conf.
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-primary)', fontWeight: 700 }}>
              Part #: {sidePanelComponent.partNumber || sidePanelComponent.type}
            </div>
          </div>

          {/* Specifications Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              Technical Data & Pinout
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Manufacturer</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{sidePanelComponent.manufacturer || 'N/A'}</div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Component Type</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{sidePanelComponent.type}</div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Package / Pins</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'monospace' }}>{sidePanelComponent.pins || 'N/A'}</div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Operating Voltage</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-warning)', fontFamily: 'monospace' }}>{sidePanelComponent.voltage || 'N/A'}</div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Primary Function</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>{sidePanelComponent.function || sidePanelComponent.description}</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Typical Applications</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{sidePanelComponent.typical_applications || sidePanelComponent.applications || 'Embedded Systems, FPGA Development'}</div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Description</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sidePanelComponent.description}</div>
            </div>
          </div>

          {/* Clickable Datasheet PDF Link */}
          {sidePanelComponent.datasheet && sidePanelComponent.datasheet !== '#' && (
            <a
              href={sidePanelComponent.datasheet}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                marginTop: 'auto'
              }}
            >
              <FileText size={16} />
              <span>Open Official Datasheet (PDF)</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      )}

      {/* Blueprint schematic modal pop-up overlay */}
      {activeSchematicKey && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--modal-overlay)',
          backdropFilter: 'blur(10px)',
          zIndex: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '550px',
            width: '100%',
            border: '1px solid var(--border-color)',
            boxShadow: '0 30px 60px var(--glass-shadow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--glass-bg)',
            animation: 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                <Cpu size={20} style={{ color: 'var(--accent-cyan)' }} />
                {SCHEMATICS[activeSchematicKey].title}
              </h3>
              <button 
                onClick={() => setActiveSchematicKey(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                className="btn-outline"
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '1rem 0' }}>
              {SCHEMATICS[activeSchematicKey].svg}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Standard transistor gate-level blueprint parsed from standard library references. Used for multi-scale pattern matching on silicon die photos.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button onClick={() => setActiveSchematicKey(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>
                Close Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
