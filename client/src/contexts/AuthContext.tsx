import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  logoutSession,
  subscribeToUnauthorized,
  type AuthTokenResponse,
  type AuthUser,
  type AuthWorkspace,
  type CurrentUserResponse,
} from "@/lib/api";
import { MCP_DEPLOYMENT } from "@/lib/mcpDeployment";
import { clearEmailLoginFlows } from "@/lib/loginFlow";

const LEGACY_STORAGE_KEY = "memova.auth.v1";
export const AUTH_BACKEND = `${MCP_DEPLOYMENT.environment}:${MCP_DEPLOYMENT.apiBaseUrl}`;
const STORAGE_KEY = `memova.auth.v2:${AUTH_BACKEND}`;
const FALLBACK_STORAGE_KEY = `${STORAGE_KEY}:fallback`;

export type AuthSession = {
  access_token: string;
  expires_at: string;
  user: AuthUser;
  default_workspace: AuthWorkspace;
  backend?: string;
};

type UnsavedSharedSession = {
  session: AuthSession | null;
  previousSharedValue: string | null | undefined;
};

type AuthContextValue = {
  session: AuthSession | null;
  token: string | null;
  user: AuthUser | null;
  workspace: AuthWorkspace | null;
  isAuthenticated: boolean;
  setSessionFromTokenResponse: (response: AuthTokenResponse) => void;
  setSessionFromCurrentUserResponse: (response: CurrentUserResponse) => void;
  refreshUser: () => Promise<void>;
  clearSession: (expectedToken?: string) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(() =>
    readStoredSession()
  );
  const hydratedTokenRef = useRef<string | null>(null);
  const sessionRef = useRef(session);
  const unsavedSessionRef = useRef<UnsavedSharedSession | null>(null);
  sessionRef.current = session;

  const applySession = useCallback((nextSession: AuthSession | null) => {
    sessionRef.current = nextSession;
    setSessionState(nextSession);
  }, []);

  const persistSession = useCallback(
    (nextSession: AuthSession | null) => {
      unsavedSessionRef.current = writeStoredSession(nextSession);
      applySession(nextSession);
    },
    [applySession]
  );

  const synchronizeSession = useCallback(() => {
    const current = sessionRef.current;
    const stored = readStoredSession(current, unsavedSessionRef.current);
    if (unsavedSessionRef.current) {
      try {
        const shared = window.localStorage.getItem(STORAGE_KEY);
        if (
          shared !== unsavedSessionRef.current.previousSharedValue ||
          shared === serializeSession(unsavedSessionRef.current.session)
        )
          unsavedSessionRef.current = null;
      } catch {
        // Keep the tab fallback while shared storage remains unavailable.
      }
    }
    if (serializeSession(current) === serializeSession(stored)) return current;
    if (
      current?.access_token !== stored?.access_token ||
      current?.user.avatar_version !== stored?.user.avatar_version
    )
      hydratedTokenRef.current = null;
    if (!stored) clearEmailLoginFlows(AUTH_BACKEND);
    const next =
      stored &&
      current?.access_token === stored.access_token &&
      current.user.avatar_version === stored.user.avatar_version
        ? {
            ...stored,
            user: {
              ...stored.user,
              avatar_url: current.user.avatar_url,
              avatar_url_expires_at: current.user.avatar_url_expires_at,
            },
          }
        : stored;
    applySession(next);
    return next;
  }, [applySession]);

  const setSessionFromTokenResponse = useCallback(
    (response: AuthTokenResponse) => {
      persistSession({
        access_token: response.access_token,
        expires_at: response.expires_at,
        user: response.user,
        default_workspace: response.default_workspace,
        backend: AUTH_BACKEND,
      });
    },
    [persistSession]
  );

  const clearSession = useCallback(
    (expectedToken?: string) => {
      if (expectedToken && synchronizeSession()?.access_token !== expectedToken)
        return;
      hydratedTokenRef.current = null;
      clearEmailLoginFlows(AUTH_BACKEND);
      persistSession(null);
    },
    [persistSession, synchronizeSession]
  );

  const setSessionFromCurrentUserResponse = useCallback(
    (response: CurrentUserResponse) => {
      const current = synchronizeSession();
      if (!session || current?.access_token !== session.access_token) return;
      persistSession({
        ...current,
        user: response.user,
        default_workspace: response.default_workspace,
      });
    },
    [persistSession, session, synchronizeSession]
  );

  const refreshUser = useCallback(async () => {
    if (!session?.access_token) return;
    const current = await getCurrentUser(session.access_token);
    const active = synchronizeSession();
    if (active?.access_token !== session.access_token) return;
    persistSession({
      ...active,
      user: current.user,
      default_workspace: current.default_workspace,
    });
  }, [persistSession, session, synchronizeSession]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        unsavedSessionRef.current = null;
        try {
          window.sessionStorage.removeItem(FALLBACK_STORAGE_KEY);
          window.sessionStorage.removeItem(STORAGE_KEY);
        } catch {
          // The shared value still takes precedence when this tab store is blocked.
        }
        synchronizeSession();
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", synchronizeSession);
    window.addEventListener("pageshow", synchronizeSession);
    synchronizeSession();
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", synchronizeSession);
      window.removeEventListener("pageshow", synchronizeSession);
    };
  }, [synchronizeSession]);

  useEffect(
    () =>
      subscribeToUnauthorized(token => {
        clearSession(token);
      }),
    [clearSession]
  );

  useEffect(() => {
    if (!session) return;
    let timer: number;
    const checkExpiry = () => {
      const expiresIn = Date.parse(session.expires_at) - Date.now();
      if (expiresIn <= 0) synchronizeSession();
      else
        timer = window.setTimeout(
          checkExpiry,
          Math.min(expiresIn, 2_147_483_647)
        );
    };
    checkExpiry();
    return () => window.clearTimeout(timer);
  }, [synchronizeSession, session?.expires_at]);

  useEffect(() => {
    const token = session?.access_token;
    if (!token || hydratedTokenRef.current === token) return;
    hydratedTokenRef.current = token;
    void refreshUser().catch(() => {
      // Keep the stored session usable when profile hydration is unavailable.
    });
  }, [refreshUser, session?.access_token]);

  useEffect(() => {
    const expiresMs = Date.parse(session?.user.avatar_url_expires_at || "");
    if (!Number.isFinite(expiresMs)) return;
    const refreshDelay = Math.max(60_000, expiresMs - Date.now() - 60_000);
    const timer = window.setTimeout(() => {
      void refreshUser().catch(() => {
        // Image error handling can retry if the scheduled refresh fails.
      });
    }, refreshDelay);
    return () => window.clearTimeout(timer);
  }, [refreshUser, session?.user.avatar_url_expires_at]);

  const logout = useCallback(async () => {
    const token = session?.access_token;
    clearSession();
    if (token) {
      try {
        await logoutSession(token);
      } catch {
        // Local logout should still complete even if the network request fails.
      }
    }
  }, [clearSession, session?.access_token]);

  const isAuthenticated = isUsableAuthSession(session);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      token: isAuthenticated ? session?.access_token || null : null,
      user: isAuthenticated ? session?.user || null : null,
      workspace: isAuthenticated ? session?.default_workspace || null : null,
      isAuthenticated,
      setSessionFromTokenResponse,
      setSessionFromCurrentUserResponse,
      refreshUser,
      clearSession,
      logout,
    }),
    [
      clearSession,
      isAuthenticated,
      logout,
      refreshUser,
      session,
      setSessionFromCurrentUserResponse,
      setSessionFromTokenResponse,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

function sessionWithoutTemporaryAvatarUrl(session: AuthSession): AuthSession {
  return {
    ...session,
    user: {
      ...session.user,
      avatar_url: null,
      avatar_url_expires_at: null,
    },
  };
}

function serializeSession(session: AuthSession | null): string {
  return JSON.stringify(
    session ? sessionWithoutTemporaryAvatarUrl(session) : null
  );
}

function writeStoredSession(
  session: AuthSession | null
): UnsavedSharedSession | null {
  let shared = false;
  let previousSharedValue: string | null | undefined;
  try {
    // Keep an explicit logout value so an old tab cannot migrate its token back.
    window.localStorage.setItem(STORAGE_KEY, serializeSession(session));
    shared = true;
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // A blocked persistent store falls back to this tab and the in-memory session.
    try {
      previousSharedValue = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Reads may be blocked alongside writes.
    }
  }
  try {
    if (shared) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(FALLBACK_STORAGE_KEY);
    } else {
      if (session)
        window.sessionStorage.setItem(STORAGE_KEY, serializeSession(session));
      else window.sessionStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.setItem(
        FALLBACK_STORAGE_KEY,
        JSON.stringify({
          session: session ? sessionWithoutTemporaryAvatarUrl(session) : null,
          previousSharedValue,
        })
      );
    }
  } catch {
    // The active session remains available in memory when both stores are blocked.
  }
  return shared ? null : { session, previousSharedValue };
}

function readTabFallback(): UnsavedSharedSession | null {
  try {
    const raw = window.sessionStorage.getItem(FALLBACK_STORAGE_KEY);
    if (raw === null) return null;
    const value = JSON.parse(raw);
    if (
      (value.session === null ||
        parseStoredSession(JSON.stringify(value.session))) &&
      (value.previousSharedValue === undefined ||
        value.previousSharedValue === null ||
        typeof value.previousSharedValue === "string")
    )
      return value;
    window.sessionStorage.removeItem(FALLBACK_STORAGE_KEY);
  } catch {
    // Fall back to the in-memory session when this tab store is unavailable.
  }
  return null;
}

function parseStoredSession(raw: string | null): AuthSession | null {
  if (raw === null) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isUsableAuthSession(parsed) && parsed.backend === AUTH_BACKEND
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function readStoredSession(
  fallback: AuthSession | null = null,
  unsaved: UnsavedSharedSession | null = null
): AuthSession | null {
  if (typeof window === "undefined") return null;
  let sharedAvailable = false;
  const tabFallback = unsaved || readTabFallback();

  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Unscoped legacy sessions are never reused.
  }
  try {
    const shared = window.localStorage.getItem(STORAGE_KEY);
    sharedAvailable = true;
    if (
      tabFallback &&
      (shared === tabFallback.previousSharedValue ||
        (tabFallback.session === null &&
          tabFallback.previousSharedValue === undefined))
    ) {
      const parsed =
        tabFallback.session &&
        parseStoredSession(serializeSession(tabFallback.session));
      writeStoredSession(parsed);
      return parsed;
    }
    if (shared !== null) {
      const parsed = parseStoredSession(shared);
      if (!parsed) writeStoredSession(null);
      return parsed;
    }
  } catch {
    // Read the tab fallback when persistent storage is unavailable.
  }
  if (!sharedAvailable && tabFallback)
    return (
      tabFallback.session &&
      parseStoredSession(serializeSession(tabFallback.session))
    );
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === null)
      return !sharedAvailable && fallback
        ? parseStoredSession(serializeSession(fallback))
        : null;
    const parsed = parseStoredSession(raw);
    // Tab-scoped v2 sessions migrate only when the shared key has never existed.
    writeStoredSession(parsed);
    return parsed;
  } catch {
    return !sharedAvailable && fallback
      ? parseStoredSession(serializeSession(fallback))
      : null;
  }
}

export function isUsableAuthSession(
  value: unknown,
  now = Date.now()
): value is AuthSession {
  if (!value || typeof value !== "object") return false;

  const session = value as Partial<AuthSession>;
  const expiresMs = Date.parse(session.expires_at || "");
  return Boolean(
    session.access_token?.trim() &&
      session.user?.id?.trim() &&
      Number.isFinite(expiresMs) &&
      expiresMs > now
  );
}
