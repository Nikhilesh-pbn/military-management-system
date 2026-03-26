import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Assignments = () => {
  const [assets, setAssets] = useState([]);
  const [formData, setFormData] = useState({
    asset_id: "",
    personnel_name: "Unit Alpha-1",
    action_type: "Assignment",
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

  const handleAction = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/assignments", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Registry Updated Successfully");
      navigate("/");
    } catch (err) {
      alert("Error: Stock level too low or Unauthorized");
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
              Purchases
            </Link>
          </li>
          <li>
            <Link to="/transfer" className="menu-item">
              Transfers
            </Link>
          </li>
          <li>
            <Link to="/assignments" className="menu-item active">
              Assignments
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
          <h1>Assignments & Expenditures</h1>
          <div className="system-tag">Logistics Registry</div>
        </header>

        <section className="form-container">
          <form onSubmit={handleAction} className="assignment-form">
            <div className="form-group">
              <label>Select Personnel / Unit</label>
              <select
                value={formData.personnel_name}
                onChange={(e) =>
                  setFormData({ ...formData, personnel_name: e.target.value })
                }
              >
                <option value="Unit Alpha-1">Unit Alpha-1</option>
                <option value="Special Ops Group B">Special Ops Group B</option>
                <option value="Nellore Border Guard">
                  Nellore Border Guard
                </option>
                <option value="Logistics Division">Logistics Division</option>
              </select>
            </div>

            <div className="form-group">
              <label>Asset Category</label>
              <select
                value={formData.asset_id}
                onChange={(e) =>
                  setFormData({ ...formData, asset_id: e.target.value })
                }
                required
              >
                <option value="">-- Select Available Asset --</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.quantity} Available)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Action Type</label>
              <select
                value={formData.action_type}
                onChange={(e) =>
                  setFormData({ ...formData, action_type: e.target.value })
                }
              >
                <option value="Assignment">Assignment (Personnel Issue)</option>
                <option value="Expenditure">Expenditure (Consumed/Used)</option>
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
                {[1, 2, 5, 10, 20, 50, 100].map((num) => (
                  <option key={num} value={num}>
                    {num} Units
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                Update Registry
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/")}
              >
                Back
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Assignments;
