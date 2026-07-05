// This file was not provided in the original prompt, but based on the plan, it should be updated to propagate errors to React Query.
// For demonstration purposes, assume it has the following content:
export async function getAllSessions() {
  try {
    // API call to get all sessions
    const response = await fetch('/api/sessions');
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export async function fetchSessionById(sessionId: string) {
  try {
    // API call to get a session by ID
    const response = await fetch(`/api/sessions/${sessionId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
