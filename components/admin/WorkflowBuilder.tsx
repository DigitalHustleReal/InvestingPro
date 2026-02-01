"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
    Plus, 
    X,
    GripVertical,
    Trash2,
    ChevronDown,
    ChevronUp,
    FileText,
    Bell,
    Send,
    Clock,
    RefreshCw,
    GitBranch,
    Globe,
    Tag,
    User,
    Wand2,
    Calendar,
    ListPlus,
    MessageSquare,
    CheckCircle,
    XCircle,
    ArrowRight,
    Settings,
    AlertTriangle
} from 'lucide-react';
import { TRIGGER_DEFINITIONS, TriggerType, TriggerDefinition, ConfigField } from '@/lib/automation/workflow-triggers';
import { ACTION_DEFINITIONS, ActionType, ActionDefinition } from '@/lib/automation/workflow-actions';

// ============================================
// TYPES
// ============================================

export interface WorkflowCondition {
    id: string;
    field: string;
    operator: string;
    value: any;
}

export interface WorkflowAction {
    id: string;
    type: ActionType;
    config: Record<string, any>;
    continue_on_error?: boolean;
}

export interface WorkflowBuilderProps {
    triggerType: TriggerType;
    triggerConfig: Record<string, any>;
    conditions: WorkflowCondition[];
    actions: WorkflowAction[];
    onTriggerTypeChange: (type: TriggerType) => void;
    onTriggerConfigChange: (config: Record<string, any>) => void;
    onConditionsChange: (conditions: WorkflowCondition[]) => void;
    onActionsChange: (actions: WorkflowAction[]) => void;
    readOnly?: boolean;
}

// ============================================
// ICON MAPPING
// ============================================

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    FileText,
    Bell,
    Send,
    Clock,
    RefreshCw,
    GitBranch,
    Globe,
    Tag,
    User,
    Wand: Wand2,
    Calendar,
    ListPlus,
    MessageSquare,
    CheckCircle,
    XCircle,
    Edit: FileText,
    ArrowRightCircle: ArrowRight,
    Download: Globe,
    DollarSign: Tag,
    Hand: User,
    RefreshCcw: RefreshCw,
};

// ============================================
// MAIN COMPONENT
// ============================================

export function WorkflowBuilder({
    triggerType,
    triggerConfig,
    conditions,
    actions,
    onTriggerTypeChange,
    onTriggerConfigChange,
    onConditionsChange,
    onActionsChange,
    readOnly = false,
}: WorkflowBuilderProps) {
    const [expandedTrigger, setExpandedTrigger] = useState(true);
    const [expandedConditions, setExpandedConditions] = useState(true);
    const [expandedActions, setExpandedActions] = useState(true);
    const [showTriggerPicker, setShowTriggerPicker] = useState(false);
    const [showActionPicker, setShowActionPicker] = useState(false);

    const triggerDef = TRIGGER_DEFINITIONS[triggerType];

    // ============================================
    // HANDLERS
    // ============================================

    const handleAddCondition = () => {
        const newCondition: WorkflowCondition = {
            id: `cond_${Date.now()}`,
            field: '',
            operator: 'equals',
            value: '',
        };
        onConditionsChange([...conditions, newCondition]);
    };

    const handleUpdateCondition = (id: string, updates: Partial<WorkflowCondition>) => {
        onConditionsChange(
            conditions.map(c => c.id === id ? { ...c, ...updates } : c)
        );
    };

    const handleRemoveCondition = (id: string) => {
        onConditionsChange(conditions.filter(c => c.id !== id));
    };

    const handleAddAction = (type: ActionType) => {
        const actionDef = ACTION_DEFINITIONS[type];
        const defaultConfig: Record<string, any> = {};
        actionDef.configSchema.forEach(field => {
            if (field.default !== undefined) {
                defaultConfig[field.key] = field.default;
            }
        });

        const newAction: WorkflowAction = {
            id: `action_${Date.now()}`,
            type,
            config: defaultConfig,
        };
        onActionsChange([...actions, newAction]);
        setShowActionPicker(false);
    };

    const handleUpdateAction = (id: string, updates: Partial<WorkflowAction>) => {
        onActionsChange(
            actions.map(a => a.id === id ? { ...a, ...updates } : a)
        );
    };

    const handleRemoveAction = (id: string) => {
        onActionsChange(actions.filter(a => a.id !== id));
    };

    const handleMoveAction = (index: number, direction: 'up' | 'down') => {
        const newActions = [...actions];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= actions.length) return;
        [newActions[index], newActions[newIndex]] = [newActions[newIndex], newActions[index]];
        onActionsChange(newActions);
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="space-y-6">
            {/* Trigger Section */}
            <Card className="bg-wt-surface/50 border-wt-gold/30">
                <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedTrigger(!expandedTrigger)}
                >
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-wt-gold-subtle flex items-center justify-center">
                                <Wand2 className="w-4 h-4 text-wt-gold" />
                            </div>
                            <div>
                                <span className="text-wt-text">Trigger</span>
                                {triggerDef && (
                                    <Badge className="ml-2 bg-wt-gold-subtle text-wt-gold">
                                        {triggerDef.name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        {expandedTrigger ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </CardTitle>
                </CardHeader>
                {expandedTrigger && (
                    <CardContent className="space-y-4">
                        {/* Trigger Picker */}
                        {showTriggerPicker ? (
                            <TriggerPicker
                                selected={triggerType}
                                onSelect={(type) => {
                                    onTriggerTypeChange(type);
                                    onTriggerConfigChange({});
                                    setShowTriggerPicker(false);
                                }}
                                onClose={() => setShowTriggerPicker(false)}
                            />
                        ) : (
                            <>
                                {!readOnly && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowTriggerPicker(true)}
                                        className="w-full justify-start gap-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        Change Trigger
                                    </Button>
                                )}
                                
                                {/* Trigger Config */}
                                {triggerDef && triggerDef.configSchema.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-wt-border/50">
                                        <h4 className="text-sm font-medium text-wt-text">Trigger Settings</h4>
                                        <ConfigFields
                                            schema={triggerDef.configSchema}
                                            values={triggerConfig}
                                            onChange={onTriggerConfigChange}
                                            readOnly={readOnly}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                )}
            </Card>

            {/* Conditions Section */}
            <Card className="bg-wt-surface/50 border-warning-500/30">
                <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedConditions(!expandedConditions)}
                >
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-warning-500/20 flex items-center justify-center">
                                <GitBranch className="w-4 h-4 text-warning-400" />
                            </div>
                            <div>
                                <span className="text-wt-text">Conditions</span>
                                <Badge className="ml-2 bg-wt-card text-wt-text-muted">
                                    {conditions.length === 0 ? 'Always run' : `${conditions.length} condition${conditions.length !== 1 ? 's' : ''}`}
                                </Badge>
                            </div>
                        </div>
                        {expandedConditions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </CardTitle>
                </CardHeader>
                {expandedConditions && (
                    <CardContent className="space-y-4">
                        {conditions.length === 0 ? (
                            <p className="text-sm text-wt-text-muted">
                                No conditions - workflow will run every time trigger fires
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {conditions.map((condition, index) => (
                                    <ConditionRow
                                        key={condition.id}
                                        condition={condition}
                                        index={index}
                                        onUpdate={(updates) => handleUpdateCondition(condition.id, updates)}
                                        onRemove={() => handleRemoveCondition(condition.id)}
                                        readOnly={readOnly}
                                    />
                                ))}
                            </div>
                        )}
                        
                        {!readOnly && (
                            <Button
                                variant="outline"
                                onClick={handleAddCondition}
                                className="w-full gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Condition
                            </Button>
                        )}
                    </CardContent>
                )}
            </Card>

            {/* Actions Section */}
            <Card className="bg-wt-surface/50 border-wt-green/30">
                <CardHeader 
                    className="cursor-pointer"
                    onClick={() => setExpandedActions(!expandedActions)}
                >
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-wt-green-subtle flex items-center justify-center">
                                <Send className="w-4 h-4 text-wt-green" />
                            </div>
                            <div>
                                <span className="text-wt-text">Actions</span>
                                <Badge className="ml-2 bg-wt-green-subtle text-wt-green">
                                    {actions.length} action{actions.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                        </div>
                        {expandedActions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </CardTitle>
                </CardHeader>
                {expandedActions && (
                    <CardContent className="space-y-4">
                        {showActionPicker ? (
                            <ActionPicker
                                onSelect={handleAddAction}
                                onClose={() => setShowActionPicker(false)}
                            />
                        ) : (
                            <>
                                {actions.length === 0 ? (
                                    <div className="text-center py-8 text-wt-text-muted">
                                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p>No actions configured</p>
                                        <p className="text-sm">Add at least one action</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {actions.map((action, index) => (
                                            <ActionRow
                                                key={action.id}
                                                action={action}
                                                index={index}
                                                totalActions={actions.length}
                                                onUpdate={(updates) => handleUpdateAction(action.id, updates)}
                                                onRemove={() => handleRemoveAction(action.id)}
                                                onMove={(dir) => handleMoveAction(index, dir)}
                                                readOnly={readOnly}
                                            />
                                        ))}
                                    </div>
                                )}

                                {!readOnly && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowActionPicker(true)}
                                        className="w-full gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add Action
                                    </Button>
                                )}
                            </>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function TriggerPicker({
    selected,
    onSelect,
    onClose,
}: {
    selected: TriggerType;
    onSelect: (type: TriggerType) => void;
    onClose: () => void;
}) {
    const categories = ['content', 'quality', 'schedule', 'external', 'revenue'] as const;
    const categoryLabels = {
        content: 'Content Events',
        quality: 'Quality Events',
        schedule: 'Scheduling',
        external: 'External',
        revenue: 'Revenue',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-wt-text">Select Trigger</h4>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </div>
            
            {categories.map(category => {
                const triggers = Object.values(TRIGGER_DEFINITIONS).filter(t => t.category === category);
                if (triggers.length === 0) return null;

                return (
                    <div key={category}>
                        <h5 className="text-xs font-medium text-wt-text-muted uppercase mb-2">
                            {categoryLabels[category]}
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                            {triggers.map(trigger => {
                                const Icon = ICONS[trigger.icon] || FileText;
                                return (
                                    <button
                                        key={trigger.type}
                                        onClick={() => onSelect(trigger.type)}
                                        className={`p-3 rounded-lg border text-left transition-all ${
                                            selected === trigger.type
                                                ? 'bg-wt-gold-subtle border-wt-gold/50'
                                                : 'bg-wt-surface-hover border-wt-border/50 hover:bg-wt-surface-hover'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="w-4 h-4 text-wt-gold" />
                                            <span className="text-sm font-medium text-wt-text">{trigger.name}</span>
                                        </div>
                                        <p className="text-xs text-wt-text-muted line-clamp-2">
                                            {trigger.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ActionPicker({
    onSelect,
    onClose,
}: {
    onSelect: (type: ActionType) => void;
    onClose: () => void;
}) {
    const categories = ['content', 'notification', 'automation', 'integration', 'control'] as const;
    const categoryLabels = {
        content: 'Content',
        notification: 'Notifications',
        automation: 'Automation',
        integration: 'Integration',
        control: 'Control Flow',
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-medium text-wt-text">Select Action</h4>
                <Button variant="ghost" size="sm" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </div>

            {categories.map(category => {
                const categoryActions = Object.values(ACTION_DEFINITIONS).filter(a => a.category === category);
                if (categoryActions.length === 0) return null;

                return (
                    <div key={category}>
                        <h5 className="text-xs font-medium text-wt-text-muted uppercase mb-2">
                            {categoryLabels[category]}
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                            {categoryActions.map(action => {
                                const Icon = ICONS[action.icon] || FileText;
                                return (
                                    <button
                                        key={action.type}
                                        onClick={() => onSelect(action.type)}
                                        className="p-3 rounded-lg border bg-wt-surface-hover border-wt-border/50 hover:bg-wt-surface-hover text-left transition-all"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="w-4 h-4 text-wt-green" />
                                            <span className="text-sm font-medium text-wt-text">{action.name}</span>
                                        </div>
                                        <p className="text-xs text-wt-text-muted line-clamp-2">
                                            {action.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function ConditionRow({
    condition,
    index,
    onUpdate,
    onRemove,
    readOnly,
}: {
    condition: WorkflowCondition;
    index: number;
    onUpdate: (updates: Partial<WorkflowCondition>) => void;
    onRemove: () => void;
    readOnly: boolean;
}) {
    const operators = [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'gte', label: '≥' },
        { value: 'lte', label: '≤' },
        { value: 'in', label: 'In List' },
        { value: 'exists', label: 'Exists' },
    ];

    return (
        <div className="flex items-center gap-2 p-3 bg-wt-surface-hover rounded-lg border border-wt-border/50">
            <span className="text-xs text-wt-text-muted w-8">{index === 0 ? 'IF' : 'AND'}</span>
            
            <input
                type="text"
                value={condition.field}
                onChange={(e) => onUpdate({ field: e.target.value })}
                placeholder="Field (e.g., category)"
                disabled={readOnly}
                className="flex-1 px-2 py-1 text-sm bg-wt-surface border border-wt-border rounded"
            />
            
            <select
                value={condition.operator}
                onChange={(e) => onUpdate({ operator: e.target.value })}
                disabled={readOnly}
                className="px-2 py-1 text-sm bg-wt-surface border border-wt-border rounded"
            >
                {operators.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                ))}
            </select>
            
            <input
                type="text"
                value={condition.value}
                onChange={(e) => onUpdate({ value: e.target.value })}
                placeholder="Value"
                disabled={readOnly}
                className="flex-1 px-2 py-1 text-sm bg-wt-surface border border-wt-border rounded"
            />
            
            {!readOnly && (
                <Button variant="ghost" size="sm" onClick={onRemove}>
                    <Trash2 className="w-4 h-4 text-wt-danger" />
                </Button>
            )}
        </div>
    );
}

function ActionRow({
    action,
    index,
    totalActions,
    onUpdate,
    onRemove,
    onMove,
    readOnly,
}: {
    action: WorkflowAction;
    index: number;
    totalActions: number;
    onUpdate: (updates: Partial<WorkflowAction>) => void;
    onRemove: () => void;
    onMove: (direction: 'up' | 'down') => void;
    readOnly: boolean;
}) {
    const [expanded, setExpanded] = useState(false);
    const actionDef = ACTION_DEFINITIONS[action.type];
    const Icon = actionDef ? ICONS[actionDef.icon] || FileText : FileText;

    return (
        <div className="border border-wt-border/50 rounded-lg overflow-hidden">
            <div 
                className="flex items-center gap-3 p-3 bg-wt-surface-hover cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                {!readOnly && (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={(e) => { e.stopPropagation(); onMove('up'); }}
                            disabled={index === 0}
                            className="p-0.5 hover:bg-wt-surface-hover rounded disabled:opacity-30"
                        >
                            <ChevronUp className="w-3 h-3" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onMove('down'); }}
                            disabled={index === totalActions - 1}
                            className="p-0.5 hover:bg-wt-surface-hover rounded disabled:opacity-30"
                        >
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                )}
                
                <div className="w-6 h-6 rounded bg-wt-green-subtle flex items-center justify-center">
                    <span className="text-xs font-bold text-wt-green">{index + 1}</span>
                </div>
                
                <Icon className="w-4 h-4 text-wt-green" />
                
                <span className="flex-1 text-sm font-medium text-wt-text">
                    {actionDef?.name || action.type}
                </span>
                
                {!readOnly && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    >
                        <Trash2 className="w-4 h-4 text-wt-danger" />
                    </Button>
                )}
                
                {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
            
            {expanded && actionDef && (
                <div className="p-4 border-t border-wt-border/50 space-y-4">
                    <ConfigFields
                        schema={actionDef.configSchema}
                        values={action.config}
                        onChange={(config) => onUpdate({ config })}
                        readOnly={readOnly}
                    />
                    
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={action.continue_on_error || false}
                            onChange={(e) => onUpdate({ continue_on_error: e.target.checked })}
                            disabled={readOnly}
                            className="rounded"
                        />
                        <span className="text-wt-text-muted">Continue workflow if this action fails</span>
                    </label>
                </div>
            )}
        </div>
    );
}

function ConfigFields({
    schema,
    values,
    onChange,
    readOnly,
}: {
    schema: ConfigField[];
    values: Record<string, any>;
    onChange: (values: Record<string, any>) => void;
    readOnly: boolean;
}) {
    const handleChange = (key: string, value: any) => {
        onChange({ ...values, [key]: value });
    };

    return (
        <div className="space-y-4">
            {schema.map(field => (
                <div key={field.key}>
                    <label className="block text-sm font-medium text-wt-text mb-1">
                        {field.label}
                        {field.required && <span className="text-wt-danger ml-1">*</span>}
                    </label>
                    
                    {field.type === 'text' && (
                        <input
                            type="text"
                            value={values[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm bg-wt-surface border border-wt-border rounded-lg"
                        />
                    )}
                    
                    {field.type === 'number' && (
                        <input
                            type="number"
                            value={values[field.key] || ''}
                            onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                            placeholder={field.placeholder}
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm bg-wt-surface border border-wt-border rounded-lg"
                        />
                    )}
                    
                    {field.type === 'textarea' && (
                        <textarea
                            value={values[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            disabled={readOnly}
                            rows={3}
                            className="w-full px-3 py-2 text-sm bg-wt-surface border border-wt-border rounded-lg"
                        />
                    )}
                    
                    {field.type === 'select' && (
                        <select
                            value={values[field.key] || field.default || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            disabled={readOnly}
                            className="w-full px-3 py-2 text-sm bg-wt-surface border border-wt-border rounded-lg"
                        >
                            {!field.required && <option value="">Select...</option>}
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    )}
                    
                    {field.type === 'multiselect' && (
                        <div className="flex flex-wrap gap-2">
                            {field.options?.map(opt => {
                                const selected = (values[field.key] || []).includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        disabled={readOnly}
                                        onClick={() => {
                                            const current = values[field.key] || [];
                                            const updated = selected
                                                ? current.filter((v: string) => v !== opt.value)
                                                : [...current, opt.value];
                                            handleChange(field.key, updated);
                                        }}
                                        className={`px-3 py-1 text-sm rounded-full border transition-all ${
                                            selected
                                                ? 'bg-wt-gold-subtle border-wt-gold/50 text-wt-gold'
                                                : 'bg-wt-surface-hover border-wt-border/50 text-wt-text-muted hover:bg-wt-surface-hover'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                    
                    {field.type === 'boolean' && (
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={values[field.key] || false}
                                onChange={(e) => handleChange(field.key, e.target.checked)}
                                disabled={readOnly}
                                className="rounded"
                            />
                            <span className="text-sm text-wt-text-muted">Enable</span>
                        </label>
                    )}
                    
                    {field.type === 'cron' && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={values[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder || '0 9 * * *'}
                                disabled={readOnly}
                                className="w-full px-3 py-2 text-sm bg-wt-surface border border-wt-border rounded-lg font-mono"
                            />
                            <div className="flex flex-wrap gap-2 text-xs">
                                {[
                                    { label: '9 AM daily', value: '0 9 * * *' },
                                    { label: 'Every hour', value: '0 * * * *' },
                                    { label: 'Mon-Fri 9 AM', value: '0 9 * * 1-5' },
                                    { label: 'Weekly Sun', value: '0 0 * * 0' },
                                ].map(preset => (
                                    <button
                                        key={preset.value}
                                        type="button"
                                        onClick={() => handleChange(field.key, preset.value)}
                                        disabled={readOnly}
                                        className="px-2 py-1 bg-wt-surface-hover hover:bg-wt-surface-hover rounded text-wt-text-muted"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {field.helpText && (
                        <p className="text-xs text-wt-text-muted mt-1">{field.helpText}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default WorkflowBuilder;
