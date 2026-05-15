import { useEffect, useState } from "react";
import {
  CalendarDays,
  Loader2,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useLocation } from "wouter";
import AccountShell from "@/components/account/AccountShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const [, setLocation] = useLocation();
  const auth = useAuth();
  const [loading, setLoading] = useState(Boolean(auth.token));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.isAuthenticated) {
      setLocation(`/login?next=${encodeURIComponent("/profile")}`);
      return;
    }

    let cancelled = false;
    setLoading(true);
    auth
      .refreshUser()
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not refresh your profile."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [auth.isAuthenticated, setLocation]);

  if (!auth.isAuthenticated) return null;

  return (
    <AccountShell
      title="Profile"
      subtitle="Manage your Memova account and connected MCP clients."
    >
      {loading ? (
        <LoadingPanel label="Refreshing profile" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
          <Card className="rounded-xl border-[#DCEBF6] bg-white shadow-lg shadow-[#2E5B82]/[0.04]">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                <UserRound className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl text-[#0F2B3C]">Account</CardTitle>
              <CardDescription className="text-[#2E5B82]/55">
                The email address you use to sign in to Memova.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfileField label="Email" value={auth.user?.email || "-"} />
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="rounded-xl border-[#DCEBF6] bg-white shadow-lg shadow-[#2E5B82]/[0.04]">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-[#0F2B3C]">
                  Workspace
                </CardTitle>
                <CardDescription className="text-[#2E5B82]/55">
                  MCP clients connect to this Memova workspace after you approve
                  access.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProfileField
                  label="Default workspace"
                  value={auth.workspace?.name || "Personal workspace"}
                />
              </CardContent>
            </Card>

            <a
              href="/connected-clients"
              className="flex items-center justify-between rounded-xl border border-[#DCEBF6] bg-[#0F2B3C] px-5 py-4 text-white shadow-lg shadow-[#2E5B82]/[0.08] transition-colors hover:bg-[#1A3A5C]"
            >
              <span>
                <span className="block text-[13px] font-bold">
                  Connected clients
                </span>
                <span className="mt-1 block text-[12px] text-white/65">
                  View and revoke MCP agent access.
                </span>
              </span>
              <ShieldCheck className="h-5 w-5" />
            </a>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] font-semibold text-[#B91C1C]">
          {error}
        </p>
      )}
    </AccountShell>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#EDF3FA] bg-[#FAFCFF] px-4 py-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#2E5B82]/45">
        {label}
      </div>
      <div className="mt-1 break-words text-[14px] font-semibold text-[#0F2B3C]">
        {value}
      </div>
    </div>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-[#DCEBF6] bg-white">
      <div className="flex items-center gap-3 text-[13px] font-semibold text-[#2E5B82]/65">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
    </div>
  );
}
