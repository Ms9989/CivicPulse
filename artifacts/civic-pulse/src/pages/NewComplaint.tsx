import { PageTransition } from "@/components/PageTransition";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComplaint, useAnalyzeText } from "@workspace/api-client-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation, Link } from "wouter";
import { toast } from "sonner";
import { Loader2, ChevronLeft, Sparkles, BrainCircuit, Building2, AlertTriangle, Hammer, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const complaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(5, "Please provide a valid location"),
  landmark: z.string().optional(),
  ward: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export default function NewComplaint() {
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      landmark: "",
      ward: "",
      imageUrl: "",
    },
  });

  const createMutation = useCreateComplaint({
    mutation: {
      onSuccess: (data) => {
        toast.success("Incident reported successfully");
        setLocation("/complaints");
      },
      onError: (error) => {
        toast.error("Failed to submit incident report");
      }
    }
  });

  const analyzeMutation = useAnalyzeText({
    mutation: {
      onError: () => toast.error("Failed to run AI analysis preview")
    }
  });

  const runPreviewAnalysis = async () => {
    const values = form.getValues();
    if (!values.title || !values.description || !values.location) {
      toast.error("Please fill in title, description, and location first");
      return;
    }
    
    analyzeMutation.mutate({
      data: {
        title: values.title,
        description: values.description,
        location: values.location
      }
    });
  };

  function onSubmit(values: z.infer<typeof complaintSchema>) {
    createMutation.mutate({ data: values });
  }

  const analysisResult = analyzeMutation.data;

  return (
    <AppLayout>
      <PageTransition className="max-w-6xl mx-auto space-y-6 pb-12">
        <div>
          <Link href="/complaints" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Incidents
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Report New Incident</h1>
          <p className="text-muted-foreground mt-1">Submit a new civic complaint for AI analysis and routing.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Incident Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Massive pothole on Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the issue in detail, including size, severity, and any hazards..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="Street address or intersection" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ward / District</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Ward 4" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="landmark"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nearest Landmark (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Next to Central Park north entrance" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-border/50">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        className="w-full sm:w-auto bg-primary/10 text-primary hover:bg-primary/20"
                        onClick={runPreviewAnalysis}
                        disabled={analyzeMutation.isPending}
                      >
                        {analyzeMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Preview AI Analysis
                      </Button>
                      
                      <Button type="submit" className="w-full sm:w-auto shadow-md" disabled={createMutation.isPending}>
                        {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Report
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="shadow-sm border-primary/20 bg-primary/5 h-full">
              <CardHeader className="border-b border-primary/10 pb-4">
                <CardTitle className="text-lg flex items-center text-primary">
                  <BrainCircuit className="mr-2 h-5 w-5" /> Live AI Analysis Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {analyzeMutation.isPending ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Running inference models...</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Priority Prediction</p>
                        <Badge variant="outline" className={
                          analysisResult.priority === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          analysisResult.priority === 'high' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                          analysisResult.priority === 'medium' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                          'bg-muted text-muted-foreground'
                        }>
                          {analysisResult.priority.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Impact Score</p>
                        <span className="text-2xl font-bold tracking-tight">{analysisResult.impactScore}/100</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Recommended Department</p>
                          <p className="text-sm text-muted-foreground">{analysisResult.department}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Category</p>
                          <p className="text-sm text-muted-foreground">{analysisResult.category} ({analysisResult.severity})</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Est. Response Time</p>
                          <p className="text-sm text-muted-foreground">{analysisResult.estimatedResponseTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background rounded-lg p-4 border border-border/50">
                      <p className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Hammer className="h-4 w-4 text-primary" /> Required Equipment
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.equipmentRequired.map((eq: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{eq}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                        Crew size recommended: {analysisResult.recommendedCrew}
                      </p>
                    </div>

                    <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                      <p className="text-sm font-medium text-primary mb-1">AI Recommendation</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{analysisResult.recommendation}</p>
                    </div>
                    
                    {analysisResult.duplicateProbability > 0.5 && (
                      <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20 text-sm text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>High probability ({(analysisResult.duplicateProbability*100).toFixed(0)}%) of being a duplicate report.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6 text-primary opacity-50" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Preview before submitting</p>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      Fill out the details on the left and click Preview to see how our AI categorizes this incident.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
