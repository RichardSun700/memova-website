import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  Loader2,
  RefreshCw,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useLocation } from "wouter";
import AccountShell from "@/components/account/AccountShell";
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
  listMcpConnections,
  revokeMcpConnection,
  type McpConnection,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { safeClientWebsite } from "@/lib/loginFlow";
import { useLegalLanguage } from "@/seo/legalLanguage";

export default function ConnectedClients() {
  const [, setLocation] = useLocation();
  const auth = useAuth();
  const language = useLegalLanguage();
  const L = (zh: string, en: string) => (language === "zh" ? zh : en);
  const [connections, setConnections] = useState<McpConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const requestSequence = useRef(0);
  const revokePending = useRef(false);
  const tokenRef = useRef(auth.token);
  tokenRef.current = auth.token;

  const loadConnections = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (!auth.token) return;
      const sequence = ++requestSequence.current;
      setError("");
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);
      try {
        const next = await listMcpConnections(auth.token);
        if (sequence === requestSequence.current) setConnections(next);
      } catch (err) {
        if (sequence === requestSequence.current)
          setError(
            err instanceof Error
              ? err.message
              : "Could not load connected clients."
          );
      } finally {
        if (sequence === requestSequence.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [auth.token]
  );

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setConnections([]);
      setLocation(
        `/mcp/login?next=${encodeURIComponent("/connected-clients" + (language === "zh" ? "?lang=zh" : ""))}`
      );
      return;
    }
    void loadConnections();
    return () => {
      requestSequence.current += 1;
    };
  }, [auth.isAuthenticated, loadConnections, language, setLocation]);

  const handleRevoke = async (connection: McpConnection) => {
    if (!auth.token || connection.status !== "active" || revokePending.current)
      return;
    const confirmed = window.confirm(
      L(
        `撤销 ${formatClientName(connection)} 的访问权限？`,
        `Revoke access for ${formatClientName(connection)}?`
      )
    );
    if (!confirmed) return;

    revokePending.current = true;
    const token = auth.token;
    setError("");
    setRevokingId(connection.connection_id);
    try {
      const revoked = await revokeMcpConnection(
        token,
        connection.connection_id
      );
      if (tokenRef.current !== token) return;
      if (
        revoked.connection_id !== connection.connection_id ||
        revoked.status !== "revoked"
      ) {
        throw new Error(
          L(
            "尚未确认撤销，请刷新后重试。",
            "Revocation has not been confirmed. Refresh and try again."
          )
        );
      }
      setConnections(items =>
        items.map(item =>
          item.connection_id === revoked.connection_id ? revoked : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not revoke this client."
      );
    } finally {
      revokePending.current = false;
      setRevokingId(null);
    }
  };

  if (!auth.isAuthenticated) return null;

  return (
    <AccountShell
      title={L("已授权的 Agent", "Connected clients")}
      subtitle={L(
        "查看各客户端的授权范围，或撤销指定连接。退出网页登录与撤销 Agent 授权分别管理。",
        "Review each client’s permissions and revoke a selected connection. Website sign-out and Agent access are managed separately."
      )}
      actions={
        <Button
          variant="outline"
          onClick={() => void loadConnections("refresh")}
          disabled={refreshing || loading}
          className="h-10 rounded-lg border-[#D7DEEB] text-[#455E93]"
        >
          {refreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {L("刷新", "Refresh")}
        </Button>
      }
    >
      {loading ? (
        <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-[#D7DEEB] bg-[#FFFEFA]">
          <div className="flex items-center gap-3 text-[13px] font-semibold text-[#455E93]/65">
            <Loader2 className="h-4 w-4 animate-spin" />
            {L("正在加载已授权客户端", "Loading connected clients")}
          </div>
        </div>
      ) : connections.length === 0 ? (
        error ? null : (
          <EmptyConnections language={language} />
        )
      ) : (
        <div className="grid gap-4">
          {connections.map(connection => (
            <ConnectionCard
              key={connection.connection_id}
              connection={connection}
              revoking={revokingId === connection.connection_id}
              busy={revokingId !== null}
              language={language}
              onRevoke={() => void handleRevoke(connection)}
            />
          ))}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] font-semibold text-[#B91C1C]"
        >
          {error}
        </p>
      )}
    </AccountShell>
  );
}

function ConnectionCard({
  connection,
  revoking,
  busy,
  language,
  onRevoke,
}: {
  connection: McpConnection;
  revoking: boolean;
  busy: boolean;
  language: "en" | "zh";
  onRevoke: () => void;
}) {
  const L = (zh: string, en: string) => (language === "zh" ? zh : en);
  return (
    <Card className="rounded-xl border-[#D7DEEB] bg-[#FFFEFA] shadow-lg shadow-[#455E93]/[0.04]">
      <CardHeader className="gap-4 md:grid-cols-[1fr_auto]">
        <div className="flex min-w-0 items-start gap-4">
          <ClientMark connection={connection} />
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <CardTitle className="break-words text-xl text-[#111A30]">
                {formatClientName(connection)}
              </CardTitle>
              <StatusBadge status={connection.status} />
            </div>
            <CardDescription className="break-words text-[#455E93]/55">
              {formatClientSubtitle(connection)}
            </CardDescription>
          </div>
        </div>
        <Button
          variant="outline"
          disabled={busy || connection.status !== "active"}
          onClick={onRevoke}
          className="h-10 rounded-lg border-[#FECACA] text-[#B91C1C] hover:bg-[#FEF2F2]"
        >
          {revoking ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldX className="h-4 w-4" />
          )}
          {L("撤销授权", "Revoke")}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <InfoBlock
            label={L("授权时间", "Connected")}
            value={formatDate(connection.connected_at)}
          />
          <InfoBlock
            label={L("最近使用", "Last used")}
            value={formatDate(connection.last_used_at)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {connection.scopes.map(scope => (
            <Badge
              key={scope}
              variant="outline"
              className="border-[#D7DEEB] bg-[#FAF8F3] px-2.5 py-1 text-[#455E93]"
            >
              {scope}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px] font-semibold text-[#455E93]/55">
          <span className="break-all">
            {L("目标服务", "Resource")}: {connection.resource}
          </span>
          {safeClientWebsite(connection.client_uri) && (
            <a
              href={safeClientWebsite(connection.client_uri)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#455E93] hover:text-[#111A30]"
            >
              {L("客户端网站", "Client site")}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em]",
        status === "active" && "bg-[#D1FAE5] text-[#065F46]",
        status === "revoked" && "bg-[#FEE2E2] text-[#B91C1C]",
        status !== "active" &&
          status !== "revoked" &&
          "bg-[#FEF3C7] text-[#B45309]"
      )}
    >
      {status === "active" ? (
        <ShieldCheck className="h-3 w-3" />
      ) : (
        <ShieldX className="h-3 w-3" />
      )}
      {status}
    </span>
  );
}

function ClientMark({ connection }: { connection: McpConnection }) {
  const logo = safeClientWebsite(connection.logo_uri);
  if (logo?.startsWith("https:")) {
    return (
      <img
        alt=""
        src={logo}
        referrerPolicy="no-referrer"
        className="h-14 w-14 rounded-xl border border-[#D7DEEB] object-cover"
      />
    );
  }
  const initial = (connection.client_name || connection.client_id || "M")
    .slice(0, 1)
    .toUpperCase();
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#111A30] text-lg font-bold text-white">
      {initial}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#E5E8F0] bg-[#FAF8F3] px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#455E93]/45">
        {label}
      </div>
      <div className="mt-1 break-words text-[13px] font-semibold text-[#111A30]">
        {value}
      </div>
    </div>
  );
}

function EmptyConnections({ language }: { language: "en" | "zh" }) {
  return (
    <div className="rounded-xl border border-[#D7DEEB] bg-[#FFFEFA] px-6 py-12 text-center shadow-lg shadow-[#455E93]/[0.04]">
      <ShieldCheck className="mx-auto h-10 w-10 text-[#455E93]" />
      <h2 className="mt-4 text-lg font-bold text-[#111A30]">
        {language === "zh" ? "还没有已授权的 Agent" : "No connected clients"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#455E93]/60">
        {language === "zh"
          ? "在客户端发起连接并批准授权后，即可在这里管理。"
          : "Clients appear here after you approve an authorization request."}
      </p>
    </div>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatClientSubtitle(connection: McpConnection): string {
  if (!connection.client_uri) return "MCP client";

  try {
    return new URL(connection.client_uri).hostname;
  } catch {
    return connection.client_uri;
  }
}

function formatClientName(connection: McpConnection): string {
  return connection.client_name?.trim() || "MCP client";
}
