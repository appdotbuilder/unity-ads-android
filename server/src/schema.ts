
import { z } from 'zod';

// Unity Ad Format enum
export const adFormatSchema = z.enum(['interstitial', 'rewarded', 'banner']);
export type AdFormat = z.infer<typeof adFormatSchema>;

// Unity Ad Status enum
export const adStatusSchema = z.enum(['active', 'inactive', 'testing']);
export type AdStatus = z.infer<typeof adStatusSchema>;

// Unity Ad Configuration schema
export const unityAdConfigSchema = z.object({
  id: z.number(),
  game_id: z.string(),
  placement_id: z.string(),
  ad_format: adFormatSchema,
  status: adStatusSchema,
  test_mode: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type UnityAdConfig = z.infer<typeof unityAdConfigSchema>;

// Input schema for creating Unity Ad configurations
export const createUnityAdConfigInputSchema = z.object({
  game_id: z.string().min(1, "Game ID is required"),
  placement_id: z.string().min(1, "Placement ID is required"),
  ad_format: adFormatSchema,
  status: adStatusSchema.default('testing'),
  test_mode: z.boolean().default(true)
});

export type CreateUnityAdConfigInput = z.infer<typeof createUnityAdConfigInputSchema>;

// Input schema for updating Unity Ad configurations
export const updateUnityAdConfigInputSchema = z.object({
  id: z.number(),
  game_id: z.string().min(1).optional(),
  placement_id: z.string().min(1).optional(),
  ad_format: adFormatSchema.optional(),
  status: adStatusSchema.optional(),
  test_mode: z.boolean().optional()
});

export type UpdateUnityAdConfigInput = z.infer<typeof updateUnityAdConfigInputSchema>;

// Unity Ad Performance Metrics schema
export const adPerformanceMetricsSchema = z.object({
  id: z.number(),
  config_id: z.number(),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  revenue: z.number().nonnegative(),
  fill_rate: z.number().min(0).max(100), // Percentage
  ctr: z.number().min(0).max(100), // Click-through rate percentage
  ecpm: z.number().nonnegative(), // Effective cost per mille
  recorded_at: z.coerce.date(),
  created_at: z.coerce.date()
});

export type AdPerformanceMetrics = z.infer<typeof adPerformanceMetricsSchema>;

// Input schema for creating performance metrics
export const createAdPerformanceInputSchema = z.object({
  config_id: z.number(),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  revenue: z.number().nonnegative(),
  fill_rate: z.number().min(0).max(100),
  ctr: z.number().min(0).max(100),
  ecpm: z.number().nonnegative(),
  recorded_at: z.coerce.date()
});

export type CreateAdPerformanceInput = z.infer<typeof createAdPerformanceInputSchema>;

// Android App Configuration schema
export const androidAppConfigSchema = z.object({
  id: z.number(),
  app_name: z.string(),
  package_name: z.string(),
  unity_game_id: z.string(),
  sdk_version: z.string(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AndroidAppConfig = z.infer<typeof androidAppConfigSchema>;

// Input schema for creating Android app configuration
export const createAndroidAppConfigInputSchema = z.object({
  app_name: z.string().min(1, "App name is required"),
  package_name: z.string().min(1, "Package name is required"),
  unity_game_id: z.string().min(1, "Unity Game ID is required"),
  sdk_version: z.string().min(1, "SDK version is required"),
  is_active: z.boolean().default(true)
});

export type CreateAndroidAppConfigInput = z.infer<typeof createAndroidAppConfigInputSchema>;

// Input schema for updating Android app configuration
export const updateAndroidAppConfigInputSchema = z.object({
  id: z.number(),
  app_name: z.string().min(1).optional(),
  package_name: z.string().min(1).optional(),
  unity_game_id: z.string().min(1).optional(),
  sdk_version: z.string().min(1).optional(),
  is_active: z.boolean().optional()
});

export type UpdateAndroidAppConfigInput = z.infer<typeof updateAndroidAppConfigInputSchema>;
