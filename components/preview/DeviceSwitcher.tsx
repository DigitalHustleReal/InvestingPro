"use client";

import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface DeviceSwitcherProps {
    currentDevice: 'mobile' | 'tablet' | 'desktop';
    onDeviceChange: (device: 'mobile' | 'tablet' | 'desktop') => void;
}

export function DeviceSwitcher({ currentDevice, onDeviceChange }: DeviceSwitcherProps) {
    const devices = [
        { id: 'mobile' as const, icon: Smartphone, label: 'Mobile', width: '375px' },
        { id: 'tablet' as const, icon: Tablet, label: 'Tablet', width: '768px' },
        { id: 'desktop' as const, icon: Monitor, label: 'Desktop', width: '100%' }
    ];

    return (
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {devices.map((device) => {
                const Icon = device.icon;
                const isActive = currentDevice === device.id;

                return (
                    <button
                        key={device.id}
                        onClick={() => onDeviceChange(device.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                            isActive
                                ? 'bg-white text-secondary-600 shadow-sm font-medium'
                                : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={`${device.label} view (${device.width})`}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm">{device.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
