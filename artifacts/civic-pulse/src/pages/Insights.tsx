import { PageTransition, staggerContainer, staggerItem } from "@/components/PageTransition";
import { AppLayout } from "@/components/AppLayout";
import { useGetInsights } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, AlertTriangle, Info, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Insights() {
  const { data: insights, isLoading } = useGetInsights();

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'trend': return <TrendingUp className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'alert': return <Zap className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getTrendIcon = (trend?: string | null) => {
    if (!trend) return null;
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-destructive" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-emerald-500" />;
    return null;
  };

  return (
    <AppLayout>
      <PageTransition className="space-y-8 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            AI Insights <Badge variant="secondary" className="bg-primary/20 text-primary">Beta</Badge>
          </h1>
          <p className="text-muted-foreground mt-1">
            Machine-generated intelligence derived from analyzing patterns across all municipal departments.
          </p>
        </div>

        {insights && insights.length > 0 ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {insights.map((insight) => (
              <motion.div key={insight.id} variants={staggerItem} className="h-full">
                <Card className="h-full flex flex-col hover-elevate border-border/50 shadow-sm relative overflow-hidden">
                  <div className={cn(
                    "absolute top-0 left-0 w-1 h-full",
                    insight.severity === 'critical' ? 'bg-destructive' :
                    insight.severity === 'high' ? 'bg-orange-500' :
                    insight.severity === 'medium' ? 'bg-blue-500' : 'bg-muted'
                  )} />
                  <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0 relative z-10 pl-6">
                    <div className="flex gap-3">
                      <div className={cn(
                        "mt-0.5 rounded-md p-2 flex items-center justify-center shrink-0",
                        getSeverityColor(insight.severity).replace('border-', '').replace('text-', 'bg-').replace('/10', '/20')
                      )}>
                        {getTypeIcon(insight.type)}
                      </div>
                      <div>
                        <Badge variant="outline" className={cn("mb-2 uppercase text-[10px] tracking-wider font-semibold", getSeverityColor(insight.severity))}>
                          {insight.severity}
                        </Badge>
                        <CardTitle className="text-lg leading-tight">{insight.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between pl-6">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {insight.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {insight.metric && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 font-mono text-xs font-medium">
                            {insight.metric}
                            {getTrendIcon(insight.trend)}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(insight.createdAt), 'MMM d, h:mm a')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-card rounded-xl border border-dashed">
            <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No insights generated yet</h3>
            <p className="text-muted-foreground mt-1 max-w-md mx-auto">
              Our AI engine needs more data to identify meaningful patterns. Check back later once more incidents are logged.
            </p>
          </div>
        )}
      </PageTransition>
    </AppLayout>
  );
}
