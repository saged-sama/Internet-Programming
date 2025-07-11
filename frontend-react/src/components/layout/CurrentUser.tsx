import { getCurrentUser } from '@/lib/auth';
import React from 'react';
import { Link } from 'react-router-dom';

interface User {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
}

const CurrentUser: React.FC = () => {
    const user: User = getCurrentUser();

    const handleLogout = () => {
        // Add logout logic here
        console.log('Logout clicked');
    };

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
        </div>
    );
};

export default CurrentUser;