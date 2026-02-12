import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { AuthorHoverCard } from '@/components/authors/AuthorHoverCard';

interface AuthorBadgeProps {
    name: string;
    slug?: string; // Added for hover card
    role?: string;
    avatarUrl?: string | null;
    bio?: string; // Added for hover card
    credentials?: string[]; // Added for hover card
    size?: "sm" | "md" | "lg";
    showRole?: boolean;
    className?: string;
}

export function AuthorBadge({ 
    name, 
    slug,
    role = "Editor", 
    avatarUrl, 
    bio,
    credentials,
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

    // Construct author object for HoverCard
    const hoverCardAuthor = {
        name: name,
        slug: slug || '#',
        photo_url: avatarUrl || undefined,
        role: role,
        bio: bio,
        credentials: credentials
    };

    const BadgeContent = () => (
        <div className={`flex items-center gap-3 ${className} cursor-pointer group`}>
            <Avatar className={`${sizeClasses[size]} border border-slate-200 bg-slate-50 transition-transform group-hover:scale-105`}>
                <AvatarImage src={avatarUrl || ""} alt={name} />
                <AvatarFallback className="bg-slate-100 text-slate-600">
                    <User className={size === 'sm' ? "w-4 h-4" : "w-6 h-6"} />
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className={`font-semibold text-slate-900 leading-tight ${textSizeClasses[size]} group-hover:text-primary-600 group-hover:underline decoration-primary-600/30 underline-offset-4 transition-colors`}>
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

    if (slug) {
        return (
            <AuthorHoverCard author={hoverCardAuthor}>
                <BadgeContent />
            </AuthorHoverCard>
        );
    }

    return <BadgeContent />;
}
