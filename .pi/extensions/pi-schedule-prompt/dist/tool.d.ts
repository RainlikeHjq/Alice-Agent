import type { ToolDefinition } from "@earendil-works/pi-coding-agent";
import { CronScheduler } from "./scheduler.js";
import type { JobScope } from "./settings.js";
import type { CronStorage } from "./storage.js";
import type { CronToolDetails } from "./types.js";
import { CronToolParams } from "./types.js";
/**
 * Create the schedule_prompt tool definition.
 * `getDefaultScope` is a getter so live setting toggles affect the next `add`.
 */
export declare function createCronTool(getStorage: () => CronStorage, getScheduler: () => CronScheduler, getDefaultScope?: () => JobScope): ToolDefinition<typeof CronToolParams, CronToolDetails>;
