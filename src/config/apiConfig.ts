export const ApiClient = {
  config: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  },

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const response = await fetch(
      `${this.config.baseUrl}${endpoint}${queryString}`,
      {
        method: "GET",
        headers: this.config.headers,
      },
    );

    if (!response.ok) {
      throw new Error(`GET ${endpoint} failed`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      method: "POST",
      headers: this.config.headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`POST ${endpoint} failed`);
    }

    return response.json();
  },
};
