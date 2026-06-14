import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HealthCheck from '../pages/HealthCheck';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/health" element={<HealthCheck />} />
        {/* Redirect default root to health dashboard for Milestone 1 validation */}
        <Route path="/" element={<Navigate to="/health" replace />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/health" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
