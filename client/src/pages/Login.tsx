import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useLocation } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  startEmailLogin,
  verifyEmailLogin,
  type EmailLoginStartResponse,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [, setLocation] = useLocation();
  const auth = useAuth();
  const next = useMemo(
    () =>
      normalizeNext(new URLSearchParams(window.location.search).get("next")),
    []
  );

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [challenge, setChallenge] = useState<EmailLoginStartResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.isAuthenticated) {
      setLocation(next);
    }
  }, [auth.isAuthenticated, next, setLocation]);

  const handleStart = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await startEmailLogin(email);
      setChallenge(response);
      setCode(response.dev_code || "");
    } catch (err) {
      setError(errorMessage(err, "Could not send a sign-in code."));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!challenge) return;
    setError("");
    setLoading(true);
    try {
      const response = await verifyEmailLogin(
        challenge.challenge_id,
        code.trim()
      );
      auth.setSessionFromTokenResponse(response);
      setLocation(next);
    } catch (err) {
      setError(errorMessage(err, "That code did not work."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7FAFD] text-[#0F2B3C]">
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <a
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[#2E5B82]/65 hover:text-[#0F2B3C]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to MEMOVA
          </a>

          <Card className="rounded-xl border-[#DCEBF6] bg-white shadow-xl shadow-[#2E5B82]/[0.05]">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-[#EDF5FC] text-[#2E5B82]">
                <Mail className="h-5 w-5" />
              </div>
              <CardTitle className="font-serif text-[2rem] font-normal text-[#0F2B3C]">
                Sign in to Memova
              </CardTitle>
              <CardDescription className="text-[#2E5B82]/55">
                Use your email to access profile settings and MCP client
                authorization.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!challenge ? (
                <form onSubmit={handleStart} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#2E5B82]/55">
                      Email
                    </label>
                    <Input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-11 rounded-lg border-[#D4E9F7] bg-[#FAFCFF]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 w-full rounded-lg bg-[#0F2B3C] text-white hover:bg-[#1A3A5C]"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    Send code
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                  <Alert className="border-[#D4E9F7] bg-[#F8FBFE]">
                    <CheckCircle2 className="h-4 w-4 text-[#2E5B82]" />
                    <AlertTitle>Code sent</AlertTitle>
                    <AlertDescription>
                      Check {email.trim().toLowerCase()} for your Memova sign-in
                      code.
                    </AlertDescription>
                  </Alert>

                  {challenge.dev_code && (
                    <p className="rounded-lg border border-[#FDE68A] bg-[#FEF3C7]/60 px-3 py-2 text-[12px] font-semibold text-[#B45309]">
                      Dev code: {challenge.dev_code}
                    </p>
                  )}

                  <div>
                    <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.12em] text-[#2E5B82]/55">
                      Sign-in code
                    </label>
                    <Input
                      required
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={code}
                      onChange={event => setCode(event.target.value)}
                      placeholder="123456"
                      className="h-11 rounded-lg border-[#D4E9F7] bg-[#FAFCFF] tracking-[0.18em]"
                    />
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="h-11 flex-1 rounded-lg bg-[#0F2B3C] text-white hover:bg-[#1A3A5C]"
                    >
                      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                      Verify
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={() => {
                        setChallenge(null);
                        setCode("");
                        setError("");
                      }}
                      className="h-11 rounded-lg border-[#D4E9F7] text-[#2E5B82]"
                    >
                      Use another email
                    </Button>
                  </div>
                </form>
              )}

              {error && (
                <p className="mt-4 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12px] font-semibold text-[#B91C1C]">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function normalizeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//"))
    return "/profile";
  return next;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
