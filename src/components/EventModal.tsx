import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SubEvent {
  name: string;
  time: string;
  details: string;
}

interface EventModalProps {
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string;
    type: string;
    sub_events: SubEvent[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EventModal = ({ event, open, onOpenChange }: EventModalProps) => {
  const { toast } = useToast();
  const [selectedSubEvent, setSelectedSubEvent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  const handleRegister = async () => {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    if (event.sub_events.length > 0 && !selectedSubEvent) {
      toast({
        title: "Error",
        description: "Please select a sub-event",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("registrations").insert([
        {
          student_id: studentId,
          event_id: event.id,
          sub_event: selectedSubEvent || null,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Registered",
            description: "You have already registered for this event",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Success!",
          description: "You have been registered for the event",
          className: "bg-green-500 text-white border-green-600",
        });
        onOpenChange(false);
        setSelectedSubEvent("");
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl">{event.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(event.date), "PPP")}
              </DialogDescription>
            </div>
            <Badge variant={event.type === "Cultural" ? "default" : "secondary"}>
              {event.type}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {event.venue}
          </div>

          <div>
            <h3 className="font-semibold mb-2">About</h3>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>

          {event.sub_events && event.sub_events.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Select Sub-Event</h3>
              <RadioGroup value={selectedSubEvent} onValueChange={setSelectedSubEvent}>
                <div className="space-y-3">
                  {event.sub_events.map((subEvent: SubEvent, index: number) => (
                    <div key={index} className="flex items-start space-x-3 border rounded-lg p-4">
                      <RadioGroupItem value={subEvent.name} id={`sub-${index}`} />
                      <div className="flex-1">
                        <Label htmlFor={`sub-${index}`} className="font-medium cursor-pointer">
                          {subEvent.name}
                        </Label>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {subEvent.time}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{subEvent.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}

          <Button onClick={handleRegister} className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register for Event"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
