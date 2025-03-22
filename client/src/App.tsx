import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import RiasecResults from "@/pages/RiasecResults";
import AptitudeResults from "@/pages/AptitudeResults";
import OceanResults from "@/pages/OceanResults";
import CareerResults from "@/pages/CareerResults";
import AuthPage from "@/pages/AuthPage";
import CompleteProfilePage from "@/pages/CompleteProfilePage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/complete-profile" component={CompleteProfilePage} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/results/riasec" component={RiasecResults} />
          <ProtectedRoute path="/results/aptitude" component={AptitudeResults} />
          <ProtectedRoute path="/results/ocean" component={OceanResults} />
          <ProtectedRoute path="/results/careers" component={CareerResults} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
