import type { Meeting } from "@/api/meetings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, MapPin, User, Video, AlertCircle, ExternalLink } from "lucide-react";

export default function MeetingActivity({ meeting }: { meeting: Meeting }) {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{meeting.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{meeting.description}</p>
                </div>
            </div>
            
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover:bg-accent transition-colors">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Meeting Schedule</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Date:</span>
                        <span className="text-sm text-foreground">{new Date(meeting.meeting_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Time:</span>
                        <span className="text-sm text-foreground">
                            {new Date(`1970-01-01T${meeting.start_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(`1970-01-01T${meeting.end_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-base">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span>Location</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{meeting.location}</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-base">
                            <User className="w-4 h-4 text-primary" />
                            <span>Organizer</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{meeting.organizer}</p>
                    </CardContent>
                </Card>
                
                <Card className="hover:bg-accent transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-base">
                            <Video className="w-4 h-4 text-secondary" />
                            <span>Type</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="secondary">{meeting.type}</Badge>
                    </CardContent>
                </Card>
                
                {meeting.url && (
                    <Card className="hover:bg-accent transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center space-x-2 text-base">
                                <ExternalLink className="w-4 h-4 text-accent" />
                                <span>Meeting Link</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="link" className="h-auto p-0 text-sm" asChild>
                                <a href={meeting.url} target="_blank" rel="noopener noreferrer">
                                    Join Meeting
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
            
            {meeting.is_registration_required && (
                <Alert className="bg-accent/10 border-accent/20">
                    <AlertCircle className="h-4 w-4 text-accent" />
                    <AlertDescription className="text-accent-foreground">
                        <strong>Registration Required</strong> - Please register to attend this meeting
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
