import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { useLogin } from "@workspace/api-client-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function Login() {
  const { login: setAuthToken } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (data) => {
        setAuthToken(data.token);
        toast.success("Successfully logged in");
        setLocation("/dashboard");
      },
      onError: (error: unknown) => {
        const msg = (error as { error?: string })?.error;
        toast.error(msg || "Failed to login. Please check your credentials.");
      }
    }
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate({ data: values });
  }

  return (
    <PageTransition className="min-h-screen flex flex-col md:flex-row">
      {/* Brand Side - Left */}
      <div className="hidden md:flex w-1/2 bg-card border-r flex-col p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-70" />
        
        <div className="flex items-center gap-2 mb-16 relative z-10">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20">
            CP
          </div>
          <span className="text-xl font-bold tracking-tight">CivicPulse</span>
        </div>

        <div className="mt-auto mb-16 relative z-10">
          <h2 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
            Municipal intelligence, <br />redefined.
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Sign in to access real-time civic data, manage critical incidents, and coordinate cross-departmental workflows.
          </p>
        </div>
      </div>

      {/* Form Side - Right */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20">
              CP
            </div>
            <span className="text-xl font-bold tracking-tight">CivicPulse</span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Please enter your credentials to sign in.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="officer@municipality.gov" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link href="#" className="text-xs font-medium text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11" disabled={loginMutation.isPending}>
                {loginMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
