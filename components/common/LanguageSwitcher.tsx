"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
    { code: 'en', name: 'English', label: 'EN' },
    { code: 'hi', name: 'Hindi (हिंदी)', label: 'HI' },
    { code: 'te', name: 'Telugu (తెలుగు)', label: 'TE' },
    { code: 'mr', name: 'Marathi (मराठी)', label: 'MR' },
    { code: 'ta', name: 'Tamil (தமிழ்)', label: 'TA' },
    { code: 'bn', name: 'Bengali (বাংলা)', label: 'BN' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)', label: 'GU' },
];

export default function LanguageSwitcher({ isMobile = false }: { isMobile?: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const [currentLang, setCurrentLang] = React.useState('en');

    // Detect language from URL
    React.useEffect(() => {
        if (!pathname) return;
        
        const found = LANGUAGES.find(l => 
            l.code !== 'en' && (pathname.endsWith(`-${l.code}`) || pathname.includes(`/${l.code}/`))
        );
        
        if (found) setCurrentLang(found.code);
        else setCurrentLang('en');
    }, [pathname]);

    const handleLanguageChange = (langCode: string) => {
        if (langCode === currentLang) return;
        
        let newPath = pathname;
        // Is this an article page? (Very basic check)
        const isArticle = pathname.startsWith('/articles/') || pathname.startsWith('/article/');

        if (isArticle) {
            if (currentLang !== 'en') {
                newPath = newPath.replace(new RegExp(`-${currentLang}$`), '');
            }
            if (langCode !== 'en') {
                newPath = `${newPath}-${langCode}`;
            }
            router.push(newPath);
        } else {
            if (langCode !== 'en') {
                // For demo purposes, we alert if not on an article
                // Ideally this would go to /te/home
                alert("Translation is currently active for Articles pages.");
            } else {
                router.push('/');
            }
        }
    };

    if (isMobile) {
        return (
            <div className="grid grid-cols-2 gap-2">
                {LANGUAGES.map((lang) => (
                    <Button
                        key={lang.code}
                        variant={currentLang === lang.code ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleLanguageChange(lang.code)}
                        className="w-full justify-start text-xs"
                    >
                        {lang.name}
                        {currentLang === lang.code && <Check className="ml-auto w-3 h-3" />}
                    </Button>
                ))}
            </div>
        );
    }

    return (
        <Select value={currentLang} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[110px] h-9 text-xs font-medium border-gray-200 bg-transparent hover:bg-gray-50 focus:ring-0">
                <Globe className="w-3 h-3 mr-2 opacity-50" />
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent align="end">
                {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-xs">
                        {lang.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
