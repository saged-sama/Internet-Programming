import type { Event } from "@/api/events";
import type { Meeting } from "@/api/meetings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import MeetingActivity from "./meetingActivity";
import EventActivity from "./eventActivity";

export interface ActivityClass {
    object: Meeting | Event;
    type: 'Class' | 'Meeting' | 'Assignment' | 'Exam' | 'Event';
}

export default function Activity({ activity }: { activity: ActivityClass }) {
    const Tag = (tagTitle: string, type: string) => (
        <div className={`${
            type === 'Class' ? 'bg-primary/10 text-primary' : 
            type === 'Meeting' ? 'bg-accent/10 text-accent-foreground' : 
            type === 'Assignment' ? 'bg-secondary/10 text-secondary-foreground' : 
            'bg-destructive/10 text-destructive'
        } px-2 py-1 rounded-full text-xs font-semibold cursor-pointer`}>
            <span className="font-bold">{type}:</span> {tagTitle}
        </div>
    )

    
    return (
        <Dialog>
            <DialogTrigger asChild>
                {Tag(activity.object.title, activity.type)}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{activity.type} Details</DialogTitle>
                </DialogHeader>
                {activity.type === "Meeting" && 
                    <MeetingActivity meeting={activity.object as Meeting} />
                }
                {activity.type === "Event" &&
                    <EventActivity event={activity.object as Event} />
                }
            </DialogContent>
        </Dialog>
    );
}