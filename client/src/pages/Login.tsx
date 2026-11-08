import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Mail, UserRound } from "lucide-react";
import { useLocation } from "wouter";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
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
  ApiError,
  loginWithReviewCredentials,
  startEmailLogin,
  updateCurrentUserProfile,
  verifyEmailLogin,
  type AuthTokenResponse,
  type EmailLoginStartResponse,
} from "@/lib/api";
import { AUTH_BACKEND, useAuth } from "@/contexts/AuthContext";
import {
  normalizeLoginReturnPath,
  readEmailLoginFlow,
  saveEmailLoginFlow,
} from "@/lib/loginFlow";
import { MCP_DEPLOYMENT } from "@/lib/mcpDeployment";
import { useLegalLanguage } from "@/seo/legalLanguage";

const inputClass =
  "h-11 rounded-[10px] border-[#C5CEE1] bg-[#FAFCFF] text-[#111A30] focus-visible:border-[#566CE5] focus-visible:ring-[#566CE5]/15";
const buttonClass =
  "h-11 rounded-[10px] bg-[#566CE5] text-[13px] font-bold text-white hover:bg-[#455E93]";
const labelClass = "mb-2 block text-[12px] font-semibold text-[#455E93]";

export default function Login() {
  const [, setLocation] = useLocation();
  const auth = useAuth();
  const language = useLegalLanguage();
  const L = (zh: string, en: string) => (language === "zh" ? zh : en);
  const next = useMemo(
    () =>
      normalizeLoginReturnPath(
        new URLSearchParams(window.location.search).get("next"),
        window.location.pathname === "/mcp/login" ? "/mcp/setup" : "/profile"
      ),
    []
  );
  const mcpLogin =
    window.location.pathname === "/mcp/login" || next.startsWith("/mcp/");
  const reviewerAvailable = MCP_DEPLOYMENT.environment === "isolated-test";
  const previewState = import.meta.env.DEV
    ? new URLSearchParams(window.location.search).get("preview_state") || ""
    : "";
  const storedFlow = useMemo(
    () => readEmailLoginFlow(AUTH_BACKEND, next),
    [next]
  );
  const [email, setEmail] = useState(
    storedFlow?.email || (previewState === "code" ? "alex@example.com" : "")
  );
  const [code, setCode] = useState("");
  const [review, setReview] = useState(
    reviewerAvailable && previewState === "review"
  );
  const [reviewPassword, setReviewPassword] = useState("");
  const [challenge, setChallenge] = useState<EmailLoginStartResponse | null>(
    storedFlow?.challenge ||
      (previewState === "code"
        ? {
            challenge_id: "design-preview",
            expires_at: "2099-01-01T00:00:00.000Z",
            delivery_channel: "email",
            dev_code: null,
          }
        : null)
  );
  const [resendAt, setResendAt] = useState(storedFlow?.resendAt || 0);
  const [clock, setClock] = useState(Date.now);
  const [inviteRequired, setInviteRequired] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [pendingSession, setPendingSession] =
    useState<AuthTokenResponse | null>(null);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    previewState === "error"
      ? "That code has expired. Request a new one and try again."
      : ""
  );
  const submitting = useRef(false);
  const mounted = useRef(true);
  const cooldown = Math.max(0, Math.ceil((resendAt - clock) / 1000));
  const expired = Boolean(
    challenge && Date.parse(challenge.expires_at) <= clock
  );
  const deliveryUncertain =
    challenge?.delivery_status === "pending" ||
    challenge?.delivery_status === "unknown";
  const deliveryFailed = challenge?.delivery_status === "failed";

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!challenge && resendAt <= Date.now()) return;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [challenge, resendAt]);

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.session) return;
    if (!mcpLogin && !auth.user?.display_name?.trim()) {
      setPendingSession({ ...auth.session, token_type: "bearer" });
      return;
    }
    saveEmailLoginFlow(AUTH_BACKEND, next, null);
    setLocation(next);
  }, [
    auth.isAuthenticated,
    auth.session,
    auth.user?.display_name,
    mcpLogin,
    next,
    setLocation,
  ]);

  const clearChallenge = () => {
    saveEmailLoginFlow(AUTH_BACKEND, next, null);
    setChallenge(null);
    setCode("");
    setInviteCode("");
    setInviteRequired(false);
    setError("");
  };

  const continueAfterVerification = (response: AuthTokenResponse) => {
    saveEmailLoginFlow(AUTH_BACKEND, next, null);
    if (!mcpLogin && !response.user.display_name?.trim()) {
      setPendingSession(response);
      setNickname("");
      return;
    }
    auth.setSessionFromTokenResponse(response);
    setLocation(next);
  };

  const submit = async (operation: () => Promise<void>, fallback: string) => {
    if (submitting.current) return;
    submitting.current = true;
    setLoading(true);
    setError("");
    try {
      await operation();
    } catch (failure) {
      if (!mounted.current) return;
      if (failure instanceof ApiError) {
        if (failure.retryAfterSeconds)
          setResendAt(Date.now() + failure.retryAfterSeconds * 1000);
        if (/invite.*required|required.*invite/.test(failure.code))
          setInviteRequired(true);
      }
      setError(failure instanceof Error ? failure.message : fallback);
    } finally {
      submitting.current = false;
      if (mounted.current) setLoading(false);
    }
  };

  const handleStart = (event?: FormEvent) => {
    event?.preventDefault();
    if (cooldown > 0 || (deliveryUncertain && !expired)) return;
    void submit(
      async () => {
        const response = await startEmailLogin(email.trim());
        if (!mounted.current) return;
        const retryAt =
          Date.now() + Math.max(0, response.retry_after_seconds ?? 60) * 1000;
        setClock(Date.now());
        setResendAt(retryAt);
        setChallenge(response);
        setCode("");
        saveEmailLoginFlow(AUTH_BACKEND, next, {
          email: email.trim(),
          challenge: response,
          resendAt: retryAt,
        });
      },
      L(
        "暂时无法发送验证码，请稍后重试。",
        "Could not send a sign-in code. Please try again."
      )
    );
  };

  const handleVerify = (event: FormEvent) => {
    event.preventDefault();
    if (!challenge || expired) return;
    void submit(
      async () => {
        const response = await verifyEmailLogin(
          challenge.challenge_id,
          code.trim(),
          inviteRequired ? inviteCode.trim() : undefined
        );
        if (mounted.current) continueAfterVerification(response);
      },
      L("验证码验证失败，请重试。", "That code did not work. Please try again.")
    );
  };

  const handleReview = (event: FormEvent) => {
    event.preventDefault();
    if (!reviewerAvailable) return;
    void submit(
      async () => {
        const response = await loginWithReviewCredentials(
          email.trim(),
          reviewPassword
        );
        if (mounted.current) {
          setReviewPassword("");
          continueAfterVerification(response);
        }
      },
      L(
        "测试登录失败，请核对专用账号。",
        "Could not sign in with the test credentials."
      )
    );
  };

  const handleNickname = (event: FormEvent) => {
    event.preventDefault();
    if (!pendingSession || !nickname.trim()) return;
    void submit(
      async () => {
        const current = await updateCurrentUserProfile(
          pendingSession.access_token,
          nickname.trim()
        );
        if (!mounted.current) return;
        auth.setSessionFromTokenResponse({ ...pendingSession, ...current });
        setPendingSession(null);
        setLocation(next);
      },
      L(
        "昵称暂时无法保存，请重试。",
        "Could not save your nickname. Please try again."
      )
    );
  };

  return (
    <div className="memova-account-shell flex min-h-screen flex-col bg-[#F6F8FC] text-[#111A30]">
      <SiteHeader current={mcpLogin ? "mcp" : "login"} />
      <main className="mx-auto flex w-full max-w-[1240px] flex-1 items-center justify-center px-5 py-10 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md gap-0 overflow-hidden rounded-[18px] border-[#D7DEEB] bg-white py-0 shadow-[0_24px_70px_rgba(17,26,48,0.07)]">
          <div
            className="h-1 bg-[var(--memova-brand-gradient)]"
            aria-hidden="true"
          />
          <CardHeader className="px-6 pt-7 sm:px-7">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#EEF1FB] text-[#566CE5]">
              {pendingSession ? (
                <UserRound className="h-5 w-5" />
              ) : (
                <Mail className="h-5 w-5" />
              )}
            </div>
            {reviewerAvailable && (
              <p className="text-xs font-semibold text-amber-700">
                {L(
                  "隔离测试环境 · 专用合成账号",
                  "Isolated test environment · Synthetic accounts"
                )}
              </p>
            )}
            <CardTitle className="memova-account-heading text-[2rem] font-normal leading-[1.08] tracking-[-0.025em]">
              {pendingSession
                ? L("Memova 该怎么称呼你？", "What should Memova call you?")
                : L("登录 Memova", "Sign in to Memova")}
            </CardTitle>
            <CardDescription className="text-[13px] leading-5 text-[#626A79]">
              {pendingSession
                ? L(
                    "设置一个昵称，方便个性化你的 Memova 体验。",
                    "Pick a name to personalize your Memova experience and your Personal Manual."
                  )
                : mcpLogin
                  ? L(
                      "使用与 Memova App 相同的邮箱。登录后继续这次 Agent 授权。",
                      "Use the same email as your Memova app. You will return to this Agent authorization after signing in."
                    )
                  : L(
                      "使用邮箱验证码登录，管理个人资料与 Agent 连接。",
                      "Use an email code to manage your profile and Agent connections."
                    )}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-7 sm:px-7">
            {pendingSession ? (
              <form onSubmit={handleNickname} className="space-y-4">
                <p className="text-sm text-[#455E93]">
                  {pendingSession.user.email}
                </p>
                <label className={labelClass} htmlFor="nickname">
                  {L("昵称", "Nickname")}
                </label>
                <Input
                  id="nickname"
                  required
                  autoComplete="nickname"
                  maxLength={255}
                  value={nickname}
                  onChange={event => setNickname(event.target.value)}
                  placeholder="Your nickname"
                  className={inputClass}
                />
                <p className="text-xs text-[#626A79]">
                  {L(
                    "以后可以随时修改，也可以添加头像。",
                    "You can change this anytime and add a profile photo later."
                  )}
                </p>
                <Button
                  type="submit"
                  disabled={loading || !nickname.trim()}
                  className={buttonClass + " w-full"}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {L("继续使用 Memova", "Continue to Memova")}
                </Button>
              </form>
            ) : review ? (
              <form onSubmit={handleReview} className="space-y-4">
                <label className={labelClass} htmlFor="review-email">
                  {L("专用测试邮箱", "Test email")}
                </label>
                <Input
                  id="review-email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  className={inputClass}
                />
                <label className={labelClass} htmlFor="review-password">
                  {L("测试密码", "Test password")}
                </label>
                <Input
                  id="review-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={reviewPassword}
                  onChange={event => setReviewPassword(event.target.value)}
                  className={inputClass}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className={buttonClass + " w-full"}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {L("登录测试账号", "Sign in to test account")}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={loading}
                  onClick={() => {
                    setReview(false);
                    setReviewPassword("");
                    setError("");
                  }}
                >
                  {L("使用邮箱验证码", "Use an email code")}
                </Button>
              </form>
            ) : !challenge ? (
              <form onSubmit={handleStart} className="space-y-4">
                <label className={labelClass} htmlFor="login-email">
                  {L("邮箱", "Email")}
                </label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
                <Button
                  type="submit"
                  disabled={loading || cooldown > 0}
                  className={buttonClass + " w-full"}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="h-4 w-4" />
                  )}
                  {cooldown
                    ? L(
                        cooldown + " 秒后重试",
                        "Try again in " + cooldown + "s"
                      )
                    : L("发送验证码", "Send code")}
                </Button>
                {reviewerAvailable && (
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={loading}
                    onClick={() => {
                      setReview(true);
                      setError("");
                    }}
                  >
                    {L("使用专用测试账号", "Use test credentials")}
                  </Button>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerify} className="space-y-4">
                <Alert className="border-[#D7DEEB] bg-[#F5F8FE] text-[#455E93]">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>
                    {expired
                      ? L("验证码已过期", "Code expired")
                      : deliveryFailed
                        ? L("验证码投递失败", "Code delivery failed")
                        : deliveryUncertain
                          ? L("验证码投递处理中", "Delivery is being processed")
                          : L("查看邮箱验证码", "Check your email")}
                  </AlertTitle>
                  <AlertDescription>
                    {deliveryFailed
                      ? L(
                          "请核对邮箱，等待冷却时间结束后重试。",
                          "Check your email address and retry after the resend timer."
                        )
                      : deliveryUncertain
                        ? L(
                            "请检查邮箱与垃圾邮件。投递尚未确认，请稍后再试。",
                            "Check your inbox and spam folder. Delivery has not yet been confirmed. Please wait before trying again."
                          )
                        : email.trim()}
                  </AlertDescription>
                </Alert>
                <label className={labelClass} htmlFor="login-code">
                  {L("验证码", "Sign-in code")}
                </label>
                <Input
                  id="login-code"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={event => setCode(event.target.value)}
                  className={inputClass + " tracking-[0.18em]"}
                />
                {inviteRequired && (
                  <div>
                    <label className={labelClass} htmlFor="invite-code">
                      {L("邀请码", "Invitation code")}
                    </label>
                    <Input
                      id="invite-code"
                      required
                      value={inviteCode}
                      onChange={event => setInviteCode(event.target.value)}
                      className={inputClass}
                    />
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={loading || expired}
                  className={buttonClass + " w-full"}
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {L("验证并继续", "Verify and continue")}
                </Button>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      loading || cooldown > 0 || (deliveryUncertain && !expired)
                    }
                    onClick={() => handleStart()}
                  >
                    {cooldown
                      ? L(
                          cooldown + " 秒后可重发",
                          "Resend in " + cooldown + "s"
                        )
                      : L("重新发送", "Resend code")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={loading}
                    onClick={clearChallenge}
                  >
                    {L("使用其他邮箱", "Use another email")}
                  </Button>
                </div>
              </form>
            )}
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-[10px] border border-[#F1C9C9] bg-[#FFF5F5] px-3 py-2 text-[12px] font-semibold text-[#A63B3B]"
              >
                {error}
              </p>
            )}
            <p className="mt-5 text-[11px] leading-5 text-[#626A79]">
              {L(
                "登录仅在当前浏览器标签页保留。",
                "Your sign-in is kept for this browser tab."
              )}
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
