export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
    conflicts?: unknown;
  }
  
  export class HttpError extends Error {
    constructor(public readonly apiError: ApiError) {
      super(apiError.message);
      this.name = "HttpError";
    }
  }
  
  type RequestInterceptor = (init: RequestInit) => RequestInit | Promise<RequestInit>;
  type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
  
  class HttpClient {
    private readonly baseUrl: string;
    private requestInterceptors: RequestInterceptor[] = [];
    private responseInterceptors: ResponseInterceptor[] = [];
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl.replace(/\/$/, "");
    }
  
    addRequestInterceptor(interceptor: RequestInterceptor): void {
      this.requestInterceptors.push(interceptor);
    }
  
    addResponseInterceptor(interceptor: ResponseInterceptor): void {
      this.responseInterceptors.push(interceptor);
    }
  
    async request<T>(endpoint: string, init: RequestInit = {}): Promise<T> {
      const isFormData = typeof init.body !== "undefined" && init.body instanceof FormData;
      const baseInit: RequestInit = {
        credentials: "include",
        ...init,
        headers: {
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
          ...init.headers,
        },
      };
  
      const finalInit = await this.applyRequestInterceptors(baseInit);
      const url = `${this.baseUrl}${endpoint}`;
      let response = await fetch(url, finalInit);
  
      response = await this.applyResponseInterceptors(response);
  
      if (!response.ok) {
        await this.handleError(response);
      }
  
      if (response.status === 204) return undefined as unknown as T;
  
      return response.json() as Promise<T>;
    }
  
    get<T>(endpoint: string, init?: RequestInit): Promise<T> {
      return this.request<T>(endpoint, { ...init, method: "GET" });
    }
  
    post<T>(endpoint: string, body?: unknown, init?: RequestInit): Promise<T> {
      return this.request<T>(endpoint, {
        ...init,
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }

    postForm<T>(endpoint: string, formData: FormData, init?: RequestInit): Promise<T> {
      return this.request<T>(endpoint, {
        ...init,
        method: "POST",
        body: formData,
      });
    }
  
    put<T>(endpoint: string, body?: unknown, init?: RequestInit): Promise<T> {
      return this.request<T>(endpoint, {
        ...init,
        method: "PUT",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  
    patch<T>(endpoint: string, body?: unknown, init?: RequestInit): Promise<T> {
      return this.request<T>(endpoint, {
        ...init,
        method: "PATCH",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    }
  
    delete<T>(endpoint: string, init?: RequestInit): Promise<T> {
      return this.request<T>(endpoint, { ...init, method: "DELETE" });
    }
  
    private async applyRequestInterceptors(init: RequestInit): Promise<RequestInit> {
      let result = init;
      for (const interceptor of this.requestInterceptors) {
        result = await interceptor(result);
      }
      return result;
    }
  
    private async applyResponseInterceptors(response: Response): Promise<Response> {
      let result = response;
      for (const interceptor of this.responseInterceptors) {
        result = await interceptor(result);
      }
      return result;
    }
  
    private async handleError(response: Response): Promise<never> {
      let apiError: ApiError = {
        status: response.status,
        message: response.statusText || "An unexpected error occurred.",
      };
  
      try {
        const data = await response.json();
        apiError = {
          status: response.status,
          message: data.message ?? apiError.message,
          errors: data.errors,
          conflicts: data.conflicts,
        };
      } catch {}
  
      throw new HttpError(apiError);
    }
  }
  
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333";
  
  export const httpClient = new HttpClient(apiBaseUrl);
  
  httpClient.addResponseInterceptor((response) => {
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }
    return response;
  });