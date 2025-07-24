import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import Builder from "./pages/Builder";
import Profile from "./pages/Profile";
import FormWizard from "./pages/FormWizard";
import NotFound from "./pages/NotFound";
import AdminTemplates from "./pages/AdminTemplates";
import { DarkModeProvider } from "./hooks/useDarkMode";
import ProtectedRoute from "./components/ProtectedRoute";
import Analyzer from "./pages/Analyzer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DarkModeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/form-wizard" element={<FormWizard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-templates" element={<AdminTemplates />} />
              <Route path="/analyzer" element={<Analyzer />} />
          </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DarkModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
