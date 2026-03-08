"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService, type LoginDto, type RegisterDto } from "@/lib/api/auth.service";
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

  useEffect(() => {
    dispatch({ type: "BOOTSTRAP_START" });

    userService
      .getMe()
      .then((user) => {
        setAuthIndicatorCookie();
        dispatch({ type: "BOOTSTRAP_SUCCESS", payload: user });
      })
      .catch(() => {
        clearAuthIndicatorCookie();
        dispatch({ type: "BOOTSTRAP_FAILURE" });
      });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch({ type: "LOGOUT" });
      router.replace("/auth/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [router]);

  const login = useCallback(
    async (credentials: LoginDto) => {
      await authService.login(credentials);
      setAuthIndicatorCookie();
      const user = await userService.getMe();
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterDto) => {
      await authService.register(data);
      setAuthIndicatorCookie();
      const user = await userService.getMe();
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      router.push("/dashboard");
    },
    [router]
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