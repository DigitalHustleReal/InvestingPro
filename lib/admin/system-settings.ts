/**
 * System Settings Management
 * Production Safety: Centralized system configuration and automation control
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Update a system setting
 */
export async function updateSystemSetting(key: string, value: any): Promise<void> {
    const { error } = await supabase
        .from('system_settings')
        .upsert({
            key,
            value: typeof value === 'object' ? JSON.stringify(value) : String(value),
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'key'
        });
    
    if (error) {
        throw new Error(`Failed to update system setting ${key}: ${error.message}`);
    }
}

/**
 * Get a system setting
 */
export async function getSystemSetting(key: string): Promise<any> {
    const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', key)
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') {
            // Setting not found
            return null;
        }
        throw new Error(`Failed to get system setting ${key}: ${error.message}`);
    }
    
    // Try to parse as JSON, fallback to string
    try {
        return JSON.parse(data.value);
    } catch {
        return data.value;
    }
}

/**
 * Get all system settings
 */
export async function getAllSystemSettings(): Promise<Record<string, any>> {
    const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');
    
    if (error) {
        throw new Error(`Failed to get system settings: ${error.message}`);
    }
    
    const settings: Record<string, any> = {};
    for (const setting of data || []) {
        try {
            settings[setting.key] = JSON.parse(setting.value);
        } catch {
            settings[setting.key] = setting.value;
        }
    }
    
    return settings;
}

/**
 * Check if automation is paused
 */
export async function isAutomationPaused(): Promise<boolean> {
    const paused = await getSystemSetting('automation_paused');
    return paused === true || paused === 'true';
}

/**
 * Get automation pause reason
 */
export async function getAutomationPauseReason(): Promise<string | null> {
    return await getSystemSetting('automation_paused_reason');
}
