/**
 * Base URL de la API. Por defecto, cadena vacia: el frontend llama a rutas
 * relativas ("/api/...") asumiendo que FastAPI sirve tambien el frontend
 * compilado desde el mismo puerto (ver backend/app/main.py). Esto evita
 * tener que fijar "localhost" dentro del navegador del celular.
 *
 * Si el frontend corre con `npm run dev` en un puerto distinto al backend,
 * define VITE_API_BASE_URL en frontend/.env (por ejemplo
 * http://192.168.1.20:8000) para apuntar a AULA BOX en la red local.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    let detail = `Error ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // ignore
    }
    throw new ApiError(detail, res.status);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
};
