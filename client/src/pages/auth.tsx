import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api, insertUserSchema } from "@shared/routes";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AuthPage({ mode = "login" }: { mode?: "login" | "register" }) {
  const { loginMutation, registerMutation, user } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
  });

  const LoginContent = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: { username: "", password: "" },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} className="h-11" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-11 text-base" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </Form>
    );
  };

  const RegisterContent = () => {
    const form = useForm<z.infer<typeof insertUserSchema>>({
      resolver: zodResolver(insertUserSchema),
      defaultValues: { username: "", password: "", name: "", role: "user" },
    });

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="user" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="user123" {...field} className="h-11" />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} className="h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">Citizen (Reporter)</SelectItem>
                    {/* <SelectItem value="admin">Administrator (Official)</SelectItem> */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full h-11 text-base" disabled={registerMutation.isPending}>
            {registerMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </Form>
    );
  };

  return (
    <div className="min-h-screen bg-secondary/30 grid lg:grid-cols-2">
      {/* Left Panel - Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8 animate-enter">
          <Link href="/" className="flex items-center gap-3 mb-8 items-center">
            <img
              src="/logo.png"
              alt="InfraAlert Logo"
              className="h-10 w-auto"
            />
            <span className="font-display font-bold text-2xl tracking-tight">
              InfraAlert
            </span>
          </Link>



          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {mode === "login" ? "Welcome back" : "Create an account"}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "Enter your credentials to access your dashboard"
                  : "Join the community to start reporting issues"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mode === "login" ? <LoginContent /> : <RegisterContent />}
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-muted-foreground text-center">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <Link href={mode === "login" ? "/register" : "/login"} className="text-primary font-medium hover:underline">
                  {mode === "login" ? "Sign up" : "Log in"}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block relative bg-gray-900">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        {/* City skyline at dusk Unsplash */}
        <img
          src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2000&auto=format&fit=crop"
          alt="City Background"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute bottom-12 left-12 right-12 z-20">
  <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl">
    <h2 className="text-4xl font-display font-bold mb-4 text-white">
      Building Tomorrow, Together.
    </h2>
    <p className="text-lg text-white max-w-lg">
      Join thousands of active citizens making their neighborhoods safer, cleaner, and more efficient.
    </p>
  </div>
  </div>

      </div>
    </div>
  );
}
