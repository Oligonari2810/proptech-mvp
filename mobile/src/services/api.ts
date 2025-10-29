export const API_BASE = process.env.API_BASE || 'http://localhost:8000/api';

export async function fetchProperties() {
  const res = await fetch(`${API_BASE}/properties`);
  return res.json();
}


