import { PageTransition } from "@/components/PageTransition";
import { AppLayout } from "@/components/AppLayout";
import { useListComplaints, useUpdateComplaint, useDeleteComplaint, useAnalyzeComplaint } from "@workspace/api-client-react";
import { getListComplaintsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { format } from "date-fns";
import { Search, Plus, Sparkles, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}


export default function Complaints() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [page, setPage] = useState(1);
  const limit = 15;

  const debouncedSearch = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isLoading } = useListComplaints({
    search: debouncedSearch || undefined,
    status: status !== "all" ? status : undefined,
    priority: priority !== "all" ? priority : undefined,
    page,
    limit,
  });

  const updateMutation = useUpdateComplaint({
    mutation: {
      onSuccess: () => {
        toast.success("Complaint updated successfully");
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
      },
      onError: () => toast.error("Failed to update complaint")
    }
  });

  const deleteMutation = useDeleteComplaint({
    mutation: {
      onSuccess: () => {
        toast.success("Complaint deleted");
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
      },
      onError: () => toast.error("Failed to delete complaint")
    }
  });

  const analyzeMutation = useAnalyzeComplaint({
    mutation: {
      onSuccess: () => {
        toast.success("AI Analysis complete");
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
      },
      onError: () => toast.error("Failed to analyze complaint")
    }
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  return (
    <AppLayout>
      <PageTransition className="space-y-6 pb-8 flex flex-col h-[calc(100vh-100px)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Incident Directory</h1>
            <p className="text-muted-foreground mt-1">Manage and track all municipal complaints in one place.</p>
          </div>
          <Link href="/complaints/new">
            <Button className="shadow-md">
              <Plus className="h-4 w-4 mr-2" /> New Complaint
            </Button>
          </Link>
        </div>

        <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-border/60">
          <div className="p-4 border-b bg-muted/20 flex flex-col sm:flex-row gap-4 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title, location, or ID..." 
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priority} onValueChange={(v) => { setPriority(v); setPage(1); }}>
                <SelectTrigger className="w-[140px] bg-background">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
              </div>
            ) : data?.data && data.data.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase text-xs sticky top-0 backdrop-blur-md z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Details</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Priority</th>
                    <th className="px-6 py-3 font-medium">Department</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.data.map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-6 py-4 font-mono text-muted-foreground">#{complaint.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground max-w-[300px] truncate mb-1">{complaint.title}</div>
                        <div className="text-xs text-muted-foreground max-w-[300px] truncate">{complaint.location}</div>
                        {complaint.aiAnalysis && (
                          <Badge variant="outline" className="mt-2 text-[10px] bg-primary/5 text-primary border-primary/20">
                            <Sparkles className="h-3 w-3 mr-1" /> AI Analyzed
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 px-2 p-0 data-[state=open]:bg-muted">
                              <Badge variant="secondary" className={
                                complaint.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600' :
                                complaint.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                                ''
                              }>
                                {complaint.status.replace('_', ' ')}
                              </Badge>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, "pending")}>Pending</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, "in_progress")}>In Progress</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, "resolved")}>Resolved</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
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
                      <td className="px-6 py-4 text-muted-foreground">{complaint.department || "Unassigned"}</td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => analyzeMutation.mutate({ id: complaint.id })}>
                              <Sparkles className="h-4 w-4 mr-2 text-primary" /> Run AI Analysis
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={() => {
                              if (confirm("Are you sure you want to delete this incident?")) {
                                deleteMutation.mutate({ id: complaint.id });
                              }
                            }}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <Search className="h-12 w-12 opacity-20 mb-4" />
                <h3 className="text-lg font-medium text-foreground">No incidents found</h3>
                <p>Try adjusting your search or filters.</p>
                {(search || status !== "all" || priority !== "all") && (
                  <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setStatus("all"); setPriority("all"); }}>
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Pagination Footer */}
          {data && data.total > limit && (
            <div className="p-4 border-t border-border/50 bg-muted/10 flex items-center justify-between shrink-0">
              <span className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page * limit >= data.total} onClick={() => setPage(p => p + 1)}>
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </PageTransition>
    </AppLayout>
  );
}
