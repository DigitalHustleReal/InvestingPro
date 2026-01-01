"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Loader2, UserPlus, Mail, Lock, User } from 'lucide-react';

export default function AdminSignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                alert(error.message || 'Signup failed');
                setLoading(false);
                return;
            }

            if (data.user) {
                alert('Account created! Setting admin role...');
                
                // Wait a moment for the trigger to create user_profiles
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // First, try to create user_profiles if it doesn't exist
                const { error: insertError } = await supabase
                    .from('user_profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email || email,
                        full_name: fullName || data.user.user_metadata?.full_name || '',
                        role: 'admin'
                    })
                    .select()
                    .single();

                // If insert fails (profile already exists), try update
                if (insertError) {
                    console.log('Profile might already exist, trying update...', insertError);
                    
                    // Check if it's a recursion error
                    if (insertError.message?.includes('recursion') || insertError.message?.includes('infinite')) {
                        alert(`Account created but RLS policy has recursion issue. Please run FIX_RLS_RECURSION.sql first, then run: UPDATE user_profiles SET role = 'admin' WHERE email = '${email}';`);
                        console.error('RLS recursion error:', insertError);
                        return;
                    }
                    
                    const { error: updateError } = await supabase
                        .from('user_profiles')
                        .update({ role: 'admin' })
                        .eq('id', data.user.id);

                    if (updateError) {
                        console.error('Failed to set admin role:', updateError);
                        if (updateError.message?.includes('recursion') || updateError.message?.includes('infinite')) {
                            alert(`Account created but RLS policy has recursion issue. Please run FIX_RLS_RECURSION.sql first, then run: UPDATE user_profiles SET role = 'admin' WHERE email = '${email}';`);
                        } else {
                            alert(`Account created but failed to set admin role. Error: ${updateError.message}. Please run this SQL: UPDATE user_profiles SET role = 'admin' WHERE email = '${email}';`);
                        }
                        return;
                    }
                }

                alert('Admin account created successfully! Redirecting...');
                router.push('/admin');
                router.refresh();
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            alert(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            style={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f1f5f9',
                padding: '1rem'
            }}
        >
            <div 
                style={{
                    width: '100%',
                    maxWidth: '28rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '1.5rem'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ 
                        display: 'inline-flex',
                        backgroundColor: '#0f172a',
                        color: 'white',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem'
                    }}>
                        <UserPlus style={{ width: '1.5rem', height: '1.5rem' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Create Admin Account
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Sign up for admin access
                    </p>
                </div>

                <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="fullName" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            Full Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ 
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                width: '1rem',
                                height: '1rem',
                                pointerEvents: 'none'
                            }} />
                            <input
                                id="fullName"
                                type="text"
                                placeholder="Your name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    height: '2.5rem',
                                    paddingLeft: '2.5rem',
                                    paddingRight: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    color: '#1e293b'
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="email" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ 
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                width: '1rem',
                                height: '1rem',
                                pointerEvents: 'none'
                            }} />
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    height: '2.5rem',
                                    paddingLeft: '2.5rem',
                                    paddingRight: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    color: '#1e293b'
                                }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label htmlFor="password" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ 
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#94a3b8',
                                width: '1rem',
                                height: '1rem',
                                pointerEvents: 'none'
                            }} />
                            <input
                                id="password"
                                type="password"
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    height: '2.5rem',
                                    paddingLeft: '2.5rem',
                                    paddingRight: '0.75rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                    backgroundColor: 'white',
                                    color: '#1e293b'
                                }}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                                Creating account...
                            </>
                        ) : (
                            'Create Admin Account'
                        )}
                    </Button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                    <p>
                        Already have an account?{' '}
                        <a
                            href="/admin/login"
                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
