from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib

app = FastAPI()

# Allow Next.js (port 3000) to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model once when the server starts
rf_model_loaded = joblib.load("rf_model_energy.pkl")

# Define the expected input data structure
class EnergyInput(BaseModel):
    square_meters: float
    year_built: int
    primary_use: int
    date: str

@app.post("/predict")
def predict_energy_from_api(data: EnergyInput):
    api_input = data.dict()
    
    current_year = 2017
    building_age = current_year - api_input["year_built"]
    
    date_obj = pd.to_datetime(api_input["date"])
    month = date_obj.month
    day_of_week = date_obj.weekday()
    
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)
    day_sin = np.sin(2 * np.pi * day_of_week / 7)
    day_cos = np.cos(2 * np.pi * day_of_week / 7)
    
    important_features = [
        'square_meters', 'building_age', 'primary_use',
        'month_sin', 'month_cos', 'day_of_week_sin', 'day_of_week_cos'
    ]
    
    input_data = pd.DataFrame([[
        api_input["square_meters"], building_age, api_input["primary_use"],
        month_sin, month_cos, day_sin, day_cos
    ]], columns=important_features)
    
    log_pred = rf_model_loaded.predict(input_data)[0]
    real_pred = np.expm1(log_pred)
    
    return {"predicted_energy_kwh": float(real_pred)}