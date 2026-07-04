import { PageTransition, staggerContainer, staggerItem } from "@/components/PageTransition";
import { AppLayout } from "@/components/AppLayout";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { format, parseISO } from "date-fns";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Analytics() {
  const { data: analytics, isLoading } = useGetAnalytics();

  if (isLoading || !analytics) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] lg:col-span-1 rounded-xl" />
            <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-md p-3 text-sm">
          <p className="font-semibold mb-2 text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">{entry.value}</span>
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into incident trends, categorization, and departmental performance.</p>
        </div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Trend */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Card className="hover-elevate shadow-sm">
              <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                <CardTitle className="text-lg">30-Day Trend</CardTitle>
                <CardDescription>Inflow vs Resolution volume over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.dailyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        tickFormatter={(val) => {
                          try { return format(parseISO(val), 'MMM d'); } catch { return val; }
                        }}
                        dy={10}
                      />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="count" name="New Incidents" stroke="hsl(var(--chart-4))" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                      <Area type="monotone" dataKey="resolved" name="Resolved" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={staggerItem}>
            <Card className="hover-elevate shadow-sm h-full">
              <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
                <CardDescription>Incidents organized by type</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-[300px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {analytics.categoryBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ward Breakdown */}
          <motion.div variants={staggerItem}>
            <Card className="hover-elevate shadow-sm h-full">
              <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                <CardTitle className="text-lg">Geospatial Distribution</CardTitle>
                <CardDescription>Incident volume by ward/district</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.wardBreakdown} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} width={80} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.5)' }} />
                      <Bar dataKey="value" name="Incidents" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                        {analytics.wardBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Performance Table */}
          <motion.div variants={staggerItem} className="lg:col-span-2">
            <Card className="shadow-sm overflow-hidden">
              <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
                <CardTitle className="text-lg">Department Performance</CardTitle>
                <CardDescription>Efficiency metrics across all municipal departments</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/30 text-muted-foreground uppercase text-xs">
                      <tr>
                        <th className="px-6 py-4 font-medium">Department</th>
                        <th className="px-6 py-4 font-medium text-center">Score</th>
                        <th className="px-6 py-4 font-medium text-right">Avg Resolution (hrs)</th>
                        <th className="px-6 py-4 font-medium text-right">Resolved</th>
                        <th className="px-6 py-4 font-medium text-right">Pending</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {analytics.departmentPerformance.map((dept, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-medium">{dept.department}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <div className="w-16 h-16 relative flex items-center justify-center">
                                <svg viewBox="0 0 36 36" className="w-12 h-12 text-muted/20">
                                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                </svg>
                                <svg viewBox="0 0 36 36" className="w-12 h-12 absolute inset-0 text-primary drop-shadow-sm -rotate-90">
                                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${dept.performanceScore}, 100`} />
                                </svg>
                                <span className="absolute text-xs font-bold">{dept.performanceScore}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-mono">{dept.avgResolutionTime.toFixed(1)}</td>
                          <td className="px-6 py-4 text-right text-emerald-600 font-medium">{dept.resolvedCount}</td>
                          <td className="px-6 py-4 text-right text-destructive font-medium">{dept.pendingCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </PageTransition>
    </AppLayout>
  );
}
