export async function fetcher(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.json();
  } catch (error) {
      console.error('Failed to fetch:', url, error);
      return null;
  }
}
