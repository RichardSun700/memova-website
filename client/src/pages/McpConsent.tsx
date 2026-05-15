import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
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
      title="Authorize MCP client"
      subtitle="Review the client request before granting access to your Memova workspace."
    >
      {loading ? (
        <LoadingState />
      ) : request ? (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-xl border-[#DCEBF6] bg-white shadow-lg shadow-[#2E5B82]/[0.04]">
            <CardHeader>
              <div className="flex items-start gap-4">
                <ClientMark request={request} />
                <div className="min-w-0">
                  <CardTitle className="break-words text-xl text-[#0F2B3C]">
                    {request.client_name || "MCP client"}
                  </CardTitle>
                  <CardDescription className="mt-1 break-words text-[#2E5B82]/55">
                    {request.client_uri || request.client_id}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <InfoBlock label="Resource" value={request.resource} />
              <InfoBlock label="Redirect URI" value={request.redirect_uri} />
              <InfoBlock
                label="Expires"
                value={formatDate(request.expires_at)}
              />

              <div>
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#2E5B82]/45">
                  Requested scopes
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
            </CardContent>
          </Card>

          <Card className="rounded-xl border-[#DCEBF6] bg-white shadow-lg shadow-[#2E5B82]/[0.04]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl text-[#0F2B3C]">
                Access review
              </CardTitle>
              <CardDescription className="text-[#2E5B82]/55">
                Approval creates a one-time OAuth code for this MCP client.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-[#D4E9F7] bg-[#F8FBFE]">
                <CheckCircle2 className="h-4 w-4 text-[#2E5B82]" />
                <AlertTitle>Signed in as {auth.user?.email}</AlertTitle>
                <AlertDescription>
                  This client will be connected to{" "}
                  {auth.workspace?.name || "your default workspace"}.
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
