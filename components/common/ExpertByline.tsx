import React from 'react';
import { User, Linkedin, Award } from 'lucide-react';

interface ExpertBylineProps {
    name: string;
    credential: string;
    yearsExperience: number;
    avatarUrl?: string;
    linkedinUrl?: string;
    className?: string;
}

export function ExpertByline({ 
    name, 
    credential, 
    yearsExperience,
    avatarUrl,
    linkedinUrl,
    className = ""
}: ExpertBylineProps) {
    return (
        <div className={`flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 ${className}`}>
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white shrink-0">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
                ) : (
                    <User className="w-6 h-6" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
                    {linkedinUrl && (
                        <a 
                            href={linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary-600 transition-colors"
                            aria-label={`${name} on LinkedIn`}
                        >
                            <Linkedin className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Award className="w-3.5 h-3.5 text-primary-600" />
                    <span className="font-medium">{credential}</span>
                    <span className="text-gray-600">•</span>
                    <span>{yearsExperience} years experience</span>
                </div>
            </div>
        </div>
    );
}

export default ExpertByline;
