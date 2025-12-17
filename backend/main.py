from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from datetime import datetime, timedelta

app = FastAPI()

# Enable CORS so frontend can access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Function to generate 100+ random KPI values
# -----------------------------
def generate_time_series(start_time="10:00", count=120, step_minutes=5, min_val=50, max_val=150):
    base = datetime.strptime(start_time, "%H:%M")
    data = []

    for i in range(count):
        time_point = (base + timedelta(minutes=i * step_minutes)).strftime("%H:%M")
        value = round(random.uniform(min_val, max_val), 2)
        data.append({"time": time_point, "value": value})

    return data


# -----------------------------
# Load static KPI data template
# -----------------------------
with open("kpi_data.json", "r") as f:
    kpi_template = json.load(f)


# -----------------------------
# /kpis endpoint - returns dynamic + static KPIs
# -----------------------------
@app.get("/kpis")
def get_all_kpis():
    response = {}

    for key, info in kpi_template.items():
        response[key] = {
            "kpi_name": info["kpi_name"],
            "unit": info["unit"],
            "values": generate_time_series(
                min_val=info["min"],
                max_val=info["max"]
            )
        }

    return response
