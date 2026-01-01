/**
 * Semantic Image Extension for TipTap
 * 
 * WHY this exists:
 * - Images are NOT uploaded or stored as files
 * - Images are semantic references (e.g., "auto:elss:hero")
 * - These references are resolved at render time by the CMS
 * - Editor stores the semantic key exactly as provided
 * 
 * ANTI-PATTERNS avoided:
 * - No file uploads
 * - No storage bucket assumptions
 * - No image resolution in editor
 */

import Image from '@tiptap/extension-image';

/**
 * Semantic Image Extension
 * 
 * Extends TipTap Image extension to:
 * - Accept semantic references (auto:*)
 * - Store src exactly as provided
 * - Render placeholder in editor
 * - Never resolve or fetch images
 */
export const SemanticImage = Image.extend({
    name: 'image',

    addAttributes() {
        return {
            ...this.parent?.(),
            src: {
                default: null,
                parseHTML: (element) => {
                    // Parse semantic images from data attributes or src
                    const src = element.getAttribute('src') || element.getAttribute('data-src');
                    return src;
                },
                renderHTML: (attributes) => {
                    if (!attributes.src) {
                        return {};
                    }

                    const src = attributes.src;
                    const isSemantic = src.startsWith('auto:');

                    if (isSemantic) {
                        // Render semantic image as a div placeholder
                        // This will be styled by CSS
                        return {
                            'data-semantic-image': 'true',
                            'data-src': src,
                            class: 'semantic-image-placeholder inline-block',
                            style: 'display: inline-block; width: 100%; min-height: 200px; border: 2px dashed #cbd5e1; border-radius: 0.5rem; padding: 1rem; margin: 1rem 0; background-color: #f8fafc;',
                        };
                    }

                    // Regular image (fallback - shouldn't happen in production)
                    return {
                        src: src,
                        alt: attributes.alt || '',
                        class: 'max-w-full h-auto rounded-lg',
                    };
                },
            },
            alt: {
                default: null,
            },
        };
    },
});

