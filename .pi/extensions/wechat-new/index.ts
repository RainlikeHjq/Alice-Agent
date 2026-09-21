// ============================================================================
// wechat-new-session — 独立插件：微信 /new 新建会话（update 安全）
// ============================================================================
// 不依赖 wechat-assistant 内部实现；只要 wechat-assistant 的 autoStart 开启，
// 新会话会自动重连微信。pi update 更新 wechat-assistant 不影响本插件。
export default function wechatNewSession(pi: any) {
  // 真正执行 newSession 的命令（只有命令上下文能调用 newSession）
  pi.registerCommand('wechat-new', {
    description: '新建会话并重连微信（供微信 /new 远程触发）',
    handler: async (args: string, ctx: any) => {
      const name = args.trim()
      await ctx.newSession({
        setup: name
          ? async (sessionManager: any) => { sessionManager.appendSessionInfo(name) }
          : undefined,
      })
    },
  })

  // 供 agent 主动给自己开新会话的工具（睡眠时刻重置 / 少爷要求重开会话）：复用 /wechat-new 命令链路
  pi.registerTool({
    name: 'new_session',
    label: 'New Session',
    description: '创建一个新的会话 session（相当于执行 /new <name>），用于清空当前短期上下文、重开一张白纸。典型场景：①睡眠时刻创建完长期记忆后重置；②少爷要求某个 agent 重开会话时，由该 agent 自己调用本工具（其他 agent 无法代劳）。触发后当前会话会被替换，因此只能作为最后一步调用。',
    promptSnippet: '创建新会话',
    promptGuidelines: [
      '睡眠时刻（创建长期记忆后）作为最后一步调用；少爷要求重开会话时也可调用。',
      '本工具只能由 agent 对自己使用：要给别人重开会话，需通过 intercom 通知对方自行调用。',
      'name 参数为 agent 名字（如 Alice、Coder、Nexus），新会话继承当前工作目录。',
    ],
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: '新会话名称（agent 名字，如 Alice、Coder、Nexus）' },
      },
      required: ['name'],
    },
    async execute(_toolCallId: any, params: any) {
      const name = String(params?.name ?? '').trim()
      // 延迟到当前工具返回后再触发命令，避免重入（与 input 拦截一致）
      setTimeout(() => {
        pi.sendUserMessage('/wechat-new' + (name ? ' ' + name : ''), { expandPromptTemplates: true })
      }, 0)
      return { content: [{ type: 'text', text: `已触发新会话创建：${name || '(默认)'}，当前会话即将被替换。` }], details: {} }
    },
  })

  // 拦截微信注入的 /new，转成上面的 /wechat-new 命令（避免被当普通提示词）
  pi.on('input', (event: any) => {
    const text = (event.text ?? '').trim()
    if (text !== '/new' && !text.startsWith('/new ')) return
    const name = text.slice(4).trim()
    // 延迟到当前 prompt 处理完再触发，避免重入
    setTimeout(() => {
      pi.sendUserMessage('/wechat-new' + (name ? ' ' + name : ''), { expandPromptTemplates: true })
    }, 0)
    return { action: 'handled' }
  })
}
