"use client";

import React from 'react';
import { ExplainerDiagramProps } from '@/lib/visuals/types';

/**
 * Auto-generated Explainer Diagram
 * 
 * Generates editorial diagrams for explaining concepts:
 * - Process flows
 * - Comparisons
 * - Hierarchies
 * - Timelines
 */
export default function ExplainerDiagram({
    type,
    title,
    data,
    steps
}: ExplainerDiagramProps) {
    switch (type) {
        case 'process':
            return <ProcessDiagram title={title} steps={steps || []} />;
        case 'comparison':
            return <ComparisonDiagram title={title} data={data} />;
        case 'flow':
            return <FlowDiagram title={title} data={data} />;
        case 'hierarchy':
            return <HierarchyDiagram title={title} data={data} />;
        case 'timeline':
            return <TimelineDiagram title={title} data={data} />;
        default:
            return <GenericExplainerDiagram title={title} />;
    }
}

/**
 * Process Diagram - Step-by-step flow
 */
function ProcessDiagram({ title, steps }: { title: string; steps: Array<{ number: number; title: string; description: string }> }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">{title}</h3>
            <div className="flex flex-col md:flex-row items-start gap-6">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex-1 relative">
                        {/* Step Number */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-teal-100 border-2 border-teal-500 flex items-center justify-center shrink-0">
                                <span className="text-teal-700 font-bold text-lg">{step.number}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="hidden md:block flex-1 h-0.5 bg-slate-200 relative top-6 -z-10">
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-teal-500 rounded-full" />
                                </div>
                            )}
                        </div>
                        
                        {/* Step Content */}
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{step.title}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Comparison Diagram - Side-by-side comparison
 */
function ComparisonDiagram({ title, data }: { title: string; data: any }) {
    const items = data?.items || [];
    
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {items.map((item: any, idx: number) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-6">
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-4">{item.name}</h4>
                        <div className="space-y-3">
                            {item.features?.map((feature: string, fIdx: number) => (
                                <div key={fIdx} className="flex items-start gap-2">
                                    <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 bg-teal-600 rounded-full" />
                                    </div>
                                    <span className="text-sm text-slate-700">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Flow Diagram - Decision tree or flow chart
 */
function FlowDiagram({ title, data }: { title: string; data: any }) {
    const nodes = data?.nodes || [];
    
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>
            <div className="relative">
                <svg viewBox="0 0 800 400" className="w-full h-96">
                    {/* Flow Lines */}
                    {nodes.map((node: any, idx: number) => {
                        if (idx < nodes.length - 1) {
                            return (
                                <line
                                    key={`line-${idx}`}
                                    x1={node.x || (idx * 200 + 100)}
                                    y1={node.y || 200}
                                    x2={nodes[idx + 1].x || ((idx + 1) * 200 + 100)}
                                    y2={nodes[idx + 1].y || 200}
                                    stroke="#cbd5e1"
                                    strokeWidth="2"
                                    markerEnd="url(#arrowhead)"
                                />
                            );
                        }
                        return null;
                    })}
                    
                    {/* Arrow Marker */}
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                            <polygon points="0 0, 10 3, 0 6" fill="#cbd5e1" />
                        </marker>
                    </defs>
                    
                    {/* Nodes */}
                    {nodes.map((node: any, idx: number) => (
                        <g key={idx}>
                            <rect
                                x={(node.x || (idx * 200 + 50)) - 50}
                                y={(node.y || 200) - 30}
                                width="100"
                                height="60"
                                rx="8"
                                fill="#f1f5f9"
                                stroke="#0d9488"
                                strokeWidth="2"
                            />
                            <text
                                x={node.x || (idx * 200 + 100)}
                                y={node.y || 200}
                                fill="#0f172a"
                                fontSize="12"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {node.label || `Step ${idx + 1}`}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}

/**
 * Hierarchy Diagram - Organizational structure
 */
function HierarchyDiagram({ title, data }: { title: string; data: any }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>
            <div className="flex flex-col items-center">
                {/* Top Level */}
                <div className="mb-8">
                    <div className="px-6 py-3 bg-teal-100 border-2 border-teal-500 rounded-lg">
                        <span className="font-bold text-teal-900">{data?.top || 'Main Category'}</span>
                    </div>
                </div>
                
                {/* Connector */}
                <div className="w-0.5 h-8 bg-slate-300 mb-8" />
                
                {/* Sub Levels */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(data?.subs || []).map((sub: string, idx: number) => (
                        <div key={idx} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-center">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{sub}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Timeline Diagram - Chronological flow
 */
function TimelineDiagram({ title, data }: { title: string; data: any }) {
    const events = data?.events || [];
    
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>
            <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-300" />
                
                {/* Events */}
                <div className="space-y-8">
                    {events.map((event: any, idx: number) => (
                        <div key={idx} className="relative pl-16">
                            {/* Dot */}
                            <div className="absolute left-6 top-2 w-4 h-4 bg-teal-500 rounded-full border-4 border-white shadow-lg" />
                            
                            {/* Content */}
                            <div>
                                <div className="text-sm font-bold text-teal-600 mb-1">{event.date || `Step ${idx + 1}`}</div>
                                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{event.title}</h4>
                                {event.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{event.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Generic Explainer Diagram
 */
function GenericExplainerDiagram({ title }: { title: string }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{title}</h3>
            <div className="flex items-center justify-center h-64">
                <svg viewBox="0 0 200 200" className="w-48 h-48 opacity-20">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#0d9488" strokeWidth="2" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="#0d9488" strokeWidth="2" />
                    <circle cx="100" cy="100" r="20" fill="#0d9488" />
                </svg>
            </div>
        </div>
    );
}

