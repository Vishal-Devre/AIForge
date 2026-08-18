import { useState, useEffect } from "react";
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
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRole } from "@/hooks/useRole";
import { sidebarItems } from "@/data/dummy";

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

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useRole();

  // ------------------------------------------------------------
  // RESPONSIVE BEHAVIOR
  // ------------------------------------------------------------

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile sidebar when navigating
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // ------------------------------------------------------------
  // HELPERS
  // ------------------------------------------------------------

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const filteredItems = sidebarItems.filter((item) => {
    if (item.requireSuperuser && !isAdmin) return false;
    if (item.requireCustomerOnly && isAdmin) return false;

    return true;
  });

  const isExpanded = !collapsed;

  const sidebarWidth = isExpanded ? "w-60" : "w-[68px]";

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
          "relative flex items-center h-[73px] border-b border-[var(--border-primary)]",
          collapsed ? "justify-center px-3" : "justify-between px-4",
        )}
      >
        {/* ====================================================
            COLLAPSED HEADER
            ==================================================== */}

        {collapsed ? (
          /* ==================================================
             COLLAPSED HEADER
             --------------------------------------------------
             A single real <button> is the dedicated hover
             target for the collapsed logo area. Hovering it
             ONLY cross-fades the logo out and reveals the
             expand icon (pure CSS opacity/visibility). The
             sidebar NEVER expands from hover — only a CLICK
             on this button calls setCollapsed(false).
             ================================================== */
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="
              group
              relative
              flex
              items-center
              justify-center
              h-11
              w-11
              rounded-lg
              cursor-pointer
              transition-colors
              duration-200
              hover:bg-surface-800
              focus:outline-none
              focus-visible:ring-2
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
                  h-9
                  w-9
                  p-2
                  rounded-lg
                  bg-gradient-to-br
                  from-primary-500
                  to-primary-700
                  flex
                  items-center
                  justify-center
                  shadow-accent
                  shrink-0
                  transition-all
                  duration-200
                  ease-in-out
                  group-hover:scale-90
                "
              >
                <Zap
                  className="
                    h-4
                    w-4
                    text-primary
                  "
                />
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
              onClick={() => navigate("/")}
              className="
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
                  h-9
                  w-9
                  p-2
                  rounded-lg
                  bg-gradient-to-br
                  from-primary-500
                  to-primary-700
                  flex
                  items-center
                  justify-center
                  shadow-accent
                  shrink-0
                  transition-transform
                  duration-200
                  hover:scale-105
                "
              >
                <Zap
                  className="
                    h-4
                    w-4
                    text-primary
                  "
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className="
                    text-sm
                    font-bold
                    text-[var(--text-primary)]
                    tracking-tight
                  "
                >
                  AIForge
                </span>

                <span
                  className="
                    text-[10px]
                    text-[var(--text-tertiary)]
                    font-medium
                  "
                >
                  AI Platform
                </span>
              </div>
            </button>

            {/* Collapse Button */}
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="
                flex
                items-center
                justify-center
                h-8
                w-8
                rounded-lg
                text-[var(--text-tertiary)]
                hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-tertiary)]
                transition-all
                duration-200
                cursor-pointer
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[var(--accent)]
              "
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* ======================================================
          NAVIGATION
          ====================================================== */}

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;

          const active = isActive(item.path);

          const showDivider = item.dividerAfter && isAdmin;

          return (
            <div key={item.path}>
              <button
                type="button"
                onClick={() => navigate(item.path)}
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
                    border
                    cursor-pointer
                  `,

                  !isExpanded && "justify-center px-2",

                  theme === "dark"
                    ? active
                      ? "sidebar-btn-active"
                      : "sidebar-btn-default"
                    : active
                      ? `
                        text-[var(--text-primary)]
                        bg-[var(--accent-light)]
                        border-[var(--border-accent)]
                      `
                      : `
                        text-[var(--text-tertiary)]
                        hover:text-[var(--text-primary)]
                        hover:bg-[var(--bg-tertiary)]
                        border-transparent
                      `,
                )}
                title={!isExpanded ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    `
                      h-4.5
                      w-4.5
                      shrink-0
                      transition-colors
                      sidebar-icon
                    `,

                    theme !== "dark" &&
                      (active
                        ? "text-[var(--accent)]"
                        : `
                            text-[var(--text-tertiary)]
                            group-hover:text-[var(--text-secondary)]
                          `),
                  )}
                />

                {isExpanded && <span className="truncate">{item.label}</span>}

                {active && theme !== "dark" && isExpanded && (
                  <span
                    className="
                        absolute
                        left-0
                        top-1/2
                        -translate-y-1/2
                        w-0.5
                        h-5
                        rounded-full
                        bg-[var(--accent)]
                        shadow-sm
                        shadow-[var(--accent-medium)]
                      "
                  />
                )}
              </button>

              {showDivider && (
                <div className="my-2.5 px-2">
                  <div
                    className="
                      border-t
                      border-[var(--border-primary)]
                      opacity-50
                    "
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ======================================================
          BOTTOM SECTION
          ====================================================== */}

      <div
        className={cn(
          `
            px-3
            py-3
            border-t
            space-y-1
          `,

          theme === "dark"
            ? "sidebar-dark-border"
            : "border-[var(--border-primary)]",

          collapsed && "px-2",
        )}
      >
        {/* ====================================================
            THEME TOGGLE
            ==================================================== */}

        <button
          type="button"
          onClick={toggleTheme}
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
              duration-150
              cursor-pointer
            `,

            collapsed && "justify-center px-2",

            theme === "dark"
              ? `
                text-[#7A7A80]
                hover:text-white
                hover:bg-[#1B1B20]
              `
              : `
                text-[var(--text-tertiary)]
                hover:text-[var(--text-primary)]
                hover:bg-[var(--bg-tertiary)]
              `,
          )}
          title={
            !isExpanded
              ? theme === "dark"
                ? "Light Mode"
                : "Dark Mode"
              : undefined
          }
        >
          {theme === "dark" ? (
            <Sun
              className="
                h-4.5
                w-4.5
                shrink-0
              "
            />
          ) : (
            <Moon
              className="
                h-4.5
                w-4.5
                shrink-0
                text-[var(--info)]
              "
            />
          )}

          {isExpanded && (
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>

        {/* ====================================================
            USER PROFILE
            ==================================================== */}

        {isAuthenticated && user ? (
          <button
            type="button"
            onClick={() => navigate("/profile")}
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
                border
                cursor-pointer
              `,

              !isExpanded && "justify-center px-2",

              theme === "dark"
                ? "sidebar-btn-default"
                : `
                  text-[var(--text-tertiary)]
                  hover:text-[var(--text-primary)]
                  hover:bg-[var(--bg-tertiary)]
                  border-transparent
                `,
            )}
            title={!isExpanded ? user.full_name : undefined}
          >
            {/* Avatar */}
            <div
              className="
                h-8
                w-8
                rounded-full
                bg-gradient-to-br
                from-[var(--accent)]
                to-[var(--accent-hover)]
                flex
                items-center
                justify-center
                text-xs
                font-bold
                text-[var(--text-on-accent)]
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
                    theme === "dark"
                      ? "text-white"
                      : "text-[var(--text-primary)]",
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
                    theme === "dark"
                      ? "text-[#7A7A80]"
                      : "text-[var(--text-tertiary)]",
                  )}
                >
                  {user.email}
                </p>
              </div>
            )}
          </button>
        ) : (
          /* ==================================================
             SIGN IN
             ================================================== */

          <button
            type="button"
            onClick={() => navigate("/login")}
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
                border
                cursor-pointer
              `,

              collapsed && "justify-center px-2",

              theme === "dark"
                ? `
                  text-[#7A7A80]
                  hover:text-white
                  hover:bg-[#1B1B20]
                  border-transparent
                `
                : `
                  text-[var(--text-tertiary)]
                  hover:text-[var(--text-primary)]
                  hover:bg-[var(--bg-tertiary)]
                  border-transparent
                `,
            )}
            title={!isExpanded ? "Sign in" : undefined}
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
                  border
                `,

                theme === "dark"
                  ? `
                    bg-[#1B1B20]
                    border-[#3A3A40]
                  `
                  : `
                    bg-[var(--bg-tertiary)]
                    border-[var(--border-primary)]
                  `,
              )}
            >
              <LogIn
                className={cn(
                  "h-4 w-4",
                  theme === "dark" ? "sidebar-icon" : "",
                )}
              />
            </div>

            {isExpanded && <span>Sign in</span>}
          </button>
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
            fixed
            inset-0
            z-40
            bg-[var(--surface-overlay)]
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
          fixed
          top-2.5
          left-4
          z-50
          md:hidden
          h-8
          w-8
          rounded-lg
          bg-[var(--bg-secondary)]
          border
          border-[var(--border-primary)]
          flex
          items-center
          justify-center
          text-[var(--text-primary)]
          shadow-xl
          cursor-pointer
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--accent)]
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
            top-0
            left-0
            z-40
            h-screen
            backdrop-blur-xl
            border-r
            flex
            flex-col
            transition-all
            duration-200
            ease-in-out
          `,

          theme === "dark"
            ? `
              sidebar-dark-bg
              sidebar-dark-border
            `
            : `
              bg-[var(--bg-primary)]
              border-[var(--border-primary)]
            `,

          sidebarWidth,

          "md:relative",

          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
