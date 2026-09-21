import type { CronJob, CronStore } from "./types.js";
/**
 * Handles persistence of scheduled prompts to .pi/schedule-prompts.json
 */
export declare class CronStorage {
    private readonly storePath;
    private readonly piDir;
    constructor(cwd: string);
    /**
     * Load scheduled prompts from disk
     */
    load(): CronStore;
    /**
     * Save scheduled prompts to disk
     */
    save(store: CronStore): void;
    /**
     * Check if a job name already exists
     */
    hasJobWithName(name: string): boolean;
    /**
     * Add a new job
     */
    addJob(job: CronJob): void;
    /**
     * Remove a job by ID
     */
    removeJob(id: string): boolean;
    /**
     * Update a job by ID
     */
    updateJob(id: string, partial: Partial<CronJob>): boolean;
    /**
     * Get a single job by ID
     */
    getJob(id: string): CronJob | undefined;
    /**
     * Get all jobs
     */
    getAllJobs(): CronJob[];
    /**
     * Get storage file path
     */
    getStorePath(): string;
}
