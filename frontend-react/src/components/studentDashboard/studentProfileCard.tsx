import { updateUserProfile, type UserProfile } from "@/api/users";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import StudentProfileView from "./studentProfileView";
import StudentProfileEdit from "./studentProfileEdit";


export default function StudentProfileCard({ userProfile, onSignOut }: { userProfile: UserProfile | null; onSignOut: () => void }) {
    // const [userDetails, setUserDetails] = useState<UserProfile | null>(userProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(userProfile?.image || "");

    useEffect(() => {
        setProfileImage(userProfile?.image || "");
    }, [userProfile?.image]);

    const handleUserProfileUpdate = async (formData: FormData) => {
        const name = formData.get("name") as string;
        if(name){    
            formData.delete("name");
        }
        const data = await updateUserProfile(formData, userProfile?.id || "", name || null);
        data ? window.location.reload(): alert("Failed to update profile");
        setIsEditing(false);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCancel = () => {
        setProfileImage(userProfile?.image || "");
        setIsEditing(false);
    };

    return (
        <Card className="w-80 min-w-[320px] shadow-xl border-0 bg-gradient-to-br from-white to-slate-50">
            <CardContent className="p-8">
                {isEditing ? (
                    <StudentProfileEdit
                        userProfile={userProfile}
                        profileImage={profileImage}
                        onSave={handleUserProfileUpdate}
                        onCancel={handleCancel}
                        onImageUpload={handleImageUpload}
                    />
                ) : (
                    <StudentProfileView
                        userProfile={userProfile}
                        profileImage={profileImage}
                        onEdit={() => setIsEditing(true)}
                        onSignOut={onSignOut}
                    />
                )}
            </CardContent>
        </Card>
    );
}
