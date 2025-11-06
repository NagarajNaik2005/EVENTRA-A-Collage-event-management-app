import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import EventModal from "@/components/EventModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      navigate("/");
      return;
    }

    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
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

  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date());
  const recentEvents = events.filter((event) => new Date(event.date) < new Date());

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <Header />
      
      <main className="container py-8">
        <section className="mb-12">
          <div className="text-center mb-8 py-12 px-4 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to Eventra
            </h1>
            <p className="text-xl text-muted-foreground">
              Your gateway to exciting college events
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={() => handleViewDetails(event)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming events at the moment.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Recent Events</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-64" />
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewDetails={() => handleViewDetails(event)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No recent events.</p>
          )}
        </section>
      </main>

      <EventModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      <Footer />
    </div>
  );
};

export default Home;
