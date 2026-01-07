import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios.ts";

interface Policy {
  id: number;
  title: string;
  categoryName: string;
}

interface ApiPolicy {
  id: number;
  title: string;
  category?: {
    name: string;
  };
}

interface PaginatedResponse {
  results?: ApiPolicy[];
}

export default function PoliciesTable() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didFetch = useRef(false);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiPolicy[] | PaginatedResponse>("/api/policies/");
      const data = res.data;

      const dataArray: ApiPolicy[] = Array.isArray(data) ? data : data.results ?? [];

      const trimmed: Policy[] = dataArray.map((p) => ({
        id: p.id,
        title: p.title,
        categoryName: p.category?.name ?? "-",
      }));

      setPolicies(trimmed);
    } catch (err: any) {
      if (err?.response) {
        setError(
          `HTTP ${err.response.status} - ${err.response.statusText || ""} - Check if /api/policies/ exists`
        );
      } else {
        setError(err?.message || "Failed to fetch policies");
      }
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!didFetch.current) {
      fetchPolicies();
      didFetch.current = true;
    }
  }, []);

  return (
    <div className="p-4">
      {error && <div className="mb-3 text-sm text-red-600">Error: {error}</div>}
      {loading && <div className="text-sm text-gray-600">Loading…</div>}
      {!loading && policies.length === 0 && !error && (
        <div className="text-sm text-gray-600">No policies found.</div>
      )}

      {policies.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr className="text-left">
                <th className="border-b py-2 px-3">ID</th>
                <th className="border-b py-2 px-3">Title</th>
                <th className="border-b py-2 px-3">Category</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className="odd:bg-white even:bg-gray-50">
                  <td className="py-2 px-3 align-top">{p.id}</td>
                  <td className="py-2 px-3 align-top">{p.title}</td>
                  <td className="py-2 px-3 align-top">{p.categoryName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
