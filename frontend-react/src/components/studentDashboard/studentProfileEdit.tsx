import type { UserProfile } from "@/api/users";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Save, Upload, X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface StudentProfileEditProps {
    userProfile: UserProfile | null;
    profileImage: string;
    onSave: (formData: FormData) => Promise<void>;
    onCancel: () => void;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StudentProfileEdit({ userProfile, profileImage, onSave, onCancel, onImageUpload }: StudentProfileEditProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            image: formData.get('image') as File | null,
        };
        console.log("Submitting profile data:", data);
        await onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-6">
            {/* Profile Avatar with Upload */}
            <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-dashed border-border shadow-xl transition-all duration-300 group-hover:border-primary">
                    <AvatarImage src={profileImage} alt="Profile" className="object-cover" />
                    <AvatarFallback className="text-xl font-bold bg-muted text-muted-foreground">
                        {userProfile?.name ? getInitials(userProfile.name) : "NP"}
                    </AvatarFallback>
                </Avatar>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-card shadow-lg border-2 border-primary hover:bg-accent/20 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="w-4 h-4 text-primary" />
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={onImageUpload}
                    className="hidden"
                />
            </div>

            {/* Form Fields */}
            <div className="w-full space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-foreground">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Your full name"
                        defaultValue={userProfile?.name || ""}
                        className="border-border focus:border-primary focus:ring-primary/20 transition-colors"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">Email</Label>
                    <Input
                        id="email"
                        placeholder="Institutional mail"
                        type="email"
                        defaultValue={userProfile?.email || ""}
                        disabled
                        className="bg-muted border-border text-muted-foreground"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-semibold text-foreground">Role</Label>
                    <Input
                        id="role"
                        placeholder="Role"
                        value={userProfile?.role?.toUpperCase() || "STUDENT"}
                        disabled
                        className="bg-muted border-border text-muted-foreground"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-semibold text-foreground">Department</Label>
                    <Input
                        id="department"
                        placeholder="Department"
                        value={userProfile?.department || "Department"}
                        disabled
                        className="bg-muted border-border text-muted-foreground"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
                <Button 
                    type="submit" 
                    className="flex-1 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-300"
                >
                    <Save className="w-4 h-4" />
                    Save Changes
                </Button>
                <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 gap-2 border-border hover:bg-muted hover:border-primary transition-colors" 
                    onClick={onCancel}
                >
                    <X className="w-4 h-4" />
                    Cancel
                </Button>
            </div>
        </form>
    );
}