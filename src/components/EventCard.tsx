import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    venue: string;
    description: string;
    type: string;
  };
  onViewDetails: () => void;
}

const EventCard = ({ event, onViewDetails }: EventCardProps) => {
  const isPast = new Date(event.date) < new Date();

  return (
    <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.date), "PPP")}
            </CardDescription>
          </div>
          <Badge 
            variant={event.type === "Cultural" ? "default" : "secondary"}
            className={event.type === "Cultural" ? "bg-gradient-to-r from-primary to-accent" : ""}
          >
            {event.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {event.venue}
        </div>
        <p className="text-sm line-clamp-2">{event.description}</p>
        <Button onClick={onViewDetails} className="w-full" disabled={isPast}>
          {isPast ? "Event Completed" : "View Details"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;
