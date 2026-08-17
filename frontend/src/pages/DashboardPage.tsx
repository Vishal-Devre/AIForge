import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Cpu,
  Bot,
  Rocket,
  ChevronRight,
  Terminal,
  GitBranch,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/lib/ui/card";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { agentsApi } from "@/lib/api";
import type { Agent } from "@/types";

function DashboardPage() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentsApi
      .getMyAgents(0, 100)
      .then((res) => setAgents(res?.items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const agentCount = agents.length;
  const hasAgents = agentCount > 0;

  const statusColor: Record<string, string> = {
    DEPLOYED: "success",
    READY: "info",
    DRAFT: "default",
    ARCHIVED: "error",
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your AI infrastructure at a glance"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <StatCard
            title="Agents"
            value={loading ? "—" : agentCount}
            icon={<Bot className="h-5 w-5" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Deployments"
            value={0}
            icon={<Rocket className="h-5 w-5" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            title="GPU Nodes"
            value={0}
            icon={<Cpu className="h-5 w-5" />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Uptime"
            value="—"
            icon={<Activity className="h-5 w-5" />}
          />
        </motion.div>
      </div>

      {!hasAgents && !loading ? (
        /* Welcome State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-dashed border-[var(--border-primary)]">
            <CardContent className="py-16">
              <div className="flex flex-col items-center text-center max-w-lg mx-auto">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[var(--accent-light)] to-[var(--accent-medium)] border border-[var(--border-accent)] flex items-center justify-center mb-6">
                  <Sparkles className="h-7 w-7 text-[var(--accent)]" />
                </div>
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  Welcome to AIForge
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
                  Your unified AI infrastructure platform. Deploy agents, manage
                  GPU clusters, and monitor everything from one place. Get
                  started by creating your first resource.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button onClick={() => navigate("/create-agent")}>
                    <Bot className="h-4 w-4" /> Create Agent
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/deployments")}
                  >
                    <GitBranch className="h-4 w-4" /> Deploy from Git
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Data view — shows when there's actual data */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Agents</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => navigate("/agents")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-14 rounded-lg bg-[var(--bg-muted)] animate-pulse"
                      />
                    ))}
                  </div>
                ) : agents.length === 0 ? (
                  <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">
                    No agents yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {agents.slice(0, 5).map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-primary)] cursor-pointer hover:border-[var(--border-accent)] transition-colors"
                        onClick={() => navigate(`/agents/${agent.id}`)}
                      >
                        <div className="h-9 w-9 rounded-lg bg-[var(--accent-light)] border border-[var(--border-accent)] flex items-center justify-center">
                          <Bot className="h-4.5 w-4.5 text-[var(--accent)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {agent.name}
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)]">
                            {agent.model}
                          </p>
                        </div>
                        <Badge
                          variant={(statusColor[agent.status] || "default") as any}
                          size="sm"
                        >
                          {agent.status.toLowerCase()}
                        </Badge>
                      </div>
                    ))}
                    {agents.length > 5 && (
                      <button
                        onClick={() => navigate("/agents")}
                        className="w-full text-center text-xs text-[var(--accent)] hover:underline py-1 cursor-pointer"
                      >
                        View all {agents.length} agents
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Deployments</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => navigate("/deployments")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text-tertiary)] py-4 text-center">
                  No deployments yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Quick Actions — always visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common operations to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  icon: Bot,
                  label: "Create Agent",
                  desc: "Deploy a new AI agent",
                  path: "/create-agent",
                  color: "text-[var(--accent)]",
                },
                {
                  icon: Cpu,
                  label: "Provision GPU",
                  desc: "Allocate GPU instance",
                  path: "/gpu",
                  color: "text-[var(--success)]",
                },
                {
                  icon: Terminal,
                  label: "Open Sandbox",
                  desc: "Start a sandbox session",
                  path: "/sandbox",
                  color: "text-[var(--warning)]",
                },
                {
                  icon: GitBranch,
                  label: "Deploy from Git",
                  desc: "Connect & deploy repo",
                  path: "/deployments",
                  color: "text-[var(--info)]",
                },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] hover:bg-[var(--bg-tertiary)] transition-all duration-200 group text-center cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-primary)] flex items-center justify-center group-hover:border-[var(--border-accent)] group-hover:bg-[var(--accent-light)] transition-all">
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {action.label}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)] hidden sm:block">
                      {action.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export { DashboardPage };
