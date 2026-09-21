export type JobScope = "session" | "workdir";
export interface ScheduleSettings {
    /** Default true. Project file overrides global. */
    widgetVisible?: boolean;
    /**
     * Default scope for newly-created jobs. `"session"` (default) writes
     * `session: <currentSessionId>` so only the creating pi fires the job;
     * `"workdir"` omits the field so every pi in this cwd fires it.
     */
    defaultJobScope?: JobScope;
}
export declare function loadSettings(cwd: string): ScheduleSettings;
/**
 * Apply a partial update to the project settings file. Reads the *project*
 * file (not the merged in-memory state), spreads `change` over it, writes
 * back. This way the project file only ever contains deliberate overrides,
 * so global defaults bleed through correctly when the user later edits them.
 *
 * Returns false on IO failure so the caller can surface a "session only" toast.
 */
export declare function saveSettings(cwd: string, change: Partial<ScheduleSettings>): boolean;
