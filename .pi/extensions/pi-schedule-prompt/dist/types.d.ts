import { type Static, Type } from "@earendil-works/pi-ai";
/**
 * Type of cron job
 */
export type CronJobType = "cron" | "once" | "interval";
/**
 * Status of the last job execution
 */
export type CronJobStatus = "success" | "error" | "running";
/**
 * A scheduled cron job
 */
export interface CronJob {
    /** Unique identifier */
    id: string;
    /** Human-readable name */
    name: string;
    /** Cron expression, ISO timestamp, or interval description */
    schedule: string;
    /** The prompt to execute */
    prompt: string;
    /** Whether the job is enabled */
    enabled: boolean;
    /** Type of job */
    type: CronJobType;
    /** Interval in milliseconds (for interval type) */
    intervalMs?: number;
    /** When the job was created */
    createdAt: string;
    /** Last execution timestamp */
    lastRun?: string;
    /** Status of last execution */
    lastStatus?: CronJobStatus;
    /** Next scheduled run (computed) */
    nextRun?: string;
    /** Number of times executed */
    runCount: number;
    /** Optional description */
    description?: string;
    /** If set, run the prompt in a separate in-process agent session using this model instead of injecting into the current chat. */
    model?: string;
    /** Subagent jobs only. If true, the parent agent is woken up to react to the subagent's result. Default false (result lands in chat silently). */
    notify?: boolean;
    /** Subagent jobs only. If true, loads all registered extensions. If an array of package names, only those extensions. Default undefined (none). */
    extensions?: boolean | string[];
    /** Subagent jobs only. If true, loads all skills. If an array of skill names, only those skills. Default undefined (none). */
    skills?: boolean | string[];
    /** Session id this job is bound to. When absent, every pi in the cwd loads it. */
    session?: string;
}
/**
 * Persistent storage for cron jobs
 */
export interface CronStore {
    jobs: CronJob[];
    version: number;
}
/**
 * Tool result details for LLM context
 */
export interface CronToolDetails {
    action: string;
    jobs: CronJob[];
    error?: string;
    jobId?: string;
    jobName?: string;
}
/**
 * Tool parameter schema
 */
export declare const CronToolParams: Type.TObject<{
    action: Type.TUnsafe<string>;
    name: Type.TOptional<Type.TString>;
    schedule: Type.TOptional<Type.TString>;
    prompt: Type.TOptional<Type.TString>;
    jobId: Type.TOptional<Type.TString>;
    type: Type.TOptional<Type.TUnsafe<string>>;
    description: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    notify: Type.TOptional<Type.TBoolean>;
    extensions: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TArray<Type.TString>]>>;
    skills: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TArray<Type.TString>]>>;
}>;
export type CronToolParamsType = Static<typeof CronToolParams>;
/**
 * Event emitted when a job is added, removed, or updated
 */
export interface CronChangeEvent {
    type: "add" | "remove" | "update" | "fire" | "error";
    job?: CronJob;
    jobId?: string;
    error?: string;
}
