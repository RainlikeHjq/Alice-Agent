/**
 * JobsView — single TUI overlay that consolidates view + add + toggle + remove
 * + cleanup for scheduled prompts. Foreign-session jobs render read-only in a
 * separate group; actions (t/x/c) ignore them.
 */
import { matchesKey } from "@earendil-works/pi-tui";
import { CronScheduler } from "../scheduler.js";
const NAME_W = 18;
const SCHED_W = 16;
const PROMPT_W = 30;
function truncate(s, n) {
    return s.length > n ? `${s.substring(0, n - 3)}...` : s;
}
export class JobsView {
    storage;
    scheduler;
    mySessionId;
    runAdd;
    theme;
    requestRender;
    done;
    mine = [];
    foreign = [];
    selectedIndex = 0;
    confirm = null;
    constructor(storage, scheduler, mySessionId, runAdd, theme, requestRender, done) {
        this.storage = storage;
        this.scheduler = scheduler;
        this.mySessionId = mySessionId;
        this.runAdd = runAdd;
        this.theme = theme;
        this.requestRender = requestRender;
        this.done = done;
        this.refresh();
    }
    invalidate() {
        // No cached render output.
    }
    refresh() {
        const all = this.storage.getAllJobs();
        this.mine = all.filter((j) => CronScheduler.isLoadedFor(j, this.mySessionId));
        this.foreign = all.filter((j) => !CronScheduler.isLoadedFor(j, this.mySessionId));
        const max = Math.max(0, this.mine.length + this.foreign.length - 1);
        if (this.selectedIndex > max)
            this.selectedIndex = max;
    }
    selectedJob() {
        return this.selectedIndex < this.mine.length
            ? this.mine[this.selectedIndex]
            : this.foreign[this.selectedIndex - this.mine.length];
    }
    isSelectionForeign() {
        return this.selectedIndex >= this.mine.length;
    }
    handleInput(data) {
        if (this.confirm) {
            this.handleConfirmInput(data);
            return;
        }
        this.handleNormalInput(data);
    }
    handleConfirmInput(data) {
        if (matchesKey(data, "y")) {
            if (this.confirm?.kind === "remove") {
                this.storage.removeJob(this.confirm.id);
                this.scheduler.removeJob(this.confirm.id);
            }
            else if (this.confirm?.kind === "cleanup") {
                for (const j of this.mine.filter((j) => !j.enabled)) {
                    this.storage.removeJob(j.id);
                    this.scheduler.removeJob(j.id);
                }
            }
            this.confirm = null;
            this.refresh();
            return;
        }
        if (matchesKey(data, "n") || matchesKey(data, "escape")) {
            this.confirm = null;
        }
    }
    handleNormalInput(data) {
        if (matchesKey(data, "q") || matchesKey(data, "escape")) {
            this.done();
            return;
        }
        if (matchesKey(data, "up")) {
            if (this.selectedIndex > 0)
                this.selectedIndex--;
            return;
        }
        if (matchesKey(data, "down")) {
            const max = this.mine.length + this.foreign.length - 1;
            if (this.selectedIndex < max)
                this.selectedIndex++;
            return;
        }
        if (matchesKey(data, "a")) {
            this.runAdd()
                .catch((err) => console.error("[pi-schedule-prompt] add flow failed:", err))
                .finally(() => {
                this.refresh();
                this.requestRender();
            });
            return;
        }
        const sel = this.selectedJob();
        if (!sel)
            return;
        if (matchesKey(data, "t")) {
            if (this.isSelectionForeign())
                return;
            const enabled = !sel.enabled;
            this.storage.updateJob(sel.id, { enabled });
            this.scheduler.updateJob(sel.id, { ...sel, enabled });
            this.refresh();
            return;
        }
        if (matchesKey(data, "s")) {
            // Toggle this job's binding: session-bound ↔ shared. Other pi sessions
            // already running in this cwd won't see the change until they restart;
            // their in-memory schedulers are stale until session_start.
            if (this.isSelectionForeign())
                return;
            const session = sel.session ? undefined : this.mySessionId;
            this.storage.updateJob(sel.id, { session });
            this.scheduler.updateJob(sel.id, { ...sel, session });
            this.refresh();
            return;
        }
        if (matchesKey(data, "x")) {
            if (this.isSelectionForeign())
                return;
            this.confirm = { kind: "remove", id: sel.id, name: sel.name };
            return;
        }
        if (matchesKey(data, "c")) {
            const count = this.mine.filter((j) => !j.enabled).length;
            if (count === 0)
                return;
            this.confirm = { kind: "cleanup", count };
        }
    }
    render(width) {
        const lines = [];
        const total = this.mine.length + this.foreign.length;
        const rule = this.theme.fg("dim", "─".repeat(Math.max(1, width)));
        lines.push(rule);
        // Header (or active confirm prompt — overrides the hint line)
        if (this.confirm?.kind === "remove") {
            lines.push(this.theme.fg("warning", ` Remove "${this.confirm.name}"? (y/n)`));
        }
        else if (this.confirm?.kind === "cleanup") {
            lines.push(this.theme.fg("warning", ` Remove ${this.confirm.count} disabled job(s) in this session? (y/n)`));
        }
        else if (total === 0) {
            lines.push(` ${this.theme.fg("accent", this.theme.bold("Jobs"))}  —  a add   q quit`);
        }
        else {
            lines.push(` ${this.theme.fg("accent", this.theme.bold("Jobs"))}  —  ↑↓ select   a add   t toggle   s scope   x remove   c cleanup   q quit`);
        }
        lines.push(rule);
        if (total === 0) {
            lines.push("");
            lines.push("  No scheduled prompts. Press `a` to add one or `q` to quit.");
            lines.push("");
            lines.push(rule);
            return lines;
        }
        for (let i = 0; i < this.mine.length; i++) {
            lines.push(this.formatRow(this.mine[i], i, false));
        }
        if (this.foreign.length > 0) {
            lines.push("");
            lines.push(this.theme.fg("dim", "  Other sessions (read-only):"));
            for (let i = 0; i < this.foreign.length; i++) {
                lines.push(this.formatRow(this.foreign[i], this.mine.length + i, true));
            }
        }
        const sel = this.selectedJob();
        if (sel) {
            lines.push(rule);
            const next = !this.isSelectionForeign() ? this.scheduler.getNextRun(sel.id) : null;
            const meta = [
                `Type: ${sel.type}`,
                next ? `Next: ${next.toISOString()}` : null,
                sel.lastRun ? `Last: ${sel.lastRun}` : null,
                `Runs: ${sel.runCount}`,
            ]
                .filter(Boolean)
                .join("   ");
            lines.push(this.theme.fg("dim", ` Selected: ${sel.name} (${sel.id})`));
            lines.push(this.theme.fg("dim", ` ${meta}`));
            lines.push(this.theme.fg("dim", ` Prompt: ${truncate(sel.prompt, 200)}`));
        }
        lines.push(rule);
        return lines;
    }
    formatRow(job, index, isForeign) {
        const indicator = index === this.selectedIndex ? "▶" : " ";
        // Foreign rows are colorless (the surrounding `Other sessions` label and
        // dim-styled selected-details footer carry the visual cue). Embedding a
        // colored icon inside a dim-wrapped string produces nested ANSI which some
        // terminals render inconsistently — keeping foreign rows uncolored avoids
        // that class of issue.
        let icon;
        if (isForeign) {
            icon = !job.enabled ? "✗" : job.lastStatus === "error" ? "!" : "✓";
        }
        else if (!job.enabled) {
            icon = this.theme.fg("muted", "✗");
        }
        else if (job.lastStatus === "running") {
            icon = this.theme.fg("warning", "⟳");
        }
        else if (job.lastStatus === "error") {
            icon = this.theme.fg("error", "!");
        }
        else {
            icon = this.theme.fg("success", "✓");
        }
        const name = truncate(job.name, NAME_W).padEnd(NAME_W);
        const sched = truncate(CronScheduler.describeSchedule(job.type, job.schedule), SCHED_W).padEnd(SCHED_W);
        const prompt = truncate(job.prompt, PROMPT_W).padEnd(PROMPT_W);
        const tag = !job.session && !isForeign ? this.theme.fg("dim", " [shared]") : "";
        return ` ${indicator} ${icon} ${name}  ${sched}  ${prompt}${tag}`;
    }
}
