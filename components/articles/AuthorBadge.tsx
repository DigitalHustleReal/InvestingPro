import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';

interface AuthorBadgeProps {
    name: string;
    role?: string;
    avatarUrl?: string | null;
    size?: "sm" | "md" | "lg";
    showRole?: boolean;
    className?: string;
}

export function AuthorBadge({ 
    name, 
    role = "Editor", 
    avatarUrl, 
    size = "sm", 
    showRole = false,
    className = "" 
}: AuthorBadgeProps) {
    
    // Size mapping
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-10 h-10",
        lg: "w-14 h-14"
    };

    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg"
    };

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <Avatar className={`${sizeClasses[size]} border border-slate-200 bg-slate-50`}>
                <AvatarImage src={avatarUrl || ""} alt={name} />
                <AvatarFallback className="bg-slate-100 text-slate-400">
                    <User className={size === 'sm' ? "w-4 h-4" : "w-6 h-6"} />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className={`font-semibold text-slate-900 leading-tight ${textSizeClasses[size]}`}>
                    {name}
                </span>
                {showRole && (
                    <span className="text-xs text-slate-500 font-medium">
                        {role}
                    </span>
                )}
            </div>
        </div>
    );
}
