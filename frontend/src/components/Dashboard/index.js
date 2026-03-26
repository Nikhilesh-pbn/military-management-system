import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Dashboard = () => {
  const [assets, setAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/assets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssets(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-layout">
      <nav className="side-navigation">
        <div className="nav-header">HQ COMMAND</div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="menu-item active">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/purchase" className="menu-item">
              Purchases
            </Link>
          </li>
          <li>
            <Link to="/transfer" className="menu-item">
              Transfers
            </Link>
          </li>
          <li>
            <Link to="/assignments" className="menu-item">
              Assignments
            </Link>
          </li>
        </ul>
        <div className="nav-footer">
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="btn-logout"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="content-area">
        <header className="content-header">
          <h1>Logistics Command Center</h1>
          <div className="header-meta">
            <span className="role-badge">{localStorage.getItem("role")}</span>
          </div>
        </header>

        <div className="asset-grid-2col">
          {assets.map((item) => (
            <div className="asset-card" key={item.id}>
              <div className="card-header">
                <span className="asset-id">UNIT ID: {item.id}</span>
                <span className="asset-tag">{item.type}</span>
              </div>
              <h2 className="asset-name">{item.name}</h2>

              <div className="metrics-container">
                <div className="metric-box">
                  <label>Opening</label>
                  <span>
                    {item.quantity +
                      (item.assigned || 0) +
                      (item.expended || 0)}
                  </span>
                </div>
                <div className="metric-box">
                  <label>Assigned</label>
                  <span className="blue-txt">{item.assigned || 0}</span>
                </div>
                <div className="metric-box">
                  <label>Expended</label>
                  <span className="red-txt">{item.expended || 0}</span>
                </div>
                <div className="metric-box highlight">
                  <label>Closing (Avail)</label>
                  <span>{item.quantity}</span>
                </div>
              </div>

              <div className="card-footer-info">
                <span>
                  Location: <strong>{item.base}</strong>
                </span>
                <button
                  className="btn-details"
                  onClick={() => {
                    setSelected(item);
                    setShowModal(true);
                  }}
                >
                  Net Movement Details ⓘ
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && selected && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-top">
                <h2>Logistics History: {selected.name}</h2>
                <button
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-inner">
                <div className="history-row">
                  <span>Total Purchased</span> <strong>+10</strong>
                </div>
                <div className="history-row">
                  <span>Transfers In</span> <strong>+5</strong>
                </div>
                <div className="history-row">
                  <span>Transfers Out</span> <strong className="neg">-2</strong>
                </div>
                <div className="history-row">
                  <span>Assignments</span>{" "}
                  <strong className="neg">-{selected.assigned || 0}</strong>
                </div>
                <div className="net-summary">
                  Net Movement Calculated:{" "}
                  {10 + 5 - (2 + (selected.assigned || 0))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
