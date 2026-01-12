import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function App() {
  const [kpis, setKpis] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/kpis");
      setKpis(Object.values(res.data));
    } catch (err) {
      console.log("API Error:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ---------------- SIDEBAR ---------------- */}
      <div
        style={{
          width: "260px",
          background: "#1d3557",
          color: "white",
          padding: "25px",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>📡 KPI Panel</h2>

        {kpis.map((kpi, index) => {
          const latest = kpi.values[kpi.values.length - 1];
          return (
            <div
              key={index}
              style={{
                background: "#457b9d",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              <h4>{kpi.kpi_name}</h4>
              <p style={{ margin: 0, fontSize: "18px" }}>
                <b>{latest.value}</b> {kpi.unit}
              </p>
              <p style={{ margin: 0, fontSize: "12px" }}>⏱ {latest.time}</p>
            </div>
          );
        })}
      </div>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <div style={{ flex: 1, padding: "30px", overflowY: "scroll" }}>
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
          📈 Telecom KPI Monitoring Dashboard
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "30px",
          }}
        >
          {kpis.map((kpi, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                background: "white",
                borderRadius: "12px",
                boxShadow: "0 0 15px rgba(0,0,0,0.1)",
              }}
            >
              <h2>
                {kpi.kpi_name} ({kpi.unit})
              </h2>

              <Line
                data={{
                  labels: kpi.values.map((v) => v.time),
                  datasets: [
                    {
                      label: kpi.kpi_name,
                      data: kpi.values.map((v) => v.value),
                      borderColor: "rgba(249, 4, 4, 1)",
                      tension: 0.2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
