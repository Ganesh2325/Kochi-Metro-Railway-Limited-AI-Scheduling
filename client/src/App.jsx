import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { MetroProvider } from "./context/MetroContext.jsx";

import Sidebar from "./components/common/Sidebar.jsx";
import Header from "./components/common/Header.jsx";

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LiveMap from "./components/dashboard/LiveMap.jsx";
import ScheduleManager from "./pages/ScheduleManager.jsx";
import FleetStatus from "./pages/FleetStatus.jsx";
import Analytics from "./pages/Analytics.jsx";
import BookTrain from "./pages/BookTrain.jsx";

import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// Layout wrapper: hides sidebar + header on login/signup
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {!hideLayout && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {!hideLayout && <Header />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <MetroProvider>
      <Router>
        <LayoutWrapper>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/live-map"
              element={
                <ProtectedRoute>
                  <LiveMap />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule-manager"
              element={
                <ProtectedRoute>
                  <ScheduleManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/fleet-status"
              element={
                <ProtectedRoute>
                  <FleetStatus />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book-train"
              element={
                <ProtectedRoute>
                  <BookTrain />
                </ProtectedRoute>
              }
            />

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/signup" replace />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </MetroProvider>
  );
};

export default App;
