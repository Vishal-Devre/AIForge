import { useState, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  PlusCircle,
  LayoutTemplate,
  Rocket,
  Terminal,
  Users,
  Activity,
  Cpu,
  BarChart3,
  CreditCard,
  Sliders,
  User,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Zap,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";
import { sidebarItems } from "@/data/dummy";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/lib/ui/tooltip";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Bot,
  PlusCircle,
  LayoutTemplate,
  Rocket,
  Terminal,
  Users,
  Activity,
  Cpu,
  BarChart3,
  CreditCard,
  Sliders,
  User,
  Settings,
};

function SidebarTooltip({
  label,
  enabled,
  children,
}: {
  label: string;
  enabled: boolean;
  children: ReactNode;
}) {
  if (!enabled) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function Sidebar() {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = useRole();

  // ------------------------------------------------------------
  // RESPONSIVE BEHAVIOR
  // ------------------------------------------------------------

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 768;
      setIsMobile(nextIsMobile);
      if (!nextIsMobile) setMobileOpen(false);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const filteredItems = sidebarItems.filter((item) => {
    if (item.requireSuperuser && !isAdmin) return false;
    if (item.requireCustomerOnly && isAdmin) return false;

    return true;
  });

  const isCompact = !isMobile && desktopCollapsed;
  const isExpanded = !isCompact;
  const sidebarWidth = isMobile ? "w-60" : isExpanded ? "w-60" : "w-[68px]";

  // ------------------------------------------------------------
  // SIDEBAR CONTENT
  // ------------------------------------------------------------

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* ======================================================
          HEADER
          ====================================================== */}

      <div
        className={cn(
          "sidebar-header relative flex items-center",
          isCompact
            ? "sidebar-header--compact justify-center"
            : "sidebar-header--expanded justify-between",
        )}
      >
        {/* ====================================================
            COLLAPSED HEADER
            ==================================================== */}

        {isCompact ? (
          /* ==================================================
             COLLAPSED HEADER
             --------------------------------------------------
             A single real <button> is the dedicated hover
             target for the collapsed logo area. Hovering it
             ONLY cross-fades the logo out and reveals the
             expand icon (pure CSS opacity/visibility). The
             sidebar NEVER expands from hover — only a CLICK
             on this button calls setDesktopCollapsed(false).
             ================================================== */
          <button
            type="button"
            onClick={() => setDesktopCollapsed(false)}
            className="
              sidebar-logo-toggle
              group
              relative
              flex
              items-center
              justify-center
              h-10
              w-10
              rounded-lg
              cursor-pointer
              transition-all
              duration-200
              focus:outline-none
            "
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            {/* AIForge logo — fades out + shrinks while the button is hovered */}
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                transition-all
                duration-200
                ease-in-out
                group-hover:opacity-0
              "
              aria-hidden="true"
            >
              <div
                className="
                  sidebar-brand-mark
                  h-9
                  w-9
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  shrink-0
                  transition-all
                  duration-200
                  ease-in-out
                  group-hover:scale-90
                "
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  boxShadow: "var(--shadow-accent)",
                }}
              >
                <Zap className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Expand icon — revealed only while the button is hovered */}
            <PanelLeft
              className="
                h-5
                w-5
                text-tertiary
                opacity-0
                group-hover:opacity-100
                group-hover:text-primary
                transition-all
                duration-200
                ease-in-out
              "
              aria-hidden="true"
            />
          </button>
        ) : (
          /* ==================================================
             EXPANDED HEADER
             ================================================== */

          <>
            {/* AIForge Branding */}
            <button
              type="button"
              onClick={() => handleNavigate("/")}
              className="
                sidebar-brand
                flex
                items-center
                gap-3
                min-w-0
                cursor-pointer
                bg-transparent
                border-0
                p-0
                text-left
                focus:outline-none
              "
              aria-label="AIForge home"
            >
              <div
                className="
                  sidebar-brand-mark
                  h-9
                  w-9
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  shrink-0
                  transition-transform
                  duration-300
                  hover:scale-105
                "
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                  boxShadow: "var(--shadow-accent)",
                }}
              >
                <Zap className="h-4.5 w-4.5" />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="sidebar-brand-name text-sm font-bold tracking-tight">
                  AIForge
                </span>

                <span className="sidebar-brand-subtitle text-[10px] font-medium">
                  AI Platform
                </span>
              </div>
            </button>

            {/* Collapse Button */}
            <button
              type="button"
              onClick={() =>
                isMobile ? setMobileOpen(false) : setDesktopCollapsed(true)
              }
              className="
                sidebar-collapse-button
                flex
                items-center
                justify-center
                h-10
                w-10
                rounded-lg
                transition-all
                duration-200
                cursor-pointer
                focus:outline-none
              "
              title={isMobile ? "Close navigation" : "Collapse sidebar"}
              aria-label={isMobile ? "Close navigation" : "Collapse sidebar"}
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* ======================================================
          NAVIGATION
          ====================================================== */}

      <nav
        className="flex-1 py-2 px-3 overflow-y-auto space-y-0.5"
        aria-label="Primary navigation"
      >
        {filteredItems
          .filter(
            (item) =>
              item.label !== "Platform Settings" &&
              item.label !== "Account settings",
          )
          .map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const active = isActive(item.path);

            return (
              <SidebarTooltip
                key={item.path}
                label={item.label}
                enabled={isCompact}
              >
                <button
                  type="button"
                  onClick={() => handleNavigate(item.path)}
                  className={cn(
                    `
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      cursor-pointer
                    `,
                    !isExpanded && "justify-center px-2",
                    active ? "sidebar-btn-active" : "sidebar-btn-default",
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0 sidebar-icon" />
                  {isExpanded && <span className="truncate">{item.label}</span>}
                </button>
              </SidebarTooltip>
            );
          })}
      </nav>

      {/* ======================================================
          BOTTOM SECTION
          ====================================================== */}

      <div
        className={cn(
          "px-3 pb-3 pt-2 space-y-0.5",
          "sidebar-footer",
          isCompact && "px-2",
        )}
      >
        {filteredItems.find((i) => i.label === "Platform Settings") && (
          <SidebarTooltip label="Platform Settings" enabled={isCompact}>
            <button
              type="button"
              onClick={() => handleNavigate("/settings")}
              className={cn(
                `
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 cursor-pointer
                `,
                !isExpanded && "justify-center px-2",
                isActive("/settings")
                  ? "sidebar-btn-active"
                  : "sidebar-btn-default",
              )}
            >
              <Sliders className="h-4.5 w-4.5 shrink-0 sidebar-icon" />
              {isExpanded && <span>Platform Settings</span>}
            </button>
          </SidebarTooltip>
        )}

        {isAuthenticated && user ? (
          <>
            <SidebarTooltip label="Account settings" enabled={isCompact}>
              <button
                type="button"
                onClick={() => handleNavigate("/account")}
                className={cn(
                  `
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 cursor-pointer
                `,
                  !isExpanded && "justify-center px-2",
                  isActive("/account")
                    ? "sidebar-btn-active"
                    : "sidebar-btn-default",
                )}
              >
                <Settings className="h-4.5 w-4.5 shrink-0 sidebar-icon" />
                {isExpanded && <span>Account settings</span>}
              </button>
            </SidebarTooltip>
            <SidebarTooltip label="Profile" enabled={isCompact}>
              <button
                type="button"
                onClick={() => handleNavigate("/profile")}
                className={cn(
                  `
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                duration-200
                group
                relative
                cursor-pointer
              `,
                  !isExpanded && "justify-center px-2",
                  isActive("/profile")
                    ? "sidebar-btn-active"
                    : "sidebar-btn-default",
                )}
              >
                {/* Avatar */}
                <div
                  className="
                sidebar-avatar
                h-10
                w-10
                rounded-full
                flex
                items-center
                justify-center
                text-xs
                font-bold
                shrink-0
                overflow-hidden
              "
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="
                    h-full
                    w-full
                    object-cover
                  "
                    />
                  ) : user.full_name ? (
                    user.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  ) : (
                    "U"
                  )}
                </div>

                {isExpanded && (
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={cn(
                        `
                      text-sm
                      font-medium
                      truncate
                    `,
                        "sidebar-profile-name",
                      )}
                    >
                      {user.full_name}
                    </p>

                    <p
                      className={cn(
                        `
                      text-[10px]
                      truncate
                    `,
                        "sidebar-profile-email",
                      )}
                    >
                      {user.email}
                    </p>
                  </div>
                )}
              </button>
            </SidebarTooltip>
          </>
        ) : (
          /* ==================================================
             SIGN IN
             ================================================== */

          <SidebarTooltip label="Sign in" enabled={isCompact}>
            <button
              type="button"
              onClick={() => handleNavigate("/login")}
              className={cn(
                `
                w-full
                flex
                items-center
                gap-3
                px-3
                py-2.5
                rounded-xl
                text-sm
                font-medium
                transition-all
                cursor-pointer
              `,
                isCompact && "justify-center px-2",
                "sidebar-btn-default",
              )}
            >
              <div
                className={cn(
                  `
                  h-8
                  w-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                `,
                  "sidebar-sign-in-icon",
                )}
              >
                <LogIn className={cn("h-4 w-4", "sidebar-icon")} />
              </div>

              {isExpanded && <span>Sign in</span>}
            </button>
          </SidebarTooltip>
        )}
      </div>
    </div>
  );

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------

  return (
    <>
      {/* ======================================================
          MOBILE OVERLAY
          ====================================================== */}

      {mobileOpen && (
        <div
          className="
            sidebar-mobile-overlay
            fixed
            inset-0
            z-40
            backdrop-blur-sm
            md:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ======================================================
          MOBILE HAMBURGER
          ====================================================== */}

      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        className="
          sidebar-mobile-toggle
          fixed
          top-2.5
          left-4
          z-50
          md:hidden
          h-8
          w-8
          rounded-lg
          border
          flex
          items-center
          justify-center
          shadow-xl
          cursor-pointer
          focus:outline-none
        "
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
      >
        {mobileOpen ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeft className="h-4 w-4" />
        )}
      </button>

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <aside
        className={cn(
          `
            fixed
            top-3
            bottom-3
            left-3
            z-40
            rounded-2xl
            border
            border-[var(--border-secondary)]
            shadow-sm
            flex
            flex-col
            transition-all
            duration-200
            ease-in-out
            overflow-hidden
          `,
          "sidebar-surface",
          "shrink-0",
          sidebarWidth,
          "md:static md:my-3 md:ml-3 md:mr-4",
          mobileOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-[110%] md:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
