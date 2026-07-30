import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/lib/ui/button";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/agents": "Agents",
  "/my-agents": "My Agents",
  "/create-agent": "Create Agent",
  "/templates": "Templates",
  "/gpu": "GPU Platform",
  "/sandbox": "AI Sandbox",
  "/deployments": "Deployment Engine",
  "/my-deployments": "Deployments",
  "/monitoring": "Monitoring",
  "/users": "Users",
  "/analytics": "Analytics",
  "/billing-management": "Billing Management",
  "/settings": "Platform Settings",
  "/account": "Account Settings",
  "/profile": "Profile",
  "/billing": "Billing",
  "/login": "Login",
  "/register": "Register",
};

export function TopNavbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = pageNames[location.pathname] || "Page";

  return (
    <header className="sticky top-0 z-30 h-12 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Breadcrumb */}
        <div className="flex items-center gap-2 text-sm min-w-0">
          <button
            onClick={() => navigate("/")}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors font-medium shrink-0 cursor-pointer"
          >
            AIForge
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-[var(--text-tertiary)] shrink-0" />
          <span className="text-[var(--text-primary)] font-medium truncate">
            {currentPage}
          </span>
        </div>

        {/* Right: Login button only */}
        <div className="flex items-center gap-2 shrink-0">
          {!isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/login")}
              className="h-8 text-xs"
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
