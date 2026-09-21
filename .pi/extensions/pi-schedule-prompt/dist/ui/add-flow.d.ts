/**
 * Interactive add flow for `/schedule-prompt`.
 * Steps the user through name → type → schedule (with re-prompt on validation
 * failure) → prompt → scope → confirm. Saves and schedules the new job, or
 * returns silently on cancellation.
 */
import type { ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { CronScheduler } from "../scheduler.js";
import type { ScheduleSettings } from "../settings.js";
import type { CronStorage } from "../storage.js";
export declare function runAddFlow(ctx: ExtensionCommandContext, storage: CronStorage, scheduler: CronScheduler, settings: ScheduleSettings, mySessionId: string | undefined): Promise<void>;
