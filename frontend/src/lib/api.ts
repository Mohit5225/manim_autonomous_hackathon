/**
 * Client-side authenticated API call helper
 * Automatically includes Clerk token in Authorization header
 */
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get token from Clerk
  const token = await (window as any).Clerk?.session?.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  return response;
}
