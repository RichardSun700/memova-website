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

type CopyField = "endpoint" | "prompt" | "verification" | "question";

export default function McpSetup() {
  const language = useLegalLanguage();
  const [copyResult, setCopyResult] = useState<{
    field: CopyField;
    success: boolean;
  }>();
  const zh = language === "zh";
  const legacy =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("surface") === "legacy";
  const prompt = buildMcpSetupPrompt(language);
  const verificationPrompt = zh
    ? "请先确认当前连接的 Memova 账号，再不设置日期、关键词或其他筛选条件，列出最多 3 项可访问的云端数据。"
    : "Confirm which Memova account is connected, then list up to 3 accessible cloud records without applying any filters.";
  const firstQuestion = zh
    ? "请找出我最近保存的三条 Memova 小时记录，每条用一句话概括，并标注记录时间。"
    : "Find three of my recent saved Memova hour notes. Summarize each in one sentence and include when it was recorded.";
  const copyFeedback = copyResult?.success
    ? zh
      ? "已复制。"
      : "Copied."
    : zh
      ? "请选中上方文字手动复制。"
      : "Select the text above to copy it manually.";
  const copy = async (value: string, field: CopyField) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyResult({ field, success: true });
    } catch {
      setCopyResult({ field, success: false });
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
                    ? "可只读查询以下六类云端资料，查看账号和用量，读取内容详情及下载已有的可用文件。无需 Pro。"
                    : "Search the six cloud content types below with read-only access. You can also check your account and usage, open record details, and download available files. No Pro subscription is required."}
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
                <p className="text-sm leading-6 text-[#455E93]">
                  {zh
                    ? "仅保存在手机上的内容需先同步。灵感候选与 Spark 对话是不同类型。"
                    : "Sync content stored only on your phone before accessing it here. Inspiration candidates and Spark conversations are separate content types."}
                </p>
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
                  {copyResult?.field === "endpoint" ||
                  copyResult?.field === "prompt"
                    ? copyFeedback
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
        <McpSetupGuide
          language={language}
          client="codex"
          detailed
          next={!legacy}
        />
        {!legacy && (
          <section
            id="verify"
            className="scroll-mt-24 space-y-3 rounded-xl border border-[#D7DEEB] bg-white p-5 sm:p-6"
          >
            <h2 className="font-bold text-[#111A30]">
              {zh ? "在原聊天验证读取" : "Verify access in your original chat"}
            </h2>
            <p className="text-sm leading-6 text-[#455E93]">
              {zh
                ? "完成网页授权后，回到发起连接的聊天，粘贴下面这句话。"
                : "After authorizing in your browser, return to the chat that started the connection and paste this prompt."}
            </p>
            <p className="rounded-lg bg-[#F4F6FD] p-4 text-sm leading-6 text-[#283B54]">
              {verificationPrompt}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void copy(verificationPrompt, "verification")}
            >
              {zh ? "复制验证提示词" : "Copy verification prompt"}
            </Button>
            <p role="status" className="text-xs leading-5 text-[#455E93]">
              {copyResult?.field === "verification" ? copyFeedback : ""}
            </p>
            <p className="text-sm leading-6 text-[#455E93]">
              {zh
                ? "查询成功但返回空结果，表示本次查询没有找到可访问的云端记录。请核对账号、同步状态和内容类型。"
                : "If the query succeeds and returns no results, it found no accessible cloud records. Check the account, sync status, and whether the content type is supported."}
            </p>
            <details className="border-t border-[#D7DEEB] pt-3 text-sm text-[#455E93]">
              <summary className="cursor-pointer font-semibold">
                {zh ? "可用工具与读取验证" : "Tools and reading verification"}
              </summary>
              <ul className="mt-3 space-y-1">
                {nextToolNames.map(name => (
                  <li key={name}>
                    <code>{name}</code>
                  </li>
                ))}
              </ul>
              <p className="mt-3 leading-6">
                {zh
                  ? "先调用 get_next_account，再调用无筛选的 search_next_data(limit=3)。最多三项结果只是抽样。"
                  : "Call get_next_account, then run search_next_data(limit=3) without filters. The results are a sample of up to three records."}
              </p>
            </details>
          </section>
        )}
        {!legacy && (
          <section
            id="first-question"
            className="scroll-mt-24 space-y-3 rounded-xl border border-[#D7DEEB] bg-white p-5 sm:p-6"
          >
            <h2 className="font-bold text-[#111A30]">
              {zh ? "验证通过后，试着问一句" : "Try your first question"}
            </h2>
            <p className="text-sm leading-6 text-[#455E93]">
              {zh
                ? "完成读取验证后，把这句话贴到刚才的聊天里。"
                : "After verifying access, paste this question into the same chat."}
            </p>
            <p className="rounded-lg bg-[#F4F6FD] p-4 text-sm leading-6 text-[#283B54]">
              {firstQuestion}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void copy(firstQuestion, "question")}
            >
              {zh ? "复制提问" : "Copy question"}
            </Button>
            <p role="status" className="text-xs leading-5 text-[#455E93]">
              {copyResult?.field === "question" ? copyFeedback : ""}
            </p>
          </section>
        )}
      </div>
    </AccountShell>
  );
}
