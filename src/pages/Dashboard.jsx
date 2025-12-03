// src/pages/Dashboard.jsx
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaBuilding, FaUserShield, FaChartLine } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  const data = [
    { name: "Jan", apiCalls: 30 },
    { name: "Feb", apiCalls: 45 },
    { name: "Mar", apiCalls: 60 },
    { name: "Apr", apiCalls: 50 },
    { name: "May", apiCalls: 70 },
    { name: "Jun", apiCalls: 90 },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">
          Loading user... If this persists, please login again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Welcome, {user.first_name}!
            </h1>
            <p className="text-indigo-200 text-lg">
              Facility Management Dashboard
            </p>
          </div>

          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/policies")}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
            >
              Policies API
            </button>

            <button
              onClick={() => navigate("/chatbot")}  // ← OPEN CHATBOT
              className="px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
            >
              ChatBot
            </button>

            <button
              onClick={logout}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<FaUser />} label="Username" value={user.username} color="indigo" />
          <StatCard icon={<FaBuilding />} label="Facility" value={user.facility?.name} color="purple" />
          <StatCard icon={<FaUserShield />} label="Role" value={user.role?.name} color="pink" />
          <StatCard icon={<FaChartLine />} label="Email" value={user.email} color="green" />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            API Calls Over Time
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="apiCalls" stroke="#6366F1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
      <div className={`w-10 h-10 text-${color}-500`}>{icon}</div>
      <div>
        <p className="text-gray-500">{label}</p>
        <p className="text-gray-900 font-bold">{value}</p>
      </div>
    </div>
  );
}
