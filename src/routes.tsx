import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Skeleton } from './components/ui/Skeleton';

const Landing = lazy(() => import('./pages/Landing'));
const Wizard = lazy(() => import('./pages/Wizard'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Print = lazy(() => import('./pages/Print'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F7F5FF] flex items-center justify-center p-6">
      <div className="space-y-4 w-full max-w-md">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/print" element={<Print />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
