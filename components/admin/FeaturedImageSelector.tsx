"use client";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, Wand2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface FeaturedImageSelectorProps {
    imageUrl?: string;
    onImageSelect: (url: string) => void;
}

export default function FeaturedImageSelector({ imageUrl, onImageSelect }: FeaturedImageSelectorProps) {
    const [urlInput, setUrlInput] = useState(imageUrl || '');
    const [keyword, setKeyword] = useState('');
    const [generating, setGenerating] = useState(false);

    const [libraryImages, setLibraryImages] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'generate' | 'library'>('generate');

    // Load library manifest
    useEffect(() => {
        fetch('/images/stock/manifest.json')
            .then(res => res.ok ? res.json() : [])
            .then(data => setLibraryImages(data))
            .catch(() => setLibraryImages([]));
    }, []);

    // Sync if prop changes externally
    useEffect(() => {
        if (imageUrl) setUrlInput(imageUrl);
    }, [imageUrl]);

    const handleGenerate = async () => {
        if (!keyword.trim()) {
            toast.error("Enter a keyword to generate");
            return;
        }
        setGenerating(true);
        try {
            const res = await fetch('/api/admin/editor-tools', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'generate-image', keyword })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error);
            
            setUrlInput(json.url);
            onImageSelect(json.url);
            toast.success(`Image generated from ${json.source}`);
        } catch (e: any) {
            console.error(e);
            toast.error("Generation failed");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-4 border border-slate-200 rounded-lg p-3 bg-white">
             {/* Preview */}
             <div className="relative aspect-video bg-slate-100 rounded-md overflow-hidden border border-slate-200 group">
                 {urlInput ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={urlInput} alt="Featured" className="w-full h-full object-cover" />
                 ) : (
                     <div className="flex items-center justify-center h-full text-slate-400 gap-2">
                         <ImageIcon className="w-6 h-6 opacity-50" />
                         <span className="text-xs">No image selected</span>
                     </div>
                 )}
             </div>
             
             {/* Manual Mobile Input */}
             <div>
                <Label className="text-[10px] text-slate-400 mb-1 block uppercase tracking-wider">Image URL</Label>
                <div className="flex gap-2">
                    <Input 
                        value={urlInput} 
                        onChange={(e) => {
                            setUrlInput(e.target.value);
                            onImageSelect(e.target.value);
                        }}
                        placeholder="https://..."
                        className="h-7 text-xs font-mono"
                    />
                </div>
             </div>

             {/* Tabs Header */}
             <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <button 
                    onClick={() => setViewMode('generate')}
                    className={`text-xs font-medium px-2 py-1 rounded ${viewMode === 'generate' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Auto-Generate
                </button>
                <button 
                    onClick={() => setViewMode('library')}
                    className={`text-xs font-medium px-2 py-1 rounded ${viewMode === 'library' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Library ({libraryImages.length})
                </button>
             </div>

             {/* Tab Content: Generate */}
             {viewMode === 'generate' && (
                 <div className="pt-2">
                      <Label className="text-xs text-slate-900 font-semibold mb-2 flex items-center gap-1">
                          <Wand2 className="w-3 h-3 text-purple-600" />
                          Stock / AI Search
                      </Label>
                      <div className="flex gap-2">
                          <Input 
                              value={keyword}
                              onChange={(e) => setKeyword(e.target.value)}
                              placeholder="Topic..."
                              className="h-8 text-xs bg-white"
                              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                          />
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={handleGenerate}
                            disabled={generating}
                            className="h-8 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                             {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : "Gen"}
                          </Button>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                          Uses Pixabay, Unsplash, or Flux AI.
                      </p>
                 </div>
             )}

             {/* Tab Content: Library */}
             {viewMode === 'library' && (
                 <div className="pt-2">
                     <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-1">
                        {libraryImages.length > 0 ? libraryImages.map((img: any) => (
                            <button 
                                key={img.filename}
                                onClick={() => {
                                    setUrlInput(img.url);
                                    onImageSelect(img.url);
                                    toast.success("Used library image");
                                }}
                                className="relative aspect-square rounded overflow-hidden border border-slate-200 hover:border-purple-500 hover:ring-2 hover:ring-purple-200 transition-all group"
                                title={img.alt}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </button>
                        )) : (
                            <div className="col-span-3 text-center py-4 text-xs text-slate-400 italic">
                                No local images found.<br/>
                                (Run scripts/download-stock-library.ts)
                            </div>
                        )}
                     </div>
                 </div>
             )}
        </div>
    );
}
