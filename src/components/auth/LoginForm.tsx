import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, AlertCircle, User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

const LoginForm = ({ onSuccess, onRegisterClick }: LoginFormProps) => {
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingUsers, setIsCreatingUsers] = useState(false);
  const [usersCreated, setUsersCreated] = useState(false);

  // Predefined login credentials for different roles
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Function to set predefined credentials
  const setCredentials = (email: string, password: string) => {
    form.setValue("email", email);
    form.setValue("password", password);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      await signIn(values.email, values.password);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.message || "Failed to sign in. Please check your credentials.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Function to create test users
  const createTestUsers = async () => {
    setIsCreatingUsers(true);
    setError(null);

    try {
      const { data, error } =
        await supabase.functions.invoke("create_test_users");

      if (error) {
        console.error("Error creating test users:", error);
        setError(`Failed to create test users: ${error.message}`);
      } else {
        console.log("Test users created:", data);
        setUsersCreated(true);
      }
    } catch (err) {
      console.error("Error invoking function:", err);
      setError(`Failed to create test users: ${err.message}`);
    } finally {
      setIsCreatingUsers(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Masuk</CardTitle>
        <CardDescription className="text-center">
          Masukkan email dan password untuk mengakses akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Create test users button */}
        <div className="mb-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={createTestUsers}
            disabled={isCreatingUsers || usersCreated}
            className="text-xs"
          >
            {isCreatingUsers ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Creating test users...
              </>
            ) : usersCreated ? (
              "Test users created"
            ) : (
              "Buat pengguna uji coba"
            )}
          </Button>
        </div>

        {/* Quick login buttons */}
        <div className="mb-6">
          <p className="text-sm text-center mb-2 text-gray-500">
            Login Cepat Sebagai:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={selectedRole === "super_admin" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCredentials("superadmin@example.com", "SuperAdmin123!");
                setSelectedRole("super_admin");
              }}
              className="flex items-center justify-center gap-1"
              disabled={!usersCreated && !isCreatingUsers}
            >
              <User className="h-3 w-3" /> Super Admin
            </Button>
            <Button
              type="button"
              variant={selectedRole === "admin" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCredentials("admin@example.com", "Admin123!");
                setSelectedRole("admin");
              }}
              className="flex items-center justify-center gap-1"
              disabled={!usersCreated && !isCreatingUsers}
            >
              <User className="h-3 w-3" /> Admin
            </Button>
            <Button
              type="button"
              variant={selectedRole === "visitor" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCredentials("user@example.com", "User123!");
                setSelectedRole("visitor");
              }}
              className="flex items-center justify-center gap-1"
              disabled={!usersCreated && !isCreatingUsers}
            >
              <User className="h-3 w-3" /> Pengguna
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Masukkan email Anda"
                        className="pl-10"
                        {...field}
                      />
                    </div>
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="Masukkan password Anda"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sedang masuk..." : "Masuk"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Belum punya akun?{" "}
          <Button variant="link" className="p-0" onClick={onRegisterClick}>
            Daftar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
