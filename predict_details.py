import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

def generate_vlsi_dataset():
    """Generates a dataset simulating physical VLSI properties with random variations."""
    np.random.seed(42)
    n_samples = 1500
    
    # Feature Inputs
    cell_count = np.random.randint(50, 10000, n_samples)
    seq_ratio = np.random.uniform(0.05, 0.4, n_samples)  # sequential ratio (registers)
    tech_node = np.random.choice([7, 14, 28, 45], n_samples)
    voltage = np.random.uniform(0.6, 1.3, n_samples)
    frequency = np.random.uniform(50, 2500, n_samples)  # MHz
    
    # Target outputs based on physical scaling laws + noise
    # Area: increases with cell count, scales quadratically with node size (e.g. (7/45)^2)
    base_cell_area = 1.8  # um^2 at 45nm
    area = cell_count * base_cell_area * ((tech_node / 45) ** 2) * np.random.uniform(1.25, 1.4, n_samples)
    
    # Delay: increases with logical depth (related to cell count), scales with tech node size, and decreases with higher voltage
    delay = (cell_count * 0.0003 + 1.1) * (tech_node / 45) * (1.1 / voltage) * np.random.uniform(0.9, 1.1, n_samples)
    
    # Power: Dynamic = C * V^2 * f * CellCount + Leakage (which scales exponentially at smaller nodes)
    cap_per_gate = 10e-15
    dyn_power = 0.15 * cell_count * cap_per_gate * (voltage ** 2) * (frequency * 1e6) * 1e6 # in uW
    static_power = cell_count * 0.07 * np.exp(0.08 * (45 - tech_node)) * (voltage / 1.1)
    power = (dyn_power + static_power) * np.random.uniform(0.95, 1.05, n_samples)
    
    df = pd.DataFrame({
        'cell_count': cell_count,
        'seq_ratio': seq_ratio,
        'tech_node': tech_node,
        'voltage': voltage,
        'frequency': frequency,
        'area': area,
        'delay': delay,
        'power': power
    })
    return df

def train_and_save():
    print("Generating synthetic VLSI datasets...")
    df = generate_vlsi_dataset()
    
    X = df[['cell_count', 'seq_ratio', 'tech_node', 'voltage', 'frequency']]
    y = df[['area', 'delay', 'power']]
    
    print("Training Random Forest Regressor Model...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save the trained model to disk
    joblib.dump(model, 'vlsi_regressor.joblib')
    print("Model successfully trained and saved as 'vlsi_regressor.joblib'!")

if __name__ == '__main__':
    train_and_save()
