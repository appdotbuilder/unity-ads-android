
import { serial, text, pgTable, timestamp, boolean, integer, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const adFormatEnum = pgEnum('ad_format', ['interstitial', 'rewarded', 'banner']);
export const adStatusEnum = pgEnum('ad_status', ['active', 'inactive', 'testing']);

// Android App Configuration table
export const androidAppConfigTable = pgTable('android_app_configs', {
  id: serial('id').primaryKey(),
  app_name: text('app_name').notNull(),
  package_name: text('package_name').notNull(),
  unity_game_id: text('unity_game_id').notNull(),
  sdk_version: text('sdk_version').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Unity Ad Configuration table
export const unityAdConfigTable = pgTable('unity_ad_configs', {
  id: serial('id').primaryKey(),
  game_id: text('game_id').notNull(),
  placement_id: text('placement_id').notNull(),
  ad_format: adFormatEnum('ad_format').notNull(),
  status: adStatusEnum('status').notNull().default('testing'),
  test_mode: boolean('test_mode').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Ad Performance Metrics table
export const adPerformanceMetricsTable = pgTable('ad_performance_metrics', {
  id: serial('id').primaryKey(),
  config_id: integer('config_id').notNull().references(() => unityAdConfigTable.id),
  impressions: integer('impressions').notNull().default(0),
  clicks: integer('clicks').notNull().default(0),
  revenue: numeric('revenue', { precision: 10, scale: 4 }).notNull().default('0'),
  fill_rate: numeric('fill_rate', { precision: 5, scale: 2 }).notNull().default('0'), // Percentage with 2 decimal places
  ctr: numeric('ctr', { precision: 5, scale: 2 }).notNull().default('0'), // Click-through rate percentage
  ecpm: numeric('ecpm', { precision: 10, scale: 4 }).notNull().default('0'), // Effective cost per mille
  recorded_at: timestamp('recorded_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const unityAdConfigRelations = relations(unityAdConfigTable, ({ many }) => ({
  performanceMetrics: many(adPerformanceMetricsTable),
}));

export const adPerformanceMetricsRelations = relations(adPerformanceMetricsTable, ({ one }) => ({
  config: one(unityAdConfigTable, {
    fields: [adPerformanceMetricsTable.config_id],
    references: [unityAdConfigTable.id],
  }),
}));

// TypeScript types for the table schemas
export type AndroidAppConfig = typeof androidAppConfigTable.$inferSelect;
export type NewAndroidAppConfig = typeof androidAppConfigTable.$inferInsert;

export type UnityAdConfig = typeof unityAdConfigTable.$inferSelect;
export type NewUnityAdConfig = typeof unityAdConfigTable.$inferInsert;

export type AdPerformanceMetrics = typeof adPerformanceMetricsTable.$inferSelect;
export type NewAdPerformanceMetrics = typeof adPerformanceMetricsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  androidAppConfigs: androidAppConfigTable,
  unityAdConfigs: unityAdConfigTable,
  adPerformanceMetrics: adPerformanceMetricsTable,
};
