const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api';

export async function apiGetJson<T>(path: string): Promise<T> {
  const response = await apiGet(path);

  return response.json() as Promise<T>;
}

export async function apiGetText(path: string): Promise<string> {
  const response = await apiGet(path);

  return response.text() as Promise<string>;
}

async function apiGet(path: string) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
}
