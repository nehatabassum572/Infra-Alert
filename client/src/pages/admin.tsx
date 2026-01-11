import { useStats, useIssues } from "@/hooks/use-issues";
import { LayoutShell } from "@/components/layout-shell";
import { IssueCard } from "@/components/issue-card";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Clock, Loader2, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type Issue } from "@shared/schema";
import { Label } from "@/components/ui/label";

export default function AdminPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: stats, isLoading: isStatsLoading } = useStats();
  const { issues, isLoading: isIssuesLoading, updateIssue } = useIssues();
  const [managingIssue, setManagingIssue] = useState<Issue | null>(null);

  if (isAuthLoading) return null;
  if (!user || user.role !== "admin") return <Redirect to="/dashboard" />;

  const isLoading = isStatsLoading || isIssuesLoading;

  const chartData = stats ? [
    { name: 'Pending', value: stats.pending, color: '#F59E0B' }, // amber-500
    { name: 'In Progress', value: stats.in_progress, color: '#3B82F6' }, // blue-500
    { name: 'Resolved', value: stats.resolved, color: '#22C55E' }, // green-500
  ] : [];

  return (
    <LayoutShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground mt-1">Overview of system status and issue management.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>
      ) : (
        <div className="space-y-8 animate-enter">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <p className="text-xs text-muted-foreground">+20% from last month</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pending || 0}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.in_progress || 0}</div>
                <p className="text-xs text-muted-foreground">Currently being fixed</p>
              </CardContent>
            </Card>
            <Card className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.resolved || 0}</div>
                <p className="text-xs text-muted-foreground">Success rate 94%</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart */}
            <Card className="lg:col-span-1 border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle>Issue Status Distribution</CardTitle>
                <CardDescription>Overview of current workload</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Issues List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold tracking-tight">All Reports</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {issues?.map((issue) => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue}
                    onEdit={(issue) => setManagingIssue(issue)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Management Dialog */}
      <Dialog open={!!managingIssue} onOpenChange={(open) => !open && setManagingIssue(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Issue Status</DialogTitle>
          </DialogHeader>
          {managingIssue && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select
                  defaultValue={managingIssue.status}
                  onValueChange={(value) => 
                    updateIssue.mutate(
                      { id: managingIssue.id, status: value as any },
                      { onSuccess: () => setManagingIssue(null) }
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                Changing status will notify the reporting citizen immediately.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </LayoutShell>
  );
}
