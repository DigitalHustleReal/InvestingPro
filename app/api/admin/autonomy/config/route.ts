/**
 * API Route: Autonomy Configuration
 * 
 * Purpose: Configure autonomy levels for auto-publishing system
 * 
 * Endpoints:
 * - GET: Get current autonomy configuration
 * - POST: Update autonomy configuration
 * - PATCH: Update specific settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { createClient } from '@/lib/supabase/server';
import { confidenceScorer, ConfidenceThresholds, CategoryRule } from '@/lib/automation/confidence-scorer';
import { autoPublisher, AutoPublishConfig } from '@/lib/automation/auto-publisher';
import { anomalyDetector, DetectorConfig } from '@/lib/automation/anomaly-detector';

// ============================================
// TYPES
// ============================================

interface AutonomyConfig {
  // Overall autonomy level
  autonomyLevel: 'manual' | 'assisted' | 'semi-autonomous' | 'autonomous';
  
  // Auto-publish settings
  autoPublish: AutoPublishConfig;
  
  // Confidence thresholds
  confidenceThresholds: ConfidenceThresholds;
  
  // Category-specific rules
  categoryRules: CategoryRule[];
  
  // Anomaly detection settings
  anomalyDetection: DetectorConfig;
  
  // Metadata
  lastUpdated: string;
  updatedBy?: string;
}

// ============================================
// GET - Get current configuration
// ============================================

export async function GET() {
  try {
    const supabase = await createClient();

    // Get stored config from database
    const { data: storedConfig } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'autonomy_config')
      .single();

    // Build current config from all components
    const currentConfig: AutonomyConfig = {
      autonomyLevel: getAutonomyLevel(),
      autoPublish: autoPublisher.getConfig(),
      confidenceThresholds: confidenceScorer.getThresholds(),
      categoryRules: confidenceScorer.getCategoryRules(),
      anomalyDetection: anomalyDetector.getConfig(),
      lastUpdated: storedConfig?.value?.lastUpdated || new Date().toISOString(),
      updatedBy: storedConfig?.value?.updatedBy,
    };

    // Get stats
    const stats = await autoPublisher.getStats(7);

    return NextResponse.json({
      success: true,
      config: currentConfig,
      stats: {
        last7Days: stats,
        currentHourPublished: 0, // Would need to track in autoPublisher
        todayPublished: 0,
      },
      presets: getAutonomyPresets(),
    });
  } catch (error) {
    logger.error('Error getting autonomy config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get configuration' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Update full configuration
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Validate request
    const {
      autonomyLevel,
      autoPublish,
      confidenceThresholds,
      categoryRules,
      anomalyDetection,
    } = body;

    // Apply autonomy level preset if provided
    if (autonomyLevel) {
      applyAutonomyPreset(autonomyLevel);
    }

    // Update individual components
    if (autoPublish) {
      autoPublisher.updateConfig(autoPublish);
    }

    if (confidenceThresholds) {
      confidenceScorer.updateThresholds(confidenceThresholds);
    }

    if (categoryRules && Array.isArray(categoryRules)) {
      for (const rule of categoryRules) {
        confidenceScorer.updateCategoryRule(rule);
      }
    }

    if (anomalyDetection) {
      anomalyDetector.updateConfig(anomalyDetection);
    }

    // Save to database
    const configToSave: AutonomyConfig = {
      autonomyLevel: autonomyLevel || getAutonomyLevel(),
      autoPublish: autoPublisher.getConfig(),
      confidenceThresholds: confidenceScorer.getThresholds(),
      categoryRules: confidenceScorer.getCategoryRules(),
      anomalyDetection: anomalyDetector.getConfig(),
      lastUpdated: new Date().toISOString(),
      updatedBy: body.updatedBy || 'admin',
    };

    await supabase
      .from('system_settings')
      .upsert({
        key: 'autonomy_config',
        value: configToSave,
        updated_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      config: configToSave,
    });
  } catch (error) {
    logger.error('Error updating autonomy config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update configuration' },
      { status: 500 }
    );
  }
}

// ============================================
// PATCH - Update specific settings
// ============================================

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'setAutonomyLevel':
        if (params.level) {
          applyAutonomyPreset(params.level);
          return NextResponse.json({
            success: true,
            message: `Autonomy level set to: ${params.level}`,
          });
        }
        break;

      case 'enableAutoPublish':
        autoPublisher.setEnabled(true);
        return NextResponse.json({
          success: true,
          message: 'Auto-publish enabled',
        });

      case 'disableAutoPublish':
        autoPublisher.setEnabled(false);
        return NextResponse.json({
          success: true,
          message: 'Auto-publish disabled',
        });

      case 'setDryRun':
        autoPublisher.setDryRun(params.enabled ?? true);
        return NextResponse.json({
          success: true,
          message: `Dry run mode ${params.enabled ? 'enabled' : 'disabled'}`,
        });

      case 'updateThresholds':
        if (params.thresholds) {
          confidenceScorer.updateThresholds(params.thresholds);
          return NextResponse.json({
            success: true,
            message: 'Thresholds updated',
            thresholds: confidenceScorer.getThresholds(),
          });
        }
        break;

      case 'updateCategoryRule':
        if (params.rule) {
          confidenceScorer.updateCategoryRule(params.rule);
          return NextResponse.json({
            success: true,
            message: `Category rule updated for: ${params.rule.category}`,
          });
        }
        break;

      case 'setSensitivity':
        if (params.sensitivity) {
          anomalyDetector.setSensitivity(params.sensitivity);
          return NextResponse.json({
            success: true,
            message: `Anomaly detection sensitivity set to: ${params.sensitivity}`,
          });
        }
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid parameters' },
      { status: 400 }
    );
  } catch (error) {
    logger.error('Error in PATCH autonomy config:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get current autonomy level based on config
 */
function getAutonomyLevel(): AutonomyConfig['autonomyLevel'] {
  const config = autoPublisher.getConfig();
  const thresholds = confidenceScorer.getThresholds();

  if (!config.enabled) return 'manual';
  if (config.dryRun) return 'assisted';
  if (thresholds.autoPublishMinScore >= 90 && thresholds.autoPublishMinConfidence >= 0.95) {
    return 'semi-autonomous';
  }
  return 'autonomous';
}

/**
 * Get autonomy presets
 */
function getAutonomyPresets() {
  return {
    manual: {
      name: 'Manual',
      description: 'All articles require human review before publishing',
      autoPublishEnabled: false,
      confidenceThreshold: 100,
      riskLevel: 'none',
    },
    assisted: {
      name: 'Assisted',
      description: 'AI suggests, human approves. Dry-run mode for auto-publish.',
      autoPublishEnabled: true,
      dryRun: true,
      confidenceThreshold: 90,
      riskLevel: 'low',
    },
    'semi-autonomous': {
      name: 'Semi-Autonomous',
      description: 'Auto-publish high-confidence content (>95%), review exceptions',
      autoPublishEnabled: true,
      dryRun: false,
      confidenceThreshold: 95,
      minScore: 90,
      riskLevel: 'medium',
    },
    autonomous: {
      name: 'Autonomous',
      description: 'Auto-publish most content (>85% confidence), minimal human intervention',
      autoPublishEnabled: true,
      dryRun: false,
      confidenceThreshold: 85,
      minScore: 80,
      riskLevel: 'high',
    },
  };
}

/**
 * Apply autonomy preset
 */
function applyAutonomyPreset(level: AutonomyConfig['autonomyLevel']) {
  switch (level) {
    case 'manual':
      autoPublisher.updateConfig({
        enabled: false,
        dryRun: false,
      });
      confidenceScorer.updateThresholds({
        autoPublishMinScore: 100,
        autoPublishMinConfidence: 1.0,
      });
      anomalyDetector.setSensitivity('high');
      break;

    case 'assisted':
      autoPublisher.updateConfig({
        enabled: true,
        dryRun: true,
        maxAutoPublishPerHour: 20,
        maxAutoPublishPerDay: 100,
      });
      confidenceScorer.updateThresholds({
        autoPublishMinScore: 90,
        autoPublishMinConfidence: 0.95,
      });
      anomalyDetector.setSensitivity('high');
      break;

    case 'semi-autonomous':
      autoPublisher.updateConfig({
        enabled: true,
        dryRun: false,
        maxAutoPublishPerHour: 10,
        maxAutoPublishPerDay: 50,
      });
      confidenceScorer.updateThresholds({
        autoPublishMinScore: 90,
        autoPublishMinConfidence: 0.95,
      });
      anomalyDetector.setSensitivity('medium');
      break;

    case 'autonomous':
      autoPublisher.updateConfig({
        enabled: true,
        dryRun: false,
        maxAutoPublishPerHour: 15,
        maxAutoPublishPerDay: 75,
      });
      confidenceScorer.updateThresholds({
        autoPublishMinScore: 85,
        autoPublishMinConfidence: 0.9,
      });
      anomalyDetector.setSensitivity('medium');
      break;
  }
}
