
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createAndroidAppConfigInputSchema,
  createUnityAdConfigInputSchema,
  updateUnityAdConfigInputSchema,
  createAdPerformanceInputSchema
} from './schema';

// Import handlers
import { createAndroidAppConfig } from './handlers/create_android_app_config';
import { getAndroidAppConfigs } from './handlers/get_android_app_configs';
import { createUnityAdConfig } from './handlers/create_unity_ad_config';
import { getUnityAdConfigs } from './handlers/get_unity_ad_configs';
import { getUnityAdConfigsByGameId } from './handlers/get_unity_ad_configs_by_game_id';
import { updateUnityAdConfig } from './handlers/update_unity_ad_config';
import { createAdPerformanceMetrics } from './handlers/create_ad_performance_metrics';
import { getAdPerformanceMetrics } from './handlers/get_ad_performance_metrics';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Android App Configuration routes
  createAndroidAppConfig: publicProcedure
    .input(createAndroidAppConfigInputSchema)
    .mutation(({ input }) => createAndroidAppConfig(input)),

  getAndroidAppConfigs: publicProcedure
    .query(() => getAndroidAppConfigs()),

  // Unity Ad Configuration routes
  createUnityAdConfig: publicProcedure
    .input(createUnityAdConfigInputSchema)
    .mutation(({ input }) => createUnityAdConfig(input)),

  getUnityAdConfigs: publicProcedure
    .query(() => getUnityAdConfigs()),

  getUnityAdConfigsByGameId: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(({ input }) => getUnityAdConfigsByGameId(input.gameId)),

  updateUnityAdConfig: publicProcedure
    .input(updateUnityAdConfigInputSchema)
    .mutation(({ input }) => updateUnityAdConfig(input)),

  // Ad Performance Metrics routes
  createAdPerformanceMetrics: publicProcedure
    .input(createAdPerformanceInputSchema)
    .mutation(({ input }) => createAdPerformanceMetrics(input)),

  getAdPerformanceMetrics: publicProcedure
    .input(z.object({ configId: z.number().optional() }))
    .query(({ input }) => getAdPerformanceMetrics(input.configId)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC Unity Ads server listening at port: ${port}`);
}

start();
