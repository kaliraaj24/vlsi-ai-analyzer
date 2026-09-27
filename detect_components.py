import cv2
import numpy as np
import os

def detect_chip_components(image_path, templates_dir):
    """Loads a chip layout and scans for templates (ALU, SRAM, Registers)."""
    img_rgb = cv2.imread(image_path)
    if img_rgb is None:
        return {"error": "Target chip layout image could not be loaded."}
        
    img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
    results = []
    component_counts = {}
    
    if not os.path.exists(templates_dir):
        os.makedirs(templates_dir, exist_ok=True)
        return {"components": [], "counts": {}, "warning": f"Templates directory '{templates_dir}' created. Please place small template snippets inside."}
        
    for file in os.listdir(templates_dir):
        if not file.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue
            
        comp_name = os.path.splitext(file)[0].upper()
        template_path = os.path.join(templates_dir, file)
        
        template = cv2.imread(template_path, 0)
        if template is None:
            continue
            
        w, h = template.shape[::-1]
        
        # Match template using Normalized Cross Correlation (NCC)
        res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED)
        threshold = 0.75 # Match similarity threshold
        loc = np.where(res >= threshold)
        
        rects = []
        for pt in zip(*loc[::-1]):
            rects.append([int(pt[0]), int(pt[1]), int(w), int(h)])
            
        # Group close overlapping rectangles into unique bounding boxes
        grouped_rects, weights = cv2.groupRectangles(rects, groupThreshold=1, eps=0.2)
        
        count = len(grouped_rects)
        if count > 0:
            component_counts[comp_name] = count
            for i, rect in enumerate(grouped_rects):
                # Map to exact component names
                exact_name = f"{comp_name} Sub-System"
                if comp_name == "ALU": exact_name = "Arithmetic Logic Unit (ALU)"
                elif comp_name == "SRAM": exact_name = "SRAM Cache Memory Block"
                elif comp_name == "REGISTERS" or comp_name == "GPR": exact_name = "General Purpose Registers (GPR)"
                elif comp_name == "DECODER": exact_name = "Instruction Decoder"
                elif comp_name == "CLOCK": exact_name = "Timing & Clock Generator"
                elif comp_name == "IO" or comp_name == "PADS": exact_name = "I/O Interface Pads"

                results.append({
                    "id": f"{comp_name.lower()}_{i}",
                    "name": exact_name,
                    "type": comp_name,
                    # Convert pixel coordinates to percentages for the React frontend canvas
                    "x": round((rect[0] / img_rgb.shape[1]) * 100, 2),
                    "y": round((rect[1] / img_rgb.shape[0]) * 100, 2),
                    "w": round((rect[2] / img_rgb.shape[1]) * 100, 2),
                    "h": round((rect[3] / img_rgb.shape[0]) * 100, 2),
                    "gates": 1024 if comp_name == "ALU" else 16384 if comp_name == "SRAM" else 256,
                    "area": "1,200 µm²" if comp_name == "ALU" else "12,500 µm²" if comp_name == "SRAM" else "500 µm²",
                    "desc": f"Identified {comp_name} circuit arrangement matching layout database."
                })
                
    return {
        "components": results,
        "counts": component_counts
    }
