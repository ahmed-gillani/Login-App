import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaBuilding, FaUserShield, FaChartLine, FaRobot, FaHome } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Dropdown from "../components/Dropdown";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Dummy data (can be replaced with API call + TanStack Query)
  const data = [
    { name: "Jan", apiCalls: 30 },
    { name: "Feb", apiCalls: 45 },
    { name: "Mar", apiCalls: 60 },
    { name: "Apr", apiCalls: 50 },
    { name: "May", apiCalls: 70 },
    { name: "Jun", apiCalls: 90 },
  ];

  const sparkData = [
    { value: 20 }, { value: 35 }, { value: 25 }, { value: 40 },
    { value: 30 }, { value: 45 }, { value: 50 },
  ];

  if (!user) return <p className="p-6 text-gray-600">Loading user...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-slate-200 to-blue-200 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">Welcome, {user.first_name}!</h1>
            <p className="text-gray-600 text-lg">Facility Management Dashboard</p>
          </div>

          <div className="flex gap-4 mt-4 sm:mt-0">
            <Dropdown
              label="Navigate"
              items={[
                { label: "Policies API", onClick: () => navigate("/policies"), icon: <FaHome /> },
                { label: "ChatBot", onClick: () => navigate("/chatbot"), icon: <FaRobot /> },
              ]}
            />
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
          <StatCard icon={<FaUser />} label="Username" value={user.username} color="blue" sparkData={sparkData} />
          <StatCard icon={<FaBuilding />} label="Facility" value={user.facility?.name} color="indigo" sparkData={sparkData} />
          <StatCard icon={<FaUserShield />} label="Role" value={user.role?.name} color="cyan" sparkData={sparkData} />
          <StatCard icon={<FaChartLine />} label="Email" value={user.email} color="green" sparkData={sparkData} />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Calls Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="apiCalls" stroke="#2563EB" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// -----------------------
// Stat Card Component
// -----------------------
function StatCard({ icon, label, value, color, sparkData }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col gap-3 hover:shadow-xl hover:scale-105 transition-transform duration-300">
      <div className="flex items-center gap-3">
        <div className={`text-${color}-500 w-10 h-10 flex items-center justify-center text-xl`}>{icon}</div>
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-gray-900 font-semibold">{value}</p>
        </div>
      </div>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="value" stroke={`var(--tw-${color}-500)`} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
