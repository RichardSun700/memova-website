import { useState } from "react";
import AccountShell from "@/components/account/AccountShell";
import McpSetupGuide, {
  buildMcpSetupPrompt,
  McpEnvironmentNotice,
  McpLanguageToggle,
  nextDataTypes,
  nextToolNames,
} from "@/components/account/McpSetupGuide";
import { Button } from "@/components/ui/button";
import { MCP_DEPLOYMENT } from "@/lib/mcpDeployment";
import { setLegalLanguage, useLegalLanguage } from "@/seo/legalLanguage";

export default function McpSetup() {
  const language = useLegalLanguage();
  const [copied, setCopied] = useState<"endpoint" | "prompt" | "manual" | null>(
    null
  );
  const zh = language === "zh";
  const legacy =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("surface") === "legacy";
  const prompt = buildMcpSetupPrompt(language);
  const copy = async (value: string, field: "endpoint" | "prompt") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(field);
    } catch {
      setCopied("manual");
    }
  };
  return (
    <AccountShell
      compact
      title={
        legacy
          ? zh
            ? "Memova MCP 接入指南"
            : "Memova MCP setup"
          : zh
            ? "连接 Memova Next"
            : "Connect Memova Next"
      }
      subtitle={
        zh
          ? "授权读取已保存的云端资料，在你的 Agent 中继续使用。"
          : "Read your saved cloud data in the agent you use."
      }
      actions={
        <McpLanguageToggle language={language} onChange={setLegalLanguage} />
      }
    >
      <div className="max-w-3xl space-y-6">
        {!legacy && (
          <>
            <McpEnvironmentNotice language={language} />
            {MCP_DEPLOYMENT.serverUrl && (
              <section className="space-y-4 rounded-xl border border-[#D7DEEB] bg-white p-5 sm:p-6">
                <h2 className="font-bold text-[#111A30]">
                  {zh ? "添加 MCP 服务器" : "Add an MCP server"}
                </h2>
                <p className="text-sm text-[#455E93]">
                  Streamable HTTP · OAuth · <code>next.read</code>
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    readOnly
                    aria-label="MCP server URL"
                    value={MCP_DEPLOYMENT.serverUrl}
                    className="min-w-0 flex-1 rounded-lg border border-[#D7DEEB] bg-[#F6F8FC] p-3 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      void copy(MCP_DEPLOYMENT.serverUrl, "endpoint")
                    }
                  >
                    {zh ? "复制地址" : "Copy URL"}
                  </Button>
                </div>
                <p className="text-sm leading-6 text-[#455E93]">
                  {zh
                    ? "按需只读，无需 Pro。范围包含六类已保存云端内容，以及账号、用量和登录等已有元数据；手机上尚未同步的本地内容不在范围内。"
                    : "Read-only, no Pro required. Access includes six saved cloud content types and stored account, usage and sign-in metadata. Unsynced content on your phone stays outside this connection."}
                </p>
                <ul className="grid gap-2 text-sm text-[#455E93] sm:grid-cols-2">
                  {nextDataTypes.map(item => (
                    <li
                      key={item.type}
                      className="rounded-lg bg-[#F4F6FD] px-3 py-2"
                    >
                      {zh ? item.zh : item.en}{" "}
                      <code className="ml-1 text-xs text-[#6B86E8]">
                        {item.type}
                      </code>
                    </li>
                  ))}
                </ul>
                <details className="border-t border-[#D7DEEB] pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-[#455E93]">
                    {zh
                      ? "交给 Agent 的安装提示词"
                      : "Setup prompt for your agent"}
                  </summary>
                  <textarea
                    readOnly
                    aria-label={
                      zh
                        ? "MCP 安装与验证提示词"
                        : "MCP setup and verification prompt"
                    }
                    value={prompt}
                    rows={8}
                    className="mt-4 w-full rounded-lg border border-[#D7DEEB] bg-[#F6F8FC] p-3 text-xs leading-6"
                  />
                  <Button
                    type="button"
                    onClick={() => void copy(prompt, "prompt")}
                    className="mt-3"
                  >
                    {zh ? "复制提示词" : "Copy prompt"}
                  </Button>
                </details>
                <p
                  role="status"
                  aria-live="polite"
                  className="text-xs text-[#455E93]"
                >
                  {copied === "manual"
                    ? zh
                      ? "请选中上方文字手动复制。"
                      : "Select the text above and copy it manually."
                    : copied
                      ? zh
                        ? "已复制。"
                        : "Copied."
                      : ""}
                </p>
              </section>
            )}
          </>
        )}
        {legacy && (
          <p className="rounded-xl border border-[#D7DEEB] bg-white p-5 text-sm leading-6 text-[#455E93]">
            {zh
              ? "这是旧版 Memova MCP 的接入说明。具体可读或可写范围以授权页列出的权限为准。"
              : "This guide is for legacy Memova MCP. The permissions shown on the authorization page determine its read and write access."}
          </p>
        )}
        {!legacy && (
          <details className="rounded-xl border border-[#D7DEEB] bg-white p-5 text-sm text-[#455E93]">
            <summary className="cursor-pointer font-semibold">
              {zh ? "可用工具与读取验证" : "Tools and reading verification"}
            </summary>
            <ul className="mt-4 space-y-2">
              {nextToolNames.map(name => (
                <li key={name}>
                  <code>{name}</code>
                </li>
              ))}
            </ul>
            <p className="mt-4 leading-6">
              {zh
                ? "开始时只需确认账号并做一次 limit=3 的无过滤搜索。空结果也可以验证连接；分页抽样不代表账号总数。"
                : "Start by confirming the account and running an unfiltered search with limit=3. An empty result can verify the connection; a paginated sample is not an account total."}
            </p>
          </details>
        )}
        <McpSetupGuide
          language={language}
          client="codex"
          detailed
          next={!legacy}
        />
      </div>
    </AccountShell>
  );
}
