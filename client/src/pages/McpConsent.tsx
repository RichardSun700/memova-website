import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useLocation, useSearch } from "wouter";
import AccountShell from "@/components/account/AccountShell";
import McpSetupGuide, {
  McpLanguageToggle,
  nextDataTypes,
  suggestedMcpClient,
  type McpLanguage,
} from "@/components/account/McpSetupGuide";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  ApiError,
  approveMcpAuthorizationRequest,
  denyMcpAuthorizationRequest,
  getMcpAuthorizationRequest,
  type McpAuthorizationRequest,
  type McpAuthorizationResponse,
} from "@/lib/api";
import { MCP_DEPLOYMENT } from "@/lib/mcpDeployment";
import { normalizeLoginReturnPath } from "@/lib/loginFlow";
import {
  setLegalLanguage,
  useLegalLanguage,
  withLegalLanguage,
} from "@/seo/legalLanguage";

const AUTO_REDIRECT_DELAY_MS = 3000;
const legacyScopes = new Set([
  "notes.read",
  "notes.write",
  "actions.read",
  "actions.write",
  "automation.read",
  "automation.write",
  "knowledge.read",
  "knowledge.write",
  "personal_manual.write",
  "resources.read",
  "resources.export",
  "sparks.read",
  "conversations.read",
  "conversations.write",
  "conversations.delete",
]);

export function consentSurface(
  request: McpAuthorizationRequest,
  apiOrigin = MCP_DEPLOYMENT.oauthApiBaseUrl
): "next" | "legacy" | "unsupported" {
  if (!apiOrigin || !request.scopes.length) return "unsupported";
  const origin = apiOrigin.replace(/\/$/, "");
  const next =
    request.resource === `${origin}/v2/mcp` ||
    request.resource === `${origin}/mcp/next`;
  if (next && request.scopes.length === 1 && request.scopes[0] === "next.read")
    return "next";
  if (
    request.resource === `${origin}/mcp` &&
    request.scopes.every(scope => legacyScopes.has(scope))
  )
    return "legacy";
  return "unsupported";
}

export function isAuthorizationRequest(
  value: unknown
): value is McpAuthorizationRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Partial<McpAuthorizationRequest>;
  return (
    typeof request.id === "string" &&
    Boolean(request.id) &&
    typeof request.client_id === "string" &&
    Boolean(request.client_id) &&
    typeof request.resource === "string" &&
    typeof request.redirect_uri === "string" &&
    typeof request.status === "string" &&
    typeof request.expires_at === "string" &&
    Number.isFinite(Date.parse(request.expires_at)) &&
    Array.isArray(request.scopes) &&
    request.scopes.every(scope => typeof scope === "string") &&
    (request.client_name === null || typeof request.client_name === "string")
  );
}

export function isSafeMcpCallback(value: string): boolean {
  try {
    if (/[\u0000-\u0020\u007f]/.test(value)) return false;
    const url = new URL(value);
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
    return (
      !url.username &&
      !url.password &&
      (url.protocol === "https:" || (url.protocol === "http:" && loopback))
    );
  } catch {
    return false;
  }
}

export function authorizationCallback(
  response: unknown,
  request: McpAuthorizationRequest,
  decision: "approve" | "deny"
): string {
  if (!response || typeof response !== "object")
    throw new Error("Invalid authorization response.");
  const result = response as Partial<McpAuthorizationResponse>;
  const returned = result.authorization_request;
  if (
    typeof result.redirect_uri !== "string" ||
    !isSafeMcpCallback(result.redirect_uri) ||
    !isSafeMcpCallback(request.redirect_uri) ||
    !isAuthorizationRequest(returned)
  )
    throw new Error("Invalid authorization response.");
  if (
    returned.id !== request.id ||
    returned.client_id !== request.client_id ||
    returned.resource !== request.resource ||
    returned.redirect_uri !== request.redirect_uri ||
    [...returned.scopes].sort().join(" ") !==
      [...request.scopes].sort().join(" ") ||
    returned.status !== (decision === "approve" ? "approved" : "denied")
  )
    throw new Error("The authorization response does not match this request.");
  const registered = new URL(request.redirect_uri);
  const callback = new URL(result.redirect_uri);
  if (
    callback.origin !== registered.origin ||
    callback.pathname !== registered.pathname
  )
    throw new Error("The authorization callback does not match this request.");
  for (const [name, value] of Array.from(registered.searchParams.entries())) {
    if (callback.searchParams.get(name) !== value)
      throw new Error(
        "The authorization callback does not match this request."
      );
  }
  // Return the authenticated server value byte-for-byte, including code/state/issuer.
  return result.redirect_uri;
}

function formatDate(value: string, language: McpLanguage) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function McpConsent() {
  const [path, setLocation] = useLocation();
  const search = useSearch();
  const auth = useAuth();
  const language = useLegalLanguage();
  const zh = language === "zh";
  const query = useMemo(
    () =>
      new URLSearchParams(
        typeof window === "undefined" ? search : window.location.search
      ),
    [search]
  );
  const requestId = query.get("request_id") || "";
  const returnPath = normalizeLoginReturnPath(
    typeof window === "undefined"
      ? path
      : `${window.location.pathname}${window.location.search}`,
    "/mcp/setup"
  );
  const loginPath = `/login?next=${encodeURIComponent(returnPath)}&lang=${language}`;
  const loginPathRef = useRef(loginPath);
  loginPathRef.current = loginPath;
  const previewState = query.get("preview_state") || "";
  const preview = import.meta.env.DEV && requestId === "design-preview";
  const [request, setRequest] = useState<McpAuthorizationRequest | null>(null);
  const [loading, setLoading] = useState(Boolean(requestId));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState<
    "approve" | "deny" | "switch" | null
  >(null);
  const [decision, setDecision] = useState<"approve" | "deny" | null>(null);
  const [approvalRedirectUri, setApprovalRedirectUri] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [clock, setClock] = useState(Date.now);
  const submitted = useRef(false);
  const callbackSent = useRef(false);
  const redirectTimer = useRef<number | null>(null);
  const currentRequestId = useRef(requestId);
  currentRequestId.current = requestId;
  const currentToken = useRef(auth.token);
  currentToken.current = auth.token;
  const surface = request ? consentSurface(request) : "unsupported";
  const expired = request
    ? request.status === "expired" || Date.parse(request.expires_at) <= clock
    : false;
  const pending = request?.status === "pending" && !expired;
  const clientLabel =
    request?.client_name?.trim() ||
    request?.client_id ||
    (zh ? "这个 Agent" : "this agent");

  useEffect(() => {
    submitted.current = false;
    callbackSent.current = false;
    setRequest(null);
    setDecision(null);
    setApprovalRedirectUri("");
    setError("");
    setSubmitting(null);
    if (!requestId) {
      setLoading(false);
      return;
    }
    if (preview) {
      const fixture: McpAuthorizationRequest = {
        id: requestId,
        client_id: "codex-local-preview",
        client_name: "Codex",
        client_uri: null,
        logo_uri: null,
        redirect_uri: "http://127.0.0.1:1455/auth/callback",
        resource: MCP_DEPLOYMENT.serverUrl,
        scopes: ["next.read"],
        status: previewState === "expired" ? "expired" : "pending",
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        created_at: null,
      };
      setRequest(fixture);
      setLoading(false);
      return;
    }
    if (!auth.isAuthenticated || !auth.token) {
      setLoading(false);
      setLocation(loginPathRef.current);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const token = auth.token;
    getMcpAuthorizationRequest(token, requestId)
      .then(detail => {
        if (cancelled || currentToken.current !== token) return;
        if (!isAuthorizationRequest(detail) || detail.id !== requestId)
          throw new Error("Invalid authorization request.");
        setRequest(detail);
      })
      .catch(reason => {
        if (cancelled || currentToken.current !== token) return;
        if (reason instanceof ApiError && reason.status === 401) {
          auth.clearSession();
          setLocation(loginPathRef.current);
          return;
        }
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not load the authorization request."
        );
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
    auth.clearSession,
    requestId,
    preview,
    previewState,
    setLocation,
  ]);

  useEffect(() => {
    if (!request || !pending) return;
    const timer = window.setTimeout(
      () => setClock(Date.now()),
      Math.min(
        Math.max(1, Date.parse(request.expires_at) - Date.now()),
        2147483647
      )
    );
    return () => window.clearTimeout(timer);
  }, [request, pending, clock]);

  const sendToClient = () => {
    if (!approvalRedirectUri || callbackSent.current) return;
    callbackSent.current = true;
    if (redirectTimer.current !== null)
      window.clearTimeout(redirectTimer.current);
    setRedirecting(true);
    try {
      window.location.assign(approvalRedirectUri);
    } catch {
      setError(
        zh
          ? "浏览器未能返回 Agent。请手动返回原聊天检查授权状态；需要时重新发起认证。"
          : "The browser could not return to your agent. Return to the original chat to check authorization, and start a new authentication if needed."
      );
    }
  };

  useEffect(() => {
    if (!approvalRedirectUri) return;
    redirectTimer.current = window.setTimeout(
      sendToClient,
      AUTO_REDIRECT_DELAY_MS
    );
    return () => {
      if (redirectTimer.current !== null)
        window.clearTimeout(redirectTimer.current);
    };
    // The validated callback is immutable. Language changes must not resend it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvalRedirectUri]);

  const submit = async (action: "approve" | "deny") => {
    if (
      !request ||
      !pending ||
      submitted.current ||
      submitting ||
      (!auth.token && !preview) ||
      (action === "approve" && surface === "unsupported")
    )
      return;
    submitted.current = true;
    setSubmitting(action);
    setError("");
    if (preview) {
      setDecision(action);
      return;
    }
    const token = auth.token!;
    try {
      const response =
        action === "approve"
          ? await approveMcpAuthorizationRequest(token, requestId)
          : await denyMcpAuthorizationRequest(token, requestId);
      if (
        currentToken.current !== token ||
        currentRequestId.current !== requestId
      )
        return;
      const callback = authorizationCallback(response, request, action);
      setDecision(action);
      setApprovalRedirectUri(callback);
    } catch (reason) {
      if (
        currentToken.current !== token ||
        currentRequestId.current !== requestId
      )
        return;
      if (reason instanceof ApiError && reason.status === 401) {
        auth.clearSession();
        setLocation(loginPathRef.current);
        return;
      }
      setError(
        zh
          ? "未能确认授权结果。请回到原 Agent 检查状态，需要时重新发起请求。"
          : "Could not confirm the authorization result. Check the original agent and start a new request if needed."
      );
      setSubmitting(null);
    }
  };

  const switchAccount = async () => {
    if (submitting || submitted.current) return;
    setSubmitting("switch");
    setRequest(null);
    await auth.logout();
    setLocation(loginPathRef.current);
  };

  const title =
    decision === "approve"
      ? zh
        ? "授权已批准"
        : "Authorization approved"
      : decision === "deny"
        ? zh
          ? "已拒绝授权"
          : "Authorization declined"
        : zh
          ? "确认 Agent 的访问权限"
          : "Review agent access";
  return (
    <AccountShell
      compact
      title={title}
      subtitle={
        decision
          ? zh
            ? "请回到发起此次连接的 Agent 查看结果。"
            : "Return to the agent that started this connection to check the result."
          : zh
            ? "仅在你刚刚从自己的 Agent 发起此请求时批准。"
            : "Approve only if you just started this request in your agent."
      }
      actions={
        <McpLanguageToggle language={language} onChange={setLegalLanguage} />
      }
    >
      <div className="max-w-3xl space-y-5">
        {preview && (
          <p className="rounded-xl border border-[#D7DEEB] bg-white p-4 text-sm text-[#455E93]">
            {zh
              ? "本地界面预览 · 不发送授权。"
              : "Local interface preview · No authorization is sent."}
          </p>
        )}
        {loading ? (
          <div
            role="status"
            className="flex items-center gap-3 rounded-xl border border-[#D7DEEB] bg-white p-6 text-sm text-[#455E93]"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
            {zh ? "正在获取授权详情…" : "Loading authorization details…"}
          </div>
        ) : decision && request ? (
          <section className="rounded-xl border border-[#D7DEEB] bg-white p-6 sm:p-8">
            <CheckCircle2 className="oauth-success-mark h-10 w-10 text-[#397D5C]" />
            <h2 className="mt-5 text-xl font-bold text-[#111A30]">
              {decision === "approve"
                ? zh
                  ? `已批准 ${clientLabel} 的授权请求`
                  : `Authorization approved for ${clientLabel}`
                : zh
                  ? "授权请求已拒绝"
                  : "Authorization request declined"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#455E93]">
              {decision === "deny"
                ? zh
                  ? "Agent 将收到 access_denied。请回到原聊天继续，需要时从 Agent 发起新的授权。"
                  : "Your agent will receive access_denied. Return to the original chat to continue, or start a new authorization there if needed."
                : zh
                  ? "正在将结果交给发起连接的 Agent。请回到原聊天，确认工具已加载并验证一次读取。"
                  : "Sending the result to the agent that started this request. Return to the original chat, check loaded tools, and verify a read."}
            </p>
            {approvalRedirectUri && (
              <Button
                type="button"
                onClick={sendToClient}
                disabled={redirecting}
                className="mt-5 bg-[#397D5C] hover:bg-[#2F6A4D]"
              >
                {zh ? "返回 Agent" : "Return to agent"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </section>
        ) : request ? (
          <section className="overflow-hidden rounded-xl border border-[#D7DEEB] bg-white">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5E8F0] p-5 sm:p-6">
              <div>
                <img
                  src="/brand/memova-app-icon-liquid-blue.svg"
                  alt=""
                  width="40"
                  height="40"
                  className="mb-4 rounded-xl"
                />
                <h2 className="text-xl font-bold text-[#111A30]">
                  {clientLabel}
                </h2>
                <p className="mt-1 text-xs text-[#626A79]">
                  {zh
                    ? "客户端名称由请求方提供"
                    : "Client name supplied by the requester"}
                </p>
              </div>
              <div className="text-sm text-[#455E93]">
                <p>
                  {preview
                    ? "Demo account"
                    : auth.user?.email || auth.user?.display_name}
                </p>
                <button
                  type="button"
                  className="mt-2 font-semibold text-[#566CE5] underline disabled:opacity-50"
                  onClick={() => void switchAccount()}
                  disabled={Boolean(submitting) || preview}
                >
                  {zh ? "换账号" : "Switch account"}
                </button>
              </div>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <h3 className="font-bold text-[#111A30]">
                {surface === "next"
                  ? "Memova Next · next.read"
                  : surface === "legacy"
                    ? zh
                      ? "旧版 Memova MCP"
                      : "Legacy Memova MCP"
                    : zh
                      ? "无法批准此请求"
                      : "This request cannot be approved"}
              </h3>
              {surface === "next" && (
                <>
                  <p className="text-sm leading-6 text-[#455E93]">
                    {zh
                      ? "按需只读已保存云端资料，无需 Pro。包含以下六类内容，以及已有账号、用量和登录元数据。手机上尚未同步的本地内容不在范围内。"
                      : "Read saved cloud data on demand, with no Pro required. Access covers these six types plus stored account, usage and sign-in metadata. Unsynced phone content is outside this connection."}
                  </p>
                  <ul className="grid gap-2 text-sm text-[#455E93] sm:grid-cols-2">
                    {nextDataTypes.map(item => (
                      <li key={item.type}>
                        {zh ? item.zh : item.en}{" "}
                        <code className="text-xs text-[#6B86E8]">
                          {item.type}
                        </code>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {surface === "legacy" && (
                <p className="text-sm leading-6 text-[#455E93]">
                  {zh
                    ? "这是旧版 MCP 请求，可读或可写范围如下。请逐项确认权限。"
                    : "This legacy MCP request may include read or write access. Review each permission below."}
                </p>
              )}
              <dl className="grid gap-4 rounded-xl bg-[#F6F8FC] p-4 text-xs text-[#455E93]">
                <div>
                  <dt className="font-bold">{zh ? "目标服务" : "Resource"}</dt>
                  <dd className="mt-1 break-all">{request.resource}</dd>
                </div>
                <div>
                  <dt className="font-bold">{zh ? "权限" : "Scopes"}</dt>
                  <dd className="mt-1 break-words">
                    {request.scopes.join(" · ") || "—"}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold">
                    {zh ? "请求有效期" : "Request expires"}
                  </dt>
                  <dd className="mt-1">
                    {formatDate(request.expires_at, language)}
                  </dd>
                </div>
              </dl>
              {surface === "unsupported" && (
                <p
                  role="alert"
                  className="rounded-xl bg-[#FFF5F5] p-4 text-sm text-[#A63B3B]"
                >
                  {zh
                    ? "请求的服务地址与权限不匹配。请回到原 Agent，使用此站点支持的 MCP 地址重新连接。"
                    : "The requested resource and permissions do not match this service. Return to the original agent and use a supported MCP address."}
                </p>
              )}
              {!pending && (
                <p
                  role="alert"
                  className="rounded-xl bg-[#FFF9EC] p-4 text-sm text-[#7A5622]"
                >
                  {expired
                    ? zh
                      ? "请求已过期。"
                      : "This request has expired."
                    : zh
                      ? "此请求已处理或已失效。"
                      : "This request has already been used or is no longer active."}{" "}
                  {zh
                    ? "请从原 Agent 重新发起授权。"
                    : "Start a new authorization from the original agent."}
                </p>
              )}
              <McpSetupGuide
                language={language}
                client={suggestedMcpClient(clientLabel)}
                next={surface === "next"}
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  className="oauth-approve-button bg-[#397D5C] hover:bg-[#2F6A4D]"
                  onClick={() => void submit("approve")}
                  disabled={
                    !pending ||
                    surface === "unsupported" ||
                    Boolean(submitting) ||
                    submitted.current
                  }
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
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void submit("deny")}
                  disabled={
                    !pending || Boolean(submitting) || submitted.current
                  }
                >
                  {zh ? "取消授权" : "Cancel this connection"}
                </Button>
              </div>
              <p className="text-xs leading-6 text-[#626A79]">
                {zh
                  ? "授权后可在连接管理中随时撤销。"
                  : "You can revoke access in Connected clients."}{" "}
                <a
                  href={withLegalLanguage("/connected-clients", language)}
                  className="font-semibold text-[#566CE5] underline"
                >
                  {zh ? "管理连接" : "Manage connections"}
                </a>
              </p>
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-[#D7DEEB] bg-white p-6">
            <ShieldX className="h-8 w-8 text-[#6B86E8]" />
            <h2 className="mt-4 text-lg font-bold text-[#111A30]">
              {zh ? "授权请求不可用" : "Authorization unavailable"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#455E93]">
              {requestId
                ? zh
                  ? "请求无法获取，可能已过期或已处理。请从原 Agent 重新发起认证。"
                  : "The request could not be loaded. It may have expired or already been used. Start a fresh authentication in the original agent."
                : zh
                  ? "请先在 Agent 中添加 MCP 服务器并发起认证，再打开授权页。"
                  : "Add the MCP server in your agent and start authentication there to open a new authorization request."}
            </p>
            <a
              className="mt-5 inline-block text-sm font-semibold text-[#566CE5] underline"
              href={`/mcp/setup?lang=${language}`}
            >
              {zh ? "查看安装指南" : "Open setup guide"}
            </a>
          </section>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-[#F1C9C9] bg-[#FFF5F5] p-4 text-sm leading-6 text-[#A63B3B]"
          >
            {error}
          </p>
        )}
        {decision === "approve" && request && (
          <McpSetupGuide
            language={language}
            client={suggestedMcpClient(clientLabel)}
            next={surface === "next"}
          />
        )}
      </div>
    </AccountShell>
  );
}
