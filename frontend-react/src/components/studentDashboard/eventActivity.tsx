import type { Event } from "@/api/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Tag, Calendar } from "lucide-react";

export default function EventActivity({ event }: { event: Event }) {
    return (
        <div className="p-6 space-y-4">
            <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">{event.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CalendarDays className="h-4 w-4" />
                            Date & Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                            {new Date(event.event_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(`1970-01-01T${event.start_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(`1970-01-01T${event.end_time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <MapPin className="h-4 w-4" />
                            Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Tag className="h-4 w-4" />
                            Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="secondary">{event.category}</Badge>
                    </CardContent>
                </Card>
                
                {event.registration_required && (
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Calendar className="h-4 w-4" />
                                Registration Deadline
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {event.registration_deadline ? 
                                    new Date(event.registration_deadline).toLocaleDateString() : 
                                    'No deadline specified'
                                }
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}