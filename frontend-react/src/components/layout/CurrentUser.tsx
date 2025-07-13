import { getCurrentUser, type User } from '@/lib/auth';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, User as UserIcon, Settings, LogOut } from 'lucide-react'

const CurrentUser: React.FC = () => {
    const navigate = useNavigate();
    const user: User | null = getCurrentUser();
    console.log("Current user:", user);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate("/auth/login");
    };

    const getInitials = (name: string): string => {
        return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase();
    };

    return (
        <div className="flex items-center space-x-3 z-10">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 bg-secondary/10 hover:bg-secondary/20 rounded-lg px-3 py-2 h-auto">
                        <Avatar className="w-8 h-8 border-2 border-secondary shadow-lg">
                            <AvatarImage
                                src={user?.image ? `${import.meta.env.VITE_BACKEND_URL}${user.image}` : undefined}
                                className='object-cover'
                                alt="Profile"
                            />
                            <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold text-sm">
                                {user?.name ? getInitials(user.name) : 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                            <div className="text-sidebar-foreground text-sm font-medium">{user?.name}</div>
                            <Badge variant="secondary" className="text-secondary bg-transparent border-none p-0 text-xs">
                                {user?.role}
                            </Badge>
                        </div>
                        <ChevronDown className="w-3 h-3 text-sidebar-foreground/80" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 p-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-3">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                            <Badge variant="outline" className="w-fit mt-1 text-xs">
                                {user?.role}
                            </Badge>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/profile" className="flex items-center py-2">
                            <UserIcon className="mr-3 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/settings" className="flex items-center py-2">
                            <Settings className="mr-3 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={handleLogout} 
                        className="cursor-pointer text-foreground hover:text-foreground focus:text-foreground py-2"
                    >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default CurrentUser;