# AI-Based VLSI Analyzer & Silicon Layout Scanner

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vlsi-ai-analyzer.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/kaliraaj24/vlsi-ai-analyzer)

> 🚀 **Live Deployed Web Application**: **[https://vlsi-ai-analyzer.vercel.app/](https://vlsi-ai-analyzer.vercel.app/)**

An intelligent VLSI computer-aided design (CAD) tool combining **Machine Learning Multi-Output Regression** for chip metrics estimation (Area, Delay, Power) and **Computer Vision Pattern Matching** for layout component detection, sub-block mapping, and auditable OCR inspection.

---

## 📌 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Architecture & Algorithms](#-architecture--algorithms)
   - [Chip Metrics Estimation (Random Forest)](#1-chip-metrics-estimation-random-forest)
   - [Component Detection (NCC & Rectangle Grouping)](#2-component-detection-ncc--rectangle-grouping)
5. [Directory Structure](#-directory-structure)
6. [Installation & Setup](#-installation--setup)
7. [API Reference](#-api-reference)
8. [UI Modules & Usage](#-ui-modules--usage)

---

## 🔍 Project Overview

In advanced semiconductor design, evaluating early-stage trade-offs between physical silicon area, critical path propagation delay, and total dynamic/leakage power consumption requires fast and reliable estimation. Furthermore, auditing PCB/silicon layout dies and identifying hardware components (ALUs, SRAM blocks, decoders, clock generators, I/O pads) requires automated visual verification.

This project delivers a dual-engine platform:
- **Predict Chip Details**: Predicts area, delay, and power metrics across multiple technology nodes (7nm, 14nm, 28nm, 45nm) given synthesis and design parameters.
- **Silicon Layout Component Scanner**: Analyzes chip layouts and PCB development boards, matching physical bounding boxes, counting gates, and providing cross-verified OCR component inventories.

---

## ✨ Key Features

- **Multi-Output ML Regression**: Estimates physical properties simultaneously using an ensemble of decision trees trained on semiconductor scaling physics.
- **Computer Vision Layout Scanner**: Normalized Cross Correlation (NCC) template matching to localize and bound standard cell blocks.
- **Pre-Trained Hardware Profiles**: Integrated catalog of known development boards including Digilent Basys 3 (Artix-7), ZedBoard (Zynq-7000), Nexys A7, Arduino Uno/Mega/Due, and BeagleBone Black.
- **Auditable OCR Verification Report**: 5-step evidence chain justifying identified chip markings against silkscreen text and component databases.
- **Interactive SVG Power Scaling Visualization**: Real-time interactive charts illustrating dynamic vs. leakage power scaling against supply voltage and frequency.
- **Full-Screen Responsive UI**: Supports theme toggling (Light/Dark mode) and full-screen layout dialogues with smooth scrolling.

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19
- **Build Tool / Bundler**: Vite 5
- **Styling**: Modern CSS variables, Glassmorphism, Responsive CSS Grid & Flexbox
- **Icons**: Lucide React (`lucide-react`)
- **Tunnelling Support**: `localtunnel`, `tunnelmole`

### Backend
- **Framework**: Flask (Python)
- **CORS Support**: `flask_cors` (cross-origin resource sharing for port `5173` $\leftrightarrow$ port `5000`)
- **Runtime**: Python 3.x

### Machine Learning & Data Processing
- **Regression Model**: Scikit-Learn `RandomForestRegressor`
- **Computer Vision**: OpenCV (`cv2`) with Normalized Cross-Correlation (`TM_CCOEFF_NORMED`)
- **Data Manipulation**: NumPy, Pandas
- **Serialization**: Joblib

---

## 📐 Architecture & Algorithms

### 1. Chip Metrics Estimation (Random Forest)
The metrics estimator predicts three physical metrics simultaneously:
- **Area ($\mu\text{m}^2$)**: Scales quadratically with feature dimensions across technology nodes:
  $$\text{Area} \approx N_{\text{cells}} \cdot A_{\text{base}} \cdot \left(\frac{\text{tech\_node}}{45}\right)^2$$
- **Propagation Delay ($\text{ns}$)**: Increases with cell count logic depth and technology node length, decreasing inversely with supply voltage:
  $$\text{Delay} \propto (N_{\text{cells}} \cdot k + d_0) \cdot \left(\frac{\text{tech\_node}}{45}\right) \cdot \left(\frac{V_{\text{nominal}}}{V}\right)$$
- **Total Power ($\mu\text{W}$)**: Sum of dynamic switching dissipation and exponential sub-threshold leakage:
  $$P_{\text{total}} = P_{\text{dyn}} + P_{\text{stat}} = \alpha C_{\text{eff}} V^2 f \cdot N_{\text{cells}} + N_{\text{cells}} \cdot I_{\text{leak}} \cdot e^{\beta(45 - \text{tech\_node})} \cdot V$$

The Random Forest ensemble constructs 100 decision trees to capture non-linear parameter interactions and provides robust predictions.

### 2. Component Detection (NCC & Rectangle Grouping)
- **Template Matching**: Evaluates Normalized Cross Correlation between candidate templates $T$ and the die image $I$:
  $$R(x,y) = \frac{\sum_{x',y'} (T'(x',y') \cdot I'(x+x',y+y'))}{\sqrt{\sum_{x',y'} T'(x',y')^2 \cdot \sum_{x',y'} I'(x+x',y+y')^2}}$$
- **Bounding Box Grouping**: Overlapping bounding boxes scoring above the threshold ($\ge 0.75$) are clustered using OpenCV's `groupRectangles` algorithm (`groupThreshold=1`, $\epsilon = 0.2$), eliminating duplicate detections.

---

## 📂 Directory Structure

```text
vlsi-ai-analyzer/
├── api_server.py              # Flask REST API backend (port 5000)
├── detect_components.py       # OpenCV template matching & coordinate scaling
├── predict_details.py         # Synthetic VLSI dataset generator & ML training
├── vlsi_regressor.joblib      # Serialized Random Forest model
├── package.json               # Frontend dependencies & scripts
├── vite.config.js             # Vite configuration
├── index.html                 # HTML entry point
├── src/
│   ├── main.jsx               # React DOM root mounting
│   ├── App.jsx                # Navigation, dark/light theme, landing view
│   ├── App.css                # Component-level styles
│   ├── index.css              # Global themes, animations, variables
│   └── components/
│       ├── MetricEstimator.jsx   # Metrics slider controls & power scaling charts
│       ├── ComponentDetector.jsx # Full-screen layout scanner & OCR dialogue
│       ├── BoardComparer.jsx     # Side-by-side comparison & defect analysis
│       ├── SiliconAnalyzer.jsx   # Silicon die analysis mode
│       ├── boardDatabase.js      # Reference specs for standard development boards
│       └── aiDetectorEngine.js   # Client-side heuristic verification engine
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+ and npm

### 1. Install Dependencies
```bash
# In the project directory:
npm install
pip install flask flask-cors scikit-learn numpy pandas opencv-python joblib
```

### 2. Train the ML Model
Generate the synthetic physical dataset and train the regression model:
```bash
python predict_details.py
```
*Output: `vlsi_regressor.joblib` created.*

### 3. Start Backend Server
```bash
python api_server.py
```
*Runs on `http://127.0.0.1:5000`.*

### 4. Start Frontend Development Server
```bash
npm run dev
```
*Runs locally on `http://localhost:5173`.*

> 🌐 **Production Deployment**: You can also use the live cloud-hosted web app directly at **[https://vlsi-ai-analyzer.vercel.app/](https://vlsi-ai-analyzer.vercel.app/)**.

---

## 🔌 API Reference

### 1. Predict Physical Metrics
- **Endpoint**: `POST /api/predict`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "cell_count": 5000,
  "seq_ratio": 0.2,
  "tech_node": 14,
  "voltage": 0.9,
  "frequency": 1200
}
```
- **Response**:
```json
{
  "area": 1245.8,
  "delay": 1.42,
  "power": 182.5
}
```

### 2. Detect Components from Layout
- **Endpoint**: `POST /api/detect`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: Form data containing `image` (file)
- **Response**:
```json
{
  "components": [
    {
      "id": "alu_0",
      "name": "Arithmetic Logic Unit (ALU)",
      "type": "ALU",
      "x": 38.5,
      "y": 35.2,
      "w": 24.0,
      "h": 26.0,
      "gates": 1024,
      "area": "1,200 µm²"
    }
  ],
  "counts": {
    "ALU": 1
  }
}
```

---

## 🖥 UI Modules & Usage

1. **Metrics Estimator**: Access via `http://localhost:5173` $\rightarrow$ click **Launch Metrics Estimator**. Adjust cell counts, technology nodes (45nm down to 7nm), operating voltages, and clock frequencies to view immediate power, delay, and area predictions.
2. **Silicon Layout Scanner**: Click **Launch Layout Scanner** to upload chip images, view detected bounding boxes, inspect gate counts, filter components by type (FPGA/SoC, Memory, Regulators, etc.), and view the auditable OCR evidence report.
