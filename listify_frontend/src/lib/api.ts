const apiBaseUrl = import.meta.env.VITE_BACKEND_API_BASE_URL ?? 'http://blablabla:8081/api';

export async function apiGetJson<T>(path: string): Promise<T> {
  const response = await callApi(path, "GET");

  return response.json() as Promise<T>;
}

export async function apiPostJson<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse> {
  const response = await callApi(path, "POST", body);

  return response.json() as Promise<TResponse>;
}

export async function apiGetText(path: string): Promise<string> {
  const response = await callApi(path, "GET");

  return response.text() as Promise<string>;
}

export async function callApi(path: string, method: string, body?: unknown) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
}
