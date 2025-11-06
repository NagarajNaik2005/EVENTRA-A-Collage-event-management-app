import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      navigate("/");
      return;
    }

    fetchRegistrations(studentId);
  }, [navigate]);

  const fetchRegistrations = async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select(`
          *,
          events (
            title,
            date,
            venue,
            type
          )
        `)
        .eq("student_id", studentId)
        .order("registered_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
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

  const handleCancelRegistration = async (registrationId: string) => {
    try {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", registrationId);

      if (error) throw error;

      toast({
        title: "Cancelled",
        description: "Registration cancelled successfully",
        className: "bg-red-500 text-white border-red-600",
      });

      const studentId = localStorage.getItem("studentId");
      if (studentId) {
        fetchRegistrations(studentId);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your event registrations
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : registrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((registration) => (
              <Card key={registration.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle>{registration.events.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(registration.events.date), "PPP")}
                      </CardDescription>
                    </div>
                    <Badge variant={registration.events.type === "Cultural" ? "default" : "secondary"}>
                      {registration.events.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {registration.events.venue}
                  </div>
                  {registration.sub_event && (
                    <div className="text-sm">
                      <span className="font-medium">Sub-event: </span>
                      {registration.sub_event}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    Registered on {format(new Date(registration.registered_at), "PPP")}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleCancelRegistration(registration.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Registration
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                You haven't registered for any events yet.
              </p>
              <Button
                className="mt-4"
                onClick={() => navigate("/home")}
              >
                Browse Events
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
