"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService, type LoginDto, type RegisterDto, type UserDto } from "@/lib/api/auth.service";
import { userService, type MeDto } from "@/lib/api/user.service";
import { HttpError } from "@/lib/api/http-client";

interface AuthState {
  user: MeDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "BOOTSTRAP_START" }
  | { type: "BOOTSTRAP_SUCCESS"; payload: MeDto }
  | { type: "BOOTSTRAP_FAILURE" }
  | { type: "LOGIN_SUCCESS"; payload: MeDto }
  | { type: "LOGOUT" };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "BOOTSTRAP_START":
      return { ...state, isLoading: true };
    case "BOOTSTRAP_SUCCESS":
      return { user: action.payload, isLoading: false, isAuthenticated: true };
    case "BOOTSTRAP_FAILURE":
      return { user: null, isLoading: false, isAuthenticated: false };
    case "LOGIN_SUCCESS":
      return { user: action.payload, isLoading: false, isAuthenticated: true };
    case "LOGOUT":
      return { user: null, isLoading: false, isAuthenticated: false };
    default:
      return state;
  }
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

interface AuthContextValue extends AuthState {
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_INDICATOR_COOKIE = "app_auth";

function setAuthIndicatorCookie() {
  document.cookie = `${AUTH_INDICATOR_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
}

function clearAuthIndicatorCookie() {
  document.cookie = `${AUTH_INDICATOR_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();
  // Prevents the global unauthorized handler from firing during bootstrap or
  // active auth flows, where a 401 is either expected or handled locally.
  const suppressUnauthorized = useRef(false);

  useEffect(() => {
    dispatch({ type: "BOOTSTRAP_START" });
    suppressUnauthorized.current = true;

    userService
      .getMe()
      .then((user) => {
        setAuthIndicatorCookie();
        dispatch({ type: "BOOTSTRAP_SUCCESS", payload: user });
      })
      .catch(() => {
        clearAuthIndicatorCookie();
        dispatch({ type: "BOOTSTRAP_FAILURE" });
      })
      .finally(() => {
        suppressUnauthorized.current = false;
      });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      if (suppressUnauthorized.current) return;
      clearAuthIndicatorCookie();
      dispatch({ type: "LOGOUT" });
      router.replace("/auth/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [router]);

  // Extracts user data from the auth response regardless of whether the backend
  // returns { user: UserDto } or UserDto directly. Falls back to GET /me when
  // the response body doesn't contain recognisable user fields (same-origin dev).
  const resolveUser = useCallback(
    async (response: { user?: UserDto } | UserDto): Promise<MeDto> => {
      if (process.env.NODE_ENV !== "production") {
        console.log("[auth] resolveUser response:", JSON.stringify(response));
      } else {
        console.log("[auth] resolveUser keys:", Object.keys(response as object));
      }

      const candidate =
        (response as { user?: UserDto }).user ??
        (response as unknown as UserDto);

      if (candidate?.id && candidate?.username && candidate?.email && candidate?.role) {
        return {
          id: candidate.id,
          username: candidate.username,
          email: candidate.email,
          role: candidate.role,
          followedBy: [],
          following: [],
        };
      }

      // Fallback for same-origin development environments where the login
      // response may not carry user fields but the session cookie works.
      return userService.getMe();
    },
    []
  );

  const login = useCallback(
    async (credentials: LoginDto) => {
      suppressUnauthorized.current = true;
      try {
        const response = await authService.login(credentials);
        const meData = await resolveUser(response as { user?: UserDto } | UserDto);
        setAuthIndicatorCookie();
        dispatch({ type: "LOGIN_SUCCESS", payload: meData });
        router.push("/dashboard");
      } finally {
        suppressUnauthorized.current = false;
      }
    },
    [router, resolveUser]
  );

  const register = useCallback(
    async (data: RegisterDto) => {
      suppressUnauthorized.current = true;
      try {
        const response = await authService.register(data);
        const meData = await resolveUser(response as { user?: UserDto } | UserDto);
        setAuthIndicatorCookie();
        dispatch({ type: "LOGIN_SUCCESS", payload: meData });
        router.push("/dashboard");
      } finally {
        suppressUnauthorized.current = false;
      }
    },
    [router, resolveUser]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      if (!(error instanceof HttpError)) throw error;
    } finally {
      clearAuthIndicatorCookie();
      dispatch({ type: "LOGOUT" });
      router.replace("/auth/login");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    const user = await userService.getMe();
    dispatch({ type: "BOOTSTRAP_SUCCESS", payload: user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}