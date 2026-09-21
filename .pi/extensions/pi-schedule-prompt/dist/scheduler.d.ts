import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CronStorage } from "./storage.js";
import type { CronJob, CronJobType } from "./types.js";
/** Result of `CronScheduler.validateSchedule`. On success, `schedule` is the
 *  resolved form to persist (ISO for `once`, original for `cron`/`interval`). */
type ValidateScheduleResult = {
    ok: true;
    schedule: string;
    intervalMs?: number;
} | {
    ok: false;
    error: string;
};
/**
 * Manages cron job scheduling and execution
 */
export declare class CronScheduler {
    private jobs;
    private intervals;
    private activeSubagents;
    private readonly storage;
    private readonly pi;
    private readonly ctx;
    constructor(storage: CronStorage, pi: ExtensionAPI, ctx: ExtensionContext);
    /**
     * Schedule all enabled jobs loaded for this session — see `isLoadedFor`.
     * Foreign-session jobs are skipped so two pis in the same cwd don't double-fire.
     *
     * Also clears stale `lastStatus: "running"` from an interrupted prior run of
     * *this* session (process kill, abort) — otherwise the widget sticks on `⟳`
     * until the cron next fires. Other sessions' flags are theirs to manage.
     */
    start(): void;
    /** Unbound jobs (no `session` field) load for everyone. */
    static isLoadedFor(job: CronJob, sessionId: string | undefined): boolean;
    /**
     * Stop all scheduled jobs
     */
    stop(): void;
    /**
     * Add and schedule a new job
     */
    addJob(job: CronJob): void;
    /**
     * Remove and unschedule a job
     */
    removeJob(id: string): void;
    /**
     * Update a job (reschedule if needed)
     */
    updateJob(id: string, updated: CronJob): void;
    /**
     * Get next run time for a job
     */
    getNextRun(jobId: string): Date | null;
    /**
     * Schedule a single job
     */
    private scheduleJob;
    /**
     * Unschedule a job
     */
    private unscheduleJob;
    /**
     * Execute a job's prompt
     */
    private executeJob;
    /**
     * Run a job's prompt in a fresh in-process AgentSession with the chosen model.
     * Fire-and-forget: the cron tick returns immediately so other jobs keep firing.
     */
    private executeJobInSubagent;
    /**
     * Emit a change event via pi.events
     */
    private emitChange;
    /**
     * Validate a cron expression (must be 6-field format with seconds)
     */
    static validateCronExpression(expression: string): {
        valid: boolean;
        error?: string;
    };
    /**
     * Parse relative time delta (e.g., "+10s", "+5m", "+1h")
     * Returns ISO timestamp if valid, null otherwise
     */
    static parseRelativeTime(delta: string): string | null;
    /**
     * Parse interval string to milliseconds
     */
    static parseInterval(interval: string): number | null;
    /**
     * Validate and resolve a schedule string for the given type.
     * Single source of truth shared by tool `add`/`update` and the UI command.
     *
     * - `cron`: validates the 6-field expression
     * - `once`: accepts ISO timestamps and relative time (`+10s`); rejects past
     *   timestamps and ones <5s away (the agent should use relative time instead)
     * - `interval`: accepts duration strings (`5m`, `1h`, `30s`)
     */
    static validateSchedule(type: CronJobType, schedule: string): ValidateScheduleResult;
    /**
     * Render a resolved schedule as a short human-readable phrase.
     * Used for confirm dialogs and the widget. `schedule` is the resolved form
     * returned by `validateSchedule` (ISO for `once`).
     */
    static describeSchedule(type: CronJobType, schedule: string): string;
}
/** Human-readable form of a 6-field cron expression for common patterns.
 *  Falls back to the raw expression for anything not recognized — never
 *  guesses a wrong description. Callers truncate for column-width displays. */
export declare function humanizeCron(expression: string): string;
/** Compact ISO timestamp render: "Feb 13 15:30". Returns the input unchanged
 *  if it doesn't parse as a date. */
export declare function formatISOShort(input: Date | string): string;
export {};
