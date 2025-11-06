import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    usn: "",
    contactNo: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if student already exists
      const { data: existingStudent } = await supabase
        .from("students")
        .select("*")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingStudent) {
        toast({
          title: "Email already exists",
          description: "Please login instead",
          variant: "destructive",
        });
        return;
      }

      // Create new student
      const { data: newStudent, error } = await supabase
        .from("students")
        .insert([{
          name: formData.name,
          email: formData.email,
          contact_no: formData.contactNo,
          usn: formData.usn
        }])
        .select()
        .single();

      if (error) throw error;

      localStorage.setItem("studentId", newStudent.id);
      localStorage.setItem("studentData", JSON.stringify(newStudent));
      
      toast({
        title: "Account created!",
        description: "Welcome to Eventra",
        className: "bg-green-500 text-white border-green-600",
      });

      navigate("/home");
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
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join Eventra - College Event Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="usn">USN</Label>
              <Input
                id="usn"
                required
                value={formData.usn}
                onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                required
                value={formData.contactNo}
                onChange={(e) => setFormData({ ...formData, contactNo: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-primary hover:underline font-medium">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
