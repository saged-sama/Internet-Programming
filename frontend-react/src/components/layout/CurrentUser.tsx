<<<<<<< HEAD
import { getCurrentUser } from '@/lib/auth';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
}

const CurrentUser: React.FC = () => {
    const navigate = useNavigate();
    const user: User = getCurrentUser();
=======
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
>>>>>>> edaf098ee3c4895ab50d73e6a77ce70591fe77fa

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        navigate("/auth/login");
    };

<<<<<<< HEAD
    return (
        <div className="flex items-center space-x-3 z-10">
            <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer bg-[#ECB31D]/10 hover:bg-[#ECB31D]/20 rounded-lg px-3 py-2 transition-colors">
                    <div className="w-8 h-8 bg-[#ECB31D] rounded-full flex items-center justify-center">
                        <span className="text-[#13274D] font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                    </div>
                    <div className="text-left">
                        <div className="text-white text-sm font-medium">{user?.name}</div>
                        <div className="text-[#ECB31D] text-xs">{user?.role}</div>
                    </div>
                    <svg
                        className="w-3 h-3 text-gray-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                            <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                            <div className="text-xs text-gray-500">{user?.email}</div>
                        </div>
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#ECB31D] hover:text-[#13274D] transition-colors"
                        >
                            Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#ECB31D] hover:text-[#13274D] transition-colors"
                        >
                            Settings
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
=======
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
>>>>>>> edaf098ee3c4895ab50d73e6a77ce70591fe77fa
        </div>
    );
};

export default CurrentUser;