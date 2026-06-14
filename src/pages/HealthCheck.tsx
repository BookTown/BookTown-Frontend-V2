import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Activity, Server, Database, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

interface ServiceStatus {
  status: string;
  services: {
    mysql: string;
    redis: string;
    mongodb: string;
  };
}

const HealthCheck: React.FC = () => {
  const [data, setData] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState<number>(0);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get('/health');
      setData(response.data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to fetch backend health status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchHealth();
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshCount]);

  const handleRefresh = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-purple-500 selection:text-white">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none animate-pulse delay-1000"></div>

      <div className="w-full max-w-xl z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            System Monitor
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-purple-400">
            BookTown V2 Health
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Real-time status check for database connections and API endpoints
          </p>
        </div>

        {/* Dashboard Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-6 shadow-2xl shadow-purple-950/20">
          <div className="flex items-center justify-between border-bottom border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <Server className="w-5 h-5 text-slate-400" />
              <span className="font-semibold text-slate-200">Backend API Gateway</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-50 transition-all duration-200 hover:rotate-180"
              title="Refresh Health Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-slate-500 text-sm animate-pulse">Querying core components...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 my-4">
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-200 text-sm">Connection Failed</h4>
                <p className="text-red-400/80 text-xs mt-1">{error}</p>
              </div>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Overall Status */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-sm text-slate-400 font-medium">Overall System Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  data.status === 'UP' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {data.status === 'UP' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  SYSTEM {data.status}
                </span>
              </div>

              {/* Service Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Connected Infrastructure</h3>
                
                {/* MySQL */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 transition-colors border border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <Database className="w-4.5 h-4.5 text-blue-400" />
                    <div>
                      <span className="text-sm font-semibold text-slate-300 block">MySQL Database</span>
                      <span className="text-[10px] text-slate-500">Relational & Metadata Storage</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    data.services.mysql === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {data.services.mysql === 'UP' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {/* MongoDB */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 transition-colors border border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <Database className="w-4.5 h-4.5 text-emerald-400" />
                    <div>
                      <span className="text-sm font-semibold text-slate-300 block">MongoDB</span>
                      <span className="text-[10px] text-slate-500">Unstructured Summary & Scene Store</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    data.services.mongodb === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {data.services.mongodb === 'UP' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {/* Redis */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/60 transition-colors border border-slate-800/40">
                  <div className="flex items-center gap-3">
                    <Database className="w-4.5 h-4.5 text-rose-500" />
                    <div>
                      <span className="text-sm font-semibold text-slate-300 block">Redis</span>
                      <span className="text-[10px] text-slate-500">In-Memory Cache & Session Store</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    data.services.redis === 'UP' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {data.services.redis === 'UP' ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

              </div>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-6">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
