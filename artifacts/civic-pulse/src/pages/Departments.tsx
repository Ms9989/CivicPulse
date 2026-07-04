import { PageTransition, staggerContainer, staggerItem } from "@/components/PageTransition";
import { AppLayout } from "@/components/AppLayout";
import { useListDepartments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Users, AlertCircle, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Departments() {
  const { data: departments, isLoading } = useListDepartments();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition className="space-y-8 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Departments</h1>
            <p className="text-muted-foreground mt-1">Manage municipal teams and monitor workload distribution.</p>
          </div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {departments?.map((dept) => {
            const total = dept.pendingCount + dept.resolvedCount;
            const resolutionRate = total > 0 ? Math.round((dept.resolvedCount / total) * 100) : 0;
            
            return (
              <motion.div key={dept.id} variants={staggerItem}>
                <Link href={`/departments/${dept.id}`}>
                  <Card className="h-full hover-elevate transition-all cursor-pointer border-border/50 shadow-sm group">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Users className="h-5 w-5 text-primary group-hover:text-primary-foreground" />
                        </div>
                        <div className="bg-muted px-2 py-1 rounded text-xs font-mono font-medium text-muted-foreground">
                          {dept.code}
                        </div>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{dept.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{dept.description || "No description provided."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/10">
                          <div className="flex items-center gap-1.5 text-destructive mb-1 text-sm font-medium">
                            <AlertCircle className="h-4 w-4" /> Pending
                          </div>
                          <p className="text-2xl font-bold text-destructive">{dept.pendingCount}</p>
                        </div>
                        <div className="bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
                          <div className="flex items-center gap-1.5 text-emerald-600 mb-1 text-sm font-medium">
                            <CheckCircle2 className="h-4 w-4" /> Resolved
                          </div>
                          <p className="text-2xl font-bold text-emerald-600">{dept.resolvedCount}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-border/50 pt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          <span>Rate: <strong className="text-foreground">{resolutionRate}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-primary font-medium group-hover:underline">
                          View details <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </PageTransition>
    </AppLayout>
  );
}
