import { useState } from "react";
import AccountShell from "@/components/account/AccountShell";
import { Button } from "@/components/ui/button";
import { resolveMcpDeployment } from "@shared/mcpDeployment";
import McpSetupGuide, {
  initialMcpLanguage,
  McpLanguageToggle,
} from "@/components/account/McpSetupGuide";

export default function McpSetup() {
  const [language, setLanguage] = useState(initialMcpLanguage);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "manual">(
    "idle"
  );
  const zh = language === "zh";
  const isNext =
    new URLSearchParams(window.location.search).get("surface") !== "legacy";
  const { environment, serverUrl: mcpUrl } = resolveMcpDeployment(
    import.meta.env
  );
  const environmentPrompt =
    environment === "isolated-test"
      ? zh
        ? "这是隔离测试环境，资料为合成数据。"
        : "This is an isolated test environment with synthetic data."
      : environment === "production"
        ? zh
          ? "这是正式环境，请使用与 Memova Next App 相同的邮箱，通过邮件验证码登录，授权读取本人真实云端资料。"
          : "This is production. Sign in with the same email as your Memova Next app using an email verification code, and authorize access to your own real cloud data."
        : zh
          ? "请确认站点标注的环境和实际授权账号。"
          : "Confirm the environment shown on this site and the actual authorized account.";
  const prompt = zh
    ? `请安装并验证 Memova Next MCP：${mcpUrl}。连接方式 Streamable HTTP，权限 next.read，只读，无需 Pro。${environmentPrompt}复用相同地址的已有配置，保留其他连接。从客户端发起 OAuth，提前提醒我授权后手动返回原聊天，工具未出现时执行该客户端支持的 Reload/Restart。在当前聊天实际调用 get_next_account，然后 search_next_data(limit=3)，不加日期、时区或关键词过滤。区分配置完成、已授权、工具已加载和读取已验证。仅有授权页面成功或其他进程的工具列表不算完成。不读取或输出密码、令牌、验证码及完整回调 URL，不自动导出全部资料。`
    : `Install and verify Memova Next MCP: ${mcpUrl}. Use Streamable HTTP, scope next.read, read-only, no Pro required. ${environmentPrompt} Reuse an existing configuration for the same URL and preserve other connections. Start OAuth in the client. Tell me to return to the original chat after approval and use the client's supported Reload/Restart if tools are missing. In the current chat, call get_next_account, then search_next_data(limit=3) without date, time-zone or keyword filters. Distinguish configured, authorized, tools loaded and reads verified. An approval page or a tool list in another process is not completion. Do not inspect or print passwords, tokens, verification codes or full callback URLs, and do not export all data.`;
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState("copied");
    } catch {
      setCopyState("manual");
    }
  };
  return (
    <AccountShell
      compact
      title={
        language === "zh"
          ? `完成 Memova ${isNext ? "Next " : ""}MCP 接入`
          : `Finish Memova ${isNext ? "Next " : ""}MCP setup`
      }
      subtitle={
        language === "zh"
          ? "授权成功后，在原 Agent 中加载工具并验证读取。"
          : "After authorization, load the tools and verify a read in your original agent."
      }
      actions={<McpLanguageToggle language={language} onChange={setLanguage} />}
    >
      <div className="max-w-2xl space-y-5">
        {isNext &&
          (mcpUrl ? (
            <section className="space-y-3 rounded-[11px] border border-[#C5CEE1] bg-white p-4 text-sm">
              <h2 className="font-bold">
                {zh ? "复制给你的 Agent" : "Give this to your agent"}
              </h2>
              <p className="break-all">{mcpUrl}</p>
              <textarea
                readOnly
                value={prompt}
                rows={7}
                aria-label={
                  zh
                    ? "MCP 安装与验收提示词"
                    : "MCP setup and verification prompt"
                }
                className="w-full resize-y rounded-md border border-[#C5CEE1] p-3 text-xs leading-6"
              />
              <Button type="button" onClick={() => void copyPrompt()}>
                {zh ? "复制安装提示词" : "Copy setup prompt"}
              </Button>
              <p role="status" aria-live="polite" className="text-xs">
                {copyState === "copied"
                  ? zh
                    ? "已复制。"
                    : "Copied."
                  : copyState === "manual"
                    ? zh
                      ? "浏览器不允许复制，请选择上方文字手动复制。"
                      : "Clipboard access is unavailable. Select and copy the text above."
                    : ""}
              </p>
            </section>
          ) : (
            <p>
              {zh
                ? "此部署尚未配置公开的 Next MCP 地址，请向 Memova 获取正确的测试或正式连接地址。"
                : "This deployment has no configured public Next MCP URL. Ask Memova for the correct test or production address."}
            </p>
          ))}
        <McpSetupGuide language={language} detailed next={isNext} />
      </div>
    </AccountShell>
  );
}
