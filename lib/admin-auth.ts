export interface AdminConfig {
  isAuthenticated: boolean;
  githubToken: string;
  geminiApiKey: string;
  loginTime?: number;
}

const STORAGE_KEY = "jash_admin_session_v1";

const DEFAULT_PIN = "2026";

export function getStoredAdminConfig(): AdminConfig {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      githubToken: "",
      geminiApiKey: "",
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        isAuthenticated: false,
        githubToken: "",
        geminiApiKey: "",
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      isAuthenticated: false,
      githubToken: "",
      geminiApiKey: "",
    };
  }
}

export function saveAdminConfig(config: Partial<AdminConfig>): AdminConfig {
  const current = getStoredAdminConfig();
  const updated: AdminConfig = {
    ...current,
    ...config,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return updated;
}

export function verifyAdminPin(pin: string): boolean {
  const expectedPin =
    process.env.NEXT_PUBLIC_ADMIN_PIN || DEFAULT_PIN;
  return pin.trim() === expectedPin.trim();
}

export function logoutAdmin(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
