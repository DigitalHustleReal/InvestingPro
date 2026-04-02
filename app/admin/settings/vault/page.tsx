"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { Shield, Lock, Eye, EyeOff, Save, Key } from 'lucide-react';
import { toast } from 'sonner';

export default function CredentialVaultPage() {
    // In a real app, this should fetch from an encrypted DB column
    // For this MVP, we use localStorage for device-only privacy or a simple mock
    // User requested "notepad" style
    
    const [notes, setNotes] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('admin_vault_notes');
        if (saved) setNotes(saved);
    }, []);

    const handleSave = () => {
        localStorage.setItem('admin_vault_notes', notes);
        toast.success('Vault updated locally');
    };

    return (
        <AdminLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-surface-darker dark:bg-surface-darker rounded-lg text-accent-500">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Secure Vault</h1>
                        <p className="text-muted-foreground/70 dark:text-muted-foreground/70">Private notepad for API keys and credentials. (Stored Locally)</p>
                    </div>
                </div>

                <div className="bg-surface-darkest dark:bg-surface-darkest rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-surface-darker/50 dark:bg-surface-darker/50">
                        <div className="flex items-center gap-2 text-muted-foreground dark:text-muted-foreground">
                            <Key className="w-4 h-4" />
                            <span className="text-sm font-mono tracking-wider">CREDENTIAL_STORE.txt</span>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:text-foreground"
                                onClick={() => setIsVisible(!isVisible)}
                            >
                                {isVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                                {isVisible ? 'Hide Text' : 'Show Text'}
                            </Button>
                            <Button size="sm" onClick={handleSave} className="bg-accent-600 hover:bg-accent-700 text-foreground dark:text-foreground border-none">
                                <Save className="w-4 h-4 mr-2" />
                                Save Updates
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        {!isVisible && (
                            <div className="absolute inset-0 bg-surface-darkest dark:bg-surface-darkest/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-muted-foreground/70 dark:text-muted-foreground/70">
                                <Lock className="w-12 h-12 mb-4 opacity-20" />
                                <p>Content Hidden</p>
                                <Button variant="link" onClick={() => setIsVisible(true)}>Click to Reveal</Button>
                            </div>
                        )}
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[500px] w-full bg-surface-darkest dark:bg-surface-darkest text-success-400 font-mono text-sm p-6 border-none focus:ring-0 resize-none leading-relaxed"
                            placeholder={"// Paste your keys here\nOPENAI_API_KEY=sk-...\nSUPABASE_KEY=ey...\n\n// Note: This is stored in your browser's LocalStorage only."}
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
