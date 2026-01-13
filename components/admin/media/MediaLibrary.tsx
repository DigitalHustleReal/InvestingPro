'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Copy, ExternalLink, Image as ImageIcon, FileText, Search, Grid, List } from 'lucide-react';
import { mediaService, MediaItem } from '@/lib/cms/media-service';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface MediaLibraryProps {
    onSelect?: (item: MediaItem) => void;
    selectionMode?: boolean;
}

export function MediaLibrary({ onSelect, selectionMode = false }: MediaLibraryProps) {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const loadItems = async () => {
        setLoading(true);
        try {
            const files = await mediaService.listFiles();
            setItems(files);
        } catch (error) {
            toast.error('Failed to load media library');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleDelete = async (e: React.MouseEvent, item: MediaItem) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this file?')) return;

        try {
            const success = await mediaService.deleteFile(item.id);
            if (success) {
                setItems(prev => prev.filter(i => i.id !== item.id));
                toast.success('File deleted');
                if (selectedId === item.id) setSelectedId(null);
            }
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const copyUrl = (e: React.MouseEvent, url: string) => {
        e.stopPropagation();
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard');
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleItemClick = (item: MediaItem) => {
        if (selectionMode) {
            onSelect?.(item);
        } else {
            setSelectedId(selectedId === item.id ? null : item.id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-brand-500"
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No media files found</p>
                </div>
            ) : (
                <div className={`
                    ${viewMode === 'grid' 
                        ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' 
                        : 'flex flex-col space-y-2'
                    }
                `}>
                    <AnimatePresence>
                        {filteredItems.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                onClick={() => handleItemClick(item)}
                                className={`
                                    group relative rounded-xl border transition-all cursor-pointer overflow-hidden
                                    ${selectedId === item.id 
                                        ? 'border-brand-500 ring-2 ring-brand-500/20 bg-slate-800' 
                                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-600 hover:shadow-lg'
                                    }
                                    ${viewMode === 'list' ? 'flex items-center p-4 gap-4' : 'aspect-square flex flex-col'}
                                `}
                            >
                                {viewMode === 'grid' ? (
                                    <>
                                        <div className="flex-1 relative w-full overflow-hidden bg-slate-950/50">
                                            {item.type.startsWith('image/') ? (
                                                <img 
                                                    src={item.url} 
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <FileText className="w-12 h-12" />
                                                </div>
                                            )}
                                            
                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => copyUrl(e, item.url)}
                                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
                                                    title="Copy URL"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-colors"
                                                    title="Open Original"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={(e) => handleDelete(e, item)}
                                                    className="p-2 bg-danger-500/20 hover:bg-danger-500/40 text-red-400 rounded-full backdrop-blur-sm transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-3 border-t border-slate-800">
                                            <p className="text-xs font-medium text-slate-300 truncate" title={item.name}>
                                                {item.name}
                                            </p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-[10px] text-slate-500">
                                                    {(item.size / 1024).toFixed(1)} KB
                                                </p>
                                                <p className="text-[10px] text-slate-500">
                                                    {format(new Date(item.created_at), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-lg bg-slate-950 overflow-hidden flex-shrink-0">
                                            {item.type.startsWith('image/') ? (
                                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-slate-600" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-200 truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500">
                                                {(item.size / 1024).toFixed(1)} KB • {format(new Date(item.created_at), 'MMM d, yyyy HH:mm')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => copyUrl(e, item.url)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button onClick={(e) => handleDelete(e, item)} className="p-2 hover:bg-danger-500/20 rounded-lg text-slate-400 hover:text-red-400">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
