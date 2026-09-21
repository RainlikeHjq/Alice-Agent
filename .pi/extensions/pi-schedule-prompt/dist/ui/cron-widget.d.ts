/**
 * CronWidget — displays scheduled prompts below the editor
 *
 * Shows a table with status, name, schedule, next run, last run, and run count
 * Auto-refreshes every 30 seconds to update relative times
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { CronScheduler } from "../scheduler.js";
import type { CronStorage } from "../storage.js";
/**
 * Create and manage the cron widget
 */
export declare class CronWidget {
    private storage;
    private scheduler;
    private pi;
    private isVisible;
    private sessionId;
    private refreshInterval?;
    private ctx?;
    private unsubscribe;
    constructor(storage: CronStorage, scheduler: CronScheduler, pi: ExtensionAPI, isVisible: () => boolean, sessionId?: string | undefined);
    /** Jobs this session loads — same predicate as the scheduler. */
    private loadedJobs;
    show(ctx: any): void;
    hide(ctx: any): void;
    /** Re-mount the widget against the latest storage state. `show` handles the
     *  visibility / empty-list / first-mount cases uniformly. */
    private refresh;
    /**
     * Render the widget content
     */
    private renderWidget;
    /**
     * Cleanup
     */
    destroy(): void;
}
