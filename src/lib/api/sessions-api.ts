import type { FocusSession, RecordFocusSessionInput } from "@/domain/focus-session";
import { apiRequest } from "./http-client";

export const sessionsApi = {
  record: (input: RecordFocusSessionInput) =>
    apiRequest<FocusSession>("/api/sessions", { method: "POST", body: JSON.stringify(input) }),
};
