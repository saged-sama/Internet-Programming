export default function DashBoardTitle() {
    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg blur-3xl"></div>
            <div className="relative bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50">
                <h1 className="text-foreground text-center mb-3 tracking-tight">
                    Your Dashboard
                </h1>
                <p className="text-center text-muted-foreground text-base leading-relaxed">
                    Welcome! View your weekly schedules, courses, grades, and routine!
                </p>
                <div className="mt-4 flex justify-center">
                    <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                </div>
            </div>
        </div>
    )
}