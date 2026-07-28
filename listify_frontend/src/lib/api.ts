const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081/api';

export async function apiGetJson<T>(path: string): Promise<T> {
  const response = await callApi(path, "GET");

  return response.json() as Promise<T>;
}

export async function apiGetText(path: string): Promise<string> {
  const response = await callApi(path, "GET");

  return response.text() as Promise<string>;
}

export async function callApi(path: string, method: string) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: method,
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
