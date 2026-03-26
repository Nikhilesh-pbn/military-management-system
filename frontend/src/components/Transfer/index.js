import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Transfer = () => {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset_id: "",
    from_base: "Nellore HQ",
    to_base: "Hyderabad Central",
    quantity: 1,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssets = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://military-management-system-2.onrender.com/api/assets",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAssets(res.data);
      if (res.data.length > 0) {
        setFormData((prev) => ({ ...prev, asset_id: res.data[0].id }));
      }
    };
    fetchAssets();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://military-management-system-2.onrender.com/api/transfers",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      navigate("/");
    } catch (err) {
      alert("Transfer Failed: Insufficient Stock or Unauthorized");
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
            <Link to="/purchase" className="menu-item">
              Asset Procurement
            </Link>
          </li>
          <li>
            <Link to="/transfer" className="menu-item active">
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
            <h1>Logistics & Movements</h1>
            <p className="status-indicator">
              Active Assets: <span className="online">{assets.length}</span>
            </p>
          </div>
        </header>

        <section className="procurement-card">
          <form onSubmit={handleTransfer} className="clean-form">
            <div className="form-group">
              <label>Select Asset to Move</label>
              <select
                value={formData.asset_id}
                onChange={(e) =>
                  setFormData({ ...formData, asset_id: e.target.value })
                }
                required
              >
                <option value="">-- Select Inventory Item --</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} (Current: {asset.quantity} at {asset.base})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Origin Base</label>
                <select
                  value={formData.from_base}
                  onChange={(e) =>
                    setFormData({ ...formData, from_base: e.target.value })
                  }
                >
                  <option value="Nellore HQ">Nellore HQ</option>
                  <option value="Hyderabad Central">Hyderabad Central</option>
                  <option value="Vizag Port">Vizag Port</option>
                  <option value="Delhi Command">Delhi Command</option>
                </select>
              </div>

              <div className="form-group">
                <label>Target Base</label>
                <select
                  value={formData.to_base}
                  onChange={(e) =>
                    setFormData({ ...formData, to_base: e.target.value })
                  }
                >
                  <option value="Hyderabad Central">Hyderabad Central</option>
                  <option value="Nellore HQ">Nellore HQ</option>
                  <option value="Vizag Port">Vizag Port</option>
                  <option value="Delhi Command">Delhi Command</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Transfer Quantity</label>
              <select
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
              >
                {[1, 2, 5, 10, 20, 50].map((num) => (
                  <option key={num} value={num}>
                    {num} Units
                  </option>
                ))}
              </select>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-transfer">
                Authorize Transfer
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

export default Transfer;
