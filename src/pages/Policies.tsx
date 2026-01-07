// src/pages/Policies.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import PoliciesTable from "../components/PoliciesTable.tsx";

export default function Policies() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Policies</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>

        <PoliciesTable />
      </div>
    </div>
  );
}