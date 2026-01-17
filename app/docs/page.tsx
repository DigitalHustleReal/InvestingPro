/**
 * OpenAPI Documentation UI
 * 
 * Interactive API documentation using Swagger UI (CDN)
 */

'use client';

import { useEffect } from 'react';

export default function APIDocsPage() {
    useEffect(() => {
        // Load Swagger UI from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore - SwaggerUIBundle is loaded from CDN
            if (window.SwaggerUIBundle) {
                // @ts-ignore
                window.SwaggerUIBundle({
                    url: '/api/docs',
                    dom_id: '#swagger-ui',
                    presets: [
                        // @ts-ignore
                        window.SwaggerUIBundle.presets.apis,
                        // @ts-ignore
                        window.SwaggerUIBundle.presets.standalone,
                    ],
                    layout: 'StandaloneLayout',
                });
            }
        };
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(script);
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h1>
                    <p className="text-gray-600">
                        Interactive API documentation for InvestingPro platform. 
                        Use the "Authorize" button to authenticate with your API token.
                    </p>
                </div>
                <div id="swagger-ui"></div>
            </div>
        </div>
    );
}
