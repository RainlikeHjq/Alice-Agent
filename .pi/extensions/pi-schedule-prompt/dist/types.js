import { StringEnum, Type } from "@earendil-works/pi-ai";
/**
 * Tool parameter schema
 */
export const CronToolParams = Type.Object({
    action: StringEnum(["add", "remove", "list", "enable", "disable", "update", "cleanup"], {
        description: "Action to perform",
    }),
    name: Type.Optional(Type.String({
        description: "Job name, auto-generated if omitted",
    })),
    schedule: Type.Optional(Type.String({
        description: "Required for add. Cron expression, ISO timestamp, relative time (+10s, +5m), or interval string",
    })),
    prompt: Type.Optional(Type.String({
        description: "Required for add. The prompt text to execute",
    })),
    jobId: Type.Optional(Type.String({
        description: "Job ID for remove, enable, disable, or update actions",
    })),
    type: Type.Optional(StringEnum(["cron", "once", "interval"], {
        description: "Job type. Use 'once' for relative times like '+10s'. Default is cron",
    })),
    description: Type.Optional(Type.String({
        description: "Optional job description",
    })),
    model: Type.Optional(Type.String({
        minLength: 1,
        description: "Optional. If set, runs the prompt in a separate in-process agent session using this model (e.g. 'haiku', 'sonnet', or 'provider/model-id'). If omitted, the prompt is injected into the current chat. Must be a non-empty string — to switch a job from subagent back to inline mode, remove the job and re-add it without a model.",
    })),
    notify: Type.Optional(Type.Boolean({
        description: "Subagent jobs only. If true, the parent agent is nudged to react to the subagent's result. Default false: the result is shown in chat but the parent is not interrupted. Ignored for inline (no-model) jobs, where the prompt itself already wakes the parent. Recommended only for low-frequency jobs.",
    })),
    extensions: Type.Optional(Type.Union([
        Type.Boolean({
            description: "If true, loads all registered extensions.",
        }),
        Type.Array(Type.String(), {
            description: "List of extension package names to load.",
        }),
    ])),
    skills: Type.Optional(Type.Union([
        Type.Boolean({
            description: "If true, loads all skills.",
        }),
        Type.Array(Type.String(), {
            description: "List of skill names to load.",
        }),
    ])),
});
