import { fetchWithAuth } from './fetchWithAuth';

/** Catalog rows are stored in Supabase `products`; in the product they are conference sessions. */
export async function getAllSessions() {
  try {
    const response = await fetchWithAuth(`/events/allSessions`, { method: 'GET' });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchSessionById(session_id: string) {
  try {
    const response = await fetchWithAuth(`/events/getSession/${session_id}`, {
      method: 'GET',
    });
    return response.data[0];
  } catch (error) {
    console.error(error);
  }
}
