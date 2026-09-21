import * as fs from "fs";
import * as path from "path";
/**
 * Handles persistence of scheduled prompts to .pi/schedule-prompts.json
 */
export class CronStorage {
    storePath;
    piDir;
    constructor(cwd) {
        this.piDir = path.join(cwd, ".pi");
        this.storePath = path.join(this.piDir, "schedule-prompts.json");
    }
    /**
     * Load scheduled prompts from disk
     */
    load() {
        try {
            if (fs.existsSync(this.storePath)) {
                const data = fs.readFileSync(this.storePath, "utf-8");
                const store = JSON.parse(data);
                return store;
            }
        }
        catch (error) {
            console.error("Failed to load scheduled prompts:", error);
        }
        // Return empty store if file doesn't exist or is corrupted
        return { jobs: [], version: 1 };
    }
    /**
     * Save scheduled prompts to disk
     */
    save(store) {
        try {
            // Ensure .pi directory exists
            if (!fs.existsSync(this.piDir)) {
                fs.mkdirSync(this.piDir, { recursive: true });
            }
            // Write atomically using temp file
            const tempPath = `${this.storePath}.tmp`;
            fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), "utf-8");
            fs.renameSync(tempPath, this.storePath);
        }
        catch (error) {
            console.error("Failed to save scheduled prompts:", error);
            throw error;
        }
    }
    /**
     * Check if a job name already exists
     */
    hasJobWithName(name) {
        const store = this.load();
        return store.jobs.some((j) => j.name === name);
    }
    /**
     * Add a new job
     */
    addJob(job) {
        const store = this.load();
        store.jobs.push(job);
        this.save(store);
    }
    /**
     * Remove a job by ID
     */
    removeJob(id) {
        const store = this.load();
        const initialLength = store.jobs.length;
        store.jobs = store.jobs.filter((j) => j.id !== id);
        if (store.jobs.length < initialLength) {
            this.save(store);
            return true;
        }
        return false;
    }
    /**
     * Update a job by ID
     */
    updateJob(id, partial) {
        const store = this.load();
        const job = store.jobs.find((j) => j.id === id);
        if (job) {
            Object.assign(job, partial);
            this.save(store);
            return true;
        }
        return false;
    }
    /**
     * Get a single job by ID
     */
    getJob(id) {
        const store = this.load();
        return store.jobs.find((j) => j.id === id);
    }
    /**
     * Get all jobs
     */
    getAllJobs() {
        const store = this.load();
        return store.jobs;
    }
    /**
     * Get storage file path
     */
    getStorePath() {
        return this.storePath;
    }
}
