export default async function updateData(apiRoute, method, body) {
  try {
    const response = await fetch(`/api/${apiRoute}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.log("error: ", error);
  }
}
