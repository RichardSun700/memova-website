import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useLocation } from "wouter";
import AccountShell from "@/components/account/AccountShell";
import McpSetupGuide, {
  initialMcpLanguage,
  McpLanguageToggle,
  suggestedMcpClient,
  type McpLanguage,
} from "@/components/account/McpSetupGuide";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  approveMcpAuthorizationRequest,
  denyMcpAuthorizationRequest,
  getMcpAuthorizationRequest,
  type McpAuthorizationRequest,
} from "@/lib/api";

const AUTO_REDIRECT_DELAY_MS = 3000;
const CALLBACK_RETRY_DELAY_MS = 6000;

const DESIGN_PREVIEW_REQUEST: McpAuthorizationRequest = {
  id: "design-preview",
  client_id: "mcporter-memova",
  client_name: "mcporter-memova",
  client_uri: "https://developers.openai.com/codex",
  logo_uri: null,
  redirect_uri: "",
  resource: "https://api.memova.ai/mcp",
  scopes: [
    "notes.read",
    "actions.read",
    "actions.write",
    "automation.read",
    "automation.write",
    "knowledge.read",
    "knowledge.write",
    "personal_manual.write",
  ],
  status: "pending",
  expires_at: "2026-09-02T16:00:00.000Z",
  created_at: "2026-09-02T15:00:00.000Z",
};

export default function McpConsent() {
  const [, setLocation] = useLocation();
  const auth = useAuth();
  const [language, setLanguage] = useState(initialMcpLanguage);
  const zh = language === "zh";
  const requestId = useMemo(
    () => new URLSearchParams(window.location.search).get("request_id") || "",
    []
  );
  const isDesignPreview = import.meta.env.DEV && requestId === "design-preview";
  const previewState = import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get("preview_state") || ""
    : "";
  const returnPath = `${window.location.pathname}${window.location.search}`;

  const [request, setRequest] = useState<McpAuthorizationRequest | null>(() =>
    isDesignPreview && previewState !== "loading" && previewState !== "error"
      ? {
          ...DESIGN_PREVIEW_REQUEST,
          status: previewState === "expired" ? "expired" : "pending",
        }
      : null
  );
  const [loading, setLoading] = useState(
    isDesignPreview ? previewState === "loading" : Boolean(requestId)
  );
  const [submitting, setSubmitting] = useState<"approve" | "deny" | null>(null);
  const [approvalRedirectUri, setApprovalRedirectUri] = useState(
    isDesignPreview && previewState === "approved"
      ? `${window.location.origin}/mcp/oauth/consent?request_id=design-preview`
      : ""
  );
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState(
    isDesignPreview && previewState === "error"
      ? "This authorization request is no longer available. Start the connection again from your agent."
      : ""
  );
  const redirectTimerRef = useRef<number | null>(null);
  const recoveryTimerRef = useRef<number | null>(null);
  const clientLabel = request?.client_name?.trim() || "this app";
  const pageTitle = approvalRedirectUri
    ? zh
      ? "授权已批准"
      : "Authorization approved"
    : loading
      ? zh
        ? "正在检查授权请求"
        : "Checking authorization request"
      : request
        ? zh
          ? `授权 ${clientLabel}`
          : `Authorize ${clientLabel}`
        : zh
          ? "授权请求不可用"
          : "Authorization unavailable";
  const pageSubtitle = approvalRedirectUri
    ? zh
      ? "正在把授权结果交给发起连接的 Agent；请回到原聊天验证读取。"
      : "Sending approval to the agent that started this request. Verify access in the original chat."
    : loading
      ? zh
        ? "正在验证你从 Agent 发起的请求。"
        : "Checking the request you started in your agent."
      : request
        ? zh
          ? "仅在你刚刚从自己的 Agent 发起连接时批准。"
          : "Approve only if you just started this connection in your agent."
        : zh
          ? "请回到原 Agent，重新发起授权。"
          : "Return to your agent and start a new authorization request.";

  useEffect(() => {
    if (isDesignPreview) return;
    if (!requestId) {
      setLoading(false);
      setError("Missing authorization request.");
      return;
    }
    if (!auth.isAuthenticated) {
      setLocation(`/login?next=${encodeURIComponent(returnPath)}`);
      return;
    }
    if (!auth.token) return;

    let cancelled = false;
    setLoading(true);
    getMcpAuthorizationRequest(auth.token, requestId)
      .then(detail => {
        if (!cancelled) setRequest(detail);
      })
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load this authorization request."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    auth.isAuthenticated,
    auth.token,
    isDesignPreview,
    requestId,
    returnPath,
    setLocation,
  ]);

  const sendToClient = () => {
    if (!approvalRedirectUri) return;
    if (redirectTimerRef.current !== null)
      window.clearTimeout(redirectTimerRef.current);
    if (recoveryTimerRef.current !== null)
      window.clearTimeout(recoveryTimerRef.current);
    setRedirecting(true);
    // One automatic attempt only. If navigation is blocked, keep recovery available.
    recoveryTimerRef.current = window.setTimeout(
      () => setRedirecting(false),
      CALLBACK_RETRY_DELAY_MS
    );
    try {
      window.location.assign(approvalRedirectUri);
    } catch {
      setRedirecting(false);
      setError(
        zh
          ? "浏览器未能发送授权结果。请先返回 Agent 检查状态；若回调失败或已过期，从 Agent 重新发起授权。"
          : "The browser could not send the authorization result. Check your agent first; if the callback failed or expired, start a fresh authorization from the agent."
      );
    }
  };

  useEffect(() => {
    if (!approvalRedirectUri) return;
    redirectTimerRef.current = window.setTimeout(
      sendToClient,
      AUTO_REDIRECT_DELAY_MS
    );
    return () => {
      if (redirectTimerRef.current !== null)
        window.clearTimeout(redirectTimerRef.current);
      if (recoveryTimerRef.current !== null)
        window.clearTimeout(recoveryTimerRef.current);
    };
    // Callback URL is immutable after approval. A language change must not resend the code.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalRedirectUri]);

  const returnToClient = () => {
    if (!redirecting) sendToClient();
  };

  const handleApprove = async () => {
    if ((!auth.token && !isDesignPreview) || !requestId) return;
    setError("");
    setSubmitting("approve");
    try {
      if (isDesignPreview) {
        await new Promise(resolve => window.setTimeout(resolve, 480));
        setApprovalRedirectUri(
          `${window.location.origin}/mcp/oauth/consent?request_id=design-preview`
        );
        return;
      }
      const response = await approveMcpAuthorizationRequest(
        auth.token!,
        requestId
      );
      setApprovalRedirectUri(response.redirect_uri);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not approve this request."
      );
      setSubmitting(null);
    }
  };

  const handleDeny = async () => {
    if ((!auth.token && !isDesignPreview) || !requestId) return;
    setError("");
    setSubmitting("deny");
    try {
      if (isDesignPreview) {
        window.location.assign("/");
        return;
      }
      const response = await denyMcpAuthorizationRequest(
        auth.token!,
        requestId
      );
      window.location.assign(response.redirect_uri);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not deny this request."
      );
      setSubmitting(null);
    }
  };

  return (
    <AccountShell
      compact
      title={pageTitle}
      subtitle={pageSubtitle}
      actions={<McpLanguageToggle language={language} onChange={setLanguage} />}
    >
      {loading ? (
        <LoadingState />
      ) : approvalRedirectUri && request ? (
        <ApprovalSuccess
          clientLabel={clientLabel}
          error={error}
          language={language}
          next={request.scopes.includes("next.read")}
          redirecting={redirecting}
          onContinue={returnToClient}
        />
      ) : request ? (
        <div className="w-full">
          <Card className="gap-0 overflow-hidden rounded-[18px] border-[#D7DEEB] bg-[#FFFEFA] py-0 shadow-[0_24px_70px_rgba(17,26,48,0.07)]">
            <div
              className="h-1 bg-[var(--memova-brand-gradient)]"
              aria-hidden="true"
            />
            <CardHeader className="border-b border-[#E5E8F0] px-5 pb-5 pt-5 sm:px-7 sm:pt-6">
              <div className="flex items-center gap-4">
                <ClientMark request={request} />
                <div className="min-w-0">
                  <CardTitle className="break-words text-xl tracking-[-0.02em] text-[#111A30]">
                    {request.client_name || "MCP client"}
                  </CardTitle>
                  <CardDescription className="mt-1.5 break-words text-[12px] font-medium text-[#626A79]">
                    {formatAccountContext(
                      auth.user?.display_name,
                      auth.user?.email,
                      auth.workspace?.name
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 px-5 pb-6 pt-5 sm:px-7 sm:pb-7">
              <section>
                <h2 className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#6B86E8]">
                  {zh ? "申请的权限" : "Access requested"}
                </h2>
                <PermissionList scopes={request.scopes} />
                {request.scopes.includes("next.read") && (
                  <p className="mt-3 text-[12px] leading-6 text-[#626A79]">
                    {zh
                      ? "Next 云端资料只读：小时笔记、灵感、Timeline/My Day、记忆、健康样本和录音标记，以及已有账号、用量和登录记录。不会修改或生成资料，读取无需 Pro。"
                      : "Read-only Next cloud access: hour notes, inspirations, Timeline/My Day, memories, health samples and recording markers, plus stored account, usage and sign-in records. No content is generated or changed. No Pro subscription is required."}
                  </p>
                )}
              </section>

              <McpSetupGuide
                language={language}
                client={suggestedMcpClient(request.client_name || "")}
                next={request.scopes.includes("next.read")}
              />

              {request.status !== "pending" && (
                <Alert className="border-[#E9D8B5] bg-[#FFF9EC] text-[#7A5622]">
                  <ShieldX className="h-4 w-4 text-[#A66F1E]" />
                  <AlertTitle className="font-bold text-[#7A5622]">
                    Request is {request.status}
                  </AlertTitle>
                  <AlertDescription className="text-[#7A5622]/80">
                    {zh
                      ? "回到原 Agent，重新发起授权。"
                      : "Return to your agent and start a new authorization request."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3 pt-1">
                <Button
                  onClick={() => void handleApprove()}
                  disabled={submitting !== null || request.status !== "pending"}
                  className="oauth-approve-button group relative h-12 w-full overflow-hidden rounded-[11px] bg-[#397D5C] px-5 text-[13px] font-extrabold text-white shadow-[0_12px_30px_rgba(57,125,92,0.24)] hover:bg-[#2F6A4D] hover:shadow-[0_14px_34px_rgba(57,125,92,0.30)] focus-visible:ring-[#397D5C]/35"
                >
                  {submitting === "approve" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {submitting === "approve"
                    ? zh
                      ? "正在批准授权…"
                      : "Approving access…"
                    : zh
                      ? "批准授权"
                      : "Approve access"}
                  {submitting !== "approve" && (
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  )}
                </Button>
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                  <p className="text-[12px] leading-5 text-[#626A79]">
                    {zh
                      ? "批准后，请回到 Agent 验证工具可用。"
                      : "After approval, verify the tools in your agent."}
                  </p>
                  <button
                    type="button"
                    onClick={() => void handleDeny()}
                    disabled={
                      submitting !== null || request.status !== "pending"
                    }
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] font-bold text-[#6B86E8] transition-colors hover:bg-[#EEF1FB] hover:text-[#455E93] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {submitting === "deny" && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {zh ? "取消授权" : "Cancel this connection"}
                  </button>
                </div>
              </div>

              <p className="text-[12px] leading-5 text-[#626A79]">
                {zh
                  ? `这将允许 ${clientLabel} 访问上述资料；你可以在 Connected clients 撤销授权。`
                  : `This allows ${clientLabel} to access the items above until you revoke authorization in Connected clients.`}
              </p>

              <TechnicalDetails request={request} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState error={error || "Authorization request was not found."} />
      )}

      {error && request && !approvalRedirectUri && (
        <p className="mt-5 rounded-[10px] border border-[#F1C9C9] bg-[#FFF5F5] px-4 py-3 text-[12px] font-bold text-[#A63B3B]">
          {error}
        </p>
      )}
    </AccountShell>
  );
}

function ApprovalSuccess({
  clientLabel,
  error,
  language,
  next,
  redirecting,
  onContinue,
}: {
  clientLabel: string;
  error: string;
  language: McpLanguage;
  next: boolean;
  redirecting: boolean;
  onContinue: () => void;
}) {
  const zh = language === "zh";
  return (
    <div className="w-full">
      <Card className="gap-0 overflow-hidden rounded-[18px] border-[#D6E8DE] bg-[#FFFEFA] py-0 shadow-[0_24px_70px_rgba(17,26,48,0.07)]">
        <div
          className="h-1 bg-[var(--memova-brand-gradient)]"
          aria-hidden="true"
        />
        <CardContent className="px-6 py-10 text-center sm:px-10 sm:py-12">
          <div className="oauth-success-mark mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ECF5F0] text-[#397D5C] ring-8 ring-[#ECF5F0]/55">
            <CheckCircle2 className="h-8 w-8" strokeWidth={2.25} />
          </div>
          <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#397D5C]">
            {zh ? "授权已批准" : "Access approved"}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-[#111A30]">
            {zh
              ? `已批准 ${clientLabel} 的授权请求`
              : `Access approved for ${clientLabel}`}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-[#626A79]">
            {zh
              ? "即将把授权结果交给 Agent。这不代表当前聊天已经加载工具；请返回原聊天完成读取验证。"
              : "The authorization result will be sent to your agent. This does not mean the current chat has loaded its tools. Return to the original chat to verify a read."}
          </p>

          <div
            className="mx-auto mt-7 max-w-md overflow-hidden rounded-full bg-[#ECF5F0]"
            aria-hidden="true"
          >
            <div
              className="oauth-success-progress h-1.5 rounded-full bg-[#397D5C]"
              style={{ animationDuration: `${AUTO_REDIRECT_DELAY_MS}ms` }}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-[10px] border border-[#F1C9C9] bg-[#FFF5F5] px-4 py-3 text-[12px] font-bold text-[#A63B3B]"
            >
              {error}
            </p>
          )}
          <Button
            type="button"
            onClick={onContinue}
            disabled={redirecting}
            className="mt-7 h-11 rounded-[10px] bg-[#397D5C] px-5 text-[13px] font-extrabold text-white shadow-[0_10px_24px_rgba(57,125,92,0.22)] hover:bg-[#2F6A4D]"
          >
            {redirecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {redirecting
              ? zh
                ? "正在发送授权结果…"
                : "Sending authorization result…"
              : zh
                ? "发送授权结果给 Agent"
                : "Send authorization result to agent"}
          </Button>
          <p className="mt-3 text-[11px] text-[#6B86E8]">
            {zh
              ? "页面会自动发送一次。如果 Agent 已显示登录成功，请直接返回原聊天；回调失败或过期时，从 Agent 重新发起授权。"
              : "This page sends the result automatically once. If your agent already reports a successful sign-in, return to the chat. For a failed or expired callback, start a fresh authorization from the agent."}
          </p>
          <div className="mt-5">
            <McpSetupGuide
              language={language}
              client={suggestedMcpClient(clientLabel)}
              next={next}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PermissionList({ scopes }: { scopes: string[] }) {
  const permissions = summarizeScopes(scopes);

  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {permissions.map(permission => (
        <li
          key={permission.label}
          className="inline-flex items-center gap-2 rounded-full border border-[#C5CEE1] bg-[#EEF1FB] px-3 py-2 text-[12px] font-bold text-[#111A30]"
        >
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#566CE5]" />
          {permission.label}
        </li>
      ))}
    </ul>
  );
}

function TechnicalDetails({ request }: { request: McpAuthorizationRequest }) {
  return (
    <details className="group rounded-[11px] border border-[#D7DEEB] bg-[#FFFEFA]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[12px] font-bold text-[#455E93] transition-colors hover:text-[#111A30] [&::-webkit-details-marker]:hidden">
        Technical details
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-[#E5E8F0] px-4 py-4">
        {request.client_uri && (
          <a
            href={request.client_uri}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[12px] font-bold text-[#566CE5] hover:text-[#455E93]"
          >
            Visit client site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
        <InfoBlock label="Client ID" value={request.client_id} />
        <InfoBlock label="Resource" value={request.resource} />
        <InfoBlock label="Redirect URI" value={request.redirect_uri} />
        <InfoBlock
          label="Request expires"
          value={formatDate(request.expires_at)}
        />
        <div>
          <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6B86E8]">
            Raw scopes
          </div>
          <div className="flex flex-wrap gap-2">
            {request.scopes.map(scope => (
              <Badge
                key={scope}
                variant="outline"
                className="border-[#C5CEE1] bg-[#EEF1FB] px-2.5 py-1 text-[#455E93]"
              >
                {scope}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </details>
  );
}

type PermissionSummary = {
  label: string;
};

const permissionGroups = [
  {
    read: "notes.read",
    write: "notes.write",
    readLabel: "Read notes",
    writeLabel: "Write notes",
    manageLabel: "Read and write notes",
  },
  {
    read: "actions.read",
    write: "actions.write",
    readLabel: "Read actions",
    writeLabel: "Write actions",
    manageLabel: "Read and write actions",
  },
  {
    read: "automation.read",
    write: "automation.write",
    readLabel: "Read automations",
    writeLabel: "Write automations",
    manageLabel: "Read and write automations",
  },
] satisfies Array<{
  read: string;
  write: string;
  readLabel: string;
  writeLabel: string;
  manageLabel: string;
}>;

function summarizeScopes(scopes: string[]): PermissionSummary[] {
  const scopeSet = new Set(scopes);
  const handled = new Set<string>();
  const summaries: PermissionSummary[] = [];

  for (const group of permissionGroups) {
    const hasRead = scopeSet.has(group.read);
    const hasWrite = scopeSet.has(group.write);
    handled.add(group.read);
    handled.add(group.write);

    if (hasRead && hasWrite) {
      summaries.push({
        label: group.manageLabel,
      });
    } else if (hasRead) {
      summaries.push({
        label: group.readLabel,
      });
    } else if (hasWrite) {
      summaries.push({
        label: group.writeLabel,
      });
    }
  }

  for (const scope of scopes) {
    if (!handled.has(scope)) {
      summaries.push({
        label: humanizeScope(scope),
      });
    }
  }

  if (summaries.length === 0) {
    summaries.push({
      label: "Connect to workspace",
    });
  }

  return summaries;
}

function humanizeScope(scope: string): string {
  const label = scope
    .replace(/[._:-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!label) return "Additional workspace access";
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatWorkspaceName(
  workspaceName: string | null | undefined,
  email: string | null | undefined
): string {
  if (!workspaceName) return "Personal workspace";
  if (!email) return workspaceName;

  const normalizedWorkspace = workspaceName.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  if (
    normalizedWorkspace === `${normalizedEmail} workspace` ||
    normalizedWorkspace === normalizedEmail
  ) {
    return "Personal workspace";
  }

  return workspaceName;
}

function formatAccountContext(
  displayName: string | null | undefined,
  email: string | null | undefined,
  workspaceName: string | null | undefined
): string {
  const accountName = displayName?.trim() || email?.trim();
  const workspace = formatWorkspaceName(workspaceName, email);
  return [accountName, workspace].filter(Boolean).join(" · ");
}

function ClientMark({ request }: { request: McpAuthorizationRequest }) {
  if (request.logo_uri) {
    return (
      <img
        alt=""
        src={request.logo_uri}
        className="h-14 w-14 rounded-[14px] border border-[#D7DEEB] object-cover shadow-[0_8px_20px_rgba(17,26,48,0.08)]"
      />
    );
  }
  if (/memova/i.test(`${request.client_name || ""} ${request.client_id}`)) {
    return (
      <img
        alt="Memova"
        src="/brand/memova-app-icon-liquid-blue.svg"
        className="h-14 w-14 rounded-[14px] shadow-[0_8px_20px_rgba(86,108,229,0.18)]"
      />
    );
  }
  const initial = (request.client_name || request.client_id || "M")
    .slice(0, 1)
    .toUpperCase();
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#111A30] text-lg font-extrabold text-white shadow-[0_8px_20px_rgba(17,26,48,0.16)]">
      {initial}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-[#E5E8F0] bg-[#FAF8F3] px-4 py-3">
      <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#6B86E8]">
        {label}
      </div>
      <div className="mt-1 break-words text-[12px] font-bold text-[#111A30]">
        {value}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-[18px] border border-[#D7DEEB] bg-[#FFFEFA] shadow-[0_24px_70px_rgba(17,26,48,0.06)]">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src="/brand/memova-app-icon-liquid-blue.svg"
            alt=""
            className="h-14 w-14 rounded-[14px]"
          />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#FAF8F3] text-[#566CE5] shadow-sm">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          </span>
        </div>
        <p className="mt-5 text-[13px] font-extrabold text-[#111A30]">
          Checking your connection
        </p>
        <p className="mt-1 text-[12px] text-[#626A79]">
          Loading the secure authorization request…
        </p>
      </div>
    </div>
  );
}

function EmptyState({ error }: { error: string }) {
  return (
    <div className="rounded-[18px] border border-[#D7DEEB] bg-[#FFFEFA] px-6 py-12 text-center shadow-[0_24px_70px_rgba(17,26,48,0.06)]">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7E8] text-[#A66F1E]">
        <ShieldX className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-lg font-extrabold tracking-[-0.02em] text-[#111A30]">
        Authorization unavailable
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#626A79]">
        {error}
      </p>
      <a
        href="/connected-clients"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-[10px] border border-[#C5CEE1] bg-[#FFFEFA] px-4 text-[12px] font-bold text-[#455E93] transition-colors hover:border-[#6B86E8] hover:text-[#111A30]"
      >
        View connected clients
      </a>
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
