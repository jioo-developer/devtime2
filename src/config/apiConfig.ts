export const ApiClient = {
  config: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  },

  async get<T>(
    endpoint: string,
    params?: Record<string, string>,
    headers?: HeadersInit,
    options?: { onNotOk?: (response: Response) => Promise<T> },
  ): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const response = await fetch(
      `${this.config.baseUrl}${endpoint}${queryString}`,
      {
        method: "GET",
        headers: {
          ...this.config.headers,
          ...headers,
        },
      },
    );

    if (!response.ok) {
      if (options?.onNotOk) {
        return options.onNotOk(response);
      }
      throw new Error(`GET ${endpoint} failed`);
    }

    return response.json();
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit,
    options?: { onNotOk?: (response: Response) => Promise<never> },
  ): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        ...this.config.headers,
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      if (options?.onNotOk) {
        return options.onNotOk(response);
      }
      throw new Error(`POST ${endpoint} failed`);
    }

    return response.json();
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit,
  ): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        ...this.config.headers,
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`PUT ${endpoint} failed`);
    }

    return response.json();
  },

  async delete<T>(
    endpoint: string,
    data?: unknown,
    headers?: HeadersInit,
  ): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...this.config.headers,
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`DELETE ${endpoint} failed`);
    }

    return response.json();
  },
};
