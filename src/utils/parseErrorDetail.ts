export type ParsedError = {
  status: number;
  statusText: string;
  contentType: string;
  rawText: string;
  /** 사람이 읽을 요약 */
  message: string;
  json?: unknown;
};

export async function parseErrorDetail(response: Response): Promise<ParsedError> {
  const contentType = response.headers.get("content-type") ?? "";
  const rawText = await response.text();

  let json: unknown = undefined;
  if (contentType.includes("application/json")) {
    try {
      json = rawText ? JSON.parse(rawText) : undefined;
    } catch {
      // json 파싱 실패해도 rawText는 유지
    }
  }

  const msgFromJson = (() => {
    if (!json || typeof json !== "object") return "";

    const o = json as Record<string, unknown> & { error?: { message?: unknown } };
    const raw =
      o?.message ??
      o?.error?.message ??
      o?.error ??
      o?.detail ??
      o?.title ??
      "";
    return typeof raw === "string" ? raw : String(raw);
  })();

  const message =
    typeof msgFromJson === "string" && msgFromJson.trim()
      ? msgFromJson
      : rawText || response.statusText;

  return {
    status: response.status,
    statusText: response.statusText,
    contentType,
    rawText,
    message,
    json,
  };
}
