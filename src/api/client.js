const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export async function request(path, options = {}) {
  const token = localStorage.getItem("collabboard-token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("collabboard-token");

    window.dispatchEvent(
      new CustomEvent("auth:expired", {
        detail: { path },
      })
    );
  }

  if (response.status === 204) {
    return null;
  }

  let body;

  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const error = new Error(
      body?.error?.message ?? `Request failed with status ${response.status}`
    );

    error.status = response.status;
    error.code = body?.error?.code;
    error.details = body?.error?.details;

    throw error;
  }

  return body;
}