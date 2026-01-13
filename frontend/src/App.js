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
  Filler,
  ArcElement,
} from "chart.js";
import "./Modern.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

function App() {
  const [kpis, setKpis] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("4G-LTE");
  const [activeTab, setActiveTab] = useState("overview");

  // Network data
  const networks = [
    {
      id: "4G-LTE",
      name: "4G-LTE",
      signal: 95,
      type: "LTE",
      quality: "Excellent",
    },
    { id: "5G", name: "5G NSA", signal: 88, type: "5G", quality: "Very Good" },
    { id: "3G", name: "3G UMTS", signal: 72, type: "3G", quality: "Good" },
    { id: "2G", name: "2G GSM", signal: 65, type: "2G", quality: "Fair" },
  ];

  const currentNetwork = networks.find((n) => n.id === selectedNetwork);

  // Convert UTC to IST
  const convertToIST = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours) + 5;
    let m = parseInt(minutes) + 30;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
    if (h >= 24) h -= 24;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} IST`;
  };

  // KPI color mapping
  const kpiColors = {
    Throughput: { hex: "#3B82F6", class: "color-blue" },
    Latency: { hex: "#F59E0B", class: "color-orange" },
    "Packet Loss": { hex: "#EF4444", class: "color-red" },
    "CPU Utilization": { hex: "#8B5CF6", class: "color-purple" },
  };

  // Mock data for GitHub Pages deployment
  const mockKpis = [
    {
      kpi_name: "Throughput",
      unit: "Mbps",
      values: Array.from({ length: 120 }, (_, i) => ({
        time: `${String(Math.floor(i / 12) + 10).padStart(2, "0")}:${String(
          (i % 12) * 5
        ).padStart(2, "0")}`,
        value: Math.round((Math.random() * 70 + 80) * 100) / 100,
      })),
    },
    {
      kpi_name: "Latency",
      unit: "ms",
      values: Array.from({ length: 120 }, (_, i) => ({
        time: `${String(Math.floor(i / 12) + 10).padStart(2, "0")}:${String(
          (i % 12) * 5
        ).padStart(2, "0")}`,
        value: Math.round((Math.random() * 50 + 10) * 100) / 100,
      })),
    },
    {
      kpi_name: "Packet Loss",
      unit: "%",
      values: Array.from({ length: 120 }, (_, i) => ({
        time: `${String(Math.floor(i / 12) + 10).padStart(2, "0")}:${String(
          (i % 12) * 5
        ).padStart(2, "0")}`,
        value: Math.round(Math.random() * 5 * 100) / 100,
      })),
    },
    {
      kpi_name: "CPU Utilization",
      unit: "%",
      values: Array.from({ length: 120 }, (_, i) => ({
        time: `${String(Math.floor(i / 12) + 10).padStart(2, "0")}:${String(
          (i % 12) * 5
        ).padStart(2, "0")}`,
        value: Math.round((Math.random() * 70 + 20) * 100) / 100,
      })),
    },
  ];

  useEffect(() => {
    const initData = async () => {
      try {
        // Try to fetch from backend
        const res = await axios.get("http://localhost:8000/kpis", {
          timeout: 2000,
        });
        setKpis(Object.values(res.data));
      } catch (err) {
        // Fallback to mock data for GitHub Pages
        console.log("Using mock data (backend unavailable)");
        setKpis(mockKpis);
      }
    };

    initData();
    const interval = setInterval(initData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getNetworkQualityScore = () => {
    if (!kpis.length) return 0;
    const throughput = kpis[0]?.values[kpis[0].values.length - 1]?.value || 0;
    const latency = kpis[1]?.values[kpis[1].values.length - 1]?.value || 0;
    const packetLoss = kpis[2]?.values[kpis[2].values.length - 1]?.value || 0;
    return Math.round(
      (throughput / 150) * 40 +
        ((60 - latency) / 60) * 40 +
        ((5 - packetLoss) / 5) * 20
    );
  };

  const signalStrengthColor = (signal) => {
    if (signal >= 90) return "#10b981";
    if (signal >= 75) return "#3b82f6";
    if (signal >= 60) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div className="dashboard-wrapper">
      {/* ========== HEADER ========== */}
      <header className="main-header">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-icon">📱</span>
            <div>
              <h1 className="logo-title">Airtel Network Monitor</h1>
              <p className="logo-subtitle">Real-time Network Intelligence</p>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="network-badge">
            <span className="badge-label">Active Network</span>
            <span className="badge-value">{currentNetwork?.name}</span>
          </div>
          <div className="quality-indicator">
            <span className="quality-score">{getNetworkQualityScore()}%</span>
            <span className="quality-label">Quality</span>
          </div>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* ========== SIDEBAR ========== */}
        <aside className="sidebar-panel">
          <div className="sidebar-section">
            <h3 className="sidebar-title">🌐 Network Selection</h3>
            <div className="network-grid">
              {networks.map((network) => (
                <button
                  key={network.id}
                  className={`network-card ${
                    selectedNetwork === network.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedNetwork(network.id)}
                >
                  <div className="network-card-header">
                    <span className="network-type">{network.type}</span>
                    <span className="signal-icon">📶</span>
                  </div>
                  <div className="network-card-name">{network.name}</div>
                  <div className="signal-bar">
                    <div
                      className="signal-fill"
                      style={{
                        width: `${network.signal}%`,
                        backgroundColor: signalStrengthColor(network.signal),
                      }}
                    ></div>
                  </div>
                  <div className="signal-text">{network.signal}%</div>
                  <span className="quality-badge">{network.quality}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">📊 Quick Stats</h3>
            <div className="quick-stats">
              {kpis.slice(0, 3).map((kpi, idx) => {
                const latest = kpi.values[kpi.values.length - 1];
                return (
                  <div key={idx} className="quick-stat">
                    <span className="stat-icon">
                      {idx === 0 ? "📈" : idx === 1 ? "⏱️" : "❌"}
                    </span>
                    <div className="stat-content">
                      <span className="stat-label">{kpi.kpi_name}</span>
                      <span className="stat-value">
                        {latest.value.toFixed(1)} {kpi.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">🎯 Tabs</h3>
            <div className="tab-buttons">
              <button
                className={`tab-btn ${
                  activeTab === "overview" ? "active" : ""
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "detailed" ? "active" : ""
                }`}
                onClick={() => setActiveTab("detailed")}
              >
                Detailed
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "comparison" ? "active" : ""
                }`}
                onClick={() => setActiveTab("comparison")}
              >
                Compare
              </button>
            </div>
          </div>
        </aside>

        {/* ========== MAIN CONTENT ========== */}
        <main className="main-content">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="content-section">
              {/* Top KPI Cards */}
              <div className="kpi-cards-grid">
                {kpis.map((kpi, index) => {
                  const latest = kpi.values[kpi.values.length - 1];
                  const colorInfo = kpiColors[kpi.kpi_name];
                  const maxVal = Math.max(...kpi.values.map((v) => v.value));
                  const minVal = Math.min(...kpi.values.map((v) => v.value));

                  return (
                    <div
                      key={index}
                      className={`kpi-card-large ${colorInfo.class}`}
                      style={{ borderTopColor: colorInfo.hex }}
                    >
                      <div className="kpi-card-top">
                        <h4>{kpi.kpi_name}</h4>
                        <span className="kpi-unit">{kpi.unit}</span>
                      </div>
                      <div className="kpi-card-value">
                        {latest.value.toFixed(2)}
                      </div>
                      <div className="kpi-card-meta">
                        <span>Min: {minVal.toFixed(1)}</span>
                        <span>Max: {maxVal.toFixed(1)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts Grid */}
              <div className="charts-grid">
                {kpis.map((kpi, index) => {
                  const colorInfo = kpiColors[kpi.kpi_name];
                  const maxValue = Math.max(...kpi.values.map((v) => v.value));
                  const minValue = Math.min(...kpi.values.map((v) => v.value));
                  const avgValue =
                    kpi.values.reduce((a, b) => a + b.value, 0) /
                    kpi.values.length;

                  return (
                    <div
                      key={index}
                      className={`chart-card-full ${colorInfo.class}`}
                    >
                      <div className="chart-header-full">
                        <h3>{kpi.kpi_name}</h3>
                        <span className="chart-unit">{kpi.unit}</span>
                      </div>
                      <div className="chart-canvas-full">
                        <Line
                          key={`chart-${index}`}
                          data={{
                            labels: kpi.values.map((v) => convertToIST(v.time)),
                            datasets: [
                              {
                                label: kpi.kpi_name,
                                data: kpi.values.map((v) => v.value),
                                borderColor: colorInfo.hex,
                                backgroundColor: colorInfo.hex + "15",
                                borderWidth: 2.5,
                                fill: true,
                                tension: 0.6,
                                pointRadius: 0,
                                pointHoverRadius: 7,
                                pointBackgroundColor: colorInfo.hex,
                                pointBorderColor: "white",
                                pointBorderWidth: 2,
                              },
                            ],
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            interaction: { intersect: false, mode: "index" },
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                backgroundColor: "rgba(15, 20, 25, 0.95)",
                                padding: 12,
                                cornerRadius: 8,
                                titleFont: { size: 12, weight: "600" },
                                bodyFont: { size: 11 },
                                borderColor: colorInfo.hex,
                                borderWidth: 1.5,
                                displayColors: false,
                                callbacks: {
                                  title: (context) => context[0].label,
                                  label: (context) =>
                                    `${context.parsed.y.toFixed(2)} ${
                                      kpi.unit
                                    }`,
                                },
                              },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: {
                                  color: "rgba(240, 240, 245, 0.06)",
                                  drawBorder: false,
                                },
                                ticks: {
                                  color: "#8a8a9e",
                                  font: { size: 10 },
                                },
                              },
                              x: {
                                grid: { display: false, drawBorder: false },
                                ticks: {
                                  color: "#8a8a9e",
                                  font: { size: 9 },
                                  maxTicksLimit: 5,
                                },
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="chart-stats-footer">
                        <div className="stat-item">
                          <span className="stat-label">Minimum</span>
                          <span className="stat-val">
                            {minValue.toFixed(1)}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Average</span>
                          <span className="stat-val">
                            {avgValue.toFixed(1)}
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Maximum</span>
                          <span className="stat-val">
                            {maxValue.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Detailed Tab */}
          {activeTab === "detailed" && (
            <div className="content-section detailed-view">
              <h2>Detailed Network Analysis</h2>
              <div className="detailed-grid">
                {kpis.map((kpi, idx) => {
                  const colorInfo = kpiColors[kpi.kpi_name];
                  const latest = kpi.values[kpi.values.length - 1];
                  const prevVal =
                    kpi.values[Math.max(0, kpi.values.length - 2)];
                  const change = latest.value - prevVal.value;
                  const changePercent = (
                    (change / prevVal.value) *
                    100
                  ).toFixed(1);

                  return (
                    <div
                      key={idx}
                      className={`detailed-card ${colorInfo.class}`}
                    >
                      <h4>{kpi.kpi_name}</h4>
                      <div className="detail-metric">
                        <span className="metric-label">Current Value</span>
                        <span className="metric-value">
                          {latest.value.toFixed(2)} {kpi.unit}
                        </span>
                      </div>
                      <div className="detail-metric">
                        <span className="metric-label">Change</span>
                        <span
                          className={`metric-change ${
                            change >= 0 ? "positive" : "negative"
                          }`}
                        >
                          {change >= 0 ? "+" : ""}
                          {changePercent}%
                        </span>
                      </div>
                      <div className="detail-metric">
                        <span className="metric-label">Last Updated</span>
                        <span className="metric-time">
                          {convertToIST(latest.time)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Comparison Tab */}
          {activeTab === "comparison" && (
            <div className="content-section comparison-view">
              <h2>Network Comparison</h2>
              <div className="comparison-table">
                <div className="comparison-header">
                  <div className="comp-col">Network Type</div>
                  <div className="comp-col">Signal</div>
                  <div className="comp-col">Quality</div>
                  <div className="comp-col">Status</div>
                </div>
                {networks.map((net) => (
                  <div key={net.id} className="comparison-row">
                    <div className="comp-col">{net.name}</div>
                    <div className="comp-col">
                      <div className="mini-signal-bar">
                        <div
                          style={{
                            width: `${net.signal}%`,
                            height: "100%",
                            backgroundColor: signalStrengthColor(net.signal),
                            borderRadius: "2px",
                          }}
                        ></div>
                      </div>
                      {net.signal}%
                    </div>
                    <div className="comp-col">
                      <span className="quality-tag">{net.quality}</span>
                    </div>
                    <div className="comp-col">
                      <button
                        className={`status-btn ${
                          selectedNetwork === net.id ? "active" : ""
                        }`}
                        onClick={() => setSelectedNetwork(net.id)}
                      >
                        {selectedNetwork === net.id ? "Active" : "Switch"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
