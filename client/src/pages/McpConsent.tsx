import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { useLocation } from "wouter";
import AccountShell from "@/components/account/AccountShell";
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

export default function McpConsent() {
  const [, setLocation] = useLocation();
  const auth = useAuth();
  const requestId = useMemo(
    () => new URLSearchParams(window.location.search).get("request_id") || "",
    []
  );
  const returnPath = `${window.location.pathname}${window.location.search}`;

  const [request, setRequest] = useState<McpAuthorizationRequest | null>(null);
  const [loading, setLoading] = useState(Boolean(requestId));
  const [submitting, setSubmitting] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState("");
  const clientLabel = request?.client_name?.trim() || "this app";

  useEffect(() => {
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
  }, [auth.isAuthenticated, auth.token, requestId, returnPath, setLocation]);

  const handleApprove = async () => {
    if (!auth.token || !requestId) return;
    setError("");
    setSubmitting("approve");
    try {
      const response = await approveMcpAuthorizationRequest(
        auth.token,
        requestId
      );
      window.location.assign(response.redirect_uri);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not approve this request."
      );
      setSubmitting(null);
    }
  };

  const handleDeny = async () => {
    if (!auth.token || !requestId) return;
    setError("");
    setSubmitting("deny");
    try {
      const response = await denyMcpAuthorizationRequest(auth.token, requestId);
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
      title={
        request ? `Connect ${clientLabel} to Memova` : "Connect an app to Memova"
      }
      subtitle={
        request
          ? `${clientLabel} is requesting access to your Memova workspace.`
          : "Review this request before connecting it to your Memova workspace."
      }
    >
      {loading ? (
        <LoadingState />
      ) : request ? (
        <div className="mx-auto max-w-3xl">
          <Card className="rounded-xl border-[#DCEBF6] bg-white shadow-lg shadow-[#2E5B82]/[0.04]">
            <CardHeader className="gap-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <ClientMark request={request} />
                <div className="min-w-0">
                  <CardTitle className="break-words text-xl text-[#0F2B3C]">
                    {request.client_name || "MCP client"}
                  </CardTitle>
                  <CardDescription className="mt-1 break-words text-[#2E5B82]/55">
                    Wants to connect to your Memova workspace.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-[#D4E9F7] bg-[#F8FBFE]">
                <CheckCircle2 className="h-4 w-4 text-[#2E5B82]" />
                <AlertTitle>Signed in as {auth.user?.email}</AlertTitle>
                <AlertDescription>
                  This connection will use{" "}
                  {auth.workspace?.name || "your default workspace"}.
                </AlertDescription>
              </Alert>

              <section>
                <h2 className="text-lg font-bold text-[#0F2B3C]">
                  {clientLabel} will be able to:
                </h2>
                <PermissionList scopes={request.scopes} />
              </section>

              <Alert className="border-[#FDE68A] bg-[#FFFBEB]">
                <ShieldAlert className="h-4 w-4 text-[#B45309]" />
                <AlertTitle>Only approve requests you started</AlertTitle>
                <AlertDescription>
                  Approve this only if you just started connecting Memova from{" "}
                  {clientLabel}.
                </AlertDescription>
              </Alert>

              {request.status !== "pending" && (
                <Alert className="border-[#FDE68A] bg-[#FEF3C7]/70">
                  <ShieldX className="h-4 w-4 text-[#B45309]" />
                  <AlertTitle>Request is {request.status}</AlertTitle>
                  <AlertDescription>
                    This request may no longer be available for approval.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Button
                  onClick={() => void handleApprove()}
                  disabled={submitting !== null || request.status !== "pending"}
                  className="h-11 rounded-lg bg-[#0F2B3C] text-white hover:bg-[#1A3A5C]"
                >
                  {submitting === "approve" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  Approve access
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void handleDeny()}
                  disabled={submitting !== null || request.status !== "pending"}
                  className="h-11 rounded-lg border-[#D4E9F7] text-[#2E5B82]"
                >
                  {submitting === "deny" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShieldX className="h-4 w-4" />
                  )}
                  Deny
                </Button>
              </div>

              <TechnicalDetails request={request} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState error={error || "Authorization request was not found."} />
      )}

      {error && request && (
        <p className="mt-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] font-semibold text-[#B91C1C]">
          {error}
        </p>
      )}
    </AccountShell>
  );
}

function PermissionList({ scopes }: { scopes: string[] }) {
  const permissions = summarizeScopes(scopes);

  return (
    <ul className="mt-3 grid gap-3">
      {permissions.map(permission => (
        <li
          key={permission.label}
          className="flex gap-3 rounded-lg border border-[#EDF3FA] bg-[#FAFCFF] px-4 py-3"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2E5B82]" />
          <div>
            <div className="text-[14px] font-semibold text-[#0F2B3C]">
              {permission.label}
            </div>
            {permission.description && (
              <div className="mt-1 text-[12px] leading-5 text-[#2E5B82]/60">
                {permission.description}
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

function TechnicalDetails({ request }: { request: McpAuthorizationRequest }) {
  return (
    <details className="group rounded-lg border border-[#D4E9F7] bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13px] font-semibold text-[#2E5B82] [&::-webkit-details-marker]:hidden">
        Technical details
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-3 border-t border-[#EDF3FA] px-4 py-4">
        {request.client_uri && (
          <a
            href={request.client_uri}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2E5B82] hover:text-[#0F2B3C]"
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
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2E5B82]/45">
            Raw scopes
          </div>
          <div className="flex flex-wrap gap-2">
            {request.scopes.map(scope => (
              <Badge
                key={scope}
                variant="outline"
                className="border-[#D4E9F7] bg-[#F8FBFE] px-2.5 py-1 text-[#2E5B82]"
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
  description?: string;
};

const permissionGroups = [
  {
    read: "notes.read",
    write: "notes.write",
    readLabel: "Read your notes",
    writeLabel: "Create and update notes",
    manageLabel: "Read and manage notes",
    readDescription: "Let this client reference notes stored in Memova.",
    writeDescription: "Let this client add or update notes in Memova.",
    manageDescription:
      "Let this client reference, add, and update notes in Memova.",
  },
  {
    read: "actions.read",
    write: "actions.write",
    readLabel: "Read your actions",
    writeLabel: "Create and update actions",
    manageLabel: "Read and manage actions",
    readDescription: "Let this client view actions in your workspace.",
    writeDescription: "Let this client add or update actions for you.",
    manageDescription: "Let this client view, add, and update actions for you.",
  },
  {
    read: "automation.read",
    write: "automation.write",
    readLabel: "Read your automations",
    writeLabel: "Create and update automations",
    manageLabel: "Read and manage automations",
    readDescription: "Let this client view automations in your workspace.",
    writeDescription: "Let this client add or update automations for you.",
    manageDescription:
      "Let this client view, add, and update automations for you.",
  },
] satisfies Array<{
  read: string;
  write: string;
  readLabel: string;
  writeLabel: string;
  manageLabel: string;
  readDescription: string;
  writeDescription: string;
  manageDescription: string;
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
        description: group.manageDescription,
      });
    } else if (hasRead) {
      summaries.push({
        label: group.readLabel,
        description: group.readDescription,
      });
    } else if (hasWrite) {
      summaries.push({
        label: group.writeLabel,
        description: group.writeDescription,
      });
    }
  }

  for (const scope of scopes) {
    if (!handled.has(scope)) {
      summaries.push({
        label: humanizeScope(scope),
        description: "Additional access requested by this client.",
      });
    }
  }

  if (summaries.length === 0) {
    summaries.push({
      label: "Connect to your workspace",
      description: "No specific workspace permissions were listed.",
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

function ClientMark({ request }: { request: McpAuthorizationRequest }) {
  if (request.logo_uri) {
    return (
      <img
        alt=""
        src={request.logo_uri}
        className="h-14 w-14 rounded-xl border border-[#DCEBF6] object-cover"
      />
    );
  }
  const initial = (request.client_name || request.client_id || "M")
    .slice(0, 1)
    .toUpperCase();
  return (
    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0F2B3C] text-lg font-bold text-white">
      {initial}
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#EDF3FA] bg-[#FAFCFF] px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2E5B82]/45">
        {label}
      </div>
      <div className="mt-1 break-words text-[13px] font-semibold text-[#0F2B3C]">
        {value}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-[#DCEBF6] bg-white">
      <div className="flex items-center gap-3 text-[13px] font-semibold text-[#2E5B82]/65">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading authorization request
      </div>
    </div>
  );
}

function EmptyState({ error }: { error: string }) {
  return (
    <div className="rounded-xl border border-[#DCEBF6] bg-white px-6 py-12 text-center shadow-lg shadow-[#2E5B82]/[0.04]">
      <ShieldX className="mx-auto h-10 w-10 text-[#B45309]" />
      <h2 className="mt-4 text-lg font-bold text-[#0F2B3C]">
        Authorization unavailable
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[13px] leading-6 text-[#2E5B82]/60">
        {error}
      </p>
    </div>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
