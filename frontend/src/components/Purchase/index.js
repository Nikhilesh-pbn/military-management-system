import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Purchase = () => {
  const [formData, setFormData] = useState({
    asset_name: "",
    type: "Vehicle",
    quantity: 1,
    base: "Nellore HQ",
  });
  const [availableCount, setAvailableCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://military-management-system-2.onrender.com/api/assets",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAvailableCount(res.data.length);
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://military-management-system-2.onrender.com/api/purchases",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      navigate("/");
    } catch (err) {
      alert("Action Denied: Check Permissions");
    }
  };

  return (
    <div className="app-layout">
      <nav className="side-navigation">
        <div className="nav-header">HQ COMMAND</div>
        <ul className="nav-menu">
          <li>
            <Link to="/" className="menu-item">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/purchase" className="menu-item active">
              Asset Procurement
            </Link>
          </li>
          <li>
            <Link to="/transfer" className="menu-item">
              Logistics Transfer
            </Link>
          </li>
        </ul>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="btn-logout"
        >
          Sign Out
        </button>
      </nav>

      <main className="content-area">
        <header className="content-header">
          <div className="header-left">
            <h1>Procurement Portal</h1>
            <p className="status-indicator">
              Server Status: <span className="online">Online</span>
            </p>
          </div>
          <div className="server-stats">
            <label>Total Assets in Server</label>
            <span className="count-badge">{availableCount}</span>
          </div>
        </header>

        <section className="procurement-card">
          <form onSubmit={handleSubmit} className="clean-form">
            <div className="form-group">
              <label>Select Asset Name</label>
              <select
                value={formData.asset_name}
                onChange={(e) =>
                  setFormData({ ...formData, asset_name: e.target.value })
                }
                required
              >
                <option value="">-- Select Asset --</option>
                <option value="M1 Abrams Tank">M1 Abrams Tank</option>
                <option value="MQ-9 Reaper UAV">MQ-9 Reaper UAV</option>
                <option value="Patriot Missile">Patriot Missile</option>
                <option value="M4 Carbine">M4 Carbine</option>
              </select>
            </div>

            <div className="form-group">
              <label>Equipment Classification</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Vehicle">Vehicle</option>
                <option value="UAV">UAV</option>
                <option value="Firearm">Firearm</option>
                <option value="Defense System">Defense System</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <select
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
              >
                {[1, 5, 10, 20, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num} Units
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Target Deployment Base</label>
              <select
                value={formData.base}
                onChange={(e) =>
                  setFormData({ ...formData, base: e.target.value })
                }
              >
                <option value="Nellore HQ">Nellore HQ</option>
                <option value="Hyderabad Central">Hyderabad Central</option>
                <option value="Vizag Port">Vizag Port</option>
                <option value="Delhi Command">Delhi Command</option>
              </select>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-primary">
                Execute Purchase
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Purchase;
