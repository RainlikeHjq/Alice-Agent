/**
 * JobsView — single TUI overlay that consolidates view + add + toggle + remove
 * + cleanup for scheduled prompts. Foreign-session jobs render read-only in a
 * separate group; actions (t/x/c) ignore them.
 */
import type { Component } from "@earendil-works/pi-tui";
import { CronScheduler } from "../scheduler.js";
import type { CronStorage } from "../storage.js";
export declare class JobsView implements Component {
    private storage;
    private scheduler;
    private mySessionId;
    private runAdd;
    private theme;
    private requestRender;
    private done;
    private mine;
    private foreign;
    private selectedIndex;
    private confirm;
    constructor(storage: CronStorage, scheduler: CronScheduler, mySessionId: string | undefined, runAdd: () => Promise<void>, theme: any, requestRender: () => void, done: () => void);
    invalidate(): void;
    private refresh;
    private selectedJob;
    private isSelectionForeign;
    handleInput(data: string): void;
    private handleConfirmInput;
    private handleNormalInput;
    render(width: number): string[];
    private formatRow;
}
