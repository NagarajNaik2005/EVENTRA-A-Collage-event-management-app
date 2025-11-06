import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if student exists
      const { data: existingStudent } = await supabase
        .from("students")
        .select("*")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingStudent) {
        // Student exists, store their ID
        localStorage.setItem("studentId", existingStudent.id);
        localStorage.setItem("studentData", JSON.stringify(existingStudent));
        toast({
          title: "Welcome back!",
          description: `Logged in as ${existingStudent.name}`,
          className: "bg-blue-500 text-white border-blue-600",
        });
        navigate("/home");
      } else {
        toast({
          title: "Account not found",
          description: "Please sign up first",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <Card className="w-full max-w-md relative shadow-2xl border-primary/20 backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Login to Eventra</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
