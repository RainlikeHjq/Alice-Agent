/**
 * Lightweight in-process subagent runner.
 *
 * Used when a scheduled job has `model` set: spawn a fresh AgentSession with
 * the chosen model, run the prompt to completion, return the assistant's text.
 * No subprocess, no extension recursion (noExtensions: true), no persistence.
 */
import type { Model } from "@earendil-works/pi-ai";
import { type AgentSession, type ExtensionContext } from "@earendil-works/pi-coding-agent";
export type SubagentResult = {
    ok: true;
    text: string;
} | {
    ok: false;
    error: string;
};
export interface RunSubagentOptions {
    /** If true, load all extensions. If an array, only those named. Default undefined (none). */
    extensions?: boolean | string[];
    /** If true, load all skills. If an array, only those named. Default undefined (none). */
    skills?: boolean | string[];
}
export declare function resolveModel(registry: ExtensionContext["modelRegistry"], modelStr: string): Model<any> | undefined;
export declare function getLastAssistantText(session: AgentSession): string;
export declare function describeAvailableModels(registry: ExtensionContext["modelRegistry"]): string;
export declare function runSubagentOnce(ctx: ExtensionContext, prompt: string, modelStr: string, signal?: AbortSignal, options?: RunSubagentOptions): Promise<SubagentResult>;
