import { supabaseClient } from "./supabase-client";

export async function fetchDashboardApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let token = "";
  if (typeof window !== "undefined") {
    const { data } = await supabaseClient.auth.getSession();
    token = data.session?.access_token || "";
  }
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  
  const res = await fetch(`${baseUrl}/api/dashboard${endpoint}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    }
  });

  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== "undefined") window.location.href = "/login";
      throw new Error("Unauthorized");
    }
    
    let message = "API Error";
    try {
      const errorData = await res.json();
      if (errorData.error) message = errorData.error;
    } catch {
      // Ignore JSON parse error if response is not JSON
    }
    
    throw new Error(message);
  }

  const json = await res.json();
  return json.data;
}
