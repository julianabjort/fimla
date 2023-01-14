export default async function getById(apiRoute, id) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    const filtered = data.filter((data) => data === id);
    return filtered;
  } catch (error) {
    console.log("error: ", error);
  }
}
