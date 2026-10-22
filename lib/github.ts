/**
 * GitOps client helper for interacting with the GitHub REST API.
 * Commits content directly to repository: jashgarach-98/jash-dev
 */

export const REPO_OWNER = "jashgarach-98";
export const REPO_NAME = "jash-dev";
export const REPO_BRANCH = "main";

export interface GitHubFileResult {
  sha: string;
  content: string;
}

export interface GitHubCommitResult {
  success: boolean;
  sha?: string;
  message?: string;
  error?: string;
}

/**
 * Robust Unicode-safe base64 encoding
 */
export function unicodeToBase64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * Robust Unicode-safe base64 decoding
 */
export function base64ToUnicode(str: string): string {
  const binary = atob(str.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Verify token and check repository access
 */
export async function verifyGitHubToken(token: string): Promise<{
  valid: boolean;
  username?: string;
  repoAccess?: boolean;
  error?: string;
}> {
  try {
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userRes.ok) {
      return { valid: false, error: "Invalid GitHub Personal Access Token." };
    }

    const userData = await userRes.json();

    const repoRes = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!repoRes.ok) {
      return {
        valid: true,
        username: userData.login,
        repoAccess: false,
        error: `Token valid, but does not have write access to ${REPO_OWNER}/${REPO_NAME}.`,
      };
    }

    const repoData = await repoRes.json();
    const canPush = repoData.permissions?.push ?? true;

    return {
      valid: true,
      username: userData.login,
      repoAccess: canPush,
    };
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Network error verifying token.",
    };
  }
}

/**
 * Fetch a file from the repository
 */
export async function fetchFileFromRepo(
  token: string,
  filePath: string
): Promise<GitHubFileResult | null> {
  const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}?ref=${REPO_BRANCH}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch file ${filePath}: ${res.statusText}`);
  }

  const data = await res.json();
  const decodedContent = base64ToUnicode(data.content);

  return {
    sha: data.sha,
    content: decodedContent,
  };
}

/**
 * Commit or create a file in the repository
 */
export async function commitFileToRepo(
  token: string,
  filePath: string,
  content: string,
  commitMessage: string
): Promise<GitHubCommitResult> {
  try {
    const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${cleanPath}`;

    // Get current file sha if it exists
    let existingSha: string | undefined;
    try {
      const existing = await fetchFileFromRepo(token, cleanPath);
      if (existing) {
        existingSha = existing.sha;
      }
    } catch {
      // File may not exist yet, which is expected for new articles
    }

    const payload: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message: commitMessage,
      content: unicodeToBase64(content),
      branch: REPO_BRANCH,
    };

    if (existingSha) {
      payload.sha = existingSha;
    }

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.trim()}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        error:
          errData.message ||
          `GitHub API error (${res.status}): ${res.statusText}`,
      };
    }

    const resData = await res.json();
    return {
      success: true,
      sha: resData.content?.sha,
      message: commitMessage,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Unknown error committing to GitHub.",
    };
  }
}
