import { useState } from "react";
import { MCP_DEPLOYMENT } from "@/lib/mcpDeployment";
import { readLegalLanguage, withLegalLanguage } from "@/seo/legalLanguage";

export type McpLanguage = "en" | "zh";
export type McpClient =
  | "codex"
  | "claude-code"
  | "claude-desktop"
  | "cursor"
  | "chatgpt"
  | "workbuddy"
  | "other";

export const nextDataTypes = [
  { type: "hour_note", en: "Hour notes", zh: "小时记录" },
  { type: "inspiration", en: "Inspiration candidates", zh: "灵感候选" },
  { type: "timeline_day", en: "Timeline & My Day", zh: "Timeline 与 My Day" },
  { type: "memory", en: "Memories", zh: "记忆" },
  { type: "health_sample", en: "Health samples", zh: "健康样本" },
  { type: "recording_marker", en: "Recording markers", zh: "录音标记" },
] as const;

export function initialMcpLanguage(): McpLanguage {
  return readLegalLanguage();
}

export const nextToolNames = [
  "get_next_account",
  "search_next_data",
  "get_next_data",
  "get_next_usage",
  "create_next_download",
] as const;

// Client names are self-reported and are used only to suggest instructions.
export function suggestedMcpClient(name = ""): McpClient {
  const value = name.toLowerCase();
  if (/^codex(?:$|[ _-])/.test(value)) return "codex";
  if (/^claude code(?:$|[ _-])/.test(value)) return "claude-code";
  if (/^claude(?: desktop)?(?:$|[ _-])/.test(value)) return "claude-desktop";
  if (value === "cursor") return "cursor";
  if (value === "chatgpt") return "chatgpt";
  if (value === "workbuddy") return "workbuddy";
  return "other";
}

export function buildMcpSetupPrompt(language: McpLanguage): string {
  const { serverUrl, environment } = MCP_DEPLOYMENT;
  if (!serverUrl) return "";
  const context =
    environment === "isolated-test"
      ? language === "zh"
        ? "这是隔离测试环境，仅含合成测试数据。"
        : "This is an isolated test environment with synthetic data."
      : language === "zh"
        ? "这是正式环境，请使用与 Memova Next App 相同的邮箱，通过邮件验证码登录。"
        : "This is production. Sign in with the email used in the Memova Next app and the verification code sent by email.";
  return language === "zh"
    ? `请安装并验证 Memova Next MCP：${serverUrl}。使用 Streamable HTTP，权限 next.read，只读，无需 Pro。${context}复用相同地址的已有配置，保留其他连接。从当前 Agent 发起 OAuth，提醒我批准后手动回到原聊天；工具未出现时，按当前客户端支持的方式 Reload/Restart。在同一聊天实际调用 get_next_account，然后 search_next_data(limit=3)，不加关键词、日期、时区或状态过滤。五个工具为 get_next_account、search_next_data、get_next_data、get_next_usage、create_next_download。六类可读云端内容是 hour_note、inspiration、timeline_day、memory、health_sample、recording_marker。区分配置已保存、授权已批准、工具已加载、读取已验证。空结果也可以验证连接，但三条抽样不代表账号总数。查询日期时用 query_time_zone 解释日期，只有明确要过滤原始时区时才用 stored_time_zone；不要把显示时区填进旧 time_zone 过滤。不要读取或输出密码、验证码、令牌或完整回调 URL，不自动导出全部资料。`
    : `Install and verify Memova Next MCP: ${serverUrl}. Use Streamable HTTP with scope next.read, read-only, no Pro required. ${context} Reuse an existing configuration for the same URL and preserve other connections. Start OAuth in the current agent. Tell me to return to the original chat after approval; if tools are missing, use this client's supported Reload/Restart. In the same chat, call get_next_account, then search_next_data(limit=3) without keyword, date, time-zone or status filters. The five tools are get_next_account, search_next_data, get_next_data, get_next_usage and create_next_download. The six cloud data types are hour_note, inspiration, timeline_day, memory, health_sample and recording_marker. Distinguish configuration saved, authorization approved, tools loaded and reads verified. An empty result can verify the connection; three sampled results are not an account total. Use query_time_zone to interpret date queries and stored_time_zone only when intentionally filtering the original record time zone; do not put the display time zone into the legacy time_zone filter. Never inspect or print passwords, verification codes, tokens or full callback URLs, and do not export all data.`;
}

export function McpLanguageToggle({
  language,
  onChange,
}: {
  language: McpLanguage;
  onChange: (language: McpLanguage) => void;
}) {
  return (
    <div className="flex gap-2 text-xs" aria-label="Language / 语言">
      {(["en", "zh"] as const).map(value => (
        <button
          key={value}
          type="button"
          aria-pressed={language === value}
          onClick={() => onChange(value)}
          className="rounded-lg border border-[#D7DEEB] bg-white px-3 py-2 font-semibold text-[#455E93] aria-pressed:bg-[#EEF2FA]"
        >
          {value === "en" ? "English" : "中文"}
        </button>
      ))}
    </div>
  );
}

export function McpEnvironmentNotice({ language }: { language: McpLanguage }) {
  const zh = language === "zh";
  return (
    <p className="rounded-xl border border-[#D7DEEB] bg-white p-4 text-sm leading-6 text-[#455E93]">
      {MCP_DEPLOYMENT.environment === "production"
        ? zh
          ? "正式环境 · 使用与 Memova Next App 相同的邮箱和邮件验证码登录。"
          : "Production · Sign in with the email used in Memova Next and its email verification code."
        : MCP_DEPLOYMENT.environment === "isolated-test"
          ? zh
            ? "隔离测试环境 · 仅包含合成测试资料。"
            : "Isolated test environment · Synthetic data only."
          : zh
            ? "此站点尚未配置 MCP 服务。请联系 Memova 获取接入地址。"
            : "MCP is not configured for this site. Contact Memova for a setup address."}
    </p>
  );
}

const clientLabels: Record<McpClient, string> = {
  codex: "Codex",
  "claude-code": "Claude Code",
  "claude-desktop": "Claude Desktop",
  cursor: "Cursor",
  chatgpt: "ChatGPT",
  workbuddy: "WorkBuddy",
  other: "Other agent / 其他 Agent",
};

const clientDocs: Partial<Record<McpClient, string>> = {
  codex:
    "https://learn.chatgpt.com/docs/extend/mcp#configure-in-the-chatgpt-desktop-app",
  "claude-code": "https://code.claude.com/docs/en/mcp",
  "claude-desktop":
    "https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp",
  cursor: "https://cursor.com/docs/mcp",
  chatgpt: "https://developers.openai.com/api/docs/guides/custom-mcp-server",
};

function installationInstruction(
  client: McpClient,
  language: McpLanguage,
  next: boolean
) {
  const zh = language === "zh";
  switch (client) {
    case "codex":
      if (next)
        return zh
          ? "打开 Settings → MCP servers，选择 Add server。名称填 memova-next，类型选 Streamable HTTP，再填入上方地址。保存后按提示选择 Restart，需要登录时选择 Authenticate。"
          : "Open Settings → MCP servers and select Add server. Enter memova-next as the name, select Streamable HTTP, and paste the URL above. Save, then choose Restart when prompted. Select Authenticate when asked to sign in.";
      return zh
        ? "Settings → MCP servers → Add server → Streamable HTTP，填入上方地址并保存，再按提示 Restart。需要认证时点 Authenticate。"
        : "Go to Settings → MCP servers → Add server → Streamable HTTP. Enter the URL above, save, and use Restart when prompted. Select Authenticate when sign-in is required.";
    case "claude-code":
      return zh
        ? "按 Claude Code 官方 MCP 说明添加远程 HTTP 服务，再从该客户端发起 OAuth。"
        : "Follow Claude Code’s MCP instructions to add a remote HTTP server, then start OAuth in Claude Code.";
    case "claude-desktop":
      return zh
        ? "在 Customize → Connectors 添加自定义远程连接，填写服务地址并选择 OAuth。实际入口取决于账号和版本。"
        : "Add a custom remote connector in Customize → Connectors, enter the server URL, and select OAuth. Available controls depend on your account and version.";
    case "cursor":
      return zh
        ? "在 MCP 设置或项目 .cursor/mcp.json 中添加远程服务，再在 Cursor 中完成 OAuth。"
        : "Add the remote server in MCP settings or the project’s .cursor/mcp.json, then complete OAuth in Cursor.";
    case "chatgpt":
      return zh
        ? "按 ChatGPT 官方自定义 MCP 说明创建并安装 OAuth 连接，再在聊天中使用。可用入口取决于账号和工作区权限。"
        : "Follow ChatGPT’s custom MCP instructions to create and install an OAuth connection, then use it in chat. Availability depends on account and workspace permissions.";
    default:
      return zh
        ? "按当前客户端的官方说明添加远程 Streamable HTTP 服务并发起 OAuth，先确认此版本支持该连接方式。"
        : "Use your client’s official instructions to add a remote Streamable HTTP server and start OAuth. Confirm that your version supports this connection method.";
  }
}

export default function McpSetupGuide({
  language,
  client = "other",
  detailed = false,
  next = true,
}: {
  language: McpLanguage;
  client?: McpClient;
  detailed?: boolean;
  next?: boolean;
}) {
  const [selected, setSelected] = useState(client);
  const activeClient = detailed ? selected : client;
  const zh = language === "zh";
  return (
    <section className="rounded-xl border border-[#D7DEEB] bg-[#F4F6FD] p-4 text-left text-[13px] leading-6 text-[#455E93]">
      <h2 className="font-bold text-[#111A30]">
        {detailed
          ? zh
            ? "添加、授权与验证"
            : "Add, authorize and verify"
          : zh
            ? "批准后，回到原聊天"
            : "After approval, return to your original chat"}
      </h2>
      {detailed && (
        <label className="mt-4 block">
          {zh ? "你的 Agent" : "Your agent"}
          <select
            className="ml-3 rounded-lg border border-[#D7DEEB] bg-white px-3 py-2"
            value={selected}
            onChange={event => setSelected(event.target.value as McpClient)}
          >
            {Object.entries(clientLabels).map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      )}
      {detailed && (
        <div className="mt-4 space-y-3 rounded-lg bg-white p-4">
          <h3 className="font-bold text-[#111A30]">
            {zh ? "先添加并认证" : "First add and authenticate"}
          </h3>
          {next &&
            activeClient === "codex" &&
            MCP_DEPLOYMENT.environment === "production" && (
              <p className="text-xs font-semibold text-[#397D5C]">
                {zh
                  ? "已在正式环境验证 Codex 接入"
                  : "Codex setup verified in production"}
              </p>
            )}
          {next && activeClient !== "codex" && (
            <p className="text-xs">
              {zh
                ? "此客户端暂无本次验证结果。"
                : "No verification result is available for this client in this release."}
            </p>
          )}
          <p>{installationInstruction(activeClient, language, next)}</p>
          {activeClient === "codex" && next && MCP_DEPLOYMENT.serverUrl && (
            <code className="block overflow-x-auto rounded-md bg-[#F6F8FC] p-3 text-xs">
              codex mcp add memova-next --url {MCP_DEPLOYMENT.serverUrl}
            </code>
          )}
          {clientDocs[activeClient] && (
            <a
              href={clientDocs[activeClient]}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              {zh
                ? "查看该客户端的官方接入说明"
                : "Official setup instructions for this client"}
            </a>
          )}
          {!next && (
            <p className="text-xs">
              {zh
                ? "其他客户端按官方说明接入，实际加载与读取请在当前聊天验证。"
                : "For other clients, follow their official instructions and verify loaded tools and reads in the current chat."}
            </p>
          )}
        </div>
      )}
      <ol className="mt-3 list-decimal space-y-3 pl-5">
        <li>
          {next && detailed
            ? zh
              ? "在浏览器登录 Memova 并核对授权。批准后，回到发起连接的客户端和原聊天。"
              : "Sign in to Memova in your browser and review the requested access. After approval, return to the client that started the connection and open the original chat."
            : zh
              ? "浏览器将授权结果交给发起连接的 Agent。它可能不会自动切换到应用，请手动回到原 Agent 和原聊天。"
              : "The browser sends the authorization result to the agent that started the request. Return to that agent and the original chat if its window does not open automatically."}
        </li>
        <li>
          {next
            ? activeClient === "codex"
              ? zh
                ? "如果当前聊天没有工具或仍显示旧账号，先在 Codex 的 Settings → MCP servers 中刷新连接，或按提示选择 Restart，再回到原聊天验证。"
                : "If the tools are missing or you still see the previous account, refresh the connection in Codex Settings → MCP servers, or choose Restart when prompted. Return to the original chat to verify access."
              : zh
                ? "如果工具未出现或账号未更新，先在当前客户端的 MCP 或连接设置中刷新连接，再回到原聊天验证。"
                : "If the tools are missing or you still see the previous account, reload the connection in your client’s MCP or connector settings. Return to the original chat to verify access."
            : activeClient === "codex"
              ? zh
                ? "在 Codex 的 Settings → MCP servers 检查连接。工具未出现时按客户端提示 Restart，再回到原聊天。"
                : "In Codex, check Settings → MCP servers. If tools are missing, use the client's Restart action and return to the original chat."
              : zh
                ? "在当前客户端的 MCP／连接设置中检查状态，按该客户端支持的方式重新加载；需要重启时先保存工作。"
                : "Check the current client's MCP or connector settings and use its supported reload action. Save your work before restarting."}
        </li>
        <li>
          {next
            ? zh
              ? "在原聊天核对 Memova 账号，再查询少量云端记录，确认读取是否成功。"
              : "In the original chat, check your Memova account and query a few cloud records to verify read access."
            : zh
              ? "在同一聊天读取本次权限允许的一条资料，核对账号与实际结果。"
              : "In the same chat, read one item allowed by these permissions and check the account and result."}
        </li>
      </ol>
      {detailed ? (
        <div className="mt-4 space-y-3 border-t border-[#D7DEEB] pt-4">
          <p>
            {zh
              ? "网页可确认授权已批准；工具是否加载以及读取结果，要在原聊天中检查。若请求过期或回调失败，从原 Agent 重新发起认证。"
              : "This page confirms approval. Check loaded tools and reading results in the original chat. If the request expires or the callback fails, start a new authentication from that agent."}
          </p>
          <p>
            {zh
              ? "其他客户端的入口与账号权限可能不同，请依其官方说明配置远程 OAuth。不要向聊天粘贴密码、验证码、令牌或完整回调 URL。"
              : "Client setup and account permissions can differ. Follow the client's official remote OAuth instructions. Never paste passwords, verification codes, tokens or full callback URLs into chat."}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              href={withLegalLanguage("/connected-clients", language)}
              className="underline"
            >
              {zh ? "管理与撤销连接" : "Manage or revoke connections"}
            </a>
            <a
              href={withLegalLanguage("/privacy/", language)}
              className="underline"
            >
              {zh ? "隐私政策" : "Privacy policy"}
            </a>
          </div>
        </div>
      ) : (
        <a
          href={`/mcp/setup?lang=${language}${next ? "" : "&surface=legacy"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block font-semibold underline"
        >
          {zh
            ? "在新标签页保留安装与排查指南"
            : "Keep the setup guide in a new tab"}
        </a>
      )}
    </section>
  );
}
