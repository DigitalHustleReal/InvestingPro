"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                alert(error.message || 'Login failed');
                setLoading(false);
                return;
            }

            if (data.user) {
                console.log('User authenticated:', data.user.id, data.user.email);
                // console.log('User authenticated:', data.user.id, data.user.email);
                
                // Verify admin role - try multiple times in case profile is still being created
                let profile = null;
                let profileError = null;
                
                // Try to get profile - try by ID first, then by email if that fails
                let profileData = null;
                let pError = null;
                
                // Method 1: Query by user ID
                const result1 = await supabase
                    .from('user_profiles')
                    .select('id, email, role, full_name')
                    .eq('id', data.user.id)
                    .single();
                
                profileData = result1.data;
                pError = result1.error;
                
                // console.log('Profile query by ID result:', { profileData, error: pError });
                
                // Method 2: If that fails, try by email (RLS might allow this)
                if (pError && !profileData) {
                    // console.log('Trying to query by email instead...');
                    const result2 = await supabase
                        .from('user_profiles')
                        .select('id, email, role, full_name')
                        .eq('email', data.user.email || email)
                        .maybeSingle();
                    
                    if (result2.data) {
                        profileData = result2.data;
                        pError = null;
                        // console.log('Profile found by email:', profileData);
                    } else {
                        // console.log('Profile not found by email either:', result2.error);
                    }
                }
                
                if (profileData) {
                    profile = profileData;
                    // console.log('Found profile:', profile);
                } else if (pError) {
                    profileError = pError;
                    console.error('Profile query error:', pError); // Keep this error log
                    
                    // If profile doesn't exist (PGRST116 = no rows returned), create it
                    if (pError.code === 'PGRST116') {
                        // console.log('Profile not found, creating it with admin role...');
                        const { data: newProfile, error: createError } = await supabase
                            .from('user_profiles')
                            .insert({
                                id: data.user.id,
                                email: data.user.email || email,
                                full_name: data.user.user_metadata?.full_name || '',
                                role: 'admin'
                            })
                            .select()
                            .single();
                        
                        if (newProfile && !createError) {
                            profile = newProfile;
                            // console.log('Created profile:', profile);
                        } else {
                            console.error('Failed to create profile:', createError); // Keep this error log
                        }
                    }
                }

                // console.log('Final profile check:', profile);
                // console.log('Role value:', profile?.role, 'Type:', typeof profile?.role);

                // Check if role is admin (handle both string and case variations)
                const isAdmin = profile?.role === 'admin' || 
                               profile?.role === 'Admin' || 
                               profile?.role === 'ADMIN' ||
                               (profile?.role && profile.role.toLowerCase() === 'admin');

                if (isAdmin) {
                    alert('Logged in successfully! Redirecting...');
                    router.push('/admin');
                    router.refresh();
                } else {
                    await supabase.auth.signOut();
                    const roleDisplay = profile?.role || 'not set';
                    const debugInfo = `User ID: ${data.user.id}, Email: ${email}, Profile found: ${!!profile}, Role: ${roleDisplay}`;
                    console.error('Admin check failed:', debugInfo);
                    alert(`Access denied. Admin role required.\n\nDebug info: ${debugInfo}\n\nPlease run this SQL:\nUPDATE user_profiles SET role = 'admin' WHERE email = '${email}';`);
                }
            }
        } catch (error: any) {
            console.error('Login error:', error);
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
                        <Lock style={{ width: '1.5rem', height: '1.5rem' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        Admin Login
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        Sign in to access the admin panel
                    </p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                                    color: '#1e293b',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                    color: '#1e293b',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>
                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                    <p>Don't have an account?</p>
                    <p style={{ marginTop: '0.25rem' }}>
                        <a
                            href="/admin/signup"
                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                        >
                            Sign up here
                        </a>
                        {' or create one in '}
                        <a
                            href="https://supabase.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#2563eb', textDecoration: 'underline' }}
                        >
                            Supabase Dashboard
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
