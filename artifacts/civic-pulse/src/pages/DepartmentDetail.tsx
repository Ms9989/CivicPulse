import { PageTransition } from "@/components/PageTransition";
import { AppLayout } from "@/components/AppLayout";
import { useGetDepartment } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Users, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Link, useParams } from "wouter";
import { format } from "date-fns";

export default function DepartmentDetail() {
  const params = useParams();
  const departmentId = parseInt(params.id || "0", 10);

  const { data: department, isLoading } = useGetDepartment(departmentId, {
    query: {
      enabled: !!departmentId,
      queryKey: ["getDepartment", departmentId],
    }
  });

  if (isLoading || !department) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[400px] lg:col-span-2 rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition className="space-y-8 pb-8">
        <div>
          <Link href="/departments" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Departments
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-muted px-2 py-1 rounded text-sm font-mono font-medium text-muted-foreground">
              {department.code}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{department.name}</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl">{department.description || "No description provided."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover-elevate shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-muted-foreground mb-2 font-medium">
                <Users className="h-5 w-5" /> Headcount
              </div>
              <p className="text-3xl font-bold">{department.headCount}</p>
            </CardContent>
          </Card>
          
          <Card className="hover-elevate shadow-sm border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-destructive mb-2 font-medium">
                <AlertCircle className="h-5 w-5" /> Pending Issues
              </div>
              <p className="text-3xl font-bold text-destructive">{department.pendingCount}</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate shadow-sm border-emerald-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-emerald-600 mb-2 font-medium">
                <CheckCircle2 className="h-5 w-5" /> Resolved
              </div>
              <p className="text-3xl font-bold text-emerald-600">{department.resolvedCount}</p>
            </CardContent>
          </Card>

          <Card className="hover-elevate shadow-sm border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-primary mb-2 font-medium">
                <Clock className="h-5 w-5" /> Resolved This Week
              </div>
              <p className="text-3xl font-bold text-primary">{department.weeklyResolved}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Assigned Complaints</CardTitle>
                <CardDescription>Latest issues routed to this department</CardDescription>
              </div>
              <Link href={`/complaints?department=${department.name}`}>
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/30 text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium">ID</th>
                      <th className="px-6 py-4 font-medium">Title</th>
                      <th className="px-6 py-4 font-medium">Priority</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {department.recentComplaints?.map((complaint) => (
                      <tr key={complaint.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 font-mono text-muted-foreground">#{complaint.id}</td>
                        <td className="px-6 py-4 font-medium max-w-[200px] truncate">{complaint.title}</td>
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
                    {(!department.recentComplaints || department.recentComplaints.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                          No recent complaints found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
              <CardTitle className="text-lg">Performance Score</CardTitle>
              <CardDescription>Overall department efficiency</CardDescription>
            </CardHeader>
            <CardContent className="pt-10 flex flex-col items-center justify-center">
              <div className="w-48 h-48 relative flex items-center justify-center mb-6">
                <svg viewBox="0 0 36 36" className="w-full h-full text-muted/20">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
                <svg viewBox="0 0 36 36" className={
                  `w-full h-full absolute inset-0 drop-shadow-sm -rotate-90 transition-all duration-1000 ease-out ${
                    department.performanceScore >= 80 ? 'text-emerald-500' :
                    department.performanceScore >= 60 ? 'text-amber-500' : 'text-destructive'
                  }`
                }>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${department.performanceScore}, 100`} />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold tracking-tighter">{department.performanceScore}</span>
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">Score</span>
                </div>
              </div>
              <p className="text-center text-muted-foreground max-w-[250px]">
                Based on average resolution time, backlog size, and priority handling over the last 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
