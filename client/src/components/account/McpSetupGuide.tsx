import { useState } from "react";
import { resolveMcpDeployment } from "@shared/mcpDeployment";

export type McpLanguage = "en" | "zh";
export type McpClient = "codex" | "claude" | "cursor" | "chatgpt" | "other";

export function McpEnvironmentNotice({ language }: { language: McpLanguage }) {
  const { environment } = resolveMcpDeployment(import.meta.env);
  if (environment === "unspecified") return null;
  const zh = language === "zh";
  return (
    <p className="mb-4 rounded-[11px] border border-[#C5CEE1] bg-white p-4 text-sm text-[#455E93]">
      {environment === "production"
        ? zh
          ? "正式环境：请使用与 Memova Next App 相同的邮箱，通过邮件验证码登录。授权后，Agent 可按需读取你本人真实的云端资料；仅限读取，无需 Pro。"
          : "Production: sign in with the same email as your Memova Next app using an email verification code. After approval, your agent can read your own real cloud data on demand. Read-only; no Pro subscription required."
        : zh
          ? "隔离测试环境：仅用于验证登录和读取，测试账号资料为合成数据，不代表你手机上的正式资料。"
          : "Isolated test environment: verifies sign-in and reading with synthetic account data, not your phone's production records."}
    </p>
  );
}

export function initialMcpLanguage(): McpLanguage {
  if (typeof window === "undefined") return "en";
  const explicit = new URLSearchParams(window.location.search).get("lang");
  if (explicit === "zh" || explicit === "en") return explicit;
  return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

// This is only a display hint. Client names are self-reported, not proof of trust.
export function suggestedMcpClient(name = ""): McpClient {
  const normalized = name.toLowerCase().trim();
  if (/^codex(?:$|[ _-])/.test(normalized)) return "codex";
  if (/^claude(?:$|[ _-])/.test(normalized)) return "claude";
  if (normalized === "cursor") return "cursor";
  if (normalized === "chatgpt") return "chatgpt";
  return "other";
}

export function McpLanguageToggle({
  language,
  onChange,
}: {
  language: McpLanguage;
  onChange: (value: McpLanguage) => void;
}) {
  return (
    <div className="flex gap-2 text-xs" aria-label="Language / 语言">
      {(["en", "zh"] as const).map(value => (
        <button
          key={value}
          type="button"
          aria-pressed={language === value}
          onClick={() => onChange(value)}
          className="rounded-md border border-[#C5CEE1] bg-white px-3 py-2 font-bold aria-pressed:bg-[#EEF1FB]"
        >
          {value === "en" ? "English" : "中文"}
        </button>
      ))}
    </div>
  );
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
  const zh = language === "zh";
  const actualClient = detailed ? selected : client;
  const reload =
    actualClient === "codex"
      ? zh
        ? "Codex：在 Settings → MCP servers 检查此连接；工具未出现时按客户端提示执行 Restart，再回到原聊天继续。已授权时不必重复登录。"
        : "Codex: check this connection in Settings → MCP servers. If tools are missing, use the client's Restart action, then return to the original chat. Authorization alone does not require another sign-in."
      : zh
        ? "如果原聊天没有 Memova 工具，在当前 Agent 的 MCP／连接设置中检查状态，按该客户端的说明重新加载连接；需要重启时先保存工作，再返回原聊天继续。"
        : "If the original chat has no Memova tools, check the connection in your agent's MCP or connector settings and use that client's supported reload action. Save your work before restarting, then continue in the original chat.";
  const verification = next
    ? zh
      ? "请在当前聊天调用 get_next_account 确认账号，再调用 search_next_data(limit=3)，不要添加日期、时区或关键词过滤。两次实际读取成功才算接入完成；不要只根据工具列表宣布成功。"
      : "In the current chat, call get_next_account to confirm the account, then search_next_data(limit=3) without date, time-zone or keyword filters. Setup is verified only after both reads succeed, not merely when tools are listed."
    : zh
      ? "回到原聊天，请 Agent 读取一条本次授权允许的资料，确认账号和实际读取结果。不要只根据授权页面或工具列表宣布接入成功。"
      : "In the original chat, ask the agent to read one item permitted by this authorization and confirm the account and result. The approval page or a tool list alone does not verify access.";

  return (
    <section className="rounded-[11px] border border-[#C5CEE1] bg-[#F4F6FD] p-4 text-left text-[12px] leading-6 text-[#455E93]">
      {next && <McpEnvironmentNotice language={language} />}
      <h2 className="font-extrabold text-[#111A30]">
        {zh
          ? "授权之后，还需要这几步"
          : "After approval: return, load tools, verify"}
      </h2>
      {detailed && (
        <label className="mt-3 block">
          {zh ? "你正在使用的 Agent" : "Your agent"}
          <select
            value={selected}
            onChange={event => setSelected(event.target.value as McpClient)}
            className="ml-3 rounded border border-[#C5CEE1] bg-white px-2 py-1"
          >
            <option value="codex">Codex</option>
            <option value="claude">Claude Code / Desktop</option>
            <option value="cursor">Cursor</option>
            <option value="chatgpt">ChatGPT</option>
            <option value="other">{zh ? "其他 Agent" : "Other agent"}</option>
          </select>
        </label>
      )}
      <ol className="mt-2 list-decimal space-y-2 pl-5">
        <li>
          {zh
            ? "浏览器会把授权结果交给发起连接的 Agent。这不一定会自动唤起桌面窗口；看到回调成功后，请手动返回原 Agent 和原聊天。"
            : "The browser sends the authorization result to the agent that started the connection. This may not bring its desktop window to the front. After the callback succeeds, return to that agent and the original chat."}
        </li>
        <li>{reload}</li>
        <li>{verification}</li>
      </ol>
      {detailed ? (
        <>
          <p className="mt-3">
            {zh
              ? "账号登录、授权批准、Agent 获得凭据、聊天工具可用是不同状态。本页面无法检查你的 Agent 是否已经加载工具。"
              : "Account sign-in, access approval, agent authentication and callable chat tools are separate states. This page cannot inspect whether your agent has loaded its tools."}
          </p>
          <p className="mt-3">
            {zh
              ? "回调过期或失败：从原 Agent 发起新的 Authenticate／登录，不要反复刷新旧回调地址。不要向聊天粘贴密码、验证码、令牌或完整回调 URL。"
              : "If the callback has expired or failed, start a fresh Authenticate/sign-in from the original agent instead of repeatedly refreshing the old callback. Never paste passwords, verification codes, tokens or full callback URLs into chat."}
          </p>
          <a
            href="https://learn.chatgpt.com/docs/extend/mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block underline"
          >
            {zh ? "Codex 官方 MCP 设置说明" : "Official Codex MCP setup guide"}
          </a>
        </>
      ) : (
        <a
          href={`/mcp/setup?lang=${language}${next ? "" : "&surface=legacy"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-bold underline"
        >
          {zh
            ? "打开安装与排查指南（新标签页，授权后仍可查看）"
            : "Open setup and troubleshooting guide (new tab, available after approval)"}
        </a>
      )}
    </section>
  );
}
