import { PageTransition, staggerContainer, staggerItem } from "@/components/PageTransition";
import { AppLayout } from "@/components/AppLayout";
import { useGetDashboard } from "@workspace/api-client-react";
import { CountUp } from "@/components/CountUp";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, Clock, FileText, Activity, Layers, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useGetDashboard();

  if (isLoading || !dashboardData) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
          
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  const {
    totalComplaints,
    criticalIssues,
    resolvedIssues,
    pendingIssues,
    avgResponseTime,
    todayComplaints,
    weeklyTrend,
    departmentWorkload,
    priorityBreakdown,
    recentComplaints
  } = dashboardData;

  const priorityData = [
    { name: 'Critical', value: priorityBreakdown.critical, color: 'hsl(var(--destructive))' },
    { name: 'High', value: priorityBreakdown.high, color: 'hsl(var(--chart-4))' },
    { name: 'Medium', value: priorityBreakdown.medium, color: 'hsl(var(--chart-2))' },
    { name: 'Low', value: priorityBreakdown.low, color: 'hsl(var(--chart-3))' },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-md p-3 text-sm">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AppLayout>
      <PageTransition className="space-y-8 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of municipal operations and incident tracking.</p>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          {/* Stat Cards */}
          <motion.div variants={staggerItem}>
            <Card className="hover-elevate">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  {weeklyTrend > 0 ? (
                    <div className="flex items-center text-xs font-medium text-destructive">
                      <ArrowUpRight className="h-3 w-3 mr-1" /> +{weeklyTrend}%
                    </div>
                  ) : (
                    <div className="flex items-center text-xs font-medium text-emerald-500">
                      <ArrowDownRight className="h-3 w-3 mr-1" /> {weeklyTrend}%
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Incidents</p>
                  <h3 className="text-2xl font-bold tracking-tight">
                    <CountUp to={totalComplaints} />
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="hover-elevate">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 w-8 rounded bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Critical Issues</p>
                  <h3 className="text-2xl font-bold tracking-tight text-destructive">
                    <CountUp to={criticalIssues} />
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="hover-elevate">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 w-8 rounded bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Resolved</p>
                  <h3 className="text-2xl font-bold tracking-tight">
                    <CountUp to={resolvedIssues} />
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="hover-elevate">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 w-8 rounded bg-amber-500/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-amber-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pending</p>
                  <h3 className="text-2xl font-bold tracking-tight">
                    <CountUp to={pendingIssues} />
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="hover-elevate">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 w-8 rounded bg-blue-500/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Avg Response</p>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {avgResponseTime}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Card className="hover-elevate bg-primary text-primary-foreground border-transparent">
              <CardContent className="p-5 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center">
                    <Layers className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-foreground/80 mb-1">Today's Inflow</p>
                  <h3 className="text-2xl font-bold tracking-tight">
                    <CountUp to={todayComplaints} />
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-1 lg:col-span-2 overflow-hidden shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="text-lg">Department Workload</CardTitle>
              <CardDescription>Pending vs Resolved issues across municipal departments</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pl-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentWorkload} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="department" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.5)' }} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                    <Bar dataKey="pending" name="Pending" stackId="a" fill="hsl(var(--chart-4))" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="resolved" name="Resolved" stackId="a" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="text-lg">Priority Distribution</CardTitle>
              <CardDescription>Current open issues by severity</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                  <span className="text-3xl font-bold">{pendingIssues}</span>
                  <span className="text-xs text-muted-foreground">Open</span>
                </div>
              </div>
              <div className="w-full mt-4 space-y-2">
                {priorityData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Incidents</CardTitle>
              <CardDescription>Latest complaints requiring attention</CardDescription>
            </div>
            <Link href="/complaints">
              <Button variant="outline" size="sm" className="hidden sm:flex">View All</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Department</th>
                    <th className="px-6 py-4 font-medium">Priority</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentComplaints.slice(0, 5).map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-muted-foreground">#{complaint.id}</td>
                      <td className="px-6 py-4 font-medium max-w-[300px] truncate" title={complaint.title}>{complaint.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{complaint.department || "Unassigned"}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          complaint.priority === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          complaint.priority === 'high' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                          complaint.priority === 'medium' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                          'bg-muted text-muted-foreground'
                        }>
                          {complaint.priority || 'Unassigned'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className={
                          complaint.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600' :
                          complaint.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                          ''
                        }>
                          {complaint.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                      </td>
                    </tr>
                  ))}
                  {recentComplaints.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No recent incidents found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border flex justify-center sm:hidden">
               <Link href="/complaints">
                <Button variant="outline" className="w-full">View All Incidents</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </PageTransition>
    </AppLayout>
  );
}
