import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AgentProvider } from './context/AgentContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AgentsPage } from './pages/AgentsPage';
import { ScenarioGeneratorPage } from './pages/ScenarioGeneratorPage';
import { FailureChainPage } from './pages/FailureChainPage';
import { TestExecutionPage } from './pages/TestExecutionPage';
import { FailureAnalysisPage } from './pages/FailureAnalysisPage';
import { ReportPage } from './pages/ReportPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
  return (
    <AgentProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Main App Layout with Aliased Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agents" element={<AgentsPage />} />
            <Route path="/scenarios" element={<ScenarioGeneratorPage />} />
            <Route path="/chains" element={<FailureChainPage />} />
            
            {/* Run / Execution Routes */}
            <Route path="/execute" element={<TestExecutionPage />} />
            <Route path="/run" element={<TestExecutionPage />} />

            {/* Failure Analysis & Autopsy Routes */}
            <Route path="/autopsy" element={<FailureAnalysisPage />} />
            <Route path="/analysis" element={<FailureAnalysisPage />} />
            <Route path="/failures" element={<FailureAnalysisPage />} />

            {/* Reports & History */}
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/reports/:id" element={<ReportPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AgentProvider>
  );
};

export default App;
