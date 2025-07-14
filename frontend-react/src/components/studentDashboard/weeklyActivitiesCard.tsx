import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { getMeetings, type Meeting } from "@/api/meetings";
import Activity, { type ActivityClass } from "./activity";
import { Calendar } from "lucide-react";
import { getEvents, type Event } from "@/api/events";

export default function WeeklyActivitiesCard() {
    const [weekdays,setWeekdays] = useState<string[]>([
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]);
    const [activities, setActivities] = useState<ActivityClass[]>([]);
    const [loading, setLoading] = useState(true);

    const shuffleWeekdays = (arr: string[]) => {
        const today = new Date();
        const todayIndex = today.getDay();
        return setWeekdays([...arr.slice(todayIndex), ...arr.slice(0, todayIndex)]);
    }

    useEffect(() => {
        shuffleWeekdays(weekdays);
        async function fetchData() {
            try {
                const meetingsResponse = await getMeetings({
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
                });

                const eventResponse = await getEvents({
                    start_date: new Date().toISOString().split('T')[0],
                    end_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
                });

                // console.log("Event Response", eventResponse);

                const currentActivities: ActivityClass[] = [
                    ...meetingsResponse.data.map(meeting => ({
                        object: meeting,
                        type: 'Meeting' as const
                    })),
                    ...eventResponse.data.map(event => ({
                        object: event,
                        type: 'Event' as const
                    }))
                ]

                console.log("Current Activities", currentActivities);

                currentActivities.sort((a, b) => {
                    return a.object.start_time < b.object.start_time ? -1 : 1;
                })
                setActivities(currentActivities);
            } catch (error) {
                console.error("Error fetching activities:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <LoadingSkeleton weekdays={weekdays} />;
    }

    return (
        <div className="flex-1 bg-card rounded-xl shadow-lg border border-border p-8">
            <h3 className="text-primary mb-6 flex gap-2 items-center"> <Calendar /> Weekly Activities</h3>
            <div className="h-full">
                <div className="overflow-x-auto rounded-lg border border-border">
                    <Table className="border-collapse">
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary/90 border-b border-border">
                                <TableHead className="w-48 min-w-48 border-r border-border text-primary-foreground font-bold text-center" colSpan={1}>
                                    Weekdays
                                </TableHead>
                                <TableHead className="w-48 min-w-48 text-primary-foreground font-bold text-center" colSpan={6}>
                                    Activities
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {weekdays.map((day, idx) => (
                                <TableRow
                                    key={idx}
                                    className="border-b border-border hover:bg-muted/50 transition-colors"
                                >
                                    <TableHead className="w-48 min-w-48 border-r border-border bg-secondary/20 text-primary font-semibold py-4 text-center" colSpan={1}>
                                        {day}
                                    </TableHead>
                                    <TableCell className="text-center py-4 bg-card" colSpan={6}>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {(activities.filter(activity => {
                                                const dateString = (() => {
                                                    switch (activity.type) {
                                                        case "Meeting":
                                                            return (activity.object as Meeting).meeting_date;
                                                        case "Event":
                                                            return (activity.object as Event).event_date;
                                                    }
                                                })();
                                                const activityDate = new Date(dateString as string);
                                                const activityDay = weekdays[activityDate.getDay()];
                                                // console.log("activity", activity.object.title, "Activity Day", activityDay, "Current Day", day);
                                                return activityDay === day;
                                            }).map(activity => (
                                                <Activity key={activity.object.id} activity={activity} />
                                            )))}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}


function LoadingSkeleton({ weekdays }: { weekdays: string[] }) {
    return (
        <div className="flex-1 bg-card rounded-xl shadow-lg border border-border p-8">
            <div className="flex gap-2 items-center mb-6">
                <Calendar />
                <h3 className="text-primary">Weekly Activities</h3>
            </div>
            <div className="h-full">
                <div className="overflow-x-auto rounded-lg border border-border">
                    <Table className="border-collapse">
                        <TableHeader>
                            <TableRow className="bg-primary hover:bg-primary/90 border-b border-border">
                                <TableHead className="w-48 min-w-48 border-r border-border text-primary-foreground font-bold text-center" colSpan={1}>
                                    Weekdays
                                </TableHead>
                                <TableHead className="w-48 min-w-48 text-primary-foreground font-bold text-center" colSpan={6}>
                                    Activities
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {weekdays.map((day, idx) => (
                                <TableRow
                                    key={idx}
                                    className="border-b border-border hover:bg-muted/50 transition-colors"
                                >
                                    <TableHead className="w-48 min-w-48 border-r border-border bg-secondary/20 text-primary font-semibold py-4 text-center" colSpan={1}>
                                        {day}
                                    </TableHead>
                                    <TableCell className="text-center py-4 bg-card" colSpan={6}>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            <Skeleton className="h-8 w-20" />
                                            <Skeleton className="h-8 w-16" />
                                            <Skeleton className="h-8 w-24" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}