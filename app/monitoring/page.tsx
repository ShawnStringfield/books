"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { RefreshCw } from "lucide-react";

interface Metrics {
  totalRequests: number;
  limitExceeded: number;
  requestsByIP: Record<string, number>;
  lastReset: string;
  lastUpdate: number;
  rateLimitPercentage: number;
}

export default function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/monitoring/rate-limits");
      if (!response.ok) {
        throw new Error("Failed to fetch metrics");
      }
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial fetch only
  useEffect(() => {
    fetchMetrics();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        Error: {error}
        <Button onClick={fetchMetrics} variant="outline" className="ml-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">API Rate Limit Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(metrics.lastUpdate).toLocaleString()}
          </p>
        </div>
        <Button
          onClick={fetchMetrics}
          disabled={isRefreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            ⚠️ Running in development mode - metrics are stored in memory and
            will reset when the development server restarts
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Requests Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Requests
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            {metrics.totalRequests}
          </p>
          <p className="text-sm text-gray-500 mt-2">Since last reset</p>
        </div>

        {/* Rate Limited Requests Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Rate Limited
          </h2>
          <p className="text-4xl font-bold text-red-600">
            {metrics.limitExceeded}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {metrics.rateLimitPercentage.toFixed(2)}% of total
          </p>
        </div>

        {/* Last Reset Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Last Reset
          </h2>
          <p className="text-xl font-medium text-gray-900">
            {new Date(metrics.lastReset).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Resets daily</p>
        </div>
      </div>

      {/* Requests by IP */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Requests by IP</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Count
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(metrics.requestsByIP).map(([ip, count]) => (
                <tr key={ip}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
