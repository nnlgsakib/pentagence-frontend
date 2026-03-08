import { StatCard } from "@/components/StatCard";
import { StatusPill } from "@/components/StatusPill";
import { SeverityBadge } from "@/components/SeverityBadge";
import { mockSessions, mockFindings } from "@/lib/mock-data";
import { Play, AlertTriangle, Clock, Search, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AppDashboard() {
  const activeSessions = mockSessions.filter(s => s.status === "running" || s.status === "provisioning").length;
  const failedRecent = mockSessions.filter(s => s.status === "failed").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        <Button asChild size="sm">
          <Link to="/app/sessions/new"><Play className="mr-2 h-4 w-4" /> New Session</Link>
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Sessions" value={activeSessions} icon={Activity} change="+1 today" changeType="neutral" />
        <StatCard label="Total Findings" value={mockFindings.length} icon={Search} change="+2 this week" changeType="negative" />
        <StatCard label="Failed Runs (24h)" value={failedRecent} icon={AlertTriangle} change={failedRecent > 0 ? "Action needed" : "All clear"} changeType={failedRecent > 0 ? "negative" : "positive"} />
        <StatCard label="Avg. Duration" value="35m 16s" icon={Clock} change="-12% vs last week" changeType="positive" />
      </div>

      {/* Recent sessions */}
      <div className="rounded-xl border border-pen-border-soft bg-card">
        <div className="p-4 border-b border-pen-border-soft flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-foreground">Recent Sessions</h2>
          <Link to="/app/sessions" className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {mockSessions.slice(0, 4).map((session) => (
            <Link key={session.id} to={`/app/sessions/${session.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-pen-elevated/30 transition-colors">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{session.repo_ref}</p>
                <p className="text-xs text-pen-text-muted truncate">{session.target_url}</p>
              </div>
              <StatusPill status={session.status}>{session.status}</StatusPill>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent findings */}
      <div className="rounded-xl border border-pen-border-soft bg-card">
        <div className="p-4 border-b border-pen-border-soft flex items-center justify-between">
          <h2 className="font-heading text-sm font-semibold text-foreground">Recent Findings</h2>
          <Link to="/app/findings" className="text-xs text-pen-brand hover:text-pen-brand-hover">View all →</Link>
        </div>
        <div className="divide-y divide-pen-border-soft">
          {mockFindings.slice(0, 3).map((finding) => (
            <Link key={finding.id} to={`/app/findings/${finding.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-pen-elevated/30 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{finding.title}</p>
                <p className="text-xs text-pen-text-muted truncate">{finding.category}</p>
              </div>
              <SeverityBadge severity={finding.severity} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
