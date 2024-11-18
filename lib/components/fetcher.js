export async function fetcher(url) {
    console.log('fetching', url);
    const response = await fetch(url);
    const json = await response.json();
  
    return json;
  }