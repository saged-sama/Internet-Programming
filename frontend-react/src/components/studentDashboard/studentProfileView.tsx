import { Edit, Settings } from "lucide-react";
import type { UserProfile } from "@/api/users";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

interface StudentProfileViewProps {
    userProfile: UserProfile | null;
    profileImage: string;
    onEdit: () => void;
    onSignOut: () => void;
}

export default function StudentProfileView({ userProfile, profileImage, onEdit, onSignOut }: StudentProfileViewProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    console.log(`${import.meta.env.VITE_BACKEND_URL}${profileImage}`)

    return (
        <div className="flex flex-col items-center space-y-3">
            
            <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-primary shadow-xl transition-transform duration-300 group-hover:scale-105">
                    <AvatarImage src={`${import.meta.env.VITE_BACKEND_URL}${profileImage}`} alt="Profile" className="object-cover" />
                    <AvatarFallback className="text-xl font-bold bg-accent/20 text-primary">
                        {userProfile?.name ? getInitials(userProfile.name) : "NP"}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {userProfile?.name || "Loading..."}
                </h2>
                
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-md">
                    {userProfile?.role?.toUpperCase() || "STUDENT"}
                </div>
                
                <div className="text-foreground font-medium">
                    {userProfile?.department || "Department"}
                </div>
                
                {userProfile?.email && (
                    <div className="text-sm text-muted-foreground font-mono bg-card px-3 py-1 rounded-md border border-border">
                        {userProfile.email}
                    </div>
                )}
            </div>

            {/* Progress indicator */}
            <div className="flex items-center justify-center">
                <div className="h-1 w-8 bg-gradient-to-r from-transparent to-primary/30 rounded-l-full" />
                <div className="h-3 w-3 bg-primary rounded-full mx-2 shadow-md" />
                <div className="h-1 w-8 bg-gradient-to-l from-transparent to-primary/30 rounded-r-full" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
                <Button 
                    onClick={onEdit}
                    variant="outline" 
                    className="flex-1 gap-2 transition-colors"
                >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                </Button>
                <Button 
                    variant="outline" 
                    className="flex-1 gap-2 transition-colors"
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Button>
            </div>

            <Button
                onClick={onSignOut}
                variant="secondary"
                className="w-full font-semibold transition-colors"
            >
                Sign Out
            </Button>
        </div>
    );
}
