// src/pages/Dashboard.tsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.tsx";
import { FaUser, FaBuilding, FaUserShield, FaEnvelope, FaRobot, FaHome } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Dropdown from "../components/Dropdown.tsx";

interface User {
  username?: string;
  first_name?: string;
  email?: string;
  role?: { name: string };
  facility?: { name: string };
}

const apiData = [
  { month: "Jan", calls: 30 }, { month: "Feb", calls: 45 }, { month: "Mar", calls: 60 },
  { month: "Apr", calls: 50 }, { month: "May", calls: 70 }, { month: "Jun", calls: 90 },
  { month: "Jul", calls: 85 }, { month: "Aug", calls: 100 }, { month: "Sep", calls: 95 },
  { month: "Oct", calls: 110 }, { month: "Nov", calls: 120 }, { month: "Dec", calls: 135 },
];

const sparkData = [
  { value: 20 }, { value: 35 }, { value: 25 }, { value: 40 },
  { value: 30 }, { value: 45 }, { value: 50 },
];

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext) as { user: User | null; logout: () => void };
  const navigate = useNavigate();

  if (!user) return <p className="p-6 text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Welcome, {user.first_name || user.username || "User"}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Facility Management Dashboard
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Dropdown
              label="Navigate"
              items={[
                { label: "Policies", onClick: () => navigate("/policies"), icon: <FaHome size={18} /> },
                { label: "ChatBot", onClick: () => navigate("/chatbot"), icon: <FaRobot size={18} /> },
              ]}
            />
            <button
              onClick={logout}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <InfoCard icon={<FaUser size={24} />} label="Username" value={user.username || "N/A"} sparkData={sparkData} />
          <InfoCard icon={<FaBuilding size={24} />} label="Facility" value={user.facility?.name || "N/A"} sparkData={sparkData} />
          <InfoCard icon={<FaUserShield size={24} />} label="Role" value={user.role?.name || "N/A"} sparkData={sparkData} />
          <InfoCard icon={<FaEnvelope size={24} />} label="Email" value={user.email || "N/A"} sparkData={sparkData} isEmail />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            API Calls Over Time
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={apiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  labelStyle={{ color: "#333", fontWeight: "bold" }}
                />
                <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={4} dot={{ fill: "#3B82F6", r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, sparkData, isEmail = false }: { icon: React.ReactNode; label: string; value: string; sparkData: any[]; isEmail?: boolean }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 flex flex-col hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className={`text-lg font-bold text-gray-900 dark:text-white mt-1 ${isEmail ? "break-all" : "truncate"}`}>
            {value}
          </p>
        </div>
      </div>

      <div className="h-16 -mx-6 -mb-6 mt-auto">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}