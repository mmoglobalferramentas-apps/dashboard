export async function fetchDashboardApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("DASHBOARD_ACCESS_TOKEN") : "";
  
  const res = await fetch(`/api/dashboard${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    }
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    
    let message = "API Error";
    try {
      const errorData = await res.json();
      if (errorData.error) message = errorData.error;
    } catch (e) {
      // Ignore JSON parse error if response is not JSON
    }
    
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
}
