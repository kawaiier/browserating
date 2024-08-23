// lib/getBrowsers.js
export async function getBrowsers() {
  const response = await fetch("/data/browsers.json");
  if (!response.ok) {
    throw new Error("Failed to fetch browser data");
  }
  return response.json();
}
