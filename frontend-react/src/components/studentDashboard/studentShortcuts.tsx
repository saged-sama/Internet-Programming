import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const scheduleOptions = [
    { label: "Class Schedule", to: "/scheduling/class-schedule" },
    { label: "Room Availability", to: "/scheduling/room-availability" },
    { label: "Exam Timetables", to: "/exams/timetables" },
    { label: "Assignments", to: "/assignments" },
];

const getIcon = (label: string) => {
    switch (label) {
        case "Class Schedule":
            return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
        case "Room Availability":
            return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />;
        case "Exam Timetables":
            return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />;
        case "Assignments":
            return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />;
        default:
            return null;
    }
};

export default function StudentShortcuts() {
    const navigate = useNavigate();
    
    return (
        <div className="w-full text-center">
            <h4 className="text-xl font-bold">Your Shortcuts</h4>
            <div className="w-full grid grid-cols-2 gap-3 mt-4">
                {scheduleOptions.map((option, index) => (
                    <Button
                        key={index}
                        onClick={() => navigate(option.to)}
                        variant="outline"
                        className="flex flex-col items-center gap-2 h-20 bg-card hover:bg-accent/10 border-border shadow-md transition-all duration-300"
                    >
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon(option.label)}
                            </svg>
                        </div>
                        <span className="text-xs font-medium text-center">{option.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
